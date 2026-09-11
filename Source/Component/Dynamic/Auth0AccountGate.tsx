"use client";

import { useAuth0 } from "@auth0/auth0-react";

import { useEffect } from "react";

import { useTranslation } from "react-i18next";

import { Header } from "../Layout/Header";

import { Button } from "../UI/Button";

/**
 * Auth0 redirect-based account gate.
 *
 * - "signin" route: triggers loginWithRedirect()
 * - "signup" route: shows a Coming Soon state while registration is disabled
 * - If already authenticated: shows user profile + logout
 *
 * This replaces custom email/password forms - Auth0 Universal Login
 * handles enabled Auth0 UI such as login, password reset, MFA, social, and SSO.
 */
export default ({
	Route,
	Header: HeaderContent,
	Connection,
	Organization,
}: {
	Route: "signin" | "signup";

	Header?: {
		logo?: { text: string };

		navigation?: Array<{ label: string; href: string; icon?: string }>;

		actions?: Array<{
			type?: string;

			text: string;

			variant?: string;

			size?: string;

			href?: string;

			icon?: string;
		}>;
	};

	/** Auth0 enterprise connection name (e.g. "okta-acme" for Okta SSO) */
	Connection?: string;

	/** Auth0 organization ID (e.g. "org_abc123" for multi-tenant Okta) */
	Organization?: string;
}) => {
	const {
		isLoading: IsLoading,

		isAuthenticated: IsAuthenticated,

		error: Error,

		loginWithRedirect: Login,

		logout: Auth0Logout,

		user: User,

		getAccessTokenSilently: GetToken,
	} = useAuth0();

	const { t: T } = useTranslation("account");

	const RegistrationEnabled = false;

	// Build enterprise SSO params (Okta, SAML, Azure AD, etc.)
	const EnterpriseParams: Record<string, string> = {};

	if (Connection) EnterpriseParams["connection"] = Connection;

	if (Organization) EnterpriseParams["organization"] = Organization;

	// Check URL for enterprise hints: ?connection=okta-acme&organization=org_abc123
	const URLConnection =
		typeof window !== "undefined"
			? new URLSearchParams(window.location.search).get("connection")
			: null;

	const URLOrganization =
		typeof window !== "undefined"
			? new URLSearchParams(window.location.search).get("organization")
			: null;

	if (URLConnection) EnterpriseParams["connection"] = URLConnection;

	if (URLOrganization) EnterpriseParams["organization"] = URLOrganization;

	const LoginWithParams = (Extra?: Record<string, string>) =>
		Login({
			authorizationParams: {
				...EnterpriseParams,
				...Extra,
			},
		});

	const Signup = () => LoginWithParams({ screen_hint: "signup" });

	const Logout = () =>
		Auth0Logout({ logoutParams: { returnTo: window.location.origin } });

	// Auto-redirect when already authenticated.
	// Syncs the Auth0 access token into the SW's CACHE_AUTH first so the
	// SW auth gate on /Dashboard lets the navigation through.
	useEffect(() => {
		if (IsLoading || !IsAuthenticated) return;

		(async () => {
			try {
				const Token = await GetToken();

				if (
					typeof navigator !== "undefined" &&
					navigator.serviceWorker?.controller
				) {
					await new Promise<void>((Resolve) => {
						const Timeout = setTimeout(Resolve, 5000);

						const OnMessage = (Event: MessageEvent) => {
							if (Event.data?.Type === "Auth:Written") {
								clearTimeout(Timeout);

								navigator.serviceWorker.removeEventListener(
									"message",

									OnMessage,
								);

								Resolve();
							}
						};

						navigator.serviceWorker.addEventListener(
							"message",

							OnMessage,
						);

						navigator.serviceWorker.controller!.postMessage({
							Type: "Auth:Write",
							Token,
							ExpiresAt: Date.now() + 3600_000,
							UserId: User?.sub ?? "",
						});
					});
				}
			} catch {
				// proceed even if SW sync fails
			}

			const Next =
				typeof window !== "undefined"
					? new URLSearchParams(window.location.search).get("next")
					: null;

			window.location.replace(Next || "/Dashboard");
		})();
	}, [IsLoading, IsAuthenticated]);

	// Auto-redirect to Auth0 Universal Login if not authenticated
	useEffect(() => {
		if (IsLoading || IsAuthenticated) return;

		if (Route === "signup" && !RegistrationEnabled) return;

		if (Route === "signup") {
			Signup();
		} else {
			LoginWithParams();
		}
	}, [IsLoading, IsAuthenticated, Route]);

	if (Route === "signup" && !RegistrationEnabled) {
		return (
			<div className="flex min-h-screen flex-col">
				<Header
					{...(HeaderContent ? { content: HeaderContent } : {})}
					Mode="functional"
				/>
				<div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-4 text-center">
					<jelly-badge
						variant="platinum"
						shape="square"
						style={
							{
								"--jelly-fill": "var(--Mute)",
								"--jelly-label": "var(--MuteForeground)",
								"--jelly-badge-radius": "0px",
								"--jelly-badge-font-size": "0.625rem",
							} as React.CSSProperties
						}
					>
						Coming Soon
					</jelly-badge>
					<h1 className="text-2xl font-semibold">
						{T("registrationComingSoon.title", {
							defaultValue: "Registration is not open yet",
						})}
					</h1>
					<p className="text-muted-foreground">
						{T("registrationComingSoon.description", {
							defaultValue:
								"Account creation is disabled while the portal flow is being finished. Existing sign-in remains available for configured accounts.",
						})}
					</p>
					<Button variant="outline" asChild>
						<a href="/Account/SignIn">
							{T("registrationComingSoon.signIn", {
								defaultValue: "Sign In",
							})}
						</a>
					</Button>
				</div>
			</div>
		);
	}

	if (IsLoading) {
		return (
			<div className="flex min-h-screen flex-col">
				<Header
					{...(HeaderContent ? { content: HeaderContent } : {})}
					Mode="functional"
				/>
				<div className="flex flex-1 items-center justify-center">
					<p className="text-muted-foreground">
						{T("loading", { defaultValue: "Loading..." })}
					</p>
				</div>
			</div>
		);
	}

	if (Error) {
		return (
			<div className="flex min-h-screen flex-col">
				<Header
					{...(HeaderContent ? { content: HeaderContent } : {})}
					Mode="functional"
				/>
				<div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
					<p className="text-destructive">
						{T("error", {
							defaultValue: "Authentication error",
						})}
						: {Error.message}
					</p>
					<Button variant="outline" onClick={() => Login()}>
						{T("tryAgain", {
							defaultValue: "Try again",
						})}
					</Button>
				</div>
			</div>
		);
	}

	if (IsAuthenticated && User) {
		const DisplayName =
			User.name && User.name !== User.email
				? User.name
				: User.nickname || User.email?.split("@")[0] || "User";

		return (
			<div className="flex min-h-screen flex-col">
				<Header
					{...(HeaderContent ? { content: HeaderContent } : {})}
					Mode="functional"
				/>
				<div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4">
					<Button variant="default" className="w-full" asChild>
						<a href="/Dashboard">
							{T("dashboard", {
								defaultValue: "Go to Dashboard",
							})}
						</a>
					</Button>

					<Button
						variant="outline"
						className="w-full"
						onClick={Logout}
					>
						{T("logout", {
							defaultValue: "Sign Out",
						})}
					</Button>

					{User.picture && (
						<img
							src={User.picture}
							alt={User.name || "User avatar"}
							title={User.name || "User avatar"}
							width="64"
							height="64"
							className="flat h-16 w-16"
						/>
					)}

					<h2 className="text-lg font-semibold">{DisplayName}</h2>

					<p className="text-muted-foreground">{User.email}</p>

					{User.email_verified === false && (
						<p className="border border-yellow-200 bg-yellow-50 px-3 py-2 text-yellow-700">
							{T("emailNotVerified", {
								defaultValue:
									"Email not verified. Check your inbox.",
							})}
						</p>
					)}
				</div>
			</div>
		);
	}

	// Not authenticated, not loading - redirect is in progress
	return (
		<div className="flex min-h-screen flex-col">
			<Header {...(HeaderContent ? { Content: HeaderContent } : {})} Mode="functional" />
			<div className="flex flex-1 items-center justify-center">
				<p className="text-muted-foreground">
					{T("redirecting", {
						defaultValue: "Redirecting to sign in...",
					})}
				</p>
			</div>
		</div>
	);
};
