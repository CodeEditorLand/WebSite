/**
 * ServiceWorker - route redirector, auth gate, and cache manager.
 *
 * Three responsibilities:
 * 1. PascalCase URL normalization (redirect variants to canonical)
 * 2. Auth-gated API requests (Bearer token + HMAC signing)
 * 3. Asset caching (versioned route/asset caches + persistent auth cache)
 *
 * Build-time injected values: route maps (canonical + variant), cache
 * version increment, and dev mode flag. See Integration.ts for the
 * injection logic.
 *
 */
/// <reference lib="webworker" />

declare var self: ServiceWorkerGlobalScope;

declare const __DEV__: boolean;

declare const __INCREMENT__: string;

// ─── Build-time injected data ───
// The Astro integration replaces these markers at build time:
// __ROUTE_MAP_CANONICAL__ → JSON array of canonical PascalCase paths
// __ROUTE_MAP_VARIANT__ → JSON object of variant → canonical mappings

declare const __ROUTE_MAP_CANONICAL__: string[];

declare const __ROUTE_MAP_VARIANT__: Record<string, string>;

// ─── Version + Cache names ───

const INCREMENT = __INCREMENT__ ?? "Initial";

const CACHE_ROUTE = `Route-${INCREMENT}`;

const CACHE_ASSET = `Asset-${INCREMENT}`;

const CACHE_AUTH = "Auth"; // Not versioned - persists across deploys

const CACHE = [CACHE_ROUTE, CACHE_ASSET];

// Note: CACHE_AUTH is NOT in the eviction list - it outlives route cache.

let CurrentClientVersion: string | null = null;

const BASE_REMOTE =
	new URLSearchParams(self.location.search).get("BASE_REMOTE") ||
	self.location.origin;

// ─── Logging (stripped in production) ───

const Log = __DEV__
	? (..._Message: any[]) => {
			console.log(
				`[SW ${INCREMENT}]`,

				`(Remote: ${BASE_REMOTE})`,
				..._Message,
			);
		}
	: () => {};

const ErrorLog = __DEV__
	? (..._Message: any[]) => {
			console.error(
				`[SW ${INCREMENT}]`,

				`(Remote: ${BASE_REMOTE})`,
				..._Message,
			);
		}
	: () => {};

const WarnLog = __DEV__
	? (..._Message: any[]) => {
			console.warn(
				`[SW ${INCREMENT}]`,

				`(Remote: ${BASE_REMOTE})`,
				..._Message,
			);
		}
	: () => {};

// ─── Route registry ───
// Injected at build time from the Astro route map.

const CanonicalSet: Set<string> = new Set(__ROUTE_MAP_CANONICAL__);

const VariantMap: Record<string, string> = __ROUTE_MAP_VARIANT__;

// ─── Route classification ───
// Auth-required routes - redirect to /Account/SignIn when no session cached.
// NOTE: /Portal is the auth-selection gateway (Cloud / Provider / LocalFirst /
// Enterprise tier picker). It must be publicly accessible - users land here
// BEFORE they have a session. Only post-auth destinations belong here.

const ProtectedRoute: Set<string> = new Set([]);

// Auth-bypass routes - redirect to /Dashboard when a session IS cached.
// Prevents authenticated users from seeing the sign-in/sign-up pages.

const AuthRoute: Set<string> = new Set([
	"/Account/SignIn",

	"/Account/SignUp",

	"/Account/ForgotPassword",

	"/Account/ResetPassword",
]);

// Dynamic route patterns - segments after the prefix are slug parameters.
// Each entry maps a URL prefix to the canonical base it falls under.

const DynamicRoute: Array<{ Pattern: RegExp; Base: string }> = [
	{ Pattern: /^\/Blog\/([^/]+)\/?$/, Base: "/Blog" },

	// Doc slugs may be single-level (/Doc/mountain) or nested (/Doc/telemetry/overview)
	{ Pattern: /^\/Doc\/.+/, Base: "/Doc" },
];

// Workers API URL prefixes - requests to these paths are pre-processed
// to inject the SW-managed auth token before forwarding to the network.
// NOTE: full domain injection of bearer token is handled in pre-processing.
// In production these match the PUBLIC_*_WORKER_URL env vars; in dev they
// are relative /api/* paths exposed by the dev Workers.

