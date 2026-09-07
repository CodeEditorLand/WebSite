"use client";

import type { LucideIcon } from "lucide-react";

import * as lucide from "lucide-react";

import * as React from "react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./Tooltip.js";

interface IconTooltipProperty {
	/** Human-readable label - drives aria-label, title, and tooltip text. Pass an array for multi-line tooltips. */
	Label: string | string[];

	/** Lucide icon component to render inside the trigger. */
	Icon?: LucideIcon;

	/** CSS color string for the icon stroke (Lucide only). */
	Color?: string;

	/** Icon size class - defaults to "h-4 w-4". */
	SizeClass?: string;

	/** Extra className forwarded to the icon element. */
	ClassName?: string;

	/**
	 * Reserved: future doc-link href.
	 * When provided the tooltip will render a clickable link.
	 */
	DocHref?: string;

	/**
	 * Override children - useful for wrapping an <img> brand mark.
	 * When provided, Icon / Color / SizeClass are ignored.
	 */
	children?: React.ReactNode;
}

/**
 * IconTooltip - single source of truth for icon accessibility across the site.
 *
 * Provides three layers of label exposure:
 * 1. aria-label on the trigger <span> - screen readers announce the label
 * 2. title on the trigger <span> - native browser tooltip fallback
 * 3. Radix TooltipContent - styled hover tooltip for sighted users
 *
 * Usage with Lucide icon:
 * <IconTooltip Label="Sync" Icon={RefreshCw} Color="#3b82f6" />
 *
 * Usage wrapping an <img> brand mark:
 * <IconTooltip Label="GitHub">
 * <img src="/Image/GitHub.svg" alt="GitHub" width="16" height="16"
 * className="h-4 w-4" />
 * </IconTooltip>
 *
 * DocHref is reserved for future documentation links - pass it now so
 * the data is threaded through and the tooltip can evolve to a link
 * without changing every call site.
 */
const IconTooltip = ({
	Label,
	Icon,
	Color,
	SizeClass = "h-4 w-4",
	ClassName = "",
	DocHref: _DocHref,
	children,
}: IconTooltipProperty) => {
	const LabelFlat = Array.isArray(Label) ? Label.join(" ") : Label;

	if (process.env.NODE_ENV === "development" && !LabelFlat) {
		console.warn("IconTooltip: Label (aria-label) is required");
	}

	const Content =
		children ??
		(Icon ? (
			<Icon
				className={`${SizeClass} ${ClassName}`}
				style={Color ? { color: Color } : undefined}
				aria-hidden="true"
			/>
		) : null);

	if (!Content) return null;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild tabIndex={-1}>
					<span
						className="inline-flex items-center"
						aria-label={LabelFlat}
						title={LabelFlat}
						role="img"
					>
						{Content}
					</span>
				</TooltipTrigger>
				{Array.isArray(Label) ? (
					<TooltipContent className="flex flex-col items-center gap-0 bg-transparent p-0 [&>svg]:hidden">
						{Label.map((Line, Index) => {
							// Deterministic hash so SSR and client hydration match
							const Hash = (S: string): number => {
								let H = 0;
								for (let I = 0; I < S.length; I++) {
									H = ((H << 5) - H + S.charCodeAt(I)) | 0;
								}
								return H / 2147483647;
							};
							const Seed = Hash(`ts-${Index}`).toFixed(3);
							const Phase = Hash(`tp-${Index}`).toFixed(3);

							return (
								<p
									key={Index}
									className="StaccatoCard flat w-fit bg-primary px-3 py-1 text-primary-foreground"
									style={
										{
											"--StaccatoSeed": Seed,
											"--StaccatoSeedPhase": Phase,
											transform: `translate(calc(var(--StaccatoSeed) * 7px), calc(var(--StaccatoSeedPhase) * 5px)) rotate(calc(var(--StaccatoSeed) * 1.5deg)) scale(1)`,
										} as React.CSSProperties
									}
								>
									{Line}
								</p>
							);
						})}
					</TooltipContent>
				) : (
					<TooltipContent>{Label}</TooltipContent>
				)}
			</Tooltip>
		</TooltipProvider>
	);
};

/**
 * DocHref Inventory - candidate icon-to-doc mappings for future linking.
 *
 * When DocHref is wired up, these icons would link to the corresponding
 * documentation page. Paths are relative to the site root (/Doc/{slug}).
 *
 * Lucide Icon | Label | Suggested DocHref
 * --------------|------------------|---------------------------
 * Code | Code | /Doc/Architecture
 * Cpu | CPU | /Doc/Architecture
 * Terminal | Terminal | /Doc/Getting-Started
 * Puzzle | Extensions | /Doc/Extension-Development
 * Settings | Configuration | /Doc/Configuration
 * Lock | Encryption | /Doc/Local-First-Protocol
 * Shield | Security | /Doc/Local-First-Protocol
 * KeyRound | Single Sign-On | /Doc/API-Reference
 * RefreshCw | Sync | /Doc/Local-First-Protocol
 * GitBranch | Repository | /Doc/Contributing
 *
 * Brand SVGs (img children, not Lucide):
 * GitHub | GitHub | https://github.com/CodeEditorLand
 * GitLab | GitLab | /Doc/Contributing
 * Okta | Okta | /Doc/API-Reference
 * Microsoft | Microsoft Azure AD | /Doc/API-Reference
 * Google | Google | /Doc/API-Reference
 */

export { IconTooltip };

export type { IconTooltipProperty };

export default IconTooltip;
