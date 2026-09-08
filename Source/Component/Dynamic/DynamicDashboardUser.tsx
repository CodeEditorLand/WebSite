"use client";

import { useAuth0 } from "@auth0/auth0-react";

import { ThemeImage } from "@Library/Theme";

import {
	Building2,
	CircleCheck,
	Eye,
	EyeOff,
	TriangleAlert,
} from "lucide-react";

import { useState, type ReactNode } from "react";

import { useTranslation } from "react-i18next";

import Auth0Provider from "../Provider/Auth0Provider";

import { Button } from "../UI/Button";

import { Skeleton } from "../UI/Skeleton";

const Pii = ({
	children,
	visible,
}: {
	children: ReactNode;

	visible: boolean;
}) => (
	<span
		className={`transition-all duration-200 ${visible ? "" : "select-none blur-sm"}`}
	>
		{children}
	</span>
);

/**
 * Auth0-aware dashboard user panel.
 * Reads Auth0 session state and populates the Account card
 * with email, username, member since, avatar, verified badge,
 * provider label, and sign out button.
 *
 * Also bridges Auth0 claims into the legacy localStorage format
 * so any remaining legacy code can read `current_user`.
 *
 * Sign-out clears Auth0 session, posts Auth:Clear to ServiceWorker,
 * and removes legacy localStorage/cookie tokens.
 *
 * For Okta enterprise users, Auth0 normalizes claims:
 * - sub = "okta|<okta-user-id>"
 * - org_id (if orgs enabled)
 * - custom claims via Auth0 Actions/Rules
 */
export default ({
	Domain,
	ClientIdentifier,
}: {
	Domain?: string;

	ClientIdentifier?: string;
}) => (
	<Auth0Provider
		Children={<DashboardUserInner />}
		{...(Domain ? { Domain } : {})}
		{...(ClientIdentifier ? { ClientIdentifier } : {})}
	/>
);

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