const ApiPrefix: string[] = [
	"/api/",

	"/auth/",

	"/downloads/",

	"/track",

	"/pageview",

	"/events",

	"/summary",

	"/timeline",

	"/stats/",

	"/status",
];

// ─── Auth state ───
// Session token is stored in CACHE_AUTH as an AES-GCM encrypted payload at
// /auth-state. The UserId is stored separately at /auth-user-id for key
// derivation. Outbound API requests are HMAC-signed with X-Signature header.
// Legacy plain JSON payloads are read transparently and re-encrypted on write.

interface AuthState {
	Token: string;

	ExpiresAt: number; // Unix ms

	UserId: string;
}

const AUTH_STATE_KEY = "/auth-state";

// In-memory auth state cache - avoids running PBKDF2 (100k iterations) on
// every navigation. undefined = not yet loaded from cache; null = no session;
// AuthState = active session. Invalidated by WriteAuthState / ClearAuthState.
let _CachedAuth: AuthState | null | undefined = undefined;

// ─── Base64 helpers ───

const ByteListToBase64 = (ByteList: Uint8Array): string =>
	btoa(String.fromCharCode(...ByteList));

const Base64ToByteList = (Base64: string): Uint8Array =>
	Uint8Array.from(atob(Base64), (Char) => Char.charCodeAt(0));

// ─── Encryption key derivation (AES-GCM via PBKDF2) ───

interface EncryptedPayload {
	Salt: string; // base64 random salt (16 bytes)

	IV: string; // base64 AES-GCM IV (12 bytes)

	Data: string; // base64 AES-GCM ciphertext
}

const DeriveKey = async (
	UserId: string,

	Salt: Uint8Array,
): Promise<CryptoKey> => {
	const Material = await crypto.subtle.importKey(
		"raw",

		new TextEncoder().encode(self.location.origin + UserId),

		"PBKDF2",

		false,

		["deriveKey"],
	);

	return crypto.subtle.deriveKey(
		{ name: "PBKDF2", salt: Salt, iterations: 100_000, hash: "SHA-256" },

		Material,

		{ name: "AES-GCM", length: 256 },

		false,

		["encrypt", "decrypt"],
	);
};

const ReadAuthState = async (): Promise<AuthState | null> => {
	// Fast path: serve from in-memory cache to avoid PBKDF2 on every navigation.
	if (_CachedAuth !== undefined) {
		if (_CachedAuth === null) return null;

		if (_CachedAuth.ExpiresAt - 30_000 < Date.now()) {
			_CachedAuth = null;

			const Cache = await caches.open(CACHE_AUTH);

			await Cache.delete(AUTH_STATE_KEY);

			await Cache.delete("/auth-user-id");

			__DEV__ && Log("Auth token expired (memory cache), cleared.");

			return null;
		}

		return _CachedAuth;
	}

	try {
		const Cache = await caches.open(CACHE_AUTH);

		const Cached = await Cache.match(AUTH_STATE_KEY);

		if (!Cached) {
			_CachedAuth = null;

			return null;
		}

		const Raw = await Cached.json();

		// Handle both encrypted and legacy plain formats for graceful migration
		if (
			"Salt" in (Raw as Record<string, unknown>) &&
			"IV" in (Raw as Record<string, unknown>)
		) {
			const Payload = Raw as EncryptedPayload;

			const Salt = Base64ToByteList(Payload.Salt);

			const IV = Base64ToByteList(Payload.IV);

			const Ciphertext = Base64ToByteList(Payload.Data);

			// UserId is stored separately (unencrypted) for key derivation
			const UserIdCached = await Cache.match("/auth-user-id");

			if (!UserIdCached) {
				await Cache.delete(AUTH_STATE_KEY);

				_CachedAuth = null;

				return null;
			}

			const UserId = await UserIdCached.text();

			const Key = await DeriveKey(UserId, Salt);

			const Decrypted = await crypto.subtle.decrypt(
				{ name: "AES-GCM", iv: IV },

				Key,

				Ciphertext,
			);

			const State = JSON.parse(
				new TextDecoder().decode(Decrypted),
			) as AuthState;

			if (State.ExpiresAt - 30_000 < Date.now()) {
				await Cache.delete(AUTH_STATE_KEY);

				await Cache.delete("/auth-user-id");

				__DEV__ && Log("Auth token expired, cleared from cache.");

				_CachedAuth = null;

				return null;
			}

			_CachedAuth = State;

			return State;
		}

		// Legacy plain format - read and re-encrypt on next write
		const State = Raw as AuthState;

		if (State.ExpiresAt - 30_000 < Date.now()) {
			await Cache.delete(AUTH_STATE_KEY);

			_CachedAuth = null;

			return null;
		}

		_CachedAuth = State;

		return State;
	} catch {
		_CachedAuth = null;

		return null;
	}
};

