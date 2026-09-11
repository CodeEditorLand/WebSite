"use client";

import { useAuth0 } from "@auth0/auth0-react";

import { ThemeImage } from "@Library/Theme";

import { Eye, EyeOff, Lock, MailCheck, ShieldCheck } from "lucide-react";

import { useState, type ReactNode } from "react";

import { useTranslation } from "react-i18next";

import Auth0Provider from "../Provider/Auth0Provider";

import { Button } from "../UI/Button";

import { Skeleton } from "../UI/Skeleton";

// ── PII blur wrapper ────────────────────────────────────────────────────────

const Pii = ({
	children,
	visible,
}: {
	children: ReactNode;

	visible: boolean;
}) => (
	<span
		className={`transition-all duration-200 ${
			visible ? "" : "select-none blur-sm"
		}`}
	>
		{children}
	</span>
);

// ── Source badge ────────────────────────────────────────────────────────

const SourceBadge = ({
	label,
	icon,
}: {
	label: string;

	icon?: string | null;
}) => (
	<span className="bg-mute inline-flex items-center gap-1 px-1.5 py-0.5 font-mono text-sm text-muted-foreground">
		{icon && (
			<ThemeImage
				src={icon}
				alt={label}
				width={10}
				height={10}
				className="h-2.5 w-2.5"
			/>
		)}
		{label}
	</span>
);

// ── Profile field row ───────────────────────────────────────────────────────

const FieldRow = ({
	label,
	value,
	source,
	sourceIcon,
	editable,
	editHint,
	editHref,
}: {
	label: string;

	value: ReactNode;

	source: string;

	sourceIcon?: string | null;

	editable: boolean;

	editHint?: string;

	editHref?: string;
}) => (
	<div className="px-6 py-4">
		<div className="flex items-start justify-between gap-4">
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium">{label}</span>
					<SourceBadge label={source} icon={sourceIcon} />
					{editable ? (
						<span className="inline-flex items-center border-[color-mix(in_srgb,var(--Accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--Accent)_10%,transparent)] px-1.5 py-0 font-mono text-sm text-[var(--Accent)]">
							Editable
						</span>
					) : (
						<span className="bg-mute inline-flex items-center px-1.5 py-0 font-mono text-sm text-muted-foreground">
							Read-only
						</span>
					)}
				</div>
				<div className="mt-1 text-sm text-card-foreground opacity-70">
					{value}
				</div>
			</div>
		</div>
		{editHint && (
			<p className="mt-1.5 text-sm text-card-foreground opacity-70">
				{editHint}

				{editHref && (
					<>
						{" "}
						<a
							href={editHref}
							target="_blank"
							rel="noopener noreferrer"
							className="text-card-foreground hover:underline"
						>
							Update here →
						</a>
					</>
				)}
			</p>
		)}
	</div>
);

// ── Auth0 badge ─────────────────────────────────────────────────────────────

const Auth0Badge = () => (
	<a
		href="https://auth0.com/privacy"
		target="_blank"
		rel="noopener noreferrer"
		className="inline-flex items-center gap-1.5 border border-[#EB5424]/30 bg-[#EB5424]/5 px-2 py-1 text-sm transition-colors hover:bg-[#EB5424]/10"
	>
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"
				fill="#EB5424"
			/>
			<path
				d="M12 6l-5 2.75V12c0 3.25 2.3 6.25 5 6.9 2.7-.65 5-3.65 5-6.9V8.75L12 6z"
				fill="white"
				fillOpacity="0.9"
			/>
		</svg>
		<span>
			Secured by{" "}
			<span className="font-medium" style={{ color: "#EB5424" }}>
				Auth0
			</span>{" "}
			by Okta
		</span>
	</a>
);

// ── Provider helpers ────────────────────────────────────────────────────────