const DashboardUserInner = () => {
	const {
		isLoading: IsLoading,

		isAuthenticated: IsAuthenticated,

		user: User,

		error: AuthError,

		loginWithRedirect: Login,

		logout: Auth0Logout,
	} = useAuth0();

	const { t: T } = useTranslation("common");

	const [PIIVisible, SetPIIVisible] = useState(false);

	// Bridge Auth0 user into localStorage for legacy code
	if (IsAuthenticated && User) {
		try {
			const LegacyUser = {
				id: User.sub || "",

				email: User.email || "",

				username: User.nickname || User.email?.split("@")[0] || "",

				displayName: User.name || "",

				avatarUrl: User.picture || "",

				provider: DetectProvider(User.sub),

				emailVerified: User.email_verified || false,

				createdAt: User.updated_at || new Date().toISOString(),

				updatedAt: User.updated_at || new Date().toISOString(),
			};

			localStorage.setItem("current_user", JSON.stringify(LegacyUser));
		} catch {
			// localStorage not available
		}
	}

	const HandleSignOut = () => {
		ClearAuthFromServiceWorker();

		ClearLegacyTokens();

		Auth0Logout({ logoutParams: { returnTo: window.location.origin } });
	};

	if (IsLoading) {
		return (
			<div
				className="space-y-3"
				aria-label={T("dashboard.loading", {
					defaultValue: "Loading account...",
				})}
			>
				<Skeleton className="mx-auto h-12 w-12" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-4/5" />
				<Skeleton className="h-4 w-3/5" />
				<Skeleton className="h-4 w-2/5" />
			</div>
		);
	}

	if (AuthError) {
		return (
			<div className="space-y-3" role="alert" aria-live="polite">
				<p className="text-destructive">
					{T("dashboard.error", {
						defaultValue:
							"Could not load your account. Please refresh.",
					})}
				</p>
				<p className="text-card-foreground">{AuthError.message}</p>
				<Button
					variant="outline"
					size="sm"
					onClick={() => window.location.reload()}
				>
					{T("tryAgain", { defaultValue: "Try again" })}
				</Button>
			</div>
		);
	}

	if (!IsAuthenticated || !User) {
		return (
			<div className="space-y-3">
				<p className="text-card-foreground">
					{T("dashboard.account.notSignedIn", {
						defaultValue: "Sign in to see your account details.",
					})}
				</p>
				<button
					type="button"
					onClick={() => Login()}
					className="StaccatoButton text-primary-fg inline-flex items-center justify-center bg-primary px-4 py-1.5 font-medium transition-all hover:opacity-90"
				>
					{T("dashboard.account.signInButton", {
						defaultValue: "Sign In",
					})}
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
			})
		: "--";

	const ProviderLabel = DetectProviderLabel(User.sub);

	const ProviderIcon = DetectProviderIcon(User.sub);

	const IsEnterprise = IsEnterpriseUser(User.sub);

	const OrganizationName = (User as Record<string, unknown>)["org_name"] as
		string | undefined;

	const OrganizationIdentifier = (User as Record<string, unknown>)[
		"org_id"
	] as string | undefined;

	return (
		<div className="space-y-3">
			{/* Privacy toggle */}
			<div className="flex justify-end">
				<button
					type="button"
					onClick={() => SetPIIVisible((v) => !v)}
					aria-label={
						PIIVisible ? "Hide personal data" : "Show personal data"
					}
					className="text-card-foreground transition-colors hover:text-card-foreground focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
				>
					{PIIVisible ? (
						<EyeOff className="h-4 w-4" aria-hidden="true" />
					) : (
						<Eye className="h-4 w-4" aria-hidden="true" />
					)}
				</button>
			</div>

			{/* Avatar */}
			<div
				className={`flex justify-center pb-2 transition-all duration-200 ${PIIVisible ? "" : "blur-sm"}`}
			>
				{User.picture ? (
					<img
						src={User.picture}
						alt={`${DisplayName} avatar`}
						title={DisplayName}
						width="48"
						height="48"
						loading="lazy"
						className="flat h-12 w-12"
						onError={(Event) => {
							(Event.target as HTMLImageElement).style.display =
								"none";

							const Fallback = (Event.target as HTMLImageElement)
								.nextElementSibling as HTMLElement | null;

							if (Fallback) Fallback.style.display = "flex";
						}}
					/>
				) : null}
				<div
					className={`${User.picture ? "hidden" : "flex"} flat bg-mute h-12 w-12 items-center justify-center text-lg font-bold text-card-foreground`}
					aria-hidden="true"
				>
					<Pii visible={PIIVisible}>
						{DisplayName.slice(0, 1).toUpperCase()}
					</Pii>
				</div>
			</div>

			{/* Display Name */}
			<div className="flex justify-between">
				<span className="text-card-foreground">
					{T("dashboard.account.nameLabel", { defaultValue: "Name" })}
				</span>
				<span className="font-medium">
					<Pii visible={PIIVisible}>{DisplayName}</Pii>
				</span>
			</div>

			{/* Email + Verified Badge */}
			<div className="flex justify-between">
				<span className="text-card-foreground">
					{T("dashboard.account.emailLabel", {
						defaultValue: "Email",
					})}
				</span>
				<span className="flex items-center gap-1.5">
					<span className="text-card-foreground">
						<Pii visible={PIIVisible}>{User.email || "--"}</Pii>
					</span>
					{User.email_verified === true && (
						<span
							className="inline-flex items-center border border-green-200 bg-green-50 px-1.5 py-0 text-sm font-medium text-green-700"
							title={T("dashboard.account.emailVerifiedTitle", {
								defaultValue: "Email verified",
							})}
						>
							{T("dashboard.account.emailVerifiedBadge", {
								defaultValue: "Verified",
							})}{" "}
							<CircleCheck
								aria-hidden="true"
								className="text-grpc inline h-4 w-4 align-[-3px]"
							/>
						</span>
					)}
				</span>
			</div>

			{/* Plan */}
			<div className="flex justify-between">
				<span className="text-card-foreground">
					{T("dashboard.account.planLabel", { defaultValue: "Plan" })}
				</span>
				<span className="font-medium">
					{IsEnterprise
						? T("dashboard.account.planEnterprise", {
								defaultValue: "Enterprise",
							})
						: T("dashboard.account.planFree", {
								defaultValue: "Free",
							})}
				</span>
			</div>

			{/* Auth Provider */}
			<div className="flex justify-between">
				<span className="text-card-foreground">
					{T("dashboard.account.providerLabel", {
						defaultValue: "Provider",
					})}
				</span>
				<span className="flex items-center gap-1.5 text-card-foreground">
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
			</div>

			{/* Organization (Enterprise only) */}
			{IsEnterprise && (OrganizationName || OrganizationIdentifier) && (
				<div className="flex justify-between">
					<span className="text-card-foreground">
						{T("dashboard.account.organizationLabel", {
							defaultValue: "Organization",
						})}
					</span>
					<span className="font-medium">
						<Pii visible={PIIVisible}>
							{OrganizationName || OrganizationIdentifier}
						</Pii>
					</span>
				</div>
			)}

			{/* Member Since */}
			<div className="flex justify-between">
				<span className="text-card-foreground">
					{T("dashboard.account.memberSinceLabel", {
						defaultValue: "Member Since",
					})}
				</span>
				<span className="text-card-foreground">
					<Pii visible={PIIVisible}>{MemberSince}</Pii>
				</span>
			</div>

			{/* Enterprise SSO Banner */}
			{IsEnterprise && (
				<div className="mt-2 border border-green-200 bg-green-50 px-3 py-2 text-green-700">
					{T("dashboard.account.enterpriseSSO", {
						defaultValue: "Enterprise SSO active",
					})}{" "}
					<Building2
						aria-hidden="true"
						className="inline h-4 w-4 align-[-3px]"
					/>
				</div>
			)}

			{/* Email Not Verified Warning */}
			{User.email_verified === false && (
				<div className="mt-2 border border-yellow-200 bg-yellow-50 px-3 py-2 text-yellow-700">
					{T("dashboard.account.emailNotVerified", {
						defaultValue: "Email not verified. Check your inbox.",
					})}{" "}
					<TriangleAlert
						aria-hidden="true"
						className="inline h-4 w-4 align-[-3px]"
					/>
				</div>
			)}

			{/* Sign Out Button */}
			<div className="mt-3 flex gap-2">
				<a
					href="/Account"
					className="StaccatoButton inline-flex flex-1 items-center justify-center bg-card px-3 py-1.5 font-medium transition-all hover:bg-secondary"
				>
					{T("dashboard.account.manageButton", {
						defaultValue: "Manage",
					})}
				</a>
				<button
					type="button"
					onClick={HandleSignOut}
					className="StaccatoButton inline-flex flex-1 items-center justify-center bg-card px-3 py-1.5 font-medium text-red-600 transition-all hover:bg-red-50"
				>
					{T("dashboard.account.signOutButton", {
						defaultValue: "Sign Out",
					})}
				</button>
			</div>
		</div>
	);
};

const DetectProvider = (
	Sub?: string,
): "email" | "github" | "google" | "gitlab" | "okta" => {
	if (!Sub) return "email";

	if (Sub.startsWith("github|")) return "github";

	if (Sub.startsWith("google-oauth2|")) return "google";

	if (Sub.startsWith("gitlab|")) return "gitlab";

	if (Sub.startsWith("okta|")) return "okta";

	return "email";
};

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

/**
 * Detect the Portal tier based on the Auth0 `sub` claim prefix.
 * - Cloud: direct auth0| database connection
 * - Provider: github|, google-oauth2|, gitlab| OAuth
 * - Enterprise: okta|, samlp|, waad| SSO
 * - LocalFirst: no cloud auth (null sub)
 */
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