const WriteAuthState = async (State: AuthState): Promise<void> => {
	const Salt = crypto.getRandomValues(new Uint8Array(16));

	const IV = crypto.getRandomValues(new Uint8Array(12));

	const Key = await DeriveKey(State.UserId, Salt);

	const Plaintext = new TextEncoder().encode(JSON.stringify(State));

	const Ciphertext = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv: IV },

		Key,

		Plaintext,
	);

	const Payload: EncryptedPayload = {
		Salt: ByteListToBase64(Salt),

		IV: ByteListToBase64(IV),

		Data: ByteListToBase64(new Uint8Array(Ciphertext)),
	};

	const Cache = await caches.open(CACHE_AUTH);

	await Cache.put(
		AUTH_STATE_KEY,

		new Response(JSON.stringify(Payload), {
			headers: { "Content-Type": "application/json" },
		}),
	);

	await Cache.put(
		"/auth-user-id",

		new Response(State.UserId, {
			headers: { "Content-Type": "text/plain" },
		}),
	);

	_CachedAuth = State;

	__DEV__ && Log("Auth state encrypted and written to cache.");
};

const ClearAuthState = async (): Promise<void> => {
	_CachedAuth = null;

	const Cache = await caches.open(CACHE_AUTH);

	await Cache.delete(AUTH_STATE_KEY);

	await Cache.delete("/auth-user-id");

	__DEV__ && Log("Auth state cleared.");
};

// ─── Path normalization ───

const StripTrailingSlash = (Path: string): string =>
	Path === "/" ? "/" : Path.replace(/\/+$/, "");

const NormalizePath = (Path: string): string =>
	StripTrailingSlash(
		"/" +
			Path.replace(/^\/+/, "")
				.split("/")
				.map((Segment: string) =>
					decodeURIComponent(Segment).toLowerCase(),
				)
				.join("/"),
	);

// ─── Route resolution ───
// Returns the PascalCase canonical path, or null if already canonical.
// Handles static routes AND dynamic route slugs.

const ResolveRoute = (RequestPath: string): string | null => {
	const Cleaned = StripTrailingSlash(RequestPath);

	// Already a canonical static route - no redirect needed
	if (CanonicalSet.has(Cleaned) || Cleaned === "/") return null;

	// Check dynamic route patterns - slugs are valid, no redirect needed
	for (const { Pattern } of DynamicRoute) {
		if (Pattern.test(Cleaned)) return null;
	}

	const Normalized = NormalizePath(Cleaned);

	// Normalize against known canonicals
	if (CanonicalSet.has(Normalized)) return Normalized;

	// Check variant map (auto-generated case/plural/compound permutations)
	if (VariantMap[Normalized]) return VariantMap[Normalized];

	if (VariantMap[Cleaned]) return VariantMap[Cleaned];

	// Hyphen/underscore stripped form
	const Stripped =
		"/" +
		Normalized.replace(/^\/+/, "")
			.split("/")
			.map((Segment: string) => Segment.replace(/[-_]/g, ""))
			.join("/");

	if (VariantMap[Stripped]) return VariantMap[Stripped];

	return null;
};

// ─── API request detection ───
// Returns true if a fetch request should have auth headers injected.

const IsApiRequest = (URL: URL): boolean => {
	// Same-origin /api/* relative paths
	if (URL.origin === self.location.origin) {
		return ApiPrefix.some((Prefix) => URL.pathname.startsWith(Prefix));
	}

	// Cross-origin Workers URLs (e.g. https://auth.workers.dev/…)
	// Pre-process if the host looks like a workers.dev deployment
	return URL.hostname.endsWith(".workers.dev");
};

// ─── HMAC request signing ───
// Adds X-Signature and X-Timestamp headers for Workers that verify integrity.
// Signature covers: METHOD\nPATH\nTIMESTAMP\nBODY

