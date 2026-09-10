import { ThemeImage } from "@Library/Theme";

import * as lucide from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { Button } from "../UI/Button";

import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";

import { IconTooltip } from "../UI/IconTooltip.js";

import { DynamicInput } from "./DynamicInput";

import type PortalContent from "./Interface/Content/Page/Portal.js";

import type TierContent from "./Interface/Content/Portal/Tier.js";

/**
 * Icon registry for tier icons.
 *
 * Covers the full CodeEditorLand technology stack:
 * - Core runtime: Cpu, Zap, Layers, Network, Radio, Timer
 * - Platform/OS: Laptop, Monitor, HardDrive, Server, Terminal
 * - Language/build: Code, Wrench, Package, PackageOpen, Hammer, FlaskConical
 * - Git/VCS: GitBranch, GitFork, GitCommit, GitPullRequest, FolderGit
 * - Identity/crypto: Key, KeyRound, Lock, Hash, Fingerprint, Shield
 * - Cloud/sync: Cloud, RefreshCw, RefreshCcw, RotateCcw, Database
 * - Auth/provisioning: UserPlus, Users, Building2, Blocks
 * - Extensions/plugins: Puzzle, Box, CirclePlay, Rocket
 * - Connectivity: Wifi, WifiOff, Globe, Unplug, Link2, ExternalLink
 * - Audit/docs: FileText, Activity, AlertTriangle, Info
 * - Settings/config: Settings, Sliders, CheckCircle, Check, ChevronRight
 * - AI/intelligence: BrainCircuit
 * - Support/lifecycle: LifeBuoy, Download, Search
 */
const TierIconRegistry: Record<string, lucide.LucideIcon> = {
	Activity: lucide.Activity,

	AlertTriangle: lucide.AlertTriangle,

	Blocks: lucide.Blocks,

	Box: lucide.Box,

	BrainCircuit: lucide.BrainCircuit,

	Building2: lucide.Building2,

	Check: lucide.Check,

	CheckCircle: lucide.CheckCircle,

	ChevronRight: lucide.ChevronRight,

	CirclePlay: lucide.CirclePlay,

	Cloud: lucide.Cloud,

	Code: lucide.Code,

	Cpu: lucide.Cpu,

	Database: lucide.Database,

	Download: lucide.Download,

	ExternalLink: lucide.ExternalLink,

	FileText: lucide.FileText,

	Fingerprint: lucide.Fingerprint,

	FlaskConical: lucide.FlaskConical,

	FolderGit: lucide.FolderGit,

	GitBranch: lucide.GitBranch,

	GitCommit: lucide.GitCommit,

	GitFork: lucide.GitFork,

	GitPullRequest: lucide.GitPullRequest,

	Globe: lucide.Globe,

	Hammer: lucide.Hammer,

	HardDrive: lucide.HardDrive,

	Hash: lucide.Hash,

	Info: lucide.Info,

	Key: lucide.Key,

	KeyRound: lucide.KeyRound,

	Laptop: lucide.Laptop,

	Layers: lucide.Layers,

	LifeBuoy: lucide.LifeBuoy,

	Link2: lucide.Link2,

	Lock: lucide.Lock,

	Monitor: lucide.Monitor,

	Network: lucide.Network,

	Package: lucide.Package,

	PackageOpen: lucide.PackageOpen,

	Puzzle: lucide.Puzzle,

	Radio: lucide.Radio,

	RefreshCcw: lucide.RefreshCcw,

	RefreshCw: lucide.RefreshCw,

	Rocket: lucide.Rocket,

	RotateCcw: lucide.RotateCcw,

	Search: lucide.Search,

	Server: lucide.Server,

	Settings: lucide.Settings,

	Shield: lucide.Shield,

	Sliders: lucide.Sliders,

	Terminal: lucide.Terminal,

	Timer: lucide.Timer,

	Unplug: lucide.Unplug,

	UserPlus: lucide.UserPlus,

	Users: lucide.Users,

	Wifi: lucide.Wifi,

	WifiOff: lucide.WifiOff,

	Wrench: lucide.Wrench,

	Zap: lucide.Zap,
};

