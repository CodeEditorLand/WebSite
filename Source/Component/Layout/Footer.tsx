/**
 * Footer - site-wide footer with navigation columns, social links,
 * funding attribution (NLnet/NGI0), and locale switcher.
 *
 * Content is fully i18n-driven via useTranslation("footer").
 */
"use client";

import { ThemeImage } from "@Library/Theme";

import { useTranslation } from "react-i18next";

import { IconTooltip } from "../UI/IconTooltip.js";

import { Separator } from "../UI/Separator";

import "./Footer/Stylesheet.css";

interface FooterColumn {
	Title: string;

	Links: Array<{ Label: string; Href: string }>;
}

interface FooterContent {
	Brand?: { Name: string; Description?: string };

	Columns?: FooterColumn[];

	BottomBar?: { MadeWith?: boolean; Copyright?: string };
}

interface FooterProps {
	Content?: FooterContent;
}

const Footer = ({ Content }: FooterProps) => {
	const { t: T } = useTranslation("footer");

	const FooterData = Content || {
		Brand: {
			Name: T("brand.name", { defaultValue: "Code Editor Land" }),

			Description: T("brand.description", {
				defaultValue:
					"No Electron. No Chromium. Every extension runs unchanged.\n\nOpen source and free forever.",
			}),
		},

		Columns: [
			{
				Title: T("columns.product.title", "Product"),

				Links: [
					{
						Label: T("columns.product.features", "Features"),

						Href: "/#features",
					},

					{
						Label: T("columns.product.downloads", "Downloads"),

						Href: "/Download",
					},

					{
						Label: T("columns.product.docs", "Documentation"),

						Href: "/Doc",
					},

					{
						Label: T("columns.product.blog", "Blog"),

						Href: "/Blog",
					},
				],
			},

			{
				Title: T("columns.company.title", "Community"),

				Links: [
					{
						Label: T("columns.company.issues", "Issues"),

						Href: "https://github.com/CodeEditorLand/Land/issues",
					},

					{
						Label: T(
							"columns.company.contributing",

							"Contributing",
						),

						Href: "/Contributing",
					},

					{
						Label: T("columns.company.github", "GitHub"),

						Href: "https://github.com/CodeEditorLand/Land",
					},

					{
						Label: T("columns.company.enterprise", "Enterprise"),

						Href: "/Contact/Sale",
					},
				],
			},

			{
				Title: T("columns.legal.title", "Legal"),

				Links: [
					{
						Label: T("columns.legal.privacy", "Privacy"),

						Href: "/Legal/Privacy",
					},

					{
						Label: T("columns.legal.terms", "Terms"),

						Href: "/Legal/Term",
					},

					{
						Label: T("columns.legal.license", "License"),

						Href: "/License",
					},
				],
			},
		],

		BottomBar: { MadeWith: true },
	};

	return (
		<footer className="Footer" role="contentinfo" aria-label="Site footer">
			<div className="FooterContent container mx-auto px-4 py-16">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
					<div className="lg:col-span-2">
						<a
							href="/"
							className="mb-4 flex items-center space-x-3 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
							aria-label={`${FooterData.Brand?.Name || "Land"} - Go to homepage`}
						>
							<ThemeImage
								src="/Asset/Dark/Logo/Glyph/Land.svg"
								alt="Code Editor Land"
								title="Code Editor Land"
								width={32}
								height={32}
								className="h-8 w-8"
								aria-hidden="true"
							/>
							<span className="font-mono text-sm font-medium uppercase tracking-widest">
								{FooterData.Brand?.Name || "LAND"}
							</span>
						</a>
						{FooterData.Brand?.Description && (
							<p className="mb-6 max-w-md whitespace-pre-line text-sm text-muted-foreground">
								{FooterData.Brand.Description}
							</p>
						)}
					</div>

					{FooterData.Columns?.map((Column, ColumnIndex) => (
						<nav key={ColumnIndex} aria-label={Column.Title}>
							<h4 className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
								{Column.Title}
							</h4>
							<ul className="space-y-2 text-muted-foreground">
								{Column.Links.map((Link, LinkIndex) => (
									<li key={LinkIndex}>
										<a
											href={Link.Href}
											className="StaccatoNavLink transition-colors hover:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
											{...(Link.Href.startsWith("http")
												? {
														target: "_blank",
														rel: "noopener noreferrer",
													}
												: {})}
										>
											{Link.Label}
										</a>
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>

				<Separator className="StaccatoSeparator my-8" />

				<div
					className="mb-6 border-l-2 py-2 pl-4"
					style={{ borderLeftColor: "var(--SpinegRPC)" }}
				>
					<p className="text-sm leading-relaxed text-muted-foreground">
						{T(
							"funding.prefix",
							"This project has been funded through the ",
						)}
						<a
							href="https://nlnet.nl/commonsfund"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
						>
							{T("funding.ngiFund", "NGI0 Commons Fund")}
						</a>
						{T("funding.nlnetIntro", ", a fund established by ")}
						<a
							href="https://nlnet.nl"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
						>
							{T("funding.nlnet", "NLnet")}
						</a>
						{T(
							"funding.euSupport",
							" with financial support from the European Commission\u2019s Next Generation Internet programme, under grant agreement No.\u00a0101135429. ",
						)}
						<a
							href="https://nlnet.nl/project/Land/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
						>
							{T("funding.projectPage", "View project page")}
						</a>
						{"."}
					</p>
				</div>

				<div className="flex flex-col items-center justify-between md:flex-row">
					<div className="mb-4 flex items-center gap-4 md:mb-0">
						<a
							href="https://github.com/CodeEditorLand"
							target="_blank"
							rel="noopener noreferrer"
							className="StaccatoSocial focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
							aria-label="Code Editor Land on GitHub (opens in new tab)"
						>
							<IconTooltip Label="GitHub">
								<ThemeImage
									src="/Dark/Image/GitHub.svg"
									alt="GitHub"
									width={20}
									height={20}
									className="h-5 w-5"
								/>
							</IconTooltip>
						</a>
						<span className="InlineSeparator" aria-hidden="true" />
						<a
							href="https://x.com/CodeEditorLand"
							target="_blank"
							rel="noopener noreferrer"
							className="StaccatoSocial focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
							aria-label="Code Editor Land on X (opens in new tab)"
						>
							<IconTooltip Label="X (Twitter)">
								<svg
									viewBox="0 0 24 24"
									fill="currentColor"
									width="20"
									height="20"
									className="h-5 w-5"
									aria-hidden="true"
								>
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</IconTooltip>
						</a>
						<span className="InlineSeparator" aria-hidden="true" />
						<p className="text-muted-foreground">
							{T("bottomBar.copyright", {
								year: new Date().getFullYear(),
								defaultValue: `© ${new Date().getFullYear()} Code Editor Land. All rights reserved.`,
							})}
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-4">
						<a
							href="https://PlayForm.Cloud"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground transition-colors hover:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
							aria-label="PlayForm (opens in new tab)"
						>
							PlayForm
							<span className="InlineSeparator">&#x2192;</span>
						</a>
						{FooterData.BottomBar?.MadeWith && (
							<a
								href="https://tauri.app"
								target="_blank"
								rel="noopener noreferrer"
								className="transition-opacity hover:opacity-80 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
								aria-label="Made with Tauri (opens in new tab)"
							>
								<ThemeImage
									src="/Dark/Image/GitHub/Made/Tauri.svg"
									alt="Made with Tauri"
									width={160}
									height={32}
									className="h-8"
									loading="lazy"
								/>
							</a>
						)}
					</div>
				</div>
			</div>
		</footer>
	);
};

export { Footer };

export default Footer;