const DetectProviderLabel = (Sub?: string): string => {
	if (!Sub) return "Email";

	if (Sub.startsWith("github|")) return "GitHub";

	if (Sub.startsWith("google-oauth2|")) return "Google";

	if (Sub.startsWith("gitlab|")) return "GitLab";

	if (Sub.startsWith("okta|")) return "Okta SSO";

	if (Sub.startsWith("samlp|")) return "SAML SSO";

	if (Sub.startsWith("waad|")) return "Azure AD";

	return "Auth0";
};

const DetectProviderIcon = (Sub?: string): string | null => {
	if (!Sub) return null;

	if (Sub.startsWith("github|")) return "/Image/GitHub.svg";

	if (Sub.startsWith("google-oauth2|")) return "/Image/Google.svg";

	if (Sub.startsWith("gitlab|")) return "/Image/GitLab.svg";

	if (Sub.startsWith("okta|")) return "/Image/Okta.svg";

	if (Sub.startsWith("waad|")) return "/Image/Microsoft.svg";

	return null;
};

const DetectProviderProfileUrl = (Sub?: string): string | null => {
	if (!Sub) return null;

	if (Sub.startsWith("github|")) return "https://github.com/settings/profile";

	if (Sub.startsWith("google-oauth2|"))
		return "https://myaccount.google.com/personal-info";

	if (Sub.startsWith("gitlab|")) return "https://gitlab.com/-/profile";

	return null;
};

const DetectPortalTier = (
	Sub?: string,
): "Cloud" | "Provider" | "LocalFirst" | "Enterprise" => {
	if (!Sub) return "LocalFirst";

	if (Sub.startsWith("github|")) return "Provider";

	if (Sub.startsWith("google-oauth2|")) return "Provider";

	if (Sub.startsWith("gitlab|")) return "Provider";

	if (Sub.startsWith("okta|")) return "Enterprise";

	if (Sub.startsWith("samlp|")) return "Enterprise";

	if (Sub.startsWith("waad|")) return "Enterprise";

	return "Cloud";
};

const IsEnterpriseUser = (Sub?: string): boolean => {
	if (!Sub) return false;

	return (
		Sub.startsWith("okta|") ||
		Sub.startsWith("samlp|") ||
		Sub.startsWith("waad|")
	);
};

const TierColorMap: Record<
	string,
	{ Border: string; Background: string; Text: string; Dot: string }
> = {
	Cloud: {
		Border: "border-blue-200",

		Background: "bg-blue-50",

		Text: "text-blue-700",

		Dot: "bg-blue-500",
	},

	Provider: {
		Border: "border-purple-200",

		Background: "bg-purple-50",

		Text: "text-purple-700",

		Dot: "bg-purple-500",
	},

	LocalFirst: {
		Border: "border-orange-200",

		Background: "bg-orange-50",

		Text: "text-orange-700",

		Dot: "bg-orange-500",
	},

	Enterprise: {
		Border: "border-green-200",

		Background: "bg-green-50",

		Text: "text-green-700",

		Dot: "bg-green-500",
	},
};

// ── Main export ─────────────────────────────────────────────────────────────

export default ({
	Domain,
	ClientIdentifier,
}: {
	Domain?: string;

	ClientIdentifier?: string;
}) => (
	<Auth0Provider
		Children={
			<AccountProfileInner
				Domain={Domain}
				ClientIdentifier={ClientIdentifier}
			/>
		}
		{...(Domain ? { Domain } : {})}
		{...(ClientIdentifier ? { ClientIdentifier } : {})}
	/>
);

// ── Service worker / token helpers ──────────────────────────────────────────

const ClearAuthFromServiceWorker = (): void => {
	try {
		if (
			typeof navigator === "undefined" ||
			!navigator.serviceWorker?.controller
		)
			return;

		navigator.serviceWorker.controller.postMessage({ Type: "Auth:Clear" });
	} catch {
		// ServiceWorker not available
	}
};

const ClearLegacyTokens = (): void => {
	try {
		localStorage.removeItem("session_token");

		localStorage.removeItem("current_user");

		document.cookie =
			"session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
	} catch {
		// Storage not available
	}
};

