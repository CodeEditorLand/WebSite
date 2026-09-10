import * as lucide from "lucide-react";

import { useEffect, useRef } from "react";

import { RichText } from "../UI/RichText.js";

import type Property from "./Interface/Property/Testimonial.js";

/**
 * Architecture-element glyph: maps a codename to a lucide icon so the cards
 * use the project icon system instead of sprinkled emoji. Falls back to a
 * neutral square for unknown names. See .claude/skills/land-design.
 */
const ElementGlyph = ({ Name }: { Name?: string }) => {
	const Key = (Name ?? "").toLowerCase();

	const Map: Record<string, lucide.LucideIcon> = {
		mountain: lucide.Mountain,

		cocoon: lucide.Box,

		wind: lucide.Wind,

		sky: lucide.Cloud,

		air: lucide.Wind,

		echo: lucide.Radio,

		grove: lucide.Trees,

		vine: lucide.Sprout,

		rest: lucide.Umbrella,

		worker: lucide.HardHat,

		common: lucide.Boxes,

		maintain: lucide.Wrench,

		mist: lucide.CloudFog,

		output: lucide.FileOutput,

		sidecar: lucide.Container,
	};

	const Icon = Map[Key] ?? lucide.Square;

	return (
		<Icon
			aria-hidden="true"
			strokeWidth={1.5}
			className="ml-2 inline h-4 w-4 align-[-3px] text-muted"
		/>
	);
};

/**
 * Semantic color map per architecture element ID.
 * Rust backends: ExtensionRust. Effect-TS layer: ExtensionEffectTypeScript.
 * TypeScript workbench: LanguageTypeScript/LanguageJavaScript.
 * Astro UI: ExtensionAstro. WASM sandbox: SpineWASM.
 * gRPC contracts: SpinegRPC. Network: SpineIPC.
 * Toolchain: ToolOxc/ToolEsBuild/ToolBiome. Node runtime: RuntimeNode.
 */
