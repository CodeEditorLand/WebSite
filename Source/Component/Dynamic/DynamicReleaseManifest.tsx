"use client";

import { useTranslation } from "react-i18next";

import {
	FieldRecordDataCard,
	FieldRecordStatus,
	FieldRecordAction,
	FieldRecordIndex,
	FieldRecordMetadata,
	FieldRecordSeal,
} from "../Brand/FieldRecord.js";

import type Property from "./Interface/Property/Grid/Platform.js";

/**
 * DynamicReleaseManifest - release manifest with field-record grammar.
 *
 * Renders platform availability as a structured manifest:
 *   # RELEASE_01
 *   〈MACOS〉 /CHANNEL: PUBLIC
 *   ARCH / SIGNING / SIZE / CHECKSUM
 *   [DOWNLOAD ACTION]
 *   WINDOWS / LINUX STATUS: RELEASE PREPARATION
 */

interface ReleaseManifestPlatform {
	Name: string;
	Channel: string;
	Arch: string;
	Signing: "VERIFIED" | "IN PREPARATION";
	Size?: string;
	Checksum?: string;
	Status: "active" | "preparing" | "verified" | "unavailable";
	DownloadUrl?: string;
	DownloadLabel?: string;
}

interface ReleaseManifestContent {
	Title?: string;
	Subtitle?: string;
	ReleaseIndex?: string;
	Platforms: ReleaseManifestPlatform[];
}

const DynamicReleaseManifest = ({ Content, ClassName }: Property) => {
	const { t: T } = useTranslation("download");

	const {
		Title = T("manifest.title", { defaultValue: "Release Manifest" }),
		Subtitle = T("manifest.subtitle", {
			defaultValue:
				"Source builds are active today. Public installers, signing, and verification artifacts are still being prepared.",
		}),
		ReleaseIndex = "RELEASE_01",
		Platforms = [],
	} = Content as ReleaseManifestContent;

	return (
		<section
			id="release-manifest"
			aria-label="Release Manifest"
			className={`w-full py-16 sm:py-20 ${ClassName || ""}`}
		>
			<div className="container mx-auto px-4">
				{(Title || Subtitle) && (
					<div className="mx-auto mb-10 max-w-2xl text-center">
						<p className="mb-4 font-mono text-sm uppercase tracking-[0.25em] text-muted">
							{T("manifest.heading", {
								defaultValue: "Release Manifest",
							})}
						</p>
						{Title && (
							<h2 className="text-4xl font-normal tracking-tight sm:text-5xl">
								{Title}
							</h2>
						)}
						{Subtitle && (
							<div className="mt-3 text-muted">
								<p>{Subtitle}</p>
							</div>
						)}
					</div>
				)}

				<div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
					{Platforms.map((Platform) => {
						const IsActive = Platform.Status === "active";
						const SigningStatus =
							Platform.Signing === "VERIFIED"
								? "verified"
								: "preparing";

						return (
							<FieldRecordDataCard
								key={Platform.Name}
								className="h-full"
							>
								<div className="flex h-full flex-col justify-between">
									{/* Top: Index + Seal */}
									<div className="flex items-start justify-between">
										<FieldRecordIndex
											index={ReleaseIndex}
										/>
										<FieldRecordSeal
											element="Land"
											size={48}
										/>
									</div>

									{/* Platform stamp */}
									<div className="mt-6">
										<p className="text-field-xl font-mono font-normal leading-[0.95] tracking-[-0.02em] text-card-foreground">
											〈{Platform.Name.toUpperCase()}〉
										</p>
										<p className="text-field-s mt-2 font-mono font-normal leading-[1.1] text-card-foreground opacity-70">
											/CHANNEL:{" "}
											{Platform.Channel.toUpperCase()}
										</p>
									</div>

									{/* Metadata block */}
									<div className="mt-6">
										<FieldRecordMetadata
											pairs={[
												{
													label: "ARCH",
													value: Platform.Arch,
												},
												{
													label: "SIGNING",
													value: Platform.Signing,
												},
												...(Platform.Size
													? [
															{
																label: "SIZE",
																value: Platform.Size,
															},
														]
													: []),
												...(Platform.Checksum
													? [
															{
																label: "CHECKSUM",
																value: Platform.Checksum,
															},
														]
													: []),
											]}
										/>
									</div>

									{/* Status */}
									<div className="mt-4">
										<FieldRecordStatus
											status={Platform.Status}
											tone="ink"
										/>
									</div>

									{/* Download action or preparation status */}
									<div className="mt-6">
										{IsActive && Platform.DownloadUrl ? (
											<FieldRecordAction
												label={
													Platform.DownloadLabel ||
													`DOWNLOAD ${Platform.Name.toUpperCase()}`
												}
												href={Platform.DownloadUrl}
												variant="button"
											/>
										) : (
											<p className="text-field-xs font-mono uppercase tracking-wider text-muted-foreground">
												STATUS: RELEASE PREPARATION
											</p>
										)}
									</div>
								</div>
							</FieldRecordDataCard>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export { DynamicReleaseManifest };
export default DynamicReleaseManifest;
