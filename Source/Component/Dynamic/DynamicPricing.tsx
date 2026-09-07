import * as lucide from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { IconTooltip } from "../UI/IconTooltip.js";

import { RichText } from "../UI/RichText.js";

import { DynamicButton } from "./DynamicButton.js";

// RichText is used with Terms={true} throughout so element names, tool names,
// protocols, and licenses are auto-badged with logos from the term dictionary.
import type Property from "./Interface/Property/Pricing.js";

/**
 * Semantic color map for the six core elements.
 * Extracts the element name from the first segment before the emoji.
 */
const ElementColorMap: Record<string, string> = {
	Mountain: "var(--ExtensionRust)",

	Cocoon: "var(--ExtensionEffectTypeScript)",

	Wind: "var(--LanguageTypeScript)",

	Sky: "var(--ExtensionAstro)",

	Air: "var(--ExtensionTauri)",

	Echo: "var(--SpineTCP)",

	Common: "var(--LanguageRust)",

	Vine: "var(--SpinegRPC)",

	Grove: "var(--SpineWASM)",

	Mist: "var(--SpineIPC)",

	Rest: "var(--ToolOxc)",

	Output: "var(--ToolEsBuild)",

	SideCar: "var(--RuntimeNode)",

	Worker: "var(--LanguageJavaScript)",

	Maintain: "var(--ToolBiome)",
};

const GetElementColor = (Line: string): string => {
	const Name = Line.split(/[\s\u2001]/)[0];

	return ElementColorMap[Name] ?? "var(--Primary)";
};

/** Doc page paths for each element - used for quick links in pricing tiers. */
const ElementDocPath: Record<string, string> = {
	Mountain: "/Doc/mountain",
	Cocoon: "/Doc/cocoon",
	Wind: "/Doc/wind",
	Sky: "/Doc/sky",
	Air: "/Doc/air",
	Echo: "/Doc/echo",
	Vine: "/Doc/vine",
	Common: "/Doc/common",
	Grove: "/Doc/grove",
	Mist: "/Doc/mist",
	Rest: "/Doc/rest",
	Output: "/Doc/output",
	SideCar: "/Doc/sidecar",
	Maintain: "/Doc/maintain",
	Worker: "/Doc/worker",
};

/**
 * Dynamic Pricing - two-column layout (Free + Future).
 * Each tier card shows:
 * Elements section - colored multi-line rows (name / descriptor / detail)
 * Separator
 * Features section - icon checklist
 */
