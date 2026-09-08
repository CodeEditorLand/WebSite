/**
 * DynamicPlatformGrid - download section with OS-specific cards.
 *
 * Auto-detects the user's platform and highlights the matching card.
 * Each card shows version, file size, checksum, and direct download link.
 */
import { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { RichText } from "../UI/RichText.js";

import { DynamicButton } from "./DynamicButton";

import { DynamicCard } from "./DynamicCard";

import type PlatformInformation from "./Interface/Information/Platform.js";

import type Property from "./Interface/Property/Grid/Platform.js";

import type CardSection from "./Interface/Section/Card.js";

/**
 * Semantic color map per platform name - maps each platform to its OS token.
 * Applied as a top-border accent on each download card.
 */
const PlatformColorMap: Record<string, string> = {
	Apple: "var(--OSMacOS)",

	macOS: "var(--OSMacOS)",

	Windows: "var(--OSWindows)",

	Linux: "var(--OSLinux)",
};

/**
 * Dynamic PlatformGrid component that displays download cards for each platform
 * Supports fetching real download data from the Workers API
 * Includes loading and error states
 */
const DynamicPlatformGrid = ({ Content, ClassName }: Property) => {
	const { t: T } = useTranslation("download");

	const {
		Title,

		Subtitle,

		Platforms: ProvidedPlatforms,

		ShowVerification = true,

		OnDownload,

		ApiPlatform,

		Labels = {},
	} = Content;

	const {
		Version: VersionLabel = T("labels.version", {
			defaultValue: "Version:",
		}),

		Size: SizeLabel = T("labels.size", { defaultValue: "Size:" }),

		Requirements: RequirementsLabel = T("labels.requirements", {
			defaultValue: "Requirements:",
		}),

		Loading: LoadingLabel = T("labels.loading", {
			defaultValue: "Loading available downloads...",
		}),

		ErrorTitle: ErrorTitleLabel = T("labels.errorTitle", {
			defaultValue: "Could not load downloads",
		}),

		DownloadFailed: DownloadFailedLabel = T("labels.downloadFailed", {
			defaultValue: "Download failed. Please try again.",
		}),
	} = Labels;

	const [Platforms, SetPlatforms] = useState<PlatformInformation[]>(
		ProvidedPlatforms || [],
	);

	const [Loading, SetLoading] = useState(!ProvidedPlatforms);

	const [ErrorMessage, SetErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		if (ProvidedPlatforms) {
			SetPlatforms(ProvidedPlatforms);

			return;
		}

		const FetchPlatforms = async () => {
			try {
				SetLoading(true);

				SetErrorMessage(null);

				// Import workers client directly for platform data
				const { GetWorkersClient } =
					await import("../../Library/WorkerClient");

				const Workers = GetWorkersClient();

				const Response = await Workers.Download.GetLatest(ApiPlatform);

				if (!Response.success || !Response.data) {
					throw new Error(
						Response.error || "Failed to fetch latest download",
					);
				}

				const Latest = Response.data;

				const CurrentPlatform: PlatformInformation[] = [];

				const FormatBytes = (Bytes: number): string => {
					const MB = Bytes / (1024 * 1024);

					return `${MB.toFixed(1)} MB`;
				};

				if (Latest.platform === "macos") {
					CurrentPlatform.push({
						Id: Latest.id,
						Name: "Apple",
						Icon: "Apple",
						Description: "Universal Binary",
						Version: Latest.version,
						Size: Latest.fileSize
							? FormatBytes(Latest.fileSize)
							: "45.2 MB",
						Checksum: Latest.sha256,
						...(Latest.pgpSignature
							? { Signature: Latest.pgpSignature }
							: {}),
						Requirements: [
							"macOS 11.0 (Big Sur) or later",
							"4 GB RAM",
							"500 MB disk space",
						],
					});
				} else if (Latest.platform === "windows") {
					CurrentPlatform.push({
						Id: Latest.id,
						Name: "Windows",
						Icon: "Monitor",
						Description: "64-bit (x64)",
						Version: Latest.version,
						Size: Latest.fileSize
							? FormatBytes(Latest.fileSize)
							: "48.7 MB",
						Checksum: Latest.sha256,
						...(Latest.pgpSignature
							? { Signature: Latest.pgpSignature }
							: {}),
						Requirements: [
							"Windows 10 or later (64-bit)",
							"4 GB RAM",
							"500 MB disk space",
						],
					});
				} else if (Latest.platform === "linux") {
					CurrentPlatform.push({
						Id: Latest.id,
						Name: "Linux",
						Icon: "Terminal",
						Description: "DEB, RPM, AppImage",
						Version: Latest.version,
						Size: Latest.fileSize
							? FormatBytes(Latest.fileSize)
							: "41.3 MB",
						Checksum: Latest.sha256,
						...(Latest.pgpSignature
							? { Signature: Latest.pgpSignature }
							: {}),
						Requirements: [
							"glibc 2.28+",
							"4 GB RAM",
							"500 MB disk space",
						],
					});
				}

				SetPlatforms(CurrentPlatform);
			} catch (FetchError) {
				SetErrorMessage(
					FetchError instanceof Error
						? FetchError.message
						: "Failed to load downloads",
				);

				console.error("Failed to fetch platform data:", FetchError);
			} finally {
				SetLoading(false);
			}
		};

		FetchPlatforms();
	}, [ProvidedPlatforms, ApiPlatform]);

	const GridReference = useRef<HTMLDivElement>(null);

	// Apply attention scatter to platform download cards
	useEffect(() => {
		const Grid = GridReference.current;

		if (!Grid || Loading) return;

		const ReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (ReducedMotion) return;

		const ApplyScatter = async () => {
			const AttentionModule =
				await import("../../Function/Noise/Attention.js");

			const Attention = await AttentionModule.default;

			Attention.ApplyToSelector(".PlatformCard", 5, 3);
		};

		ApplyScatter();
	}, [Platforms, Loading]);

	const FormatFileSize = (SizeString: string) => {
		return SizeString;
	};

	const FormatVersion = (Version: string) => {
		return Version.startsWith("v") ? Version : `v${Version}`;
	};

	const HandleDownload = async (Platform: PlatformInformation) => {
		try {
			// Use workers client directly
			const { GetWorkersClient } =
				await import("../../Library/WorkerClient");

			const Workers = GetWorkersClient();

			const InfoResponse = await Workers.Download.GetInfo(Platform.Id);

			if (!InfoResponse.success || !InfoResponse.data) {
				throw new Error(
					InfoResponse.error || "Failed to get download info",
				);
			}

			window.open(InfoResponse.data.downloadUrl, "_blank");

			await Workers.Download.TrackDownload(Platform.Id);

			OnDownload?.(Platform);
		} catch (DownloadError) {
			console.error("Download failed:", DownloadError);

			console.warn(DownloadFailedLabel);
		}
	};

	if (Loading) {
		return (
			<section
				className={`py-20 ${ClassName || ""}`}
				aria-label="Downloads"
				aria-busy="true"
			>
				<div className="container mx-auto px-4">
					<div
						className="mb-16 text-center"
						role="status"
						aria-live="polite"
					>
						<h2 className="mb-4 text-4xl font-normal md:text-5xl lg:text-6xl">
							{LoadingLabel}
						</h2>
					</div>
					<div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
						{[1, 2, 3].map((Index) => (
							<DynamicCard
								key={Index}
								Sections={{}}
								ClassName="animate-pulse"
							/>
						))}
					</div>
				</div>
			</section>
		);
	}

	if (ErrorMessage) {
		return (
			<section
				className={`py-20 ${ClassName || ""}`}
				aria-label="Downloads"
			>
				<div className="container mx-auto px-4">
					<div className="mb-16 text-center" role="alert">
						<h2 className="mb-4 text-4xl font-normal text-red-500 md:text-5xl lg:text-6xl">
							{ErrorTitleLabel}
						</h2>
						<p className="text-muted-foreground">{ErrorMessage}</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section
			id="download"
			aria-label="Downloads"
			className={`w-full py-16 sm:py-20 ${ClassName || ""}`}
		>
			<div className="container mx-auto px-4">
				{(Title || Subtitle) && (
					<div className="mx-auto mb-10 max-w-2xl text-center">
						<p className="mb-4 font-mono text-sm uppercase tracking-[0.25em] text-muted">
							Download
						</p>
						{Title && (
							<h2 className="text-4xl font-normal tracking-tight sm:text-5xl">
								{Title}
							</h2>
						)}

						{Subtitle && (
							<div className="mt-3 text-muted">
								<RichText Text={Subtitle} />
							</div>
						)}
					</div>
				)}

				<div
					ref={GridReference}
					className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
				>
					{Platforms.map((Platform) => {
						const HasVerification =
							ShowVerification &&
							(Platform.Checksum || Platform.Signature);

						const PlatformCardSection: CardSection = {
							Header: {
								title: Platform.Name,
								description: Platform.Description,
								content: (
									<div className="mt-3">
										<DynamicButton
											Content={{
												Text: T("labels.downloadFor", {
													defaultValue:
														"Download for {{platform}}",
													platform:
														Platform.Name ||
														"this platform",
												}),
												Variant: "default",
												Size: "lg",
												FullWidth: true,
												Icon: "Download",
											}}
											OnAction={() =>
												HandleDownload(Platform)
											}
										/>
									</div>
								),
							},
							Body: {
								content: (
									<div className="space-y-2 font-mono text-sm text-muted-foreground">
										<div className="flex justify-between">
											<span>{VersionLabel}</span>
											<span className="font-medium text-card-foreground">
												{FormatVersion(
													Platform.Version,
												)}
											</span>
										</div>
										<div className="flex justify-between">
											<span>{SizeLabel}</span>
											<span className="font-medium text-card-foreground">
												{FormatFileSize(Platform.Size)}
											</span>
										</div>
										{Platform.Requirements &&
											Platform.Requirements.length >
												0 && (
												<div className="mt-2 border-t border-border pt-2">
													<p className="mb-1 font-medium text-card-foreground">
														{RequirementsLabel}
													</p>
													<ul className="list-inside list-disc space-y-1">
														{Platform.Requirements.map(
															(
																Requirement,

																RequirementIndex,
															) => (
																<li
																	key={
																		RequirementIndex
																	}
																	className=""
																>
																	{
																		Requirement
																	}
																</li>
															),
														)}
													</ul>
												</div>
											)}
									</div>
								),
							},
							...(HasVerification
								? {
										Footer: {
											content: (
												<div className="font-mono text-sm text-muted-foreground">
													{Platform.Checksum && (
														<p>
															SHA-256:{" "}
															{Platform.Checksum.substring(
																0,
																16,
															)}
															...
														</p>
													)}
													{Platform.Signature && (
														<p>
															Signature: available
														</p>
													)}
												</div>
											),
										},
									}
								: {}),
						};

						const PlatformAccentColor =
							PlatformColorMap[Platform.Name] ??
							"var(--PlatformDesktop)";

						return (
							<DynamicCard
								Sections={PlatformCardSection}
								ClassName="PlatformCard flex flex-col"
								Style={
									{
										"--jelly-color-border-default":
											PlatformAccentColor,
										"--jelly-fill": "var(--Card)",
										"--jelly-radius": "0",
										"--jelly-card-padding-block": "0",
										"--jelly-card-padding-inline": "0",
										"--jelly-card-font-size": "inherit",
									} as React.CSSProperties
								}
							/>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export { DynamicPlatformGrid };

export default DynamicPlatformGrid;