const IconLabelMap: Record<string, string> = {
	Activity: "Monitor health in real time",

	AlertTriangle: "Catch issues before they reach users",

	Blocks: "Composable access control",

	Box: "Extension installation path",

	BrainCircuit: "AI capability path",

	Building2: "Organization-wide access control",

	Check: "Requirement met",

	CheckCircle: "Your identity is confirmed",

	ChevronRight: "Continue",

	CirclePlay: "Automate your release pipeline",

	Cloud: "Planned workspace sync",

	Code: "Code and build tooling",

	Cpu: "Runs at native CPU speed",

	Database: "Your data stored safely",

	Download: "Download path",

	ExternalLink: "Opens external resource",

	FileText: "Audit record path",

	Fingerprint: "Proves it's really you",

	FlaskConical: "Tested before it ships to you",

	FolderGit: "Your code, version-controlled",

	GitBranch: "Work across branches freely",

	GitCommit: "Changes tracked forever",

	GitFork: "Your code history, always intact",

	GitPullRequest: "Review before it merges",

	Globe: "Network or platform route",

	Hammer: "Build tooling",

	HardDrive: "Lives on your machine, not the cloud",

	Hash: "Cryptographically verified",

	Info: "More detail available",

	Key: "Identity key",

	KeyRound: "Identity provider route",

	Laptop: "Desktop path",

	Layers: "Type errors caught at compile time",

	LifeBuoy: "Help when you need it",

	Link2: "Connections stay live",

	Lock: "Encrypted or permissioned route",

	Monitor: "Workbench surface",

	Network: "Connects over your local network",

	Package: "Shipped as one native bundle",

	PackageOpen: "Inspect every line of code",

	Puzzle: "Unmodified extension path",

	Radio: "Always listening for reconnects",

	RefreshCcw: "Restarts cleanly every time",

	RefreshCw: "Your preferences follow you",

	Rocket: "Release path",

	RotateCcw: "Roll back in seconds",

	Search: "Find anything in your codebase",

	Server: "Service route",

	Settings: "Everything configurable by you",

	Shield: "Verification boundary",

	Sliders: "Fine-tune every detail",

	Terminal: "Full shell access, right here",

	Timer: "Deploys in under 60 s",

	Unplug: "Full functionality when internet is gone",

	UserPlus: "New developers onboard in minutes",

	Users: "Shared across your whole team",

	Wifi: "Stays connected to your local daemon",

	WifiOff: "Full power, no internet required",

	Wrench: "Modern developer toolchain",

	Zap: "Instant response, zero lag",
};

/**
 * Semantic icon color map - per-icon, domain-grouped, tier-independent.
 *
 * Each color group represents a function domain. Colors are chosen to be:
 * - Visually distinct from each other
 * - Visually distinct from the 4 tier border colors
 * (Cloud #3b82f6, Provider #8b5cf6, LocalFirst #f97316, Enterprise #374151)
 * - Readable at 16px on both light and dark surfaces
 *
 * Groups:
 * Identity/crypto → indigo #6366f1
 * Network/connect → sky #0ea5e9
 * Storage/hardware → slate #64748b
 * Build/code → emerald #10b981
 * Git/VCS → amber #f59e0b
 * Cloud/sync/deploy → blue #3b82f6
 * Auth/provision → violet #7c3aed
 * Audit/docs → teal #14b8a6
 * Settings/config → slate-4 #94a3b8
 * Connectivity misc → orange #f97316
 * AI → purple #a855f7
 * Support/lifecycle → pink #ec4899
 */
const IconColorMap: Record<string, string> = {
	// Identity / crypto - TierEnterprise (charcoal → SpineWASM for identity)
	Lock: "var(--SpineWASMFore)",

	Key: "var(--SpineWASMFore)",

	Fingerprint: "var(--SpineWASMFore)",

	Shield: "var(--SpineWASMFore)",

	// Network / connect - TierLocalFirst (TCP orange)
	Wifi: "var(--SpineTCPFore)",

	WifiOff: "var(--SpineTCPFore)",

	Globe: "var(--SpineIPCFore)",

	Network: "var(--SpineIPCFore)",

	Radio: "var(--SpineTCPFore)",

	Link2: "var(--SpineIPCFore)",

	// Storage / hardware - PlatformDesktop slate
	HardDrive: "var(--PlatformDesktopFore)",

	Server: "var(--PlatformDesktopFore)",

	Database: "var(--DatabasePostgresFore)",

	Cpu: "var(--PlatformDesktopFore)",

	Terminal: "var(--PlatformCLIFore)",

	// Build / code - ExtensionRust / LanguageRust emerald
	Code: "var(--SpinegRPCFore)",

	Wrench: "var(--SpinegRPCFore)",

	Hammer: "var(--SpinegRPCFore)",

	FlaskConical: "var(--SpinegRPCFore)",

	Package: "var(--SpinegRPCFore)",

	PackageOpen: "var(--SpinegRPCFore)",

	Box: "var(--SpinegRPCFore)",

	Puzzle: "var(--PlatformExtensionFore)",

	// Git / VCS - LanguageJavaScript amber
	GitBranch: "var(--LanguageJavaScriptFore)",

	GitFork: "var(--LanguageJavaScriptFore)",

	GitCommit: "var(--LanguageJavaScriptFore)",

	GitPullRequest: "var(--LanguageJavaScriptFore)",

	FolderGit: "var(--LanguageJavaScriptFore)",

	// Cloud / sync / deploy - TierCloud (SpineIPC blue)
	Cloud: "var(--TierCloudFore)",

	RefreshCw: "var(--TierCloudFore)",

	RefreshCcw: "var(--TierCloudFore)",

	RotateCcw: "var(--TierCloudFore)",

	Download: "var(--TierCloudFore)",

	Rocket: "var(--TierCloudFore)",

	Timer: "var(--TierCloudFore)",

	Zap: "var(--TierCloudFore)",

	// Auth / provisioning - TierProvider (SpineWASM violet)
	KeyRound: "var(--TierProviderFore)",

	UserPlus: "var(--TierProviderFore)",

	Users: "var(--TierProviderFore)",

	Building2: "var(--TierProviderFore)",

	Blocks: "var(--TierProviderFore)",

	// Audit / docs - DatabaseTurso teal
	FileText: "var(--DatabaseTursoFore)",

	Activity: "var(--DatabaseTursoFore)",

	AlertTriangle: "var(--DatabaseTursoFore)",

	Info: "var(--DatabaseTursoFore)",

	Search: "var(--DatabaseTursoFore)",

	// Settings / config - PlatformDesktop slate
	Settings: "var(--PlatformDesktop)",

	Sliders: "var(--PlatformDesktop)",

	CheckCircle: "var(--PlatformDesktop)",

	Check: "var(--PlatformDesktop)",

	ChevronRight: "var(--PlatformDesktop)",

	// Connectivity misc - TierLocalFirst (SpineTCP orange)
	Unplug: "var(--TierLocalFirstFore)",

	ExternalLink: "var(--TierLocalFirstFore)",

	Layers: "var(--TierLocalFirstFore)",

	Hash: "var(--TierLocalFirstFore)",

	// AI - SpineWASM purple
	BrainCircuit: "var(--SpineWASM)",

	// Support / lifecycle - PlatformMobile pink
	LifeBuoy: "var(--PlatformMobileFore)",

	CirclePlay: "var(--PlatformMobileFore)",

	Monitor: "var(--PlatformMobileFore)",

	Laptop: "var(--PlatformMobileFore)",
};

/**
 * Enterprise SSO form with organization domain input and Auth0 redirect buttons.
 * Routes through Auth0 Enterprise Connections (Okta, Azure AD, SAML).
 */