const SignRequest = async (
	OriginalRequest: Request,

	Token: string,
): Promise<Request> => {
	const Key = await crypto.subtle.importKey(
		"raw",

		new TextEncoder().encode(Token),

		{ name: "HMAC", hash: "SHA-256" },

		false,

		["sign"],
	);

	const Body =
		OriginalRequest.method !== "GET" && OriginalRequest.method !== "HEAD"
			? await OriginalRequest.clone().text()
			: "";

	const Timestamp = Date.now().toString();

	const PathName = new URL(OriginalRequest.url).pathname;

	const Message = `${OriginalRequest.method}\n${PathName}\n${Timestamp}\n${Body}`;

	const SignatureBuffer = await crypto.subtle.sign(
		"HMAC",

		Key,

		new TextEncoder().encode(Message),
	);

	const SignedHeaders = new Headers(OriginalRequest.headers);

	SignedHeaders.set(
		"X-Signature",

		ByteListToBase64(new Uint8Array(SignatureBuffer)),
	);

	SignedHeaders.set("X-Timestamp", Timestamp);

	return new Request(OriginalRequest.url, {
		method: OriginalRequest.method,
		headers: SignedHeaders,
		body:
			OriginalRequest.method !== "GET" &&
			OriginalRequest.method !== "HEAD"
				? OriginalRequest.body
				: undefined,
		credentials: OriginalRequest.credentials,
		cache: OriginalRequest.cache,
		redirect: OriginalRequest.redirect,
		referrer: OriginalRequest.referrer,
		mode: OriginalRequest.mode,
	});
};

// ─── Inject auth header ───
// Attaches Bearer token to outbound API requests from the SW cache,
// then HMAC-signs the request for Workers-side integrity verification.
// Does not modify the request if no session is active.

const InjectAuthHeader = async (OriginalRequest: Request): Promise<Request> => {
	const State = await ReadAuthState();

	if (!State) return OriginalRequest;

	const AuthHeaders = new Headers(OriginalRequest.headers);

	AuthHeaders.set("Authorization", `Bearer ${State.Token}`);

	const AuthedRequest = new Request(OriginalRequest.url, {
		method: OriginalRequest.method,
		headers: AuthHeaders,
		body:
			OriginalRequest.method !== "GET" &&
			OriginalRequest.method !== "HEAD"
				? OriginalRequest.body
				: undefined,
		credentials: OriginalRequest.credentials,
		cache: OriginalRequest.cache,
		redirect: OriginalRequest.redirect,
		referrer: OriginalRequest.referrer,
		mode: OriginalRequest.mode,
	});

	return SignRequest(AuthedRequest, State.Token);
};

// ─── Token refresh lifecycle ───
// On activate (and on-demand via Auth:Refresh message), check if the cached
// token is within 5 minutes of expiry and attempt a refresh against the Auth
// Worker. On failure, clear auth state to force re-authentication.

const MaybeRefreshToken = async (): Promise<void> => {
	const State = await ReadAuthState();

	if (!State) return;

	const MinutesLeft = (State.ExpiresAt - Date.now()) / 60_000;

	if (MinutesLeft > 5) return;

	__DEV__ &&
		Log(
			`Token expires in ${MinutesLeft.toFixed(1)} minutes, attempting refresh...`,
		);

	try {
		const RefreshResponse = await fetch(`${BASE_REMOTE}/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${State.Token}`,
			},
		});

		if (!RefreshResponse.ok) {
			// Only clear auth on 401 (token explicitly rejected by the server).
			// 404 means no auth Worker is deployed; 5xx means transient error.
			// Neither should log the user out.
			if (RefreshResponse.status === 401) {
				__DEV__ && WarnLog("Token refresh 401, clearing auth state.");

				await ClearAuthState();
			} else {
				__DEV__ &&
					WarnLog(
						`Token refresh ${RefreshResponse.status}, keeping auth state.`,
					);
			}

			return;
		}

		const Data = (await RefreshResponse.json()) as {
			success: boolean;

			data?: { token: string; expiresIn: number };
		};

		if (Data.success && Data.data) {
			await WriteAuthState({
				Token: Data.data.token,
				ExpiresAt: Date.now() + Data.data.expiresIn * 1000,
				UserId: State.UserId,
			});

			__DEV__ && Log("Token refreshed successfully.");
		} else {
			__DEV__ &&
				WarnLog("Token refresh response invalid, clearing auth state.");

			await ClearAuthState();
		}
	} catch (RefreshError) {
		__DEV__ && ErrorLog("Token refresh network error:", RefreshError);

		// Don't clear - might be offline temporarily
	}
};

