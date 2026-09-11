/**
 * OpenGraph SVG template generator - Nocturnal Field Record artifact grammar.
 *
 * Produces a 1200×675 (16:9) SVG string for og:image / twitter:image social
 * sharing cards on every non-home page. Mirrors the field-record artifact
 * card used by the home endpoint (Source/pages/OpenGraph.svg.ts):
 *
 *   black frame → warm paper card (#F5F0E8) with # index, 〈stamp〉,
 *   /route, title, STATUS/LICENSE/TARGET info lines, evidence area with
 *   cross-hatch placeholder, one green seal. Flat corners, mono type only.
 *
 * Call sites keep the legacy (Title, Description, Section) signature; the
 * optional Meta argument carries per-page overrides (Slug, Index, Stamp,
 * Route, Status, License, Target, Seal) resolved from PageMetadata.ts at
 * the endpoint. Per-page variation flows through Title/Description/Section
 * plus the Status/License/Target fields on each PageMetadata entry.
 */

interface OpenGraphMeta {
	Slug?: string;
	Index?: string;
	Stamp?: string[];
	Route?: string[];
	Status?: string;
	License?: string;
	Target?: string;
	Seal?: string;
}

const WrapText = (Text: string, MaxCharacter: number): string[] => {
	const Word = Text.split(" ");

	const Line: string[] = [];

	let Current = "";

	for (const W of Word) {
		if (
			Current.length + W.length + 1 > MaxCharacter &&
			Current.length > 0
		) {
			Line.push(Current);

			Current = W;
		} else {
			Current = Current.length > 0 ? `${Current} ${W}` : W;
		}
	}

	if (Current.length > 0) Line.push(Current);

	return Line;
};

const EscapeXML = (Text: string): string =>
	Text.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");

/**
 * Generates a field-record artifact SVG at 1200×675 (16:9).
 *
 * Structure:
 * - Black frame (outer border)
 * - Warm paper card with index, stamp, route, title, status, metadata
 * - Evidence image area (right panel with cross-hatch placeholder + caption)
 * - One green seal (bottom-right of evidence area)
 */