const EnterpriseSSOForm = ({
	Content,
	Disabled,
}: {
	Content: TierContent;

	Disabled?: boolean;
}) => {
	const [OrganizationDomain, SetOrganizationDomain] = useState("");

	const [OktaDomain, SetOktaDomain] = useState("");

	const [AzureTenant, SetAzureTenant] = useState("");

	const [SamlMetadata, SetSamlMetadata] = useState("");

	const [OrganizationId, SetOrganizationId] = useState("");

	const { t: T } = useTranslation("account");

	const HandleEnterpriseLogin = (
		Connection: string,

		Extra?: Record<string, string>,
	) => {
		if (Disabled) return;

		const Params = new URLSearchParams();

		Params.set("connection", Connection);

		if (OrganizationDomain.trim()) {
			Params.set("login_hint", OrganizationDomain.trim());
		}

		if (OrganizationId.trim()) {
			Params.set("organization", OrganizationId.trim());
		}

		if (Extra) {
			for (const [Key, Value] of Object.entries(Extra)) {
				if (Value.trim()) {
					Params.set(Key, Value.trim());
				}
			}
		}

		window.location.href = `/Account/SignIn?${Params.toString()}`;
	};

	const HandleDomainSubmit = (Event: React.FormEvent) => {
		Event.preventDefault();

		if (Disabled) return;

		if (!OrganizationDomain.trim()) return;

		const DomainParams = new URLSearchParams();

		DomainParams.set("login_hint", OrganizationDomain.trim());

		if (OrganizationId.trim()) {
			DomainParams.set("organization", OrganizationId.trim());
		}

		window.location.href = `/Account/SignIn?${DomainParams.toString()}`;
	};

	return (
		<div
			className="space-y-4"
			aria-label={T("portal.enterprise.ariaLabel", {
				defaultValue: "Enterprise SSO",
			})}
		>
			<form onSubmit={HandleDomainSubmit} className="space-y-3">
				<DynamicInput
					Content={{
						Label: T("portal.enterprise.domainLabel", {
							defaultValue: "Work Email or Domain",
						}),
						Placeholder: T("portal.enterprise.domainPlaceholder", {
							defaultValue: "name@company.com",
						}),
						Type: "email",
						Required: false,
						AutoComplete: "email",
						OnChange: SetOrganizationDomain,
					}}
					Id="portal-enterprise-domain"
				/>
				<Button
					type="submit"
					className="StaccatoButton w-full"
					disabled={Disabled}
					style={{
						backgroundColor: Content.Color,
						borderColor: Content.BorderColor,
						color: "#070707",
					}}
				>
					{T("portal.enterprise.continueSSO", {
						defaultValue: "Continue with SSO",
					})}
					{"\u2001"}
					<lucide.Building2 className="h-4 w-4" aria-hidden="true" />
				</Button>
			</form>

			<div className="PortalTierDivider StaccatoSeparator" />

			<DynamicInput
				Content={{
					Label: T("portal.enterprise.orgIdLabel", {
						defaultValue: "Auth0 Organization ID (optional)",
					}),
					Placeholder: T("portal.enterprise.orgIdPlaceholder", {
						defaultValue: "org_xxxxxxxxxxxxxxxx",
					}),
					Type: "text",
					Required: false,
					OnChange: SetOrganizationId,
				}}
				Id="portal-enterprise-org-id"
			/>

			<DynamicInput
				Content={{
					Label: T("portal.enterprise.oktaDomainLabel", {
						defaultValue: "Okta Domain",
					}),
					Placeholder: T("portal.enterprise.oktaDomainPlaceholder", {
						defaultValue: "your-org.okta.com",
					}),
					Type: "text",
					Required: false,
					OnChange: SetOktaDomain,
				}}
				Id="portal-enterprise-okta-domain"
			/>
			<Button
				className="StaccatoButton w-full"
				variant="outline"
				disabled={Disabled}
				style={{ borderColor: Content.BorderColor }}
				onClick={() =>
					HandleEnterpriseLogin("okta", {
						okta_domain: OktaDomain,
					})
				}
			>
				{T("portal.enterprise.continueOkta", {
					defaultValue: "Continue with Okta",
				})}
				{"\u2001"}
				<IconTooltip Label="Okta">
					<ThemeImage
						src="/Image/Okta.svg"
						alt="Okta"
						width={20}
						height={20}
						className="h-5 w-5"
					/>
				</IconTooltip>
			</Button>

			<DynamicInput
				Content={{
					Label: T("portal.enterprise.azureTenantLabel", {
						defaultValue: "Azure AD Tenant ID",
					}),
					Placeholder: T("portal.enterprise.azureTenantPlaceholder", {
						defaultValue: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
					}),
					Type: "text",
					Required: false,
					OnChange: SetAzureTenant,
				}}
				Id="portal-enterprise-azure-tenant"
			/>
			<Button
				className="StaccatoButton w-full"
				variant="outline"
				disabled={Disabled}
				style={{ borderColor: Content.BorderColor }}
				onClick={() =>
					HandleEnterpriseLogin("waad", {
						tenant: AzureTenant,
					})
				}
			>
				{T("portal.enterprise.continueAzure", {
					defaultValue: "Continue with Azure AD",
				})}
				{"\u2001"}
				<IconTooltip Label="Microsoft Azure AD">
					<ThemeImage
						src="/Image/Microsoft.svg"
						alt="Microsoft"
						width={20}
						height={20}
						className="h-5 w-5"
					/>
				</IconTooltip>
			</Button>

			<DynamicInput
				Content={{
					Label: T("portal.enterprise.samlMetadataLabel", {
						defaultValue: "SAML Metadata URL",
					}),
					Placeholder: T(
						"portal.enterprise.samlMetadataPlaceholder",

						{
							defaultValue: "https://your-idp.com/metadata.xml",
						},
					),
					Type: "url",
					Required: false,
					OnChange: SetSamlMetadata,
				}}
				Id="portal-enterprise-saml-metadata"
			/>
			<Button
				className="StaccatoButton w-full"
				variant="outline"
				disabled={Disabled}
				style={{ borderColor: Content.BorderColor }}
				onClick={() =>
					HandleEnterpriseLogin("samlp", {
						saml_metadata_url: SamlMetadata,
					})
				}
			>
				{T("portal.enterprise.continueSAML", {
					defaultValue: "Continue with SAML",
				})}
				{"\u2001"}
				<lucide.Lock className="h-4 w-4" aria-hidden="true" />
			</Button>

			<div className="PortalTierDivider StaccatoSeparator" />
			<p className="text-center text-card-foreground">
				{T("portal.enterprise.note", {
					defaultValue:
						"OpenID Connect Discovery \u2001+\u2001 SAML 2.0 Assertion \u2001+\u2001 SCIM 2.0 User Provisioning",
				})}
			</p>
		</div>
	);
};

/**
 * Single tier row: login form on the left, feature description on the right.
 * Color-coded border by Protocol Spine identity.
 */