// ─── Install ───

self.addEventListener("install", (Event: ExtendableEvent) => {
	__DEV__ && Log(`Installing version ${INCREMENT}...`);

	Event.waitUntil(
		caches
			.open(CACHE_ROUTE)
			.then((Cache) => {
				__DEV__ && Log("Route cache opened.");

				return Cache;
			})
			.catch((_Error: unknown) => {
				__DEV__ && ErrorLog("Cache open failed:", _Error);
			})
			.then(() => {
				__DEV__ && Log("Install complete. Activating immediately.");

				return self.skipWaiting();
			}),
	);
});

// ─── Activate ───

self.addEventListener("activate", (Event: ExtendableEvent) => {
	__DEV__ && Log(`Activating version ${INCREMENT}...`);

	Event.waitUntil(
		Promise.all([
			caches
				.keys()
				.then((CacheKey) =>
					Promise.all(
						CacheKey.map((Key) => {
							// Evict old versioned caches; preserve CACHE_AUTH
							if (!CACHE.includes(Key) && Key !== CACHE_AUTH) {
								__DEV__ && Log(`Deleting old cache: ${Key}`);

								return caches.delete(Key);
							}

							return Promise.resolve();
						}),
					),
				)
				.catch((_Error: unknown) => {
					__DEV__ && ErrorLog("Cache cleanup failed:", _Error);

					return Promise.resolve();
				}),

			self.clients
				.claim()
				.then(() => {
					__DEV__ && Log("Clients claimed.");
				})
				.catch((_Error: unknown) => {
					__DEV__ && ErrorLog("clients.claim() failed:", _Error);

					return Promise.resolve();
				}),
		])
			.then(async () => {
				__DEV__ &&
					Log(
						`Version ${INCREMENT} activated and controlling clients.`,
					);

				// Attempt token refresh if nearing expiry
				await MaybeRefreshToken();

				const IsNewVersion = CurrentClientVersion !== INCREMENT;

				if (IsNewVersion) {
					CurrentClientVersion = INCREMENT;

					return (
						await self.clients.matchAll({ type: "window" })
					).forEach((Client: WindowClient) => {
						Client.postMessage({ Version: "New" });
					});
				}
			})
			.catch((_Error: unknown) => {
				__DEV__ && ErrorLog("Activation failed:", _Error);
			}),
	);
});

// ─── Fetch ───
// Layered request handler - mirrors a CF Pages Function / server adapter:
//
// Layer 1 Route redirect - normalize variant URLs → PascalCase canonical
// Layer 2 Auth gate - guard protected routes, bypass auth routes
// Layer 3 API pre-process - inject Bearer token on Workers API calls
// Layer 4 Page cache - network-first for navigation (offline fallback)
// Layer 5 Asset cache - cache-first for hashed static assets
// Layer 6 Pass-through - everything else → network