const DynamicPricing = ({ Content, ClassName }: Property) => {
	const { t: T } = useTranslation("home");

	const GridReference = useRef<HTMLDivElement>(null);

	const {
		Title,

		Subtitle,

		Tier: Tiers,

		ShowMonthlyYearlyToggle = false,

		DefaultYearly = false,

		Labels = {},
	} = Content;

	const PopularLabel =
		Labels.Popular ??
		T("pricing.labels.popular", { defaultValue: "Most Popular" });

	const [IsYearly, SetIsYearly] = useState(DefaultYearly);

	useEffect(() => {
		const Grid = GridReference.current;

		if (!Grid) return;

		const ReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (ReducedMotion) return;

		const ApplyScatter = async () => {
			const AttentionModule =
				await import("../../Function/Noise/Attention.js");

			const Attention = await AttentionModule.default;

			const Cards = Grid.querySelectorAll<HTMLElement>(".PricingCard");

			Cards.forEach((Card, Index) => {
				Attention.ApplyToElement(Card, Index, 4, 3);
			});
		};

		ApplyScatter();
	}, [Tiers]);

	const DisplayTier = Tiers.map((Tier) => ({
		...Tier,
		currentPrice: IsYearly ? Tier.Price.Yearly : Tier.Price.Monthly,
	}));

	return (
		<section
			id="pricing"
			aria-labelledby="PricingHeading"
			className={`w-full py-16 sm:py-20 ${ClassName || ""}`}
		>
			<div className="container mx-auto px-4">
				{(Title || Subtitle) && (
					<div className="mx-auto mb-10 max-w-2xl text-center">
						<p className="mb-4 font-mono text-sm uppercase tracking-[0.25em] text-muted">
							Roadmap
						</p>
						{Title && (
							<h2
								id="PricingHeading"
								className="text-4xl font-normal tracking-tight sm:text-5xl"
							>
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
					className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2"
				>
					{DisplayTier.map((Tier) => (
						<jelly-card
							key={Tier.Identifier}
							className={`PricingCard flat ${
								Tier.Highlighted || Tier.Popular ? "" : ""
							} ${
								Tier.Status && Tier.Status !== "Ready"
									? "opacity-75"
									: ""
							}`}
							style={{
								"--jelly-fill": "var(--Card)",
								"--jelly-radius": "0",
								"--jelly-card-padding-block": "0",
								"--jelly-card-padding-inline": "0",
							} as React.CSSProperties}
							aria-disabled={
								Tier.Status && Tier.Status !== "Ready"
									? true
									: undefined
							}
						>
							<div className="flex flex-col">
							{/* ── Card header ───────────────────────────── */}
							<div className="border-b border-[var(--Border)] p-8">
								{Tier.Popular && (
									<div className="mb-3">
										<jelly-badge
											variant="mint"
											shape="square"
											style={{
												"--jelly-fill": "var(--SpinegRPCMute)",
												"--jelly-label": "var(--SpinegRPCFore)",
												"--jelly-badge-radius": "0px",
												"--jelly-badge-font-size": "10px",
											} as React.CSSProperties}
										>
											<span
												className="StaccatoRhythmDot mr-1.5 h-1.5 w-1.5 flat"
												style={{
													backgroundColor: "var(--SpinegRPC)",
												}}
												aria-hidden="true"
											/>
											{PopularLabel}
										</jelly-badge>
									</div>
								)}
								{Tier.Status && Tier.Status !== "Ready" && (
									<div className="mb-2">
										<jelly-badge
											variant="platinum"
											shape="square"
											style={{
												"--jelly-fill": "var(--Mute)",
												"--jelly-label": "var(--MuteForeground)",
												"--jelly-badge-radius": "0px",
												"--jelly-badge-font-size": "0.625rem",
											} as React.CSSProperties}
										>
											{Tier.Status === "WIP"
												? "WIP"
												: "Coming Soon"}
										</jelly-badge>
									</div>
								)}
								<div className="mb-4">
									<DynamicButton
										Content={{
											...Tier.CTA,
											FullWidth: true,
										}}
									/>
								</div>
								<h3 className="mb-2 text-2xl font-bold">
									{Tier.Name}
								</h3>
								{Tier.Description && (
									<div className="StaccatoBreath text-muted-foreground">
										<RichText Text={Tier.Description} />
									</div>
								)}
							</div>

							{/* ── Card body ─────────────────────────────── */}
							<div className="flex flex-1 flex-col p-8">
								{/* Elements section */}
								{Tier.Element && Tier.Element.length > 0 && (
									<>
										<p className="mb-3 font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
											Elements
										</p>
										<ul className="space-y-3">
											{Tier.Element.map(
												(Element, Index) => {
													const Parts =
														Element.split("\n");

													const NameLine =
														Parts[0] ?? "";

													const Sub1 = Parts[1];

													const Sub2 = Parts[2];

													const AccentColor =
														GetElementColor(
															NameLine,
														);

													return (
														<li
															key={Index}
															className={`flex flex-col gap-0.5 ${
																Tier.Status &&
																Tier.Status !==
																	"Ready"
																	? "opacity-70"
																	: ""
															}`}
														>
																														<a
																																href={
																																	ElementDocPath[
																																		NameLine
																																	] ??
																																		`/Doc/${NameLine.toLowerCase()}`
																																}
																															className="font-mono text-sm font-semibold transition-colors hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
																															style={{
																																color: AccentColor,
																															}}
																														>
																															<RichText
																																Text={
																																	NameLine
																																}
																																Terms={true}
																															/>
																														</a>
															{Sub1 && (
																<span className="font-mono text-sm text-foreground">
																	<RichText
																		Text={
																			Sub1
																		}
																		Terms={
																			true
																		}
																	/>
																</span>
															)}
															{Sub2 && (
																<span className="font-mono text-sm text-muted-foreground">
																	<RichText
																		Text={
																			Sub2
																		}
																		Terms={
																			true
																		}
																	/>
																</span>
															)}
														</li>
													);
												},
											)}
										</ul>
										{Tier.Feature.length > 0 && (
											<hr className="my-5 border-[var(--Border)]" />
										)}
									</>
								)}

								{/* Features section */}
								{Tier.Feature.length > 0 && (
									<>
										{Tier.Element &&
											Tier.Element.length > 0 && (
												<p className="mb-3 font-mono text-sm font-semibold uppercase tracking-wider text-muted-foreground">
													Roadmap
												</p>
											)}

										<ul className="space-y-3">
											{Tier.Feature.map(
												(Feature, FeatureIndex) => (
													<li
														key={FeatureIndex}
														className={`flex items-start justify-between gap-2 ${
															Tier.Status &&
															Tier.Status !==
																"Ready"
																? "opacity-70"
																: ""
														}`}
													>
														<span className="min-w-0 flex-1">
															<RichText
																Text={Feature}
																Terms={true}
															/>
														</span>
														{Tier.Status &&
														Tier.Status !==
															"Ready" ? (
															<jelly-badge
																									variant="platinum"
																									shape="square"
																									className="shrink-0"
																									style={{
																										"--jelly-fill": "var(--Mute)",
																										"--jelly-label": "var(--MuteForeground)",
																										"--jelly-badge-radius": "0px",
																										"--jelly-badge-font-size": "0.625rem",
																									} as React.CSSProperties}
																								>
																									{Tier.Status ===
																									"WIP"
																										? "WIP"
																										: "Coming Soon"}
																								</jelly-badge>
														) : (
															<IconTooltip
																Label="Included"
																Icon={
																	lucide.Check
																}
																SizeClass="h-4 w-4 shrink-0"
																ClassName="StaccatoCheckmark mt-0.5 text-primary"
															/>
														)}
													</li>
												),
											)}
										</ul>
									</>
								)}
							</div>
							</div>
						</jelly-card>
					))}
				</div>
			</div>
		</section>
	);
};

export { DynamicPricing };

export default DynamicPricing;
