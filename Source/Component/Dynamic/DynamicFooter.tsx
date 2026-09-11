import { Heart, MessageCircle, type LucideIcon } from "lucide-react";

import { RichText } from "../UI/RichText.js";

import type Property from "./Interface/Property/Footer.js";

/**
 * Brand social icons not available in lucide-react are rendered as inline SVGs.
 * Em quad (U+2001) appears BEFORE each icon in the row, matching the
 * icon-right InlineSeparator convention used across the portal.
 */
const GitHubIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
		className={className}
	>
		<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
	</svg>
);

const XIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
		className={className}
	>
		<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
	</svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
		className={className}
	>
		<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
	</svg>
);

type SocialKey = "github" | "twitter" | "discord" | "linkedin";

const SocialIconRegistry: Record<SocialKey, LucideIcon | typeof GitHubIcon> = {
	github: GitHubIcon,

	twitter: XIcon,

	discord: MessageCircle,

	linkedin: LinkedInIcon,
};

const SocialLabelRegistry: Record<SocialKey, string> = {
	github: "GitHub",

	twitter: "X (Twitter)",

	discord: "Discord",

	linkedin: "LinkedIn",
};

/**
 * Dynamic Footer component that accepts brand, links, and social schemas.
 * Social icons use Lucide (or inline SVG for X) with em quad (U+2001)
 * separator BEFORE each icon. Renders multi-column footer with bottom bar.
 */
const DynamicFooter = ({ Content, ClassName }: Property) => {
	const { Brand, Social, Columns, BottomBar } = Content;

	const CurrentYear = new Date().getFullYear();

	const SocialLink: Record<SocialKey, string> = {
		github: Social?.GitHub || "#",

		twitter: Social?.Twitter || "#",

		discord: Social?.Discord || "#",

		linkedin: Social?.LinkedIn || "#",
	};

	return (
		<footer className={`border-t py-12 ${ClassName || ""}`}>
			<div className="container mx-auto px-4">
				<div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
					{/* Brand Column */}
					<div className="col-span-2 md:col-span-4 lg:col-span-1">
						<h3 className="mb-2 font-mono text-sm font-medium">
							{Brand.Name}
						</h3>
						{Brand.Description && (
							<div className="mb-4 text-muted-foreground">
								<RichText Text={Brand.Description} />
							</div>
						)}
						{Social && (
							<div className="flex items-center">
								{(Object.keys(SocialLink) as SocialKey[]).map(
									(Key) => {
										const Href = SocialLink[Key];

										if (Href === "#") return null;

										const Icon = SocialIconRegistry[Key];

										const Label = SocialLabelRegistry[Key];

										return (
											<a
												key={Key}
												href={Href}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
												aria-label={Label}
											>
												{"\u2001"}
												<Icon
													className="h-5 w-5"
													aria-hidden="true"
												/>
											</a>
										);
									},
								)}
							</div>
						)}
					</div>

					{/* Dynamic Columns */}
					{Columns.map((Column, ColumnIndex) => (
						<div key={ColumnIndex}>
							<h4 className="mb-4 font-mono text-sm font-medium uppercase tracking-wider text-muted-foreground">
								{Column.Title}
							</h4>
							<ul className="space-y-2">
								{Column.Links.map((Link, LinkIndex) => (
									<li key={LinkIndex}>
										<a
											href={Link.Href}
											className="text-muted-foreground transition-colors hover:text-foreground"
										>
											{Link.Label}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom Bar */}
				{BottomBar && (
					<div className="flex flex-col items-center justify-between space-y-4 border-t pt-8 md:flex-row md:space-y-0">
						<div className="text-muted-foreground">
							<RichText
								Text={
									BottomBar.Copyright ||
									`© ${CurrentYear} ${Brand.Name}.\nAll rights reserved.`
								}
							/>
						</div>
						{BottomBar.MadeWith && (
							<div className="text-muted-foreground">
								{Brand.Name}

								{"\u2001"}

								<Heart
									aria-hidden="true"
									className="text-tcp inline h-3.5 w-3.5 fill-current align-[-2px]"
								/>
							</div>
						)}
					</div>
				)}
			</div>
		</footer>
	);
};

export { DynamicFooter };

export default DynamicFooter;