const PortalTierRow = ({
	Content,
	Index,
	Labels,
}: {
	Content: TierContent;

	Index: number;

	Labels?: PortalContent["Labels"];
}) => {
	const RowReference = useRef<HTMLDivElement>(null);

	const [, SetEmail] = useState("");

	const [, SetPassword] = useState("");

	const { t: T } = useTranslation("account");

	const IconComponent = Content.Icon
		? TierIconRegistry[Content.Icon] || lucide.Shield
		: lucide.Shield;

	const TierIconLabel = IconLabelMap[Content.Icon ?? ""] ?? Content.Title;

	useEffect(() => {
		const Row = RowReference.current;

		if (!Row) return;

		const ReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (ReducedMotion) return;

		const ApplyScatter = async () => {
			const AttentionModule =
				await import("../../Function/Noise/Attention.js");

			const Attention = await AttentionModule.default;

			Attention.ApplyToElement(Row, Index, 3, 2);
		};

		ApplyScatter();
	}, [Index]);

	const IsCloud = Content.Identifier === "Cloud";

	const IsProvider = Content.Identifier === "Provider";

	const IsLocalFirst = Content.Identifier === "LocalFirst";

	const IsEnterprise = Content.Identifier === "Enterprise";

	const StatusLabel =
		Content.Status === "ComingSoon"
			? "Coming Soon"
			: Content.Status === "WIP"
				? "WIP"
				: undefined;

	const IsUnavailable =
		Content.Status === "ComingSoon" || Content.Status === "WIP";

	const TierBorderClass = IsCloud
		? "PortalTierCloud"
		: IsProvider
			? "PortalTierProvider"
			: IsEnterprise
				? "PortalTierEnterprise"
				: "PortalTierLocalFirst";

	return (
		<div
			ref={RowReference}
			className={`PortalTierRow ${TierBorderClass} StaccatoCard StaccatoBorderShimmer ${
				IsUnavailable ? "opacity-70" : ""
			}`}
			role="region"
			aria-disabled={IsUnavailable}
			aria-label={`${Content.Title} authentication tier`}
		>
			{/* Left: Login Box */}
			<div className="PortalTierLogin">
				<Card className="PortalTierCard">
					<CardHeader className="PortalTierCardHeader">
						<div className="flex items-center justify-between">
							<CardTitle className="text-xl">
								{Content.Title}
							</CardTitle>
							{StatusLabel && (
								<jelly-badge
									variant="platinum"
									shape="square"
									style={
										{
											"--jelly-fill": "var(--Mute)",
											"--jelly-label":
												"var(--MuteForeground)",
											"--jelly-badge-radius": "0px",
											"--jelly-badge-font-size":
												"0.625rem",
										} as React.CSSProperties
									}
								>
									{StatusLabel}
								</jelly-badge>
							)}
							{/* Tier header icon - tooltip shows tier identity label on hover */}
							<div className="PortalTierIconWrapper">
								<IconTooltip
									Label={TierIconLabel}
									Icon={IconComponent}
									Color={Content.Color}
									SizeClass="h-6 w-6"
									ClassName="StaccatoIcon"
								/>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{IsCloud && (
							<form
								className="space-y-4"
								onSubmit={(Event) => {
									Event.preventDefault();

									if (IsUnavailable) return;

									// Navigate to Auth0 Universal Login (database connection).
									// Auth0AccountGate on /Account/SignIn handles the redirect.
									window.location.href = "/Account/SignIn";
								}}
								aria-label="Cloud sign in form"
							>
								<DynamicInput
									Content={{
										Label: T("portal.cloud.emailLabel", {
											defaultValue: "Email",
										}),
										Placeholder: T(
											"portal.cloud.emailPlaceholder",

											{
												defaultValue:
													"name@example.com",
											},
										),
										Type: "email",
										Required: true,
										AutoComplete: "email",
										OnChange: SetEmail,
									}}
									Id="portal-cloud-email"
								/>
								<DynamicInput
									Content={{
										Label: T("portal.cloud.passwordLabel", {
											defaultValue: "Password",
										}),
										Placeholder: T(
											"portal.cloud.passwordPlaceholder",

											{
												defaultValue:
													"Enter your password",
											},
										),
										Type: "password",
										Required: true,
										AutoComplete: "current-password",
										OnChange: SetPassword,
									}}
									Id="portal-cloud-password"
								/>
								<Button
									type="submit"
									className="StaccatoButton w-full"
									disabled={IsUnavailable}
									style={{
										backgroundColor: Content.Color,
										borderColor: Content.BorderColor,
										color: "#ffffff",
									}}
								>
									{T("portal.cloud.signIn", {
										defaultValue: "Secure Sign In",
									})}

									{"\u2001"}

									<lucide.Lock
										className="h-4 w-4"
										aria-hidden="true"
									/>
								</Button>
							</form>
						)}

						{IsProvider && (
							<div
								className="space-y-4"
								aria-label="Provider authentication options"
							>
								<Button
									className="StaccatoButton w-full"
									variant="outline"
									disabled={IsUnavailable}
									style={{ borderColor: Content.BorderColor }}
									onClick={() => {
										window.location.href =
											"/Account/SignIn?connection=github";
									}}
								>
									{T("portal.provider.continueGitHub", {
										defaultValue: "Continue with GitHub",
									})}

									{"\u2001"}

									<IconTooltip Label="GitHub">
										<ThemeImage
											src="/Image/GitHub.svg"
											alt="GitHub"
											width={20}
											height={20}
											className="h-5 w-5"
										/>
									</IconTooltip>
								</Button>
								<Button
									className="StaccatoButton w-full"
									variant="outline"
									disabled={IsUnavailable}
									style={{ borderColor: Content.BorderColor }}
									onClick={() => {
										window.location.href =
											"/Account/SignIn?connection=google-oauth2";
									}}
								>
									{T("portal.provider.continueGoogle", {
										defaultValue: "Continue with Google",
									})}

									{"\u2001"}

									<IconTooltip Label="Google">
										<ThemeImage
											src="/Image/Google.svg"
											alt="Google"
											width={20}
											height={20}
											className="h-5 w-5"
										/>
									</IconTooltip>
								</Button>
								<Button
									className="StaccatoButton w-full"
									variant="outline"
									disabled={IsUnavailable}
									style={{ borderColor: Content.BorderColor }}
									onClick={() => {
										window.location.href =
											"/Account/SignIn?connection=gitlab";
									}}
								>
									{T("portal.provider.continueGitLab", {
										defaultValue: "Continue with GitLab",
									})}

									{"\u2001"}

									<IconTooltip Label="GitLab">
										<ThemeImage
											src="/Image/GitLab.svg"
											alt="GitLab"
											width={20}
											height={20}
											className="h-5 w-5"
										/>
									</IconTooltip>
								</Button>
								<div className="PortalTierDivider StaccatoSeparator" />
								<p className="text-center text-card-foreground">
									{T("portal.provider.oauthNote", {
										defaultValue:
											"OAuth 2.0 \u2001 Profile + Email scope \u2001 Linked to your preferences",
									})}
								</p>
							</div>
						)}

						{IsLocalFirst && (
							<div
								className="space-y-4"
								aria-label="Local-first connection"
							>
								<div className="PortalTierDaemonStatus StaccatoBreath">
									<span className="font-medium">
										{T("portal.localfirst.daemonLabel", {
											defaultValue: "Air Daemon",
										})}
									</span>
									<span className="ml-auto text-muted-foreground">
										{T("portal.localfirst.daemonStatus", {
											defaultValue: "Scanning...",
										})}
									</span>
									{"\u2001"}

									<div className="PortalTierDaemonDot StaccatoRhythmDot" />
								</div>
								<Button
									className="StaccatoButton w-full"
									disabled={IsUnavailable}
									style={{
										backgroundColor: Content.Color,
										borderColor: Content.BorderColor,
										color: "#ffffff",
									}}
									onClick={async () => {
										// Local-first: write a synthetic SW session so
										// the auth gate on /Dashboard lets this through.
										// The Dashboard then handles Air Daemon discovery.
										try {
											if (
												typeof navigator !==
													"undefined" &&
												navigator.serviceWorker
													?.controller
											) {
												await new Promise<void>(
													(Resolve) => {
														const Timeout =
															setTimeout(
																Resolve,

																2000,
															);

														const OnMessage = (
															Event: MessageEvent,
														) => {
															if (
																Event.data
																	?.Type ===
																"Auth:Written"
															) {
																clearTimeout(
																	Timeout,
																);

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

														navigator.serviceWorker.controller!.postMessage(
															{
																Type: "Auth:Write",
																Token: "local-first",
																ExpiresAt:
																	Date.now() +
																	3600_000,
																UserId: "local-first",
															},
														);
													},
												);
											}
										} catch {
											// proceed without SW write
										}

										window.location.href =
											"/Dashboard?mode=local";
									}}
								>
									{T("portal.localfirst.connect", {
										defaultValue: "Connect to Air Daemon",
									})}

									{"\u2001"}

									<lucide.Wifi
										className="h-4 w-4"
										aria-hidden="true"
									/>
								</Button>
								<div className="PortalTierDivider StaccatoSeparator" />
								<p className="text-center text-card-foreground">
									{T("portal.localfirst.note", {
										defaultValue:
											"Zero cloud dependency \u2001 JWT certificates \u2001 mTLS",
									})}
								</p>
							</div>
						)}

						{IsEnterprise && (
							<EnterpriseSSOForm
								Content={Content}
								Disabled={IsUnavailable}
							/>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Right: Feature Description */}
			<div className="PortalTierDescription">
				{Content.Badge && (
					<jelly-badge
						variant="mint"
						shape="square"
						className="StaccatoRhythmBeat PortalTierBadge"
						style={
							{
								"--jelly-fill": "var(--Card)",
								"--jelly-label":
									Content.Color || "var(--Foreground)",
								"--jelly-badge-radius": "0px",
								"--jelly-badge-font-size": "0.625rem",
								"--jelly-color-border-default":
									Content.BorderColor || "var(--Border)",
							} as React.CSSProperties
						}
					>
						{Content.Badge}
					</jelly-badge>
				)}

				<h3
					className="PortalTierDescriptionTitle"
					style={{ color: Content.Color }}
				>
					{Content.Title}
				</h3>

				<p className="PortalTierDescriptionSubtitle">
					{Content.Subtitle}
				</p>

				{/* Features list */}
				<div className="PortalTierFeatureList">
					<h4 className="PortalTierFeatureHeading">
						{Labels?.Included ??
							T("portal.labels.included", {
								defaultValue: "Included",
							})}
					</h4>
					<ul className="PortalTierFeatureItems">
						{Content.Feature.map((Feature, FeatureIndex) => (
							<li
								key={FeatureIndex}
								className={`PortalTierFeatureItem ${
									(Feature.Status ?? Content.Status) &&
									(Feature.Status ?? Content.Status) !==
										"Ready"
										? "opacity-60"
										: ""
								}`}
							>
								<span className="flex flex-wrap items-center gap-2 font-medium">
									{Feature.Heading}
									{(Feature.Status ?? Content.Status) &&
										(Feature.Status ?? Content.Status) !==
											"Ready" && (
											<jelly-badge
												variant="platinum"
												shape="square"
												style={
													{
														"--jelly-fill":
															"var(--Mute)",
														"--jelly-label":
															"var(--MuteForeground)",
														"--jelly-badge-radius":
															"0px",
														"--jelly-badge-font-size":
															"0.625rem",
													} as React.CSSProperties
												}
											>
												{(Feature.Status ??
													Content.Status) === "WIP"
													? "WIP"
													: "Coming Soon"}
											</jelly-badge>
										)}
								</span>
								<span className="text-muted-foreground">
									{Feature.Description}
									{Feature.Icon &&
										Feature.Icon.length > 0 && (
											<span
												className="inline-flex items-center align-middle"
												role="img"
												aria-label={`${
													Feature.Heading
												} technology stack`}
											>
												{Feature.Icon.map(
													(IconName, IconIndex) => {
														// Derive label: SVG path → filename without extension;
														// Lucide key → IconLabelMap lookup.
														const IconLabel =
															IconName.startsWith(
																"/",
															)
																? (IconName.split(
																		"/",
																	)
																		.pop()
																		?.replace(
																			".svg",

																			"",
																		) ?? "")
																: (IconLabelMap[
																		IconName
																	] ??
																	IconName);

														const LucideColor =
															IconColorMap[
																IconName
															] ??
															"var(--PlatformDesktop)";

														return (
															<span
																key={IconIndex}
																className="inline-flex items-center"
															>
																{IconIndex ===
																0 ? (
																	"\u2001"
																) : (
																	<>
																		{
																			"\u2001"
																		}
																		{"+"}
																		{
																			"\u2001"
																		}
																	</>
																)}
																{IconName.startsWith(
																	"/",
																) ? (
																	<IconTooltip
																		Label={
																			IconLabel
																		}
																	>
																		<img
																			src={
																				IconName
																			}
																			alt={
																				IconLabel
																			}
																			title={
																				IconLabel
																			}
																			width="16"
																			height="16"
																			className="h-4 w-4"
																		/>
																	</IconTooltip>
																) : (
																	(() => {
																		const FeatureIcon =
																			TierIconRegistry[
																				IconName
																			];

																		return FeatureIcon ? (
																			<IconTooltip
																				Label={
																					IconLabel
																				}
																				Icon={
																					FeatureIcon
																				}
																				Color={
																					LucideColor
																				}
																				SizeClass="h-4 w-4"
																			/>
																		) : null;
																	})()
																)}
															</span>
														);
													},
												)}
											</span>
										)}
								</span>
							</li>
						))}
					</ul>
				</div>

				{/* Capabilities list */}
				{Content.Capability.length > 0 && (
					<div className="PortalTierCapabilityList">
						<h4 className="PortalTierFeatureHeading">
							{Labels?.Capabilities ??
								T("portal.labels.capabilities", {
									defaultValue: "Capabilities",
								})}
						</h4>
						<div className="PortalTierCapabilityGrid">
							{Content.Capability.map(
								(CapabilityText, CapabilityIndex) => (
									<div
										key={CapabilityIndex}
										className={`PortalTierCapabilityItem StaccatoBreath ${
											IsUnavailable ? "opacity-60" : ""
										}`}
									>
										<span className="">
											{CapabilityText}
										</span>
										{StatusLabel && (
											<>
												{"\u2001"}

												<jelly-badge
													variant="platinum"
													shape="square"
													style={
														{
															"--jelly-fill":
																"var(--Mute)",
															"--jelly-label":
																"var(--MuteForeground)",
															"--jelly-badge-radius":
																"0px",
															"--jelly-badge-font-size":
																"0.625rem",
														} as React.CSSProperties
													}
												>
													{StatusLabel}
												</jelly-badge>
											</>
										)}
										{"\u2001"}
										<IconTooltip
											Label="Verification boundary"
											Icon={lucide.Shield}
											Color={
												IconColorMap["Shield"] ??
												"var(--SpineWASMFore)"
											}
											SizeClass="h-3 w-3 shrink-0"
										/>
									</div>
								),
							)}
						</div>
					</div>
				)}

				{Content.Protocol && (
					<div className="PortalTierProtocol">
						<span className="font-medium text-muted-foreground">
							{Labels?.Protocol ?? "Protocol:"}
						</span>
						<code
							className="PortalTierProtocolCode"
							style={{ color: Content.Color }}
						>
							{Content.Protocol}
						</code>
					</div>
				)}

				<div className="PortalTierSettingsManaged StaccatoBorderShimmer">
					<span className="font-medium">
						{Labels?.SettingsManaged ?? "Settings Managed"}
					</span>
					{"\u2001"}
					<span className="text-muted-foreground">
						{Labels?.AllTiers ?? "Included in all tiers"}
					</span>
					{"\u2001"}
					<IconTooltip
						Label="Your preferences follow you across devices"
						Icon={lucide.RefreshCw}
						Color={
							IconColorMap["RefreshCw"] ?? "var(--TierCloudFore)"
						}
						SizeClass="h-3.5 w-3.5"
						ClassName="StaccatoIcon"
					/>
				</div>
			</div>
		</div>
	);
};

/**
 * DynamicPortal: Three-tier authentication portal.
 *
 * Three distinct rows, each color-coded by Protocol Spine:
 * Cloud (IPC blue): Secure online login
 * Provider (WASM purple): GitHub/OAuth authentication
 * LocalFirst (TCP orange): Air Daemon local-first connection
 * Enterprise (charcoal): OIDC/SAML/SCIM enterprise SSO
 *
 * Layout: Login box (left, white bg) | Feature description (right)
 * Staccato noise integration on all interactive elements.
 *
 * TierIconRegistry covers 59 icons spanning the full CEL technology stack.
 * Feature.Icon[] arrays accept both Lucide registry keys and /Image/*.svg paths.
 *
 * Icon accessibility (IconTooltip):
 * Every icon in the tier header, feature stack, capability list, and
 * settings footer is wrapped in <IconTooltip> - three layers:
 * 1. aria-label on the trigger <span> - screen reader announcement
 * 2. title on the trigger <span> - native browser tooltip fallback
 * 3. Radix TooltipContent - styled hover tooltip (sighted users)
 * DocHref prop is reserved for future doc-link integration.
 * Button-chrome icons (Lock, Wifi, Building2) that follow visible button
 * text are exempted and keep aria-hidden="true" - they are decorative there.
 */
const DynamicPortal = ({ Content }: { Content: PortalContent }) => {
	const SectionReference = useRef<HTMLElement>(null);

	useEffect(() => {
		const ReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (ReducedMotion) return;

		let StopFunction: (() => void) | undefined;

		const StartNoise = async () => {
			const StaccatoModule =
				await import("../../Function/Noise/Staccato.js");

			const Staccato = await StaccatoModule.default;

			Staccato.Start();

			StopFunction = Staccato.Stop;

			Staccato.SeedSelector(".PortalTierRow");
		};

		StartNoise();

		return () => {
			StopFunction?.();
		};
	}, []);

	return (
		<section
			ref={SectionReference}
			id="portal"
			className="PortalSection"
			aria-labelledby="PortalHeading"
		>
			<div className="container mx-auto px-4">
				<div className="PortalHeader StaccatoBreath">
					<h1 id="PortalHeading" className="PortalTitle">
						{Content.Title}
					</h1>
					<p className="PortalSubtitle">{Content.Subtitle}</p>
				</div>

				<div
					className="PortalTierGrid"
					role="group"
					aria-label="Authentication tiers"
				>
					<PortalTierRow
						Content={Content.Cloud}
						Index={0}
						Labels={Content.Labels}
					/>

					<PortalTierRow
						Content={Content.Provider}
						Index={1}
						Labels={Content.Labels}
					/>

					<PortalTierRow
						Content={Content.LocalFirst}
						Index={2}
						Labels={Content.Labels}
					/>

					{Content.Enterprise && (
						<PortalTierRow
							Content={Content.Enterprise}
							Index={3}
							Labels={Content.Labels}
						/>
					)}
				</div>
			</div>
		</section>
	);
};

export { DynamicPortal };

export default DynamicPortal;