// ── Inner component ─────────────────────────────────────────────────────────

const AccountProfileInner = ({
	Domain = "",
	ClientIdentifier = "",
}: {
	Domain?: string;

	ClientIdentifier?: string;
}) => {
	const {
		isLoading: IsLoading,

		isAuthenticated: IsAuthenticated,

		user: User,

		error: AuthError,

		loginWithRedirect: Login,

		logout: Auth0Logout,
	} = useAuth0();

	const { t: T } = useTranslation("account");

	const [PIIVisible, SetPIIVisible] = useState(false);

	const [PasswordResetState, SetPasswordResetState] = useState<
		"idle" | "sending" | "sent" | "error"
	>("idle");

	const HandleSignOut = () => {
		ClearAuthFromServiceWorker();

		ClearLegacyTokens();

		Auth0Logout({ logoutParams: { returnTo: window.location.origin } });
	};

	const HandlePasswordReset = async () => {
		if (!User?.email || !Domain || !ClientIdentifier) return;

		SetPasswordResetState("sending");

		try {
			const Response = await fetch(
				`https://${Domain}/dbconnections/change_password`,

				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						client_id: ClientIdentifier,
						email: User.email,
						connection: "Username-Password-Authentication",
					}),
				},
			);

			SetPasswordResetState(Response.ok ? "sent" : "error");
		} catch {
			SetPasswordResetState("error");
		}
	};

	if (IsLoading) {
		return (
			<div className="mx-auto max-w-2xl space-y-6 px-4 py-16">
				<div className="flex items-center gap-6">
					<Skeleton className="h-20 w-20 shrink-0" />
					<div className="flex-1 space-y-3">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-64" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
				<Skeleton className="h-48 w-full" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-24 w-full" />
			</div>
		);
	}

	if (AuthError) {
		return (
			<div
				className="mx-auto max-w-2xl space-y-4 px-4 py-16"
				role="alert"
				aria-live="polite"
			>
				<p className="text-destructive">
					{T("error", { defaultValue: "Authentication error" })}:{" "}
					{AuthError.message}
				</p>
				<Button
					variant="outline"
					onClick={() => window.location.reload()}
				>
					{T("tryAgain", { defaultValue: "Try again" })}
				</Button>
			</div>
		);
	}

	if (!IsAuthenticated || !User) {
		return (
			<div className="mx-auto max-w-2xl space-y-4 px-4 py-16 text-center">
				<p className="text-muted-foreground">
					{T("notSignedIn", {
						defaultValue: "Sign in to manage your account.",
					})}
				</p>
				<button
					type="button"
					onClick={() => {
						try {
							sessionStorage.setItem(
								"auth0_return_to",

								window.location.pathname,
							);
						} catch {}

						Login();
					}}
					className="StaccatoButton text-primary-fg inline-flex items-center justify-center bg-primary px-6 py-2 font-medium transition-all hover:opacity-90"
				>
					{T("signInButton", { defaultValue: "Sign In" })}
				</button>
			</div>
		);
	}

	const DisplayName =
		User.name && User.name !== User.email
			? User.name
			: User.nickname || User.email?.split("@")[0] || "User";

	const MemberSince = User.updated_at
		? new Date(User.updated_at).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: "--";

	const ProviderLabel = DetectProviderLabel(User.sub);

	const ProviderIcon = DetectProviderIcon(User.sub);

	const ProviderProfileUrl = DetectProviderProfileUrl(User.sub);

	const Tier = DetectPortalTier(User.sub);

	const TierColor = TierColorMap[Tier] || TierColorMap["Cloud"]!;

	const IsEnterprise = IsEnterpriseUser(User.sub);

	const IsSocialUser =
		User.sub !== undefined && !User.sub.startsWith("auth0|");

	const IsEmailPasswordUser = User.sub?.startsWith("auth0|") === true;

	const OrganizationName = (User as Record<string, unknown>)["org_name"] as
		string | undefined;

	const OrganizationIdentifier = (User as Record<string, unknown>)[
		"org_id"
	] as string | undefined;

	return (
		<div className="mx-auto max-w-2xl space-y-8 px-4 py-16">
			{/* ── Profile Header ────────────────────────────────────── */}
			<div className="flex items-start gap-6">
				<div
					className={`shrink-0 transition-all duration-200 ${
						PIIVisible ? "" : "blur-sm"
					}`}
				>
					{User.picture ? (
						<img
							src={User.picture}
							alt={User.name || "User avatar"}
							title={User.name || "User avatar"}
							width="80"
							height="80"
							className="flat h-20 w-20 object-cover"
						/>
					) : (
						<div className="bg-mute flex h-20 w-20 items-center justify-center text-2xl font-medium text-muted-foreground">
							{DisplayName.slice(0, 2).toUpperCase()}
						</div>
					)}
				</div>
				<div className="flex-1">
					<h2 className="text-2xl font-medium">
						<Pii visible={PIIVisible}>{DisplayName}</Pii>
					</h2>
					<div className="mt-1 flex flex-wrap items-center gap-2">
						<span className="text-sm text-muted-foreground">
							<Pii visible={PIIVisible}>{User.email || "--"}</Pii>
						</span>
						{User.email_verified === true && (
							<span className="inline-flex items-center gap-1 border border-green-200 bg-green-50 px-1.5 py-0 text-sm font-medium text-green-700">
								<MailCheck
									className="h-2.5 w-2.5"
									aria-hidden="true"
								/>
								Verified
							</span>
						)}
						{User.email_verified === false && (
							<span className="inline-flex items-center border border-yellow-200 bg-yellow-50 px-1.5 py-0 text-sm font-medium text-yellow-700">
								Not Verified
							</span>
						)}
					</div>
					<div className="mt-2 flex flex-wrap gap-2">
						<span
							className={`inline-flex items-center border ${TierColor.Border} ${TierColor.Background} px-2 py-0.5 text-sm font-medium ${TierColor.Text}`}
						>
							{Tier}
							{"\u2001"}
							<span
								className={`flat h-1.5 w-1.5 ${TierColor.Dot}`}
								aria-hidden="true"
							/>
						</span>
						{ProviderIcon ? (
							<span className="bg-mute inline-flex items-center gap-1 px-2 py-0.5 text-sm font-medium text-muted-foreground">
								<ThemeImage
									src={ProviderIcon}
									alt={ProviderLabel}
									width={12}
									height={12}
									className="h-3 w-3"
								/>
								<Pii visible={PIIVisible}>{ProviderLabel}</Pii>
							</span>
						) : (
							<span className="bg-mute inline-flex items-center px-2 py-0.5 text-sm font-medium text-muted-foreground">
								<Pii visible={PIIVisible}>{ProviderLabel}</Pii>
							</span>
						)}
					</div>
				</div>
				<button
					type="button"
					onClick={() => SetPIIVisible((v) => !v)}
					aria-label={
						PIIVisible ? "Hide personal data" : "Show personal data"
					}
					className="mt-1 shrink-0 text-muted-foreground transition-colors hover:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
				>
					{PIIVisible ? (
						<EyeOff className="h-5 w-5" aria-hidden="true" />
					) : (
						<Eye className="h-5 w-5" aria-hidden="true" />
					)}
				</button>
			</div>

			{/* ── Enterprise SSO banner ─────────────────────────────── */}
			{IsEnterprise && (
				<div className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
					<div className="flex items-center gap-2">
						<ShieldCheck
							className="h-4 w-4 shrink-0"
							aria-hidden="true"
						/>
						<span>
							Enterprise SSO active
							{(OrganizationName || OrganizationIdentifier) && (
								<>
									{" - "}

									<Pii visible={PIIVisible}>
										<span className="font-medium">
											{OrganizationName ||
												OrganizationIdentifier}
										</span>
									</Pii>
								</>
							)}
						</span>
					</div>
					<p className="mt-1 pl-6 text-sm text-green-600">
						Profile fields are managed by your organization's
						identity provider. Contact your IT administrator to
						update them.
					</p>
				</div>
			)}

			{/* ── Email not verified warning ────────────────────────── */}
			{User.email_verified === false && (
				<div className="border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
					{T("emailNotVerified", {
						defaultValue: "Email not verified. Check your inbox.",
					})}
				</div>
			)}

			{/* ── Data storage notice ───────────────────────────────── */}
			<div className="bg-mute flex items-start gap-4 border border-[var(--Border)] px-5 py-4">
				<Lock
					className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
					aria-hidden="true"
				/>
				<div className="flex-1 space-y-1">
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm font-medium">
							Your account data is stored securely
						</span>
						<Auth0Badge />
					</div>
					<p className="text-sm text-muted-foreground">
						Authentication, profile data, and session tokens are
						managed by Auth0 (by Okta) and stored on their EU
						infrastructure. Code Editor Land does not store your
						password. Social login credentials (Google, GitHub,
						etc.) remain with your identity provider.
					</p>
				</div>
			</div>

			{/* ── Profile fields ────────────────────────────────────── */}
			<div className="StaccatoCard StaccatoBorderShimmer bg-card">
				<div className="flex items-center justify-between border-b border-[var(--Border)] px-6 py-4">
					<h3 className="font-medium text-card-foreground">
						{T("profileSection", {
							defaultValue: "Profile Fields",
						})}
					</h3>
					<span className="text-sm text-card-foreground">
						All data stored in Auth0
					</span>
				</div>
				<div className="divide-y divide-[var(--Border)]">
					{/* Display name */}
					<FieldRow
						label="Display Name"
						value={<Pii visible={PIIVisible}>{DisplayName}</Pii>}
						source={IsSocialUser ? ProviderLabel : "Auth0"}
						sourceIcon={IsSocialUser ? ProviderIcon : null}
						editable={!IsSocialUser}
						editHint={
							IsSocialUser
								? `Set by your ${ProviderLabel} account. To change it, update your profile at ${ProviderLabel}.`
								: "Contact support to update your display name."
						}
						editHref={
							IsSocialUser
								? (ProviderProfileUrl ?? undefined)
								: undefined
						}
					/>

					{/* Email */}
					<FieldRow
						label="Email Address"
						value={
							<span className="flex items-center gap-2">
								<Pii visible={PIIVisible}>
									{User.email || "--"}
								</Pii>
								{User.email_verified === true && (
									<span className="inline-flex items-center gap-1 border border-green-200 bg-green-50 px-1.5 py-0 font-mono text-sm text-green-700">
										<MailCheck className="h-2.5 w-2.5" />
										verified
									</span>
								)}
								{User.email_verified === false && (
									<span className="inline-flex items-center border border-yellow-200 bg-yellow-50 px-1.5 py-0 font-mono text-sm text-yellow-700">
										unverified
									</span>
								)}
							</span>
						}
						source={IsSocialUser ? ProviderLabel : "Auth0"}
						sourceIcon={IsSocialUser ? ProviderIcon : null}
						editable={IsEmailPasswordUser}
						editHint={
							IsSocialUser
								? `Email is tied to your ${ProviderLabel} account and cannot be changed here.`
								: IsEmailPasswordUser
									? "Email changes require re-verification. Contact support to initiate an email update."
									: undefined
						}
						editHref={
							IsSocialUser
								? (ProviderProfileUrl ?? undefined)
								: undefined
						}
					/>

					{/* Profile picture */}
					<FieldRow
						label="Profile Picture"
						value={
							User.picture ? (
								<span className="flex items-center gap-2">
									<span
										className={`transition-all duration-200 ${PIIVisible ? "" : "blur-sm"}`}
									>
										<img
											src={User.picture}
											alt="Profile picture"
											width="32"
											height="32"
											className="flat h-8 w-8 object-cover"
										/>
									</span>
									<Pii visible={PIIVisible}>
										<span className="font-mono text-sm text-card-foreground opacity-70">
											{User.picture
												.split("/")
												.pop()
												?.slice(0, 24)}
											…
										</span>
									</Pii>
								</span>
							) : (
								<span className="text-card-foreground opacity-70">
									Not set
								</span>
							)
						}
						source={IsSocialUser ? ProviderLabel : "Auth0"}
						sourceIcon={IsSocialUser ? ProviderIcon : null}
						editable={false}
						editHint={
							IsSocialUser
								? `Avatar is pulled from your ${ProviderLabel} account on each login.`
								: "Profile picture URL can be updated via the Auth0 Management API. Contact support."
						}
						editHref={
							IsSocialUser
								? (ProviderProfileUrl ?? undefined)
								: undefined
						}
					/>

					{/* Identity provider */}
					<FieldRow
						label="Identity Provider"
						value={
							<span className="flex items-center gap-1.5">
								{ProviderIcon && (
									<ThemeImage
										src={ProviderIcon}
										alt={ProviderLabel}
										width={14}
										height={14}
										className="h-3.5 w-3.5"
									/>
								)}
								<Pii visible={PIIVisible}>{ProviderLabel}</Pii>
							</span>
						}
						source="Auth0"
						editable={false}
						editHint="To use a different sign-in method, sign out and sign in with another provider. Multiple providers can be linked."
					/>

					{/* Portal tier */}
					<FieldRow
						label="Portal Tier"
						value={
							<span
								className={`inline-flex items-center border ${TierColor.Border} ${TierColor.Background} px-2 py-0.5 text-sm font-medium ${TierColor.Text}`}
							>
								{Tier}
								{"\u2001"}
								<span
									className={`flat h-1 w-1 ${TierColor.Dot}`}
									aria-hidden="true"
								/>
							</span>
						}
						source="Auth0"
						editable={false}
						editHint="Tier is determined by your sign-in method. Switch to a different provider to change tier."
					/>

					{/* User ID */}
					<FieldRow
						label="User ID"
						value={
							<code className="font-mono text-sm">
								<Pii visible={PIIVisible}>
									{User.sub || "--"}
								</Pii>
							</code>
						}
						source="Auth0"
						editable={false}
						editHint="System identifier assigned by Auth0. Used in GDPR requests and support tickets."
					/>

					{/* Member since */}
					<FieldRow
						label="Last Updated"
						value={<Pii visible={PIIVisible}>{MemberSince}</Pii>}
						source="Auth0"
						editable={false}
					/>

					{/* Organization (enterprise) */}
					{IsEnterprise &&
						(OrganizationName || OrganizationIdentifier) && (
							<FieldRow
								label="Organization"
								value={
									<Pii visible={PIIVisible}>
										<span className="font-medium">
											{OrganizationName ||
												OrganizationIdentifier}
										</span>
									</Pii>
								}
								source="Auth0 Organizations"
								editable={false}
								editHint="Managed by your organization administrator."
							/>
						)}
				</div>
			</div>

			{/* ── Security ──────────────────────────────────────────── */}
			<div className="StaccatoCard StaccatoBorderShimmer bg-card">
				<div className="border-b border-[var(--Border)] px-6 py-4">
					<h3 className="font-medium text-card-foreground">
						Security
					</h3>
				</div>
				<div className="divide-y divide-[var(--Border)]">
					{/* Password - email/password users only */}
					{IsEmailPasswordUser && (
						<div className="px-6 py-4">
							<div className="flex items-start justify-between gap-4">
								<div>
									<div className="flex items-center gap-2 text-sm font-medium">
										<Lock
											className="h-3.5 w-3.5 text-card-foreground opacity-70"
											aria-hidden="true"
										/>
										Password
										<SourceBadge label="Auth0" />
										<span className="inline-flex items-center border-[color-mix(in_srgb,var(--Accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--Accent)_10%,transparent)] px-1.5 py-0 font-mono text-sm text-[var(--Accent)]">
											Editable
										</span>
									</div>
									<p className="mt-1 text-sm text-card-foreground opacity-70">
										A reset link is sent to your email. You
										will not be signed out until you set a
										new password.
									</p>
								</div>
								{PasswordResetState === "idle" && (
									<button
										type="button"
										onClick={HandlePasswordReset}
										className="StaccatoButton shrink-0 bg-card px-3 py-1.5 text-sm font-medium transition-all hover:bg-secondary"
									>
										Send Reset Email
									</button>
								)}
								{PasswordResetState === "sending" && (
									<span className="shrink-0 text-sm text-card-foreground opacity-70">
										Sending…
									</span>
								)}
								{PasswordResetState === "sent" && (
									<span className="inline-flex shrink-0 items-center gap-1 border border-green-200 bg-green-50 px-2 py-1 text-sm text-green-700">
										<MailCheck className="h-3 w-3" />
										Email sent
									</span>
								)}
								{PasswordResetState === "error" && (
									<span className="shrink-0 text-sm text-red-600">
										Failed. Try again.
									</span>
								)}
							</div>
						</div>
					)}

					{/* Social users - no password */}
					{IsSocialUser && (
						<div className="px-6 py-4">
							<div className="flex items-center gap-2 text-sm font-medium">
								<Lock
									className="h-3.5 w-3.5 text-card-foreground opacity-70"
									aria-hidden="true"
								/>
								Password
								<SourceBadge
									label={ProviderLabel}
									icon={ProviderIcon}
								/>
								<span className="bg-mute inline-flex items-center px-1.5 py-0 font-mono text-sm text-muted-foreground">
									Not applicable
								</span>
							</div>
							<p className="mt-1 text-sm text-card-foreground opacity-70">
								You signed in via {ProviderLabel}. Password
								management is handled entirely by{" "}
								{ProviderLabel} - Code Editor Land never
								receives or stores your password.
								{ProviderProfileUrl && (
									<>
										{" "}
										<a
											href={ProviderProfileUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-card-foreground hover:underline"
										>
											Manage at {ProviderLabel} →
										</a>
									</>
								)}
							</p>
						</div>
					)}

					{/* Session */}
					<div className="px-6 py-4">
						<div className="flex items-center gap-2 text-sm font-medium">
							<ShieldCheck
								className="h-3.5 w-3.5 text-card-foreground opacity-70"
								aria-hidden="true"
							/>
							Active Session
							<SourceBadge label="Auth0" />
							<span className="bg-mute inline-flex items-center px-1.5 py-0 font-mono text-sm text-muted-foreground">
								Read-only
							</span>
						</div>
						<p className="mt-1 text-sm text-card-foreground opacity-70">
							Session managed by Auth0. Signing out revokes the
							session token on Auth0's servers and clears local
							storage. Access token validity: 1 hour.
						</p>
					</div>
				</div>
			</div>

			{/* ── Account actions ───────────────────────────────────── */}

			<div className="StaccatoCard StaccatoBorderShimmer bg-card">
				<div className="border-b border-[var(--Border)] px-6 py-4">
					<h3 className="font-medium text-card-foreground">
						{T("actionsSection", {
							defaultValue: "Account Actions",
						})}
					</h3>
				</div>
				<div className="space-y-3 px-6 py-4">
					<a
						href="/Dashboard"
						className="StaccatoButton inline-flex w-full items-center justify-center bg-card px-4 py-2 font-medium transition-all hover:bg-secondary"
					>
						{T("goToDashboard", {
							defaultValue: "Go to Dashboard",
						})}

						<span className="InlineSeparator">&rarr;</span>
					</a>
					<button
						type="button"
						onClick={HandleSignOut}
						className="StaccatoButton inline-flex w-full items-center justify-center border border-red-200 bg-card px-4 py-2 font-medium text-red-600 transition-all hover:bg-red-50"
					>
						{T("signOut", { defaultValue: "Sign Out" })}
					</button>
				</div>
			</div>
		</div>
	);
};