self.addEventListener("fetch", (Event: FetchEvent) => {
	const Request = Event.request;

	const _URL = new URL(Request.url);

	const Path = _URL.pathname;

	__DEV__ &&
		Log(`Fetch: ${Path}`, {
			Method: Request.method,
			Destination: Request.destination,
			Mode: Request.mode,
		});

	// Ignore fetches for the SW script itself
	if (
		_URL.origin === self.origin &&
		Path === new URL(self.location.href).pathname
	) {
		return;
	}

	if (Request.method !== "GET" && Request.method !== "HEAD") {
		// ── Layer 3 (mutation): Inject auth on non-GET API requests ──
		if (IsApiRequest(_URL)) {
			__DEV__ &&
				Log(`API mutation (auth inject): ${Request.method} ${Path}`);

			Event.respondWith(
				InjectAuthHeader(Request).then((AuthedRequest) =>
					fetch(AuthedRequest),
				),
			);
		}

		// All other non-GET requests pass through unmodified
		return;
	}

	// ── Layer 1: Route redirect ──
	if (Request.mode === "navigate") {
		const ResolvedPath = ResolveRoute(Path);

		if (ResolvedPath !== null) {
			__DEV__ && Log(`Route redirect: ${Path} → ${ResolvedPath}`);

			const RedirectURL = new URL(ResolvedPath, _URL.origin);

			RedirectURL.search = _URL.search;

			Event.respondWith(Response.redirect(RedirectURL.href, 301));

			return;
		}

		// ── Layer 2: Auth gate ──
		Event.respondWith(
			(async () => {
				const AuthState = await ReadAuthState();

				const IsAuthed = AuthState !== null;

				// Protected route + no session → sign in
				if (ProtectedRoute.has(Path) && !IsAuthed) {
					__DEV__ &&
						Log(
							`Auth gate: ${Path} requires auth, redirecting to SignIn`,
						);

					const SignInURL = new URL("/Account/SignIn", _URL.origin);

					SignInURL.searchParams.set("next", Path);

					return Response.redirect(SignInURL.href, 302);
				}

				// Auth route + has session → already signed in, redirect away.
				// Skip if this is an OAuth callback (?code=&state=): some
				// providers redirect back to an auth route; intercepting that
				// navigation would discard the code and break the flow.
				if (
					AuthRoute.has(Path) &&
					IsAuthed &&
					!(
						_URL.searchParams.has("code") &&
						_URL.searchParams.has("state")
					)
				) {
					const Next = _URL.searchParams.get("next");

					const Target =
						Next && Next.startsWith("/") && !Next.startsWith("//")
							? Next
							: "/Dashboard";

					__DEV__ &&
						Log(
							`Auth bypass: ${Path} already authed, redirecting to ${Target}`,
						);

					return Response.redirect(
						new URL(Target, _URL.origin).href,

						302,
					);
				}

				// ── Layer 4: Page cache (network-first) ──
				__DEV__ && Log(`Navigation (network-first): ${Path}`);

				try {
					const NetworkResponse = await fetch(Request);

					if (NetworkResponse && NetworkResponse.ok) {
						__DEV__ && Log(`Navigation fetched: ${Path}`);

						(await caches.open(CACHE_ROUTE)).put(
							Request,

							NetworkResponse.clone(),
						);

						return NetworkResponse;
					}

					__DEV__ &&
						WarnLog(
							`Navigation failed (${NetworkResponse.status}): ${Path}. Trying cache...`,
						);
				} catch (_Error: unknown) {
					__DEV__ &&
						WarnLog(
							`Navigation fetch failed: ${Path}. Trying cache...`,

							_Error,
						);
				}

				const CachedResponse = await (
					await caches.open(CACHE_ROUTE)
				).match(Request);

				if (CachedResponse) {
					__DEV__ && Log(`Serving from cache: ${Path}`);

					return CachedResponse;
				}

				__DEV__ && ErrorLog(`No cache fallback for: ${Path}`);

				return new Response(
					"Network error: You appear to be offline and the page is not cached.",

					{
						status: 503,
						statusText: "Service Unavailable",
						headers: { "Content-Type": "text/plain" },
					},
				);
			})(),
		);

		return;
	}

	// ── Layer 3 (GET): Inject auth on API requests ──
	if (IsApiRequest(_URL)) {
		__DEV__ && Log(`API fetch (auth inject): ${Path}`);

		Event.respondWith(
			InjectAuthHeader(Request).then((AuthedRequest) =>
				fetch(AuthedRequest).catch((_Error: unknown) => {
					__DEV__ && ErrorLog(`API fetch failed: ${Path}`, _Error);

					return new Response(
						JSON.stringify({
							success: false,
							error: "Network error",
						}),

						{
							status: 503,
							headers: { "Content-Type": "application/json" },
						},
					);
				}),
			),
		);

		return;
	}

	// ── Layer 5: Asset cache (cache-first) ──
	if (
		Path.startsWith("/_astro/") ||
		Path.startsWith("/Asset/") ||
		Path.startsWith("/Dark/") ||
		Path.startsWith("/Evidence/") ||
		Path.startsWith("/Favicon/") ||
		Path.startsWith("/Font/") ||
		Path.startsWith("/Image/") ||
		Path.startsWith("/Mermaid/") ||
		Path.startsWith("/OpenGraph/") ||
		Path.startsWith("/Vendor/")
	) {
		__DEV__ && Log(`Asset (cache-first): ${Path}`);

		Event.respondWith(
			caches.open(CACHE_ASSET).then(async (Cache) => {
				const Cached = await Cache.match(Request);

				if (Cached) {
					__DEV__ && Log(`Asset cache hit: ${Path}`);

					return Cached;
				}

				__DEV__ && Log(`Asset cache miss, fetching: ${Path}`);

				try {
					const NetworkResponse = await fetch(Request);

					// Only cache genuine asset responses. During a
					// broken deploy window the catch-all can return a
					// 200 HTML page for an asset URL (e.g. /Mermaid/*.svg
					// before the routing fix); caching that as the asset
					// permanently breaks the diagram. Guard on content
					// type so HTML fallbacks are never stored.
					const Type =
						NetworkResponse?.headers?.get("content-type") ?? "";
					if (
						NetworkResponse &&
						NetworkResponse.ok &&
						Type.startsWith("image/")
					) {
						await Cache.put(Request, NetworkResponse.clone());
					}

					return (
						NetworkResponse ||
						new Response(`Failed to fetch ${Path}`, {
							status: 504,
						})
					);
				} catch (_Error: unknown) {
					__DEV__ && ErrorLog(`Asset fetch failed: ${Path}`, _Error);

					return new Response(`Offline: ${Path}`, {
						status: 503,
					});
				}
			}),
		);

		return;
	}

	// ── Layer 6: Pass-through ──
	__DEV__ && WarnLog(`Unhandled, passing through: ${Path}`);
});

