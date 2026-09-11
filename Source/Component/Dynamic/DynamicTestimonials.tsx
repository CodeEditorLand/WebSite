import * as lucide from "lucide-react";

import { Fragment, useEffect, useRef } from "react";

import { RichText } from "../UI/RichText.js";

import { FieldRecordSeal } from "../Brand/FieldRecordSeal.js";

import type { FieldRecord } from "../../Content/Record/FieldRecord.js";

import { Air } from "../../Content/Record/Air.js";

import { Cocoon } from "../../Content/Record/Cocoon.js";

import { Echo } from "../../Content/Record/Echo.js";

import { Grove } from "../../Content/Record/Grove.js";

import { Mountain } from "../../Content/Record/Mountain.js";

import { Sky } from "../../Content/Record/Sky.js";

import { Wind } from "../../Content/Record/Wind.js";

import type Item from "./Interface/Item/Testimonial.js";

import type Property from "./Interface/Property/Testimonial.js";

/**
 * Architecture-element glyph: the official emoji per element, sourced from the
 * element README header table (Land/Element/<Name>/README.md line 1 - the
 * Readme-Element standard's "emoji cell", the project's visual identity) and
 * corroborated by the per-element doc pages (WebSite/Source/Content/doc/*.md)
 * and the HomePage Testimonial Emoji data. Falls back to the spec's neutral ◎
 * (U+25CE) functional symbol for unknown names (design_system.md §Functional
 * symbols - design_system.md assigns SVG seals, not emoji, to the 8 core
 * records; the official emoji placement lives in the element READMEs).
 */
