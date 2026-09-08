import { Download, Fingerprint, Shield } from "lucide-react";

import { useTranslation } from "react-i18next";

import { RichText } from "../UI/RichText.js";

import { DynamicButton } from "./DynamicButton";

import type VerificationInfo from "./Interface/Information/Verification.js";

import type Property from "./Interface/Property/Information/Verification.js";

/**
 * Dynamic VerificationInfo component for displaying binary verification info
 * Shows SHA-256 checksums and release signatures with copy functionality
 */
const DynamicVerificationInfo = ({
	Content,
	OnVerify,
	ClassName,
}: Property) => {
	const { t: T } = useTranslation("download");

	const { Title, Description, DownloadVerification, IntegrityVerification } =
		Content;

	const CopyToClipboard = (Text: string, Label: string) => {
		navigator.clipboard
			.writeText(Text)
			.then(() => {
				alert(
					T("labels.copiedToClipboard", {
						defaultValue: "{{label}} copied to clipboard!",
						label: Label,
					}),
				);
			})
			.catch(() => {
				alert(
					T("labels.failedToCopy", {
						defaultValue: "Failed to copy {{label}}",
						label: Label,
					}),
				);
			});
	};

	const RenderVerificationBlock = (
		Information: VerificationInfo,

		Type: "download" | "integrity",
	) => (
		<div className="space-y-4">
			{Information.SHA256 && (
				<div className="space-y-2">
					<div className="flex items-center">
						<span className="font-semibold">
							{T("labels.sha256Checksum", {
								defaultValue: "SHA-256 Checksum",
							})}
						</span>
						{"\u2001"}

						<Fingerprint
							className="h-4 w-4 shrink-0 text-primary"
							aria-hidden="true"
						/>
					</div>
					<div className="bg-muted/50 flex items-center gap-2 p-3">
						<code className="flex-1 truncate font-mono">
							{Information.SHA256}
						</code>
						<button
							type="button"
							className="px-3 py-1 transition-colors hover:bg-accent"
							aria-label="Copy SHA-256 checksum to clipboard"
							onClick={() =>
								CopyToClipboard(
									Information.SHA256!,

									T("labels.sha256Checksum", {
										defaultValue: "SHA-256 checksum",
									}),
								)
							}
						>
							{T("labels.copy", { defaultValue: "Copy" })}
						</button>
					</div>
				</div>
			)}

			{Information.PGPSignature && (
				<div className="space-y-2">
					<div className="flex items-center">
						<span className="font-semibold">
							{T("labels.pgpSignature", {
								defaultValue: "Release Signature",
							})}
						</span>
						{"\u2001"}

						<Shield
							className="h-4 w-4 shrink-0 text-primary"
							aria-hidden="true"
						/>
					</div>
					<div className="bg-muted/50 flex items-center gap-2 p-3">
						<code className="flex-1 truncate font-mono">
							{Information.PGPSignature}
						</code>
						<button
							type="button"
							className="px-3 py-1 transition-colors hover:bg-accent"
							aria-label="Copy release signature to clipboard"
							onClick={() =>
								CopyToClipboard(
									Information.PGPSignature || "",

									T("labels.pgpSignature", {
										defaultValue: "release signature",
									}),
								)
							}
						>
							{T("labels.copy", { defaultValue: "Copy" })}
						</button>
					</div>
					{Information.SigningKeyId && (
						<p className="text-card-foreground">
							{T("labels.signedWithKeyId", {
								defaultValue: "Signed with key ID: {{keyId}}",
								keyId: Information.SigningKeyId,
							})}
						</p>
					)}
				</div>
			)}

			{Information.VerificationInstructions && (
				<div className="border-t border-[var(--Border)] pt-4">
					<h5 className="mb-2 font-semibold">
						{T("labels.verificationInstructions", {
							defaultValue: "Verification Instructions",
						})}
					</h5>
					<div className="text-muted-foreground">
						<RichText Text={Information.VerificationInstructions} />
					</div>
				</div>
			)}

			{Type === "download" && Content.DownloadButton && (
				<div className="pt-4">
					<DynamicButton
						Content={{ ...Content.DownloadButton, FullWidth: true }}
					/>
				</div>
			)}

			{Type === "integrity" && Content.VerifyButton && (
				<div className="pt-4">
					<DynamicButton
						Content={{ ...Content.VerifyButton, FullWidth: true }}
						OnAction={() =>
							OnVerify?.(IntegrityVerification.SHA256 || "")
						}
					/>
				</div>
			)}
		</div>
	);

	return (
		<section
			className={`py-20 ${ClassName || ""}`}
			aria-label="Download verification"
		>
			<div className="container mx-auto px-4">
				<div className="mx-auto max-w-4xl">
					{(Title || Description) && (
						<div className="mb-12 text-center">
							{Title && (
								<h2 className="mb-4 text-3xl tracking-tight md:text-4xl lg:text-5xl">
									{Title}
								</h2>
							)}

							{Description && (
								<div className="mx-auto max-w-2xl text-lg text-muted-foreground">
									<RichText Text={Description} />
								</div>
							)}
						</div>
					)}

					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						{/* Download Verification */}
						<div className="StaccatoCard StaccatoBorderShimmer flat bg-card p-6">
							<h3 className="mb-4 flex items-center font-mono text-sm font-semibold">
								{T("labels.downloadVerification", {
									defaultValue: "Download Verification",
								})}
								{"\u2001"}
								<Download
									className="h-5 w-5 shrink-0"
									aria-hidden="true"
								/>
							</h3>
							{RenderVerificationBlock(
								DownloadVerification,
								"download",
							)}
						</div>

						{/* Integrity Verification */}
						<div className="StaccatoCard StaccatoBorderShimmer flat border border-primary bg-card p-6">
							<h3 className="mb-4 flex items-center font-mono text-sm font-semibold">
								{T("labels.integrityCheck", {
									defaultValue: "Integrity Check",
								})}
								{"\u2001"}
								<Shield
									className="h-5 w-5 shrink-0"
									aria-hidden="true"
								/>
							</h3>
							{RenderVerificationBlock(
								IntegrityVerification,
								"integrity",
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export { DynamicVerificationInfo };

export default DynamicVerificationInfo;
