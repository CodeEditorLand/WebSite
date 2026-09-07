"use client";

import { ThemeImage } from "@Library/Theme";

import * as lucide from "lucide-react";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import { Button } from "../UI/Button";

import { IconTooltip } from "../UI/IconTooltip.js";

import { LocaleSwitcher } from "./LocaleSwitcher";

import "../Layout/Header/Stylesheet.css";

/**
 * Icon registry:maps string keys to Lucide components.
 * Used by both sub-header and mobile menu.
 */
const IconRegistry: Record<string, lucide.LucideIcon> = {
	Sparkles: lucide.Sparkles,

	Download: lucide.Download,

	BookOpen: lucide.BookOpen,

	GitFork: lucide.GitFork,

	ExternalLink: lucide.ExternalLink,

	Newspaper: lucide.Newspaper,

	Users: lucide.Users,

	LayoutDashboard: lucide.LayoutDashboard,

	HelpCircle: lucide.HelpCircle,

	LogIn: lucide.LogIn,

	Monitor: lucide.Monitor,
};

interface NavigationLink {
	Label: string;

	Href: string;

	Icon?: string;

	Tooltip?: string | string[];
}

export interface HeaderContent {
	Logo?: { Text: string };

	Navigation?: NavigationLink[];

	Actions?: Array<{
		Type?: string;

		Text: string;

		Variant?: string;

		Size?: string;

		Href?: string;

		Icon?: string;

		Tooltip?: string | string[];
	}>;
}

interface HeaderProps {
	Content?: HeaderContent;

	AuthSlot?: React.ReactNode;
}