const GenerateOpenGraphSvg = (
	Title: string,
	Description: string,
	Section?: string,
	Meta?: OpenGraphMeta,
): string => {
	const Width = 1200;
	const Height = 675;

	const FrameWidth = 16;
	const CardInset = 24;
	const PaperColor = "#F5F0E8";
	const FrameColor = "#151515";
	const MutedColor = "#6b6b6b";
	const SealColor = "#2D6A4F";
	const FontStack = "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace";

	const SectionName =
		Section ?? Meta?.Slug?.split("/")[0] ?? "Land";

	const SectionUpper = SectionName.toUpperCase();

	const CardX = FrameWidth + CardInset;
	const CardY = FrameWidth + CardInset;
	const CardW = Width - 2 * (FrameWidth + CardInset);
	const CardH = Height - 2 * (FrameWidth + CardInset);

	// Split: text left (~52%), evidence right (~48%)
	const SplitX = CardX + Math.round(CardW * 0.52);
	const TextX = CardX + 28;
	const TextW = SplitX - CardX - 44;
	const EvidenceX = SplitX + 12;
	const EvidenceW = CardX + CardW - EvidenceX - 28;

	// Compose stamp: 〈STAMP〉
	const StampText = (Meta?.Stamp ?? [SectionUpper])
		.map((Stamp) => `〈${Stamp}〉`)
		.join(" ");

	// Compose route: /ROUTE
	const RouteText = (Meta?.Route ?? [SectionName])
		.map((Route) => (Route.startsWith("/") ? Route : `/${Route}`))
		.join(" · ");

	// Index / catalogue number: # SECTION_01
	const IndexText = Meta?.Index ?? `# ${SectionUpper}_01`;

	// Info lines: STATUS / LICENSE / TARGET (per-page values from PageMetadata)
	const InfoLines = [
		`STATUS: ${Meta?.Status ?? "READY"}`,
		`LICENSE: ${Meta?.License ?? "CC0"}`,
		`TARGET: ${Meta?.Target ?? "OPEN SOURCE"}`,
	];

	// Title: wrap for the mono measure, clamp to two lines
	const TitleLines = WrapText(Title, 22).slice(0, 2);

	const TitleFontSize = TitleLines.length > 1 ? 30 : 38;

	const TitleLineHeight = Math.round(TitleFontSize * 1.35);

	const TitleStartY =
		TitleLines.length > 1 ? CardY + 168 : CardY + 192;

	const TitleElement = TitleLines.map(
		(Line, Index) =>
			`\t<text x="${TextX}" y="${TitleStartY + Index * TitleLineHeight}" font-family="${FontStack}" font-size="${TitleFontSize}" font-weight="500" fill="${FrameColor}" letter-spacing="0.02em">${EscapeXML(Line)}</text>`,
	).join("\n");

	// Thin separator under the title
	const SeparatorY = TitleStartY + TitleLines.length * TitleLineHeight + 14;

	// Status / License / Target info lines
	const InfoStartY = SeparatorY + 30;

	const InfoLineHeight = 30;

	const InfoElements = InfoLines.map(
		(Line, Index) =>
			`\t<text x="${TextX}" y="${InfoStartY + Index * InfoLineHeight}" font-family="${FontStack}" font-size="13" font-weight="400" fill="${MutedColor}" letter-spacing="0.02em">${EscapeXML(Line)}</text>`,
	).join("\n");

	// Evidence image area geometry
	const EvdX = EvidenceX + 16;
	const EvdY = CardY + 28;
	const EvdW = EvidenceW - 32;
	const EvdH = CardH - 100;

	// Evidence caption (per-page description), bottom of the evidence panel
	const CaptionLines = WrapText(Description, 58).slice(0, 4);

	const CaptionStartY = EvdY + EvdH - CaptionLines.length * 19 - 8;

	const CaptionElement = CaptionLines.map(
		(Line, Index) =>
			`\t<text x="${EvdX + 18}" y="${CaptionStartY + Index * 19}" font-family="${FontStack}" font-size="12" font-weight="400" fill="${MutedColor}" fill-opacity="0.8" letter-spacing="0.02em">${EscapeXML(Line)}</text>`,
	).join("\n");

	// Seal position (bottom-right of evidence area)
	const SealCx = EvidenceX + EvidenceW - 52;
	const SealCy = CardY + CardH - 52;

	const SealText = (Meta?.Seal ?? "Land").slice(0, 5).toUpperCase();

	return `<svg width="${Width}" height="${Height}" viewBox="0 0 ${Width} ${Height}" xmlns="http://www.w3.org/2000/svg">
\t<!-- Black frame -->
\t<rect width="${Width}" height="${Height}" fill="${FrameColor}" />

\t<!-- Warm paper card -->
\t<rect x="${CardX}" y="${CardY}" width="${CardW}" height="${CardH}" fill="${PaperColor}" />

\t<!-- Subtle inner rule -->
\t<rect x="${CardX + 12}" y="${CardY + 12}" width="${CardW - 24}" height="${CardH - 24}" fill="none" stroke="${FrameColor}" stroke-opacity="0.06" stroke-width="1" />

\t<!-- Index / catalogue number -->
\t<text x="${TextX}" y="${CardY + 60}" font-family="${FontStack}" font-size="20" font-weight="600" fill="${FrameColor}" letter-spacing="0.04em">${EscapeXML(IndexText)}</text>

\t<!-- Stamp -->
\t<text x="${TextX}" y="${CardY + 96}" font-family="${FontStack}" font-size="14" font-weight="400" fill="${MutedColor}" letter-spacing="0.02em">${EscapeXML(StampText)}</text>

\t<!-- Route -->
\t<text x="${TextX}" y="${CardY + 124}" font-family="${FontStack}" font-size="13" font-weight="400" fill="${MutedColor}" letter-spacing="0.02em">${EscapeXML(RouteText)}</text>

\t<!-- Title -->
${TitleElement}

\t<!-- Thin separator -->
\t<line x1="${TextX}" y1="${SeparatorY}" x2="${TextX + TextW}" y2="${SeparatorY}" stroke="${FrameColor}" stroke-opacity="0.1" stroke-width="1" />

\t<!-- Status / License / Target info lines -->
${InfoElements}
\t<!-- Evidence panel -->
\t<rect x="${EvidenceX}" y="${CardY + 16}" width="${EvidenceW}" height="${CardH - 32}" fill="${FrameColor}" fill-opacity="0.03" />
\t<rect x="${EvidenceX}" y="${CardY + 16}" width="${EvidenceW}" height="${CardH - 32}" fill="none" stroke="${FrameColor}" stroke-opacity="0.08" stroke-width="1" />

\t<!-- Evidence image placeholder -->
\t<rect x="${EvdX}" y="${EvdY}" width="${EvdW}" height="${EvdH}" fill="${FrameColor}" fill-opacity="0.05" />

\t<!-- Cross-hatch placeholder for evidence image -->
\t<line x1="${EvdX}" y1="${EvdY}" x2="${EvdX + EvdW}" y2="${EvdY + EvdH}" stroke="${FrameColor}" stroke-opacity="0.06" stroke-width="1" />
\t<line x1="${EvdX + EvdW}" y1="${EvdY}" x2="${EvdX}" y2="${EvdY + EvdH}" stroke="${FrameColor}" stroke-opacity="0.06" stroke-width="1" />
\t<line x1="${EvdX + EvdW / 2}" y1="${EvdY}" x2="${EvdX + EvdW / 2}" y2="${EvdY + EvdH}" stroke="${FrameColor}" stroke-opacity="0.04" stroke-width="1" />
\t<line x1="${EvdX}" y1="${EvdY + EvdH / 2}" x2="${EvdX + EvdW}" y2="${EvdY + EvdH / 2}" stroke="${FrameColor}" stroke-opacity="0.04" stroke-width="1" />

\t<!-- Evidence caption -->
${CaptionElement}
\t<!-- Green seal -->
\t<circle cx="${SealCx}" cy="${SealCy}" r="34" fill="${SealColor}" />
\t<circle cx="${SealCx}" cy="${SealCy}" r="30" fill="none" stroke="${PaperColor}" stroke-width="1.5" />
\t<text x="${SealCx}" y="${SealCy + 5}" font-family="${FontStack}" font-size="12" font-weight="600" fill="${PaperColor}" text-anchor="middle" letter-spacing="0.05em">${EscapeXML(SealText)}</text>

\t<!-- Footer -->
\t<text x="${TextX}" y="${CardY + CardH - 18}" font-family="${FontStack}" font-size="11" font-weight="400" fill="${MutedColor}" fill-opacity="0.45">editor.land</text>
\t<text x="${CardX + CardW - 28}" y="${CardY + CardH - 18}" font-family="${FontStack}" font-size="10" font-weight="400" fill="${MutedColor}" fill-opacity="0.4" text-anchor="end">field record · ${EscapeXML(SectionName.toLowerCase())}</text>
</svg>`;
};

export default GenerateOpenGraphSvg;