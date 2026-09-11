"use client";

import { useTranslation } from "react-i18next";

import { LocaleSwitcher } from "./LocaleSwitcher.js";

import "./Footer/Stylesheet.css";

interface FooterProps {
	Content?: Record<string, unknown>;
}

const Footer = ({ Content }: FooterProps) => {
	const { t: T } = useTranslation("footer");

	return (
		<footer className="Footer" role="contentinfo" aria-label="Site footer">
			<div className="FooterRecord">
				<div className="FooterRule" aria-hidden="true" />

				<div className="FooterRecordHeader">
					<span className="FooterRecordMarker">#</span>
					<span className="FooterRecordEnd">
						{T("record.end", "LAND / RECORD END")}
					</span>
					<LocaleSwitcher />
				</div>

				<dl className="FooterMetadata">
					<div className="FooterMetadataRow">
						<dt>{T("record.source.key", "SOURCE")}</dt>
						<dd>{T("record.source.value", "CODEEDITORLAND")}</dd>
					</div>
					<div className="FooterMetadataRow">
						<dt>{T("record.license.key", "LICENSE")}</dt>
						<dd>
							<a href="/License" className="FooterMetadataLink">
								{T("record.license.value", "CC0")}
							</a>
						</dd>
					</div>
					<div className="FooterMetadataRow">
						<dt>{T("record.maintained.key", "MAINTAINED BY")}</dt>
						<dd>
							<a
								href="https://PlayForm.Cloud"
								target="_blank"
								rel="noopener noreferrer"
								className="FooterMetadataLink"
							>
								{T("record.maintained.value", "PLAYFORM")}
							</a>
						</dd>
					</div>
					<div className="FooterMetadataRow">
						<dt>{T("record.support.key", "SUPPORT")}</dt>
						<dd>
							<a
								href="https://nlnet.nl"
								target="_blank"
								rel="noopener noreferrer"
								className="FooterMetadataLink"
							>
								{T("record.support.nlnet", "NLNET")}
							</a>
							<span className="FooterMetadataSep"> / </span>
							<a
								href="https://nlnet.nl/commonsfund"
								target="_blank"
								rel="noopener noreferrer"
								className="FooterMetadataLink"
							>
								{T("record.support.ngi", "NGI0")}
							</a>
						</dd>
					</div>
					<div className="FooterMetadataRow">
						<dt>{T("record.status.key", "STATUS")}</dt>
						<dd>{T("record.status.value", "PUBLIC SOURCE")}</dd>
					</div>
				</dl>

				<nav className="FooterQuickLinks" aria-label="Quick links">
					<a href="/Doc" className="FooterQuickLink">
						{T("record.docs", "/DOCS")}
					</a>
					<a href="/Download" className="FooterQuickLink">
						{T("record.download", "/DOWNLOAD")}
					</a>
					<a
						href="https://github.com/CodeEditorLand/Land"
						target="_blank"
						rel="noopener noreferrer"
						className="FooterQuickLink"
					>
						{T("record.github", "/GITHUB")}
					</a>
					<a href="/Contact" className="FooterQuickLink">
						{T("record.contact", "/CONTACT")}
					</a>
				</nav>

				<nav className="FooterLegal" aria-label="Legal">
					<a href="/Legal/Privacy" className="FooterLegalLink">
						{T("columns.legal.privacy", "Privacy")}
					</a>
					<a href="/Legal/Term" className="FooterLegalLink">
						{T("columns.legal.terms", "Terms")}
					</a>
					<a href="/License" className="FooterLegalLink">
						{T("columns.legal.license", "License")}
					</a>
					<a href="/Contributing" className="FooterLegalLink">
						{T("columns.company.contributing", "Contributing")}
					</a>
					<a
						href="https://github.com/CodeEditorLand/Land/issues"
						target="_blank"
						rel="noopener noreferrer"
						className="FooterLegalLink"
					>
						{T("columns.company.issues", "Issues")}
					</a>
					<a href="/Blog" className="FooterLegalLink">
						{T("columns.product.blog", "Blog")}
					</a>
					<a href="/Contact/Sale" className="FooterLegalLink">
						{T("columns.company.enterprise", "Enterprise")}
					</a>
				</nav>

				<div className="FooterBottom">
					<span className="FooterCopyright">
						{T("bottomBar.copyright", {
							year: new Date().getFullYear(),
							defaultValue: `© ${new Date().getFullYear()} Code Editor Land. All rights reserved.`,
						})}
					</span>
					<span className="FooterTauri">
						<a
							href="https://tauri.app"
							target="_blank"
							rel="noopener noreferrer"
							className="FooterTauriLink"
						>
							<img
								src="/Dark/Image/GitHub/Made/Tauri.svg"
								alt="Made with Tauri"
								width="160"
								height="32"
								className="h-8"
								loading="lazy"
							/>
						</a>
					</span>
				</div>
			</div>
		</footer>
	);
};

export { Footer };
export default Footer;