// ─── Message bus ───
// Handles auth state updates posted by the app (WorkerClient calls postMessage
// after Login/Register/Refresh/Logout). The SW stores the token in CACHE_AUTH
// so it can inject it on subsequent API requests without reading from DOM APIs.
//
// Message shapes:
// { Type: "Auth:Write", Token: string, ExpiresAt: number, UserId: string }
// { Type: "Auth:Clear" }
// { Type: "Auth:Read" } → SW replies with { Type: "Auth:State", State: AuthState | null }
// { Type: "Auth:Refresh" } → triggers MaybeRefreshToken, replies with { Type: "Auth:State", State }

self.addEventListener("message", (Event: ExtendableMessageEvent) => {
	if (Event.origin !== self.location.origin && Event.origin !== BASE_REMOTE) {
		__DEV__ &&
			WarnLog(
				`Message from untrusted origin: ${Event.origin}`,

				Event.data,
			);

		return;
	}

	__DEV__ && Log("Message from client:", Event.data?.Type ?? Event.data);

	const Data = Event.data as {
		Type: string;

		Token?: string;

		ExpiresAt?: number;

		UserId?: string;
	} | null;

	if (!Data || typeof Data.Type !== "string") return;

	if (Data.Type === "Auth:Write") {
		// UserId may be an empty string (anonymous/local-first sessions) - only
		// Token and ExpiresAt are truly required.
		if (
			!Data.Token ||
			!Data.ExpiresAt ||
			Data.UserId === undefined ||
			Data.UserId === null
		) {
			__DEV__ && ErrorLog("Auth:Write missing required fields.");

			Event.source?.postMessage({
				Type: "Auth:Error",
				Reason: "missing-fields",
			});

			return;
		}

		Event.waitUntil(
			WriteAuthState({
				Token: Data.Token,
				ExpiresAt: Data.ExpiresAt,
				UserId: Data.UserId,
			}).then(() => {
				Event.source?.postMessage({ Type: "Auth:Written" });
			}),
		);

		return;
	}

	if (Data.Type === "Auth:Clear") {
		Event.waitUntil(
			ClearAuthState().then(() => {
				Event.source?.postMessage({ Type: "Auth:Cleared" });
			}),
		);

		return;
	}

	if (Data.Type === "Auth:Read") {
		Event.waitUntil(
			ReadAuthState().then((State) => {
				Event.source?.postMessage({ Type: "Auth:State", State });
			}),
		);

		return;
	}

	if (Data.Type === "Auth:Refresh") {
		Event.waitUntil(
			MaybeRefreshToken().then(() => {
				ReadAuthState().then((State) => {
					Event.source?.postMessage({
						Type: "Auth:State",
						State,
					});
				});
			}),
		);

		return;
	}

	if (Data.Type === "Version:Check") {
		Event.source?.postMessage({
			Type: "Version:Current",
			Version: INCREMENT,
		});

		return;
	}

	// Client requests immediate activation (for waiting SW)
	if (Data.Type === "skipWaiting") {
		__DEV__ && Log("skipWaiting requested by client.");

		self.skipWaiting();

		return;
	}

	// Legacy: old clients post { Version: "New" }
	if (Event.data?.Version === "New") {
		__DEV__ && Log("Legacy version message received.");
	}
});

export default {};