const Header = ({ Content, AuthSlot }: HeaderProps) => {
	const { t: T } = useTranslation("header");

	const [NavMenuOpen, SetNavMenuOpen] = useState(false);

	const [MobileMenuOpen, SetMobileMenuOpen] = useState(false);

	const HeaderData: HeaderContent = Content || {
		Logo: { Text: T("logo", "Land") },

		Navigation: [
			{
				Label: T("nav.features", "Features"),

				Href: "/#features",
			},

			{
				Label: T("nav.download", "Download"),

				Href: "/Download",
			},

			{
				Label: T("nav.docs", "Documentation"),

				Href: "/Doc",
			},

			{
				Label: T("nav.github", "GitHub"),

				Href: "https://github.com/CodeEditorLand/Land",
			},
		],

		Actions: [
			{
				Text: T("actions.signIn", "Sign In"),

				Variant: "ghost",

				Size: "default",

				Href: "/Account/SignIn",
			},

			{
				Text: T("actions.editorPortal", "Portal"),

				Variant: "ghost",

				Size: "default",

				Href: "/Portal",
			},

			{
				Text: T("actions.getStarted", "Get Land"),

				Variant: "default",

				Size: "default",

				Href: "/Download",

				Icon: "Download",
			},
		],
	};

	const RenderActionIcon = (
		IconName?: string,

		Label?: string,

		Tooltip?: string | string[],
	) => {
		if (!IconName) return null;

		const Icon = IconRegistry[IconName];

		if (!Icon) return null;

		return (
			<>
				{"\u2001"}
				<IconTooltip
					Label={Tooltip || Label || IconName}
					Icon={Icon}
					SizeClass="h-4 w-4"
				/>
			</>
		);
	};

	const NavLinks = ({ OnClick }: { OnClick?: () => void }) => (
		<>
			{HeaderData.Navigation?.map((Link, Index) => (
				<a
					key={Index}
					href={Link.Href}
					className="StaccatoNavLink HeaderSubLink relative flex items-center px-4 py-3 text-muted-foreground transition-colors hover:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
					onClick={OnClick}
					{...(Link.Href.startsWith("http")
						? { target: "_blank", rel: "noopener noreferrer" }
						: {})}
				>
					<span className="HeaderLinkLabel font-mono text-sm font-medium uppercase tracking-widest">
						{Link.Label}
					</span>
				</a>
			))}
		</>
	);

	const ActionButtons = ({
		OnClick,
		FullWidth,
	}: {
		OnClick?: () => void;

		FullWidth?: boolean;
	}) => (
		<>
			{AuthSlot ? (
				<>
					{AuthSlot}

					{HeaderData.Actions?.filter(
						(Action) => Action.Href !== "/Account/SignIn",
					).map((Action, Index) => {
						const variant =
							(Action.Variant as
								"ghost" | "default" | "outline") || "default";
						const size =
							(Action.Size as "default" | "sm" | "lg") ||
							"default";
						const cls = FullWidth
							? "StaccatoButton w-full justify-start"
							: "StaccatoButton";
						// Ghost/link variants have no filled-blob equivalent in
						// Jelly UI and must stay as plain CSS elements.  Default
						// and outline render as real jelly-buttons with onClick
						// navigation so the header CTAs get the same soft-body
						// physics as the hero buttons.
						if (variant === "ghost" || variant === "link") {
							return (
								<Button
									key={Index}
									variant={variant}
									size={size}
									className={cls}
									asChild
								>
									<a href={Action.Href} onClick={OnClick}>
										{Action.Text}
										{RenderActionIcon(
											Action.Icon,
											Action.Text,
											Action.Tooltip,
										)}
									</a>
								</Button>
							);
						}
						return (
							<Button
								key={Index}
								variant={variant}
								size={size}
								className={cls}
								onClick={() => {
									window.location.href = Action.Href;
								}}
							>
								{Action.Text}
								{RenderActionIcon(
									Action.Icon,
									Action.Text,
									Action.Tooltip,
								)}
							</Button>
						);
					})}
				</>
			) : (
				HeaderData.Actions?.map((Action, Index) => {
					const variant =
						(Action.Variant as "ghost" | "default" | "outline") ||
						"default";
					const size =
						(Action.Size as "default" | "sm" | "lg") || "default";
					const cls = FullWidth
						? "StaccatoButton w-full justify-start"
						: "StaccatoButton";
					if (variant === "ghost" || variant === "link") {
						return (
							<Button
								key={Index}
								variant={variant}
								size={size}
								className={cls}
								asChild
							>
								<a href={Action.Href} onClick={OnClick}>
									{Action.Text}
									{RenderActionIcon(
										Action.Icon,
										Action.Text,
										Action.Tooltip,
									)}
								</a>
							</Button>
						);
					}
					return (
						<Button
							key={Index}
							variant={variant}
							size={size}
							className={cls}
							onClick={() => {
								window.location.href = Action.Href;
							}}
						>
							{Action.Text}
							{RenderActionIcon(
								Action.Icon,
								Action.Text,
								Action.Tooltip,
							)}
						</Button>
					);
				})
			)}
		</>
	);

	return (
		<header className="Header sticky top-0 z-50 w-full" role="banner">
			{/* Primary bar */}
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Left: logo always + inline nav on lg+, hamburger on md only */}
				<div className="flex items-center gap-3">
					<a
						href="/"
						className="StaccatoLogo HeaderLogo flex items-center space-x-3 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
						aria-label={`${HeaderData.Logo?.Text || "Land"} - Go to homepage`}
					>
						<div
							className="LogoBox relative flex h-8 w-8 items-center justify-center overflow-hidden"
							aria-hidden="true"
						>
							<ThemeImage
								src="/Asset/Dark/Logo/Glyph/Land.svg"
								alt="Code Editor Land"
								title="Code Editor Land"
								width={32}
								height={32}
								className="h-full w-full"
							/>
						</div>
						<span className="font-mono text-sm font-medium uppercase tracking-widest">
							{HeaderData.Logo?.Text || "LAND"}
						</span>
					</a>

					{/* Inline nav - desktop only (lg+) */}
					<nav
						className="ml-2 hidden items-center lg:flex"
						aria-label="Main navigation"
					>
						{HeaderData.Navigation?.map((Link, Index) => (
							<a
								key={Index}
								href={Link.Href}
								className="StaccatoNavLink HeaderSubLink relative flex items-center px-4 py-2 text-muted-foreground transition-colors hover:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
								{...(Link.Href.startsWith("http")
									? {
											target: "_blank",
											rel: "noopener noreferrer",
										}
									: {})}
							>
								<span className="HeaderLinkLabel font-mono text-sm font-medium uppercase tracking-widest">
									{Link.Label}
								</span>
							</a>
						))}
					</nav>

					{/* Nav hamburger - tablet only (md, hidden on lg+) */}
					<Button
						variant="ghost"
						size="icon"
						className="hidden md:flex lg:hidden"
						onClick={() => SetNavMenuOpen(!NavMenuOpen)}
						aria-label="Toggle navigation"
						aria-expanded={NavMenuOpen}
					>
						{NavMenuOpen ? (
							<lucide.X className="h-5 w-5" />
						) : (
							<lucide.Menu className="h-5 w-5" />
						)}
					</Button>
				</div>

				{/* Right: actions (md+) + mobile hamburger */}
				<div className="flex items-center gap-3">
					<div className="hidden items-center gap-3 md:flex">
						<LocaleSwitcher />
						<ActionButtons />
					</div>

					{/* Mobile hamburger - merges nav + actions */}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => SetMobileMenuOpen(!MobileMenuOpen)}
						aria-label="Toggle menu"
						aria-expanded={MobileMenuOpen}
					>
						{MobileMenuOpen ? (
							<lucide.X className="h-5 w-5" />
						) : (
							<lucide.Menu className="h-5 w-5" />
						)}
					</Button>
				</div>
			</div>

			{/* Tablet nav dropdown (md only, hidden on lg+) */}
			{NavMenuOpen && (
				<div
					className="NavDropdown hidden bg-card md:block lg:hidden"
					role="dialog"
					aria-label="Navigation menu"
				>
					<nav
						className="container mx-auto flex flex-col gap-1 px-4 py-4"
						aria-label="Site navigation"
					>
						<NavLinks OnClick={() => SetNavMenuOpen(false)} />
					</nav>
				</div>
			)}

			{/* Mobile full menu: nav + locale + actions */}
			{MobileMenuOpen && (
				<div
					className="bg-card md:hidden"
					role="dialog"
					aria-label="Mobile navigation menu"
				>
					<nav
						className="container mx-auto flex flex-col gap-1 px-4 py-4"
						aria-label="Mobile navigation"
					>
						<NavLinks OnClick={() => SetMobileMenuOpen(false)} />
						<div className="my-1.5 border-t border-border" />
						<div className="px-4 py-3">
							<LocaleSwitcher />
						</div>
						<div className="my-1.5 border-t border-border" />
						<ActionButtons
							OnClick={() => SetMobileMenuOpen(false)}
							FullWidth
						/>
					</nav>
				</div>
			)}
		</header>
	);
};

export { Header };

export default Header;
