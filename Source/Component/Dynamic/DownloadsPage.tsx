"use client";

import { useTranslation } from "react-i18next";

import { ErrorBoundary } from "../ErrorBoundary.js";

import { Header } from "../Layout/Header";

import { SkeletonCard } from "../UI/Skeleton.js";

import { DynamicPlatformGrid } from "./DynamicPlatformGrid";

import { DynamicPreviousReleases } from "./DynamicPreviousReleases";

import { DynamicSystemRequirements } from "./DynamicSystemRequirements";

import { DynamicVerificationInfo } from "./DynamicVerificationInfo";

import type Interface from "./Interface/Content/Page/Download.js";

import type Property from "./Interface/Property/Page/Download.js";

/**
 * Dynamic DownloadsPage composition
 * Assembles PlatformGrid, SystemRequirements, VerificationInfo, PreviousReleases
 * Content driven by translations (useTranslation) or explicit props
 */
const DownloadsPage = ({ Content, ClassName }: Property) => {
	const { t: T } = useTranslation(["download", "common"]);

	const ResolvedContent: Interface = Content || {
		PlatformGrid: {
			Title: T("download:page.title", {
				defaultValue: "Download Land",
			}),

			Subtitle: T("download:page.subtitle", {
				defaultValue:
					"Source builds are active today. Public installers, signing, and verification artifacts are still being prepared.",
			}),

			Platforms: [],

			ShowVerification: true,

			OnDownload: async (Platform) => {
				if (Platform.Id) {
					try {
						const { default: DownloadAPI } =
							await import("../../Library/API/Download.js");

						const Information = await DownloadAPI.GetInfo(
							Platform.Id,
						);

						window.open(Information.downloadUrl, "_blank");

						await DownloadAPI.TrackDownload(Platform.Id);
					} catch (DownloadError) {
						console.error("Download failed:", DownloadError);

						alert(
							T("download:labels.downloadFailed", {
								defaultValue:
									"Download failed. Please try again.",
							}),
						);
					}
				}
			},
		},

		SystemRequirements: {
			Title: T("download:systemRequirements.title", {
				defaultValue: "System Requirements",
			}),

			Description: T("download:systemRequirements.subtitle", {
				defaultValue:
					"A quick check before you download saves a reinstall later.",
			}),

			Requirements: {
				Minimum: [
					{
						Id: "cpu-min",

						Label: "Processor",

						Value: "Intel Core i5 or AMD Ryzen 5 / Apple Silicon",
					},

					{ Id: "ram-min", Label: "Memory", Value: "4 GB RAM" },

					{ Id: "disk-min", Label: "Disk Space", Value: "500 MB" },
				],

				Recommended: [
					{
						Id: "cpu-rec",

						Label: "Processor",

						Value: "Intel Core i7 or AMD Ryzen 7",
					},

					{ Id: "ram-rec", Label: "Memory", Value: "8 GB RAM" },

					{
						Id: "disk-rec",

						Label: "Disk Space",

						Value: "1 GB SSD",
					},
				],
			},

			Os: [
				"macOS 11+",

				"Windows 10+",

				"Ubuntu 20.04+ / Fedora 35+ / Debian 11+",
			],
		},

		VerificationInfo: {
			Title: T("download:verification.title", {
				defaultValue: "Verification Will Ship With Public Releases.",
			}),

			Description: T("download:verification.description", {
				defaultValue:
					"Release downloads will publish checksum and signature material when public installers are available.",
			}),

			DownloadVerification: {
				SHA256: "Available at first public release",

				PGPSignature: "Available at first public release",

				SigningKeyId: "Available at first public release",

				VerificationInstructions:
					"Verification instructions will be published beside the installer, checksum, and signature artifacts.",
			},

			IntegrityVerification: {
				SHA256: "Available at first public release",

				PGPSignature: "Available at first public release",

				VerificationInstructions:
					"Air contains checksum and integrity code. Public release verification material will be published with the installers.",
			},

			DownloadButton: {
				Text: T("download:verification.downloadButton", {
					defaultValue: "View Verification Plan",
				}),

				Variant: "outline",

				Size: "default",

				FullWidth: false,
			},

			VerifyButton: {
				Text: T("download:verification.verifyButton", {
					defaultValue: "Verify Download",
				}),

				Variant: "default",

				Size: "default",

				FullWidth: false,
			},
		},

		PreviousReleases: {
			Title: T("download:previousReleases.title", {
				defaultValue: "Previous Releases",
			}),

			Description: T("download:previousReleases.description", {
				defaultValue:
					"Download an older version if you need to pin to a specific release.",
			}),

			Releases: [],

			ShowChangelog: false,
		},

		Footer: {},
	};

	const {
		PlatformGrid,

		SystemRequirements,

		VerificationInfo: VerificationInformation,

		PreviousReleases,

		Header: HeaderContent,
	} = ResolvedContent;

	return (
		<div className={`flex min-h-screen flex-col ${ClassName || ""}`}>
			{HeaderContent !== undefined && (
				<Header Content={HeaderContent} Mode="functional" />
			)}

			<div className="flex-1">
				<DynamicPlatformGrid Content={PlatformGrid} />

				<ErrorBoundary FallbackComponent={() => <SkeletonCard />}>
					<DynamicSystemRequirements Content={SystemRequirements} />
				</ErrorBoundary>

				<ErrorBoundary FallbackComponent={() => <SkeletonCard />}>
					<DynamicVerificationInfo
						Content={VerificationInformation}
					/>
				</ErrorBoundary>

				<ErrorBoundary FallbackComponent={() => <SkeletonCard />}>
					<DynamicPreviousReleases Content={PreviousReleases} />
				</ErrorBoundary>
			</div>
		</div>
	);
};

export { DownloadsPage };

export default DownloadsPage;