const ElementGlyph = ({ Name }: { Name?: string }) => {
	const Key = (Name ?? "").toLowerCase();

	const Map: Record<string, string> = {
		mountain: "⛰️",

		cocoon: "🦋",

		wind: "🍃",

		sky: "🌌",

		air: "🪁",

		echo: "📣",

		grove: "🌳",

		vine: "🌿",

		rest: "⛱️",

		worker: "🍩",

		common: "🧑🏼‍🏭",

		maintain: "💪🏼",

		mist: "🌫️",

		output: "⚫",

		sidecar: "🚃",
	};

	const Glyph = Map[Key] ?? "◎";

	return (
		<span
			aria-hidden="true"
			className="ml-2 inline-block text-lg leading-none"
		>
			{Glyph}
		</span>
	);
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

// ── Field-record layer ─────────────────────────────────────────────────────

/**
 * Per-element field records (Source/Content/Record/*.ts) keyed by element name.
 * The 8 core records exist (Land, Mountain, Cocoon, Wind, Sky, Air, Echo,
 * Grove); only those present here are among the architecture cards. The
 * extended architecture elements (Common, Maintain, Mist, Output, Rest,
 * SideCar, Vine, Worker) have no record - their cards keep the record index
 * convention (# <ELEMENT>_01) and the spec's ◎ (U+25CE) fallback seal, and
 * omit the stamp / route / status / metadata / evidence rows (nothing to
 * derive - never invented).
 */
const ElementRecords: Record<string, FieldRecord> = {
	Air,

	Cocoon,

	Echo,

	Grove,

	Mountain,

	Sky,

	Wind,
};

/**
 * Compact record-card body: the field-record grammar (# INDEX, 〈claim〉,
 * /ROUTE, STATUS:/metadata rows, seal upper-right, evidence crop placeholder)
 * layered on top of the existing name + emoji + role-chip + quote work.
 * Warm-white flat mono uppercase tracked font-medium dark-ink, no XS.
 */
const RenderTestimonialBody = ({
	Testimonial,
}: {
	Testimonial: Item;
}) => {
	const ElementRecord = ElementRecords[Testimonial.Author];

	return (
		<div className="flex flex-col gap-3">
			{/* Record index + upper-right seal (SVG where Public/Seal has one, else ◎) */}
			<div className="flex items-start justify-between gap-2">
				<span className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-card-foreground">
					{ElementRecord?.Index ??
						`# ${Testimonial.Author.toUpperCase()}_01`}
				</span>
				{ElementRecord ? (
					<FieldRecordSeal
						element={ElementRecord.Seal}
						size={40}
						className="shrink-0"
					/>
				) : (
					<span
						aria-hidden="true"
						className="font-mono text-sm leading-none text-card-foreground opacity-60"
					>
						◎
					</span>
				)}
			</div>

			{/* Name + glyph + GitHub link */}
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-1.5">
					<span className="font-mono text-lg font-medium text-card-foreground">
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
						<ElementGlyph Name={Testimonial.Author} />
					)}
				</div>
				{Testimonial.Href && (
					<a
						href={Testimonial.Href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Open ${Testimonial.Author} source`}
						className="text-[color-mix(in_srgb,var(--CardForeground)_50%,transparent)] inline-flex items-center transition-colors hover:text-card-foreground"
					>
						<lucide.ExternalLink
							className="h-3 w-3 shrink-0"
							aria-hidden="true"
						/>
					</a>
				)}
			</div>

			{/* Role → keyword chips split by em-space (U+2001) or legacy " - " */}
			{Testimonial.Role && (
				<div className="flex flex-wrap text-card-foreground">
					{Testimonial.Role.split(/\u2001| - /).map(
						(Tag, TagIndex) => (
							<Fragment key={TagIndex}>
								{TagIndex > 0 && "\u2001"}
								<code className="flat bg-[color-mix(in_srgb,currentColor_10%,transparent)] px-1.5 py-0.5 font-mono text-sm">
									{Tag}
								</code>
							</Fragment>
						),
					)}
				</div>
			)}

			{/* Field-record rows from the element record */}
			{ElementRecord && (
				<div className="flex flex-col gap-1">
					{ElementRecord.Stamp?.length > 0 && (
						<p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-card-foreground">
							〈{ElementRecord.Stamp.join("\u2001")}〉
						</p>
					)}
					{ElementRecord.Route?.length > 0 && (
						<p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-card-foreground opacity-70">
							{ElementRecord.Route.join("\u2001")}
						</p>
					)}
					<p
						className={`font-mono text-sm font-medium uppercase tracking-[0.2em] ${
							ElementRecord.Status.Tone === "specimen"
								? "text-accent"
								: "text-card-foreground"
						}`}
					>
						STATUS: {ElementRecord.Status.Value}
					</p>
					{ElementRecord.Metadata.length > 0 && (
						<p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-card-foreground opacity-70">
							{ElementRecord.Metadata[0].Label}:{" "}
							{ElementRecord.Metadata[0].Value}
						</p>
					)}
				</div>
			)}

			{/* Lead - first line of the quote only */}
			<p className="text-sm leading-relaxed text-card-foreground">
				{Testimonial.Quote.split("\n")[0]}
			</p>

			{/* Evidence crop placeholder - only where the element record defines one */}
			{ElementRecord && (
				<div
					role="img"
					aria-label={ElementRecord.Evidence.Alt}
					title={ElementRecord.Evidence.Alt}
					className="h-14 w-full border border-[color-mix(in_srgb,var(--CardForeground)_15%,transparent)] bg-[color-mix(in_srgb,var(--CardForeground)_8%,transparent)]"
				/>
			)}
		</div>
	);
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

							return (
								<jelly-card
									key={Testimonial.Id}
									className="MasonryCard TestimonialCard flat p-5"
									style={
										{
											"--jelly-fill": "var(--Card)",
											"--jelly-radius": "0",
											"--jelly-card-font-size":
												"inherit",
											"--jelly-card-padding-block": "0",
											"--jelly-card-padding-inline": "0",
											"--jelly-color-border-default":
												"var(--ColorMuteBorder)",
											"--masonry-col": ColSpan,
										} as React.CSSProperties
									}
								>
									<RenderTestimonialBody
										Testimonial={Testimonial}
									/>
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
								<RenderTestimonialBody
									Testimonial={Testimonial}
								/>
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