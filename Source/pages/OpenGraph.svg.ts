/**
 * Home page OpenGraph SVG endpoint.
 *
 * Serves /OpenGraph.svg - the og:image for the root page.
 * Renders a field-record artifact card using the Land record.
 * All other pages use /OpenGraph/[Slug].svg via the [...Slug].svg.ts endpoint.
 */

import type { APIRoute } from "astro";
import type { FieldRecord } from "../Content/Record/FieldRecord";

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
 * - Evidence image area (right panel with cross-hatch placeholder)
 * - One green seal (bottom-right of evidence area)
 *
 * Varies by record: Product/Element/Release/Document each carry their own
 * Index, Stamp, Route, Title, Status, Metadata, and Seal.
 */
const GenerateFieldRecordSvg = (Record: FieldRecord): string => {
	const Width = 1200;
	const Height = 675;

	const FrameWidth = 16;
	const CardInset = 24;
	const PaperColor = "#F5F0E8";
	const FrameColor = "#151515";
	const MutedColor = "#6b6b6b";
	const SealColor = "#2D6A4F";

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

	// Compose stamp: 〈STAMP〉 〈STAMP〉
	const StampText = Record.Stamp.map((s) => `〈${s}〉`).join(" ");

	// Compose route: /ROUTE · /ROUTE
	const RouteText = Record.Route.join("\u2001");

	// Info lines from Status + Metadata
	const InfoLines: string[] = [];
	InfoLines.push(`${Record.Status.Label}: ${Record.Status.Value}`);
	for (const Meta of Record.Metadata) {
		InfoLines.push(`${Meta.Label}: ${Meta.Value}`);
	}

	// Program text
	const ProgramText = Record.Program?.join("   ") ?? "";

	// Evidence image area geometry
	const EvdX = EvidenceX + 16;
	const EvdY = CardY + 28;
	const EvdW = EvidenceW - 32;
	const EvdH = CardH - 100;

	// Seal position (bottom-right of evidence area)
	const SealCx = EvidenceX + EvidenceW - 52;
	const SealCy = CardY + CardH - 52;

	const InfoStartY = CardY + 260;
	const InfoLineHeight = 30;

	const InfoElements = InfoLines.map(
		(Line, i) =>
			`\t<text x="${TextX}" y="${InfoStartY + i * InfoLineHeight}" font-family="'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" font-size="13" font-weight="400" fill="${MutedColor}" letter-spacing="0.02em">${EscapeXML(Line)}</text>`,
	).join("\n");

	const ProgramElement = ProgramText
		? `\t<text x="${TextX}" y="${CardY + CardH - 52}" font-family="'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" font-size="11" font-weight="400" fill="${MutedColor}" fill-opacity="0.65" letter-spacing="0.04em">${EscapeXML(ProgramText)}</text>\n`
		: "";

	return `<svg width="${Width}" height="${Height}" viewBox="0 0 ${Width} ${Height}" xmlns="http://www.w3.org/2000/svg">
	<!-- Black frame -->
	<rect width="${Width}" height="${Height}" fill="${FrameColor}" />

	<!-- Warm paper card -->
	<rect x="${CardX}" y="${CardY}" width="${CardW}" height="${CardH}" fill="${PaperColor}" />

	<!-- Subtle inner rule -->
	<rect x="${CardX + 12}" y="${CardY + 12}" width="${CardW - 24}" height="${CardH - 24}" fill="none" stroke="${FrameColor}" stroke-opacity="0.06" stroke-width="1" />

	<!-- Index / catalogue number -->
	<text x="${TextX}" y="${CardY + 60}" font-family="'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" font-size="20" font-weight="600" fill="${FrameColor}" letter-spacing="0.04em">${EscapeXML(Record.Index)}</text>

	<!-- Stamp -->
	<text x="${TextX}" y="${CardY + 96}" font-family="'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" font-size="14" font-weight="400" fill="${MutedColor}" letter-spacing="0.02em">${EscapeXML(StampText)}</text>

	<!-- Route -->
	<text x="${TextX}" y="${CardY + 124}" font-family="'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" font-size="13" font-weight="400" fill="${MutedColor}" letter-spacing="0.02em">${EscapeXML(RouteText)}</text>

	<!-- Title -->
	<text x="${TextX}" y="${CardY + 192}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="38" font-weight="800" fill="${FrameColor}">${EscapeXML(Record.Title)}</text>

	<!-- Thin separator -->
	<line x1="${TextX}" y1="${CardY + 214}" x2="${TextX + TextW}" y2="${CardY + 214}" stroke="${FrameColor}" stroke-opacity="0.1" stroke-width="1" />

	<!-- Status / Metadata info lines -->
${InfoElements}
${ProgramElement}	<!-- Evidence panel -->
	<rect x="${EvidenceX}" y="${CardY + 16}" width="${EvidenceW}" height="${CardH - 32}" fill="${FrameColor}" fill-opacity="0.03" />
	<rect x="${EvidenceX}" y="${CardY + 16}" width="${EvidenceW}" height="${CardH - 32}" fill="none" stroke="${FrameColor}" stroke-opacity="0.08" stroke-width="1" />

	<!-- Evidence image placeholder -->
	<rect x="${EvdX}" y="${EvdY}" width="${EvdW}" height="${EvdH}" fill="${FrameColor}" fill-opacity="0.05" />

	<!-- Cross-hatch placeholder for evidence image -->
	<line x1="${EvdX}" y1="${EvdY}" x2="${EvdX + EvdW}" y2="${EvdY + EvdH}" stroke="${FrameColor}" stroke-opacity="0.06" stroke-width="1" />
	<line x1="${EvdX + EvdW}" y1="${EvdY}" x2="${EvdX}" y2="${EvdY + EvdH}" stroke="${FrameColor}" stroke-opacity="0.06" stroke-width="1" />
	<line x1="${EvdX + EvdW / 2}" y1="${EvdY}" x2="${EvdX + EvdW / 2}" y2="${EvdY + EvdH}" stroke="${FrameColor}" stroke-opacity="0.04" stroke-width="1" />
	<line x1="${EvdX}" y1="${EvdY + EvdH / 2}" x2="${EvdX + EvdW}" y2="${EvdY + EvdH / 2}" stroke="${FrameColor}" stroke-opacity="0.04" stroke-width="1" />

	<!-- Green seal -->
	<circle cx="${SealCx}" cy="${SealCy}" r="34" fill="${SealColor}" />
	<circle cx="${SealCx}" cy="${SealCy}" r="30" fill="none" stroke="${PaperColor}" stroke-width="1.5" />
	<text x="${SealCx}" y="${SealCy + 5}" font-family="'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" font-size="12" font-weight="700" fill="${PaperColor}" text-anchor="middle" letter-spacing="0.05em">${EscapeXML(Record.Seal).slice(0, 5).toUpperCase()}</text>

	<!-- Footer -->
	<text x="${TextX}" y="${CardY + CardH - 18}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="11" font-weight="400" fill="${MutedColor}" fill-opacity="0.45">editor.land</text>
	<text x="${CardX + CardW - 28}" y="${CardY + CardH - 18}" font-family="'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" font-size="10" font-weight="400" fill="${MutedColor}" fill-opacity="0.4" text-anchor="end">field record{"\u2001"}${Record.Category.toLowerCase()}</text>
</svg>`;
};

export const GET: APIRoute = async () => {
	const { Land } = await import("../Content/Record/Land");

	const Svg = GenerateFieldRecordSvg(Land);

	return new Response(Svg, {
		status: 200,
		headers: {
			"Content-Type": "image/svg+xml",
			"Cache-Control": "public, max-age=86400",
		},
	});
};