const TestimonialColorMap: Record<string, string> = {
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

// ── Quasi-random row ratios ────────────────────────────────────────────────

/**
 * Halton base-2 low-discrepancy sequence.
 * Deterministic, covers [0,1) evenly, never truly repeats a value.
 * Used instead of simplex noise here because it guarantees all ratio
 * buckets are visited across a small number of rows.
 */
const Halton = (Index: number): number => {
	let F = 1;

	let R = 0;

	let I = Index;

	while (I > 0) {
		F /= 2;

		R += F * (I % 2);

		I = Math.floor(I / 2);
	}

	return R;
};

/**
 * Fixed width ratios expressed as column spans in a 12-column grid.
 * The Halton sequence distributes row indices across all five buckets
 * without any two identical ratios appearing on consecutive rows.
 *
 *  50/50  -> [6, 6]
 *  58/42  -> [7, 5]   ~= 3:2
 *  42/58  -> [5, 7]   ~= 2:3
 *  67/33  -> [8, 4]   = 2:1
 *  33/67  -> [4, 8]   = 1:2
 */
const ROW_RATIOS: readonly [number, number][] = [
	[5, 7], // 42/58 (Halton 0.5  -> bucket 2)

	[7, 5], // 58/42 (Halton 0.25 -> bucket 1)

	[8, 4], // 67/33 (Halton 0.75 -> bucket 3)

	[6, 6], // 50/50 (Halton 0.125-> bucket 0)

	[8, 4], // 67/33 (Halton 0.625-> bucket 3)

	[7, 5], // 58/42 (Halton 0.375-> bucket 1)

	[4, 8], // 33/67 (Halton 0.875-> bucket 4)

	[6, 6], // 50/50 (Halton 0.062-> bucket 0)
] as const;

/**
 * Returns the [left, right] column-span pair for a given row.
 * Indexing pre-computed via Halton to guarantee unique-ratio spread.
 */
const GetRowRatio = (RowIndex: number): [number, number] => {
	const Noise = Halton(RowIndex + 1); // skip 0 -> starts at 0.5

	const BucketIndex = Math.min(Math.floor(Noise * 5), 4);

	const BUCKETS: readonly [number, number][] = [
		[6, 6],

		[7, 5],

		[5, 7],

		[8, 4],

		[4, 8],
	];

	return BUCKETS[BucketIndex];
};

// ── Component ──────────────────────────────────────────────────────────────

const DynamicTestimonials = ({ Content, ClassName }: Property) => {
	const {
		Title,
		Subtitle,
		Testimonial: Testimonials,
		Column: Columns = 3,
	} = Content;

	const GridReference = useRef<HTMLDivElement>(null);

	const IsMasonry = Columns === "masonry";

	const ColumnClass: Record<number, string> = {
		1: "grid-cols-1 max-w-3xl",

		2: "grid-cols-1 md:grid-cols-2 max-w-5xl",

		3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl",

		4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-6xl",

		5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 max-w-7xl",

		6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 max-w-7xl",
	};

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

			const Cards =
				Grid.querySelectorAll<HTMLElement>(".TestimonialCard");

			Cards.forEach((Card, Index) => {
				Attention.ApplyToElement(Card, Index, 5, 3);
			});

			const StaccatoModule =
				await import("../../Function/Noise/Staccato.js");

			const Engine = await StaccatoModule.default;

			Engine.SeedSelector(".TestimonialCard");
		};

		ApplyScatter();
	}, [Testimonials]);

	const RenderStars = (Rating: number = 0) => {
		if (Rating <= 0) return null;

		return (
			<div role="img" aria-label={`Rating: ${Rating} out of 5 stars`}>
				{Array.from({ length: 5 }).map((_, Index) => (
					<span
						key={Index}
						className="StaccatoStar StarRatingSymbol text-yellow-400"
						aria-hidden="true"
					>
						{Index < Rating ? "\u2605" : "\u2606"}
					</span>
				))}
			</div>
		);
	};

	if (IsMasonry) {
		return (
			<section
				id="testimonials"
				aria-label="Architecture"
				className={`w-full py-16 sm:py-20 ${ClassName || ""}`}
			>
				<div className="container mx-auto px-4">
					{(Title || Subtitle) && (
						<div className="mx-auto mb-10 max-w-2xl text-center">
							<p className="mb-4 font-mono text-sm uppercase tracking-[0.25em] text-muted">
								Architecture
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
						className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12"
					>
						{Testimonials.map((Testimonial, Index) => {
							const Row = Math.floor(Index / 2);

							const IsLeft = Index % 2 === 0;

							const IsLastOdd =
								Index === Testimonials.length - 1 &&
								Testimonials.length % 2 === 1;

							const [ColA, ColB] = GetRowRatio(Row);

							const ColSpan = IsLastOdd
								? 12
								: IsLeft
									? ColA
									: ColB;

							const AccentColor =
								TestimonialColorMap[Testimonial.Id] ??
								"var(--Primary)";

							return (
								<jelly-card
									key={Testimonial.Id}
									className="MasonryCard TestimonialCard flat p-5"
									style={
										{
											"--jelly-fill": "var(--Card)",
											"--jelly-radius": "0",
											"--jelly-card-font-size": "inherit",
											"--jelly-card-padding-block": "0",
											"--jelly-card-padding-inline": "0",
											"--jelly-color-border-default":
												"var(--ColorMuteBorder)",
											"--masonry-col": ColSpan,
										} as React.CSSProperties
									}
								>
									<div className="flex flex-col gap-3">
										{/* Name + glyph + GitHub link */}
										<div className="flex items-center justify-between gap-2">
											<div className="flex items-center gap-1.5">
												<span
													className="font-mono text-sm font-bold"
													style={{
														color: AccentColor,
													}}
												>
													{Testimonial.Href ? (
														<a
															href={
																Testimonial.Href
															}
															target="_blank"
															rel="noopener noreferrer"
															className="hover:underline"
														>
															{Testimonial.Author}
														</a>
													) : (
														Testimonial.Author
													)}
												</span>
												{Testimonial.Author && (
													<ElementGlyph
														Name={
															Testimonial.Author
														}
													/>
												)}
											</div>
											{Testimonial.Href && (
												<lucide.ExternalLink
													className="text-card-foreground/50 h-3 w-3 shrink-0"
													aria-hidden="true"
												/>
											)}
										</div>

										{/* Role → chips split by " - " */}
										{Testimonial.Role && (
											<div className="flex flex-wrap gap-1">
												{Testimonial.Role.split(
													" - ",
												).map((Tag, TagIndex) => (
													<span
														key={TagIndex}
														className="bg-mute px-2 py-0.5 font-mono text-sm tracking-wide text-foreground"
													>
														{Tag}
													</span>
												))}
											</div>
										)}

										{/* Lead - first line of the quote only */}
										<p className="text-sm leading-relaxed text-card-foreground">
											{Testimonial.Quote.split("\n")[0]}
										</p>
									</div>
								</jelly-card>
							);
						})}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section
			id="testimonials"
			aria-label="Architecture"
			className={`w-full py-16 sm:py-20 ${ClassName || ""}`}
		>
			<div className="container mx-auto px-4">
				{(Title || Subtitle) && (
					<div className="mx-auto mb-10 max-w-2xl text-center">
						<p className="mb-4 font-mono text-sm uppercase tracking-[0.25em] text-muted">
							Architecture
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
					className={`StaccatoMorphGap grid ${ColumnClass[Columns as number] ?? ColumnClass[3]} mx-auto gap-12`}
				>
					{Testimonials.map((Testimonial) => {
						const AccentColor =
							TestimonialColorMap[Testimonial.Id] ??
							"var(--Primary)";

						return (
							<jelly-card
								key={Testimonial.Id}
								className="TestimonialCard flat p-5"
								style={
									{
										"--jelly-fill": "var(--Card)",
										"--jelly-radius": "0",
										"--jelly-card-padding-block": "0",
										"--jelly-card-padding-inline": "0",
										"--jelly-color-border-default":
											"var(--ColorMuteBorder)",
									} as React.CSSProperties
								}
							>
								<div className="flex flex-col gap-3">
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-1.5">
											<span
												className="font-mono text-sm font-bold"
												style={{ color: AccentColor }}
											>
												{Testimonial.Href ? (
													<a
														href={Testimonial.Href}
														target="_blank"
														rel="noopener noreferrer"
														className="hover:underline"
													>
														{Testimonial.Author}
													</a>
												) : (
													Testimonial.Author
												)}
											</span>
											{Testimonial.Author && (
												<ElementGlyph
													Name={Testimonial.Author}
												/>
											)}
										</div>
										{Testimonial.Href && (
											<lucide.ExternalLink
												className="text-card-foreground/50 h-3 w-3 shrink-0"
												aria-hidden="true"
											/>
										)}
									</div>
									{Testimonial.Role && (
										<div className="flex flex-wrap gap-1">
											{Testimonial.Role.split(" - ").map(
												(Tag, TagIndex) => (
													<span
														key={TagIndex}
														className="bg-mute px-2 py-0.5 font-mono text-sm tracking-wide text-foreground"
													>
														{Tag}
													</span>
												),
											)}
										</div>
									)}
									<p className="text-sm leading-relaxed text-card-foreground">
										{Testimonial.Quote.split("\n")[0]}
									</p>
								</div>
							</jelly-card>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export { DynamicTestimonials };

export default DynamicTestimonials;
