"use client";

import { ThemeImage } from "@Library/Theme";

import * as lucide from "lucide-react";

import { useEffect, useRef, useState } from "react";

// ─── Term dictionary ──────────────────────────────────────────────────────────

type TermCategory =
	"Architecture" | "Telemetry" | "Protocol" | "Feature" | "License" | "Tool";

const TermDictionary = new Map<string, TermCategory>([
	// Architecture elements
	["Mountain", "Architecture"],

	["Cocoon", "Architecture"],

	["Wind", "Architecture"],

	["Sky", "Architecture"],

	["Air", "Architecture"],

	["Echo", "Architecture"],

	["Vine", "Architecture"],

	["Common", "Architecture"],

	["Rest", "Architecture"],

	["Mist", "Architecture"],

	["Grove", "Architecture"],

	["Worker", "Architecture"],

	["Sidecar", "Architecture"],

	// Feature flags / compile features
	["ExtensionHostCocoon", "Feature"],

	["MistNative", "Feature"],

	["AirIntegration", "Feature"],

	// Telemetry
	["Telemetry", "Telemetry"],

	["MetricsCollection", "Telemetry"],

	["DistributedTracing", "Telemetry"],

	["CrashReport", "Telemetry"],

	["TelemetryService", "Telemetry"],

	["TelemetryMock", "Telemetry"],

	// Protocols
	["gRPC", "Protocol"],

	["OTEL", "Protocol"],

	["OpenTelemetry", "Protocol"],

	["WebSocket", "Protocol"],

	["WASM", "Protocol"],

	["Rhai", "Protocol"],

	// Tools / Frameworks
	["Rust", "Tool"],

	["Tauri", "Tool"],

	["Effect-TS", "Tool"],

	["Cargo", "Tool"],

	["OXC", "Tool"],

	["SWC", "Tool"],

	["Electron", "Tool"],

	["TypeScript", "Tool"],

	["Astro", "Tool"],

	["Vite", "Tool"],

	["React", "Tool"],

	["Tailwind", "Tool"],

	["Node.js", "Tool"],

	["Biome", "Tool"],

	["Cloudflare", "Tool"],

	["Auth0", "Tool"],

	["pnpm", "Tool"],

	["esbuild", "Tool"],

	// License / Funding
	["CC0", "License"],

	["PGP", "License"],

	["NLnet", "License"],

	["NGI0", "License"],
]);

const CategoryStyle: Record<TermCategory, string> = {
	Architecture: "border-blue-200 text-blue-700",

	Telemetry: "border-yellow-200 text-yellow-700",

	Protocol: "border-purple-200 text-purple-700",

	Feature: "border-orange-200 text-orange-700",

	License: "border-green-200 text-green-700",

	Tool: "border-sky-200 text-sky-700",
};

const CategoryFill: Record<TermCategory, string> = {
	Architecture: "var(--SpineIPCMute)",
	Telemetry: "var(--ExtensionTauriMute)",
	Protocol: "var(--SpineWASMMute)",
	Feature: "var(--SpineTCPMute)",
	License: "var(--SpinegRPCMute)",
	Tool: "var(--ExtensionReactMute)",
};
const CategoryLabel: Record<TermCategory, string> = {
	Architecture: "Architecture element",

	Telemetry: "Telemetry feature",

	Protocol: "Protocol",

	Feature: "Compile feature flag",

	License: "License / Security",

	Tool: "Build tool / Framework",
};

const TermLogo: Record<string, string> = {
	Rust: "/Image/Rust.svg",

	Tauri: "/Image/Tauri.svg",

	"Effect-TS": "/Image/EffectTS.svg",

	Cargo: "/Image/Cargo.svg",

	TypeScript: "/Image/TypeScript.svg",

	Astro: "/Image/Astro.svg",

	Vite: "/Image/Vite.svg",

	React: "/Image/React.svg",

	Tailwind: "/Image/Tailwind.svg",

	"Node.js": "/Image/NodeJS.svg",

	WASM: "/Image/WASM.svg",

	gRPC: "/Image/gRPC.svg",

	Biome: "/Image/Biome.svg",

	CC0: "/Image/CC0.svg",

	NLnet: "/Image/NLnet.svg",

	Cloudflare: "/Image/Cloudflare.svg",

	Auth0: "/Image/Auth0.svg",

	OXC: "/Image/OXC.svg",

	SWC: "/Image/SWC.svg",

	Electron: "/Image/Electron.svg",

	Rhai: "/Image/Rhai.svg",

	Telemetry: "/Image/OpenTelemetry.svg",

	OpenTelemetry: "/Image/OpenTelemetry.svg",

	OTEL: "/Image/OpenTelemetry.svg",

	pnpm: "/Image/pnpm.svg",

	esbuild: "/Image/esbuild.svg",
};

// ─── Segment types ────────────────────────────────────────────────────────────

type Segment =
	| { Kind: "Text"; Value: string }
	| { Kind: "Code"; Value: string }
	| { Kind: "Em"; Value: string }
	| { Kind: "Term"; Value: string; Category: TermCategory };

// ─── Inline parser ────────────────────────────────────────────────────────────

const BuildTermPattern = () =>
	new RegExp(`\\b(${[...TermDictionary.keys()].join("|")})\\b`, "g");

const ParseInline = (Text: string, ShowTerms: boolean): Segment[] => {
	const Segments: Segment[] = [];

	const Parts = Text.split(/(`[^`]+`|\*[^*]+\*)/g);

	for (const Part of Parts) {
		if (Part.startsWith("`") && Part.endsWith("`") && Part.length > 2) {
			Segments.push({ Kind: "Code", Value: Part.slice(1, -1) });
			continue;
		}
		if (Part.startsWith("*") && Part.endsWith("*") && Part.length > 2) {
			Segments.push({ Kind: "Em", Value: Part.slice(1, -1) });
			continue;
		}
		if (ShowTerms) {
			const Pattern = BuildTermPattern();
			let LastIndex = 0;
			let Match: RegExpExecArray | null;
			while ((Match = Pattern.exec(Part)) !== null) {
				const TermName = Match[1];
				if (!TermName) continue;
				if (Match.index > LastIndex) {
					Segments.push({
						Kind: "Text",
						Value: Part.slice(LastIndex, Match.index),
					});
				}
				const Category = TermDictionary.get(TermName)!;
				Segments.push({ Kind: "Term", Value: TermName, Category });
				LastIndex = Match.index + TermName.length;
			}
			if (LastIndex < Part.length) {
				Segments.push({ Kind: "Text", Value: Part.slice(LastIndex) });
			}
		} else {
			if (Part.length > 0) Segments.push({ Kind: "Text", Value: Part });
		}
	}

	return Segments;
};

// ─── Copy button ─────────────────────────────────────────────────────────────

const CopyInlineButton = ({ Code }: { Code: string }) => {
	const [Copied, SetCopied] = useState(false);

	const HandleCopy = async () => {
		try {
			await navigator.clipboard.writeText(Code);
			SetCopied(true);
			setTimeout(() => SetCopied(false), 1800);
		} catch {
			// clipboard unavailable
		}
	};

	return (
		<button
			type="button"
			onClick={HandleCopy}
			aria-label={Copied ? "Copied" : "Copy to clipboard"}
			title={Copied ? "Copied" : "Copy to clipboard"}
			className="flat bg-mute ml-1 inline-flex h-[1.1em] w-[1.1em] shrink-0 items-center justify-center opacity-50 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--Ring)]"
		>
			{Copied ? (
				<lucide.Check
					className="h-[0.65em] w-[0.65em] text-green-600"
					aria-hidden="true"
				/>
			) : (
				<lucide.Copy
					className="h-[0.65em] w-[0.65em]"
					aria-hidden="true"
				/>
			)}
		</button>
	);
};

// ─── Segment renderer ─────────────────────────────────────────────────────────

const SegmentNode = ({ Segment }: { Segment: Segment }) => {
	switch (Segment.Kind) {
		case "Code":
			return (
				<span className="inline-flex items-baseline">
					<code className="flat bg-mute px-1.5 py-0.5 font-mono">
						{Segment.Value}
					</code>
					<CopyInlineButton Code={Segment.Value} />
				</span>
			);
		case "Em":
			return (
				<em className="font-medium not-italic text-foreground">
					{Segment.Value}
				</em>
			);
		case "Term": {
			const Logo = TermLogo[Segment.Value];
			const Style = CategoryStyle[Segment.Category];
			const Fill = CategoryFill[Segment.Category];
			return (
				<jelly-badge
					variant="platinum"
					shape="square"
					className={Style}
					title={`${CategoryLabel[Segment.Category]}: ${Segment.Value}`}
					aria-label={`${CategoryLabel[Segment.Category]} ${Segment.Value}`}
					style={
						{
							"--jelly-fill": Fill,
							"--jelly-label": "currentColor",
							"--jelly-badge-radius": "0px",
							"--jelly-badge-font-size": "0.78em",
						} as React.CSSProperties
					}
				>
					{Segment.Value}
					{Logo && (
						<>
							{"\u2001"}
							<ThemeImage
								src={Logo}
								alt=""
								width={12}
								height={12}
								className="inline-block align-middle opacity-60"
								aria-hidden="true"
							/>
						</>
					)}
				</jelly-badge>
			);
		}
		default:
			return <>{Segment.Value}</>;
	}
};

// ─── Line renderer ────────────────────────────────────────────────────────────

const CommandPrefixes = [
	"cargo ",
	"bash ",
	"./",
	"sh ",
	"pnpm ",
	"npm run ",
	"npm ",
	"git ",
];

const IsCommandString = (Text: string) =>
	CommandPrefixes.some((Prefix) => Text.trimStart().startsWith(Prefix));

const InlineSegments = ({
	Text,
	ShowTerms,
}: {
	Text: string;
	ShowTerms: boolean;
}) => (
	<>
		{ParseInline(Text, ShowTerms).map((Segment, Index) => (
			<SegmentNode key={Index} Segment={Segment} />
		))}
	</>
);

const LineNode = ({
	Line,
	ShowTerms,
}: {
	Line: string;
	ShowTerms: boolean;
}) => {
	const Trimmed = Line.trimStart();

	// "Enable with: cargo build ..." → label + copyable code + optional remainder
	const EnableMatch = Trimmed.match(
		/^(enable with:\s*)(cargo\s+[^.]+?)(\.\s*(.+))?$/i,
	);
	if (EnableMatch) {
		const Command = (EnableMatch[2] ?? "").trim();
		const Remainder = EnableMatch[4]?.trim();
		return (
			<>
				<span className="text-muted-foreground/80">
					{EnableMatch[1]}
				</span>
				<span className="inline-flex items-baseline">
					<code className="flat bg-mute px-1.5 py-0.5 font-mono">
						{Command}
					</code>
					<CopyInlineButton Code={Command} />
				</span>
				{Remainder && (
					<>
						{"."}
						<span className="ml-1">
							<InlineSegments
								Text={Remainder}
								ShowTerms={ShowTerms}
							/>
						</span>
					</>
				)}
			</>
		);
	}

	// "Sub-features: A, B, C" → label + comma-separated items as em
	const SubFeaturesMatch = Trimmed.match(/^(sub-features?:\s*)(.+)$/i);
	if (SubFeaturesMatch) {
		const Items = (SubFeaturesMatch[2] ?? "")
			.split(/,\s*/)
			.map((Item) => Item.trim().replace(/\.$/, ""))
			.filter(Boolean);
		return (
			<>
				<span className="text-muted-foreground/80">
					{SubFeaturesMatch[1]}
				</span>
				{Items.map((Item, Index) => (
					<span key={Item} className="inline-flex items-center">
						{Index > 0 && (
							<span className="mx-1 text-muted-foreground">
								,
							</span>
						)}
						{ShowTerms && TermDictionary.has(Item) ? (
							<span
								className={`flat inline-flex items-center border px-1.5 py-0.5 align-middle font-mono font-medium leading-normal ${CategoryStyle[TermDictionary.get(Item)!]}`}
								title={`${CategoryLabel[TermDictionary.get(Item)!]}: ${Item}`}
							>
								{Item}
							</span>
						) : (
							<em className="font-medium not-italic text-foreground">
								{Item}
							</em>
						)}
					</span>
				))}
			</>
		);
	}

	// "Default features: X, Y, Z" → label + badged feature names
	const DefaultFeaturesMatch = Trimmed.match(
		/^(default features?:\s*)(.+?)(\.\s*(.+))?$/i,
	);
	if (DefaultFeaturesMatch) {
		const Items = (DefaultFeaturesMatch[2] ?? "")
			.split(/,\s*/)
			.map((Item) => Item.trim())
			.filter(Boolean);
		const Remainder = DefaultFeaturesMatch[4]?.trim();
		return (
			<>
				<span className="text-muted-foreground/80">
					{DefaultFeaturesMatch[1]}
				</span>
				{Items.map((Item, Index) => (
					<span key={Item} className="inline-flex items-center">
						{Index > 0 && (
							<span className="mx-1 text-muted-foreground">
								,
							</span>
						)}
						{ShowTerms && TermDictionary.has(Item) ? (
							<span
								className={`flat inline-flex items-center border px-1.5 py-0.5 align-middle font-mono font-medium leading-normal ${CategoryStyle[TermDictionary.get(Item)!]}`}
								title={`${CategoryLabel[TermDictionary.get(Item)!]}: ${Item}`}
							>
								{Item}
							</span>
						) : (
							<code className="flat bg-mute px-1.5 py-0.5 font-mono">
								{Item}
							</code>
						)}
					</span>
				))}
				{Remainder && (
					<span className="ml-1">
						<InlineSegments
							Text={Remainder}
							ShowTerms={ShowTerms}
						/>
					</span>
				)}
			</>
		);
	}

	// Full command line (whole line is a shell command)
	if (IsCommandString(Trimmed)) {
		return (
			<span className="inline-flex items-baseline">
				<code className="flat bg-mute px-1.5 py-0.5 font-mono">
					{Trimmed}
				</code>
				<CopyInlineButton Code={Trimmed} />
			</span>
		);
	}

	// Plain line: parse inline segments (backtick code, *em*, term badges)
	return <InlineSegments Text={Line} ShowTerms={ShowTerms} />;
};

// ─── Main component ───────────────────────────────────────────────────────────

export interface RichTextProps {
	readonly Text: string;
	/** Enable auto-badging of tech terms from the dictionary. Default: false. */
	readonly Terms?: boolean;
	readonly ClassName?: string;
}

// ─── Typewriter core ──────────────────────────────────────────────────────────

/**
 * Read the current --StaccatoRaw value from the CSS custom property.
 * Returns 0 when Staccato hasn't started yet (SSR / before first tick).
 */
const ReadStaccatoRaw = (): number => {
	if (typeof document === "undefined") return 0;
	const Value = getComputedStyle(document.documentElement).getPropertyValue(
		"--StaccatoRaw",
	);
	return parseFloat(Value) || 0;
};

/**
 * Lerp a value toward a target by factor α (0-1).
 * At α = 0.12, a step of ~0.3ms toward target gives organic character timing.
 */
const Lerp = (Current: number, Target: number, Alpha: number): number =>
	Current + (Target - Current) * Alpha;

// ─── Main component ────────────────────────────────────────────────────────────

const RichText = ({ Text, Terms = false, ClassName }: RichTextProps) => {
	const [Revealed, SetRevealed] = useState(Text.length);
	const [IsAnimating, SetIsAnimating] = useState(false);

	const PreviousText = useRef(Text);
	const ContainerRef = useRef<HTMLSpanElement>(null);
	const AnimRef = useRef(0);
	/** Lerped character delay in ms - starts at 20ms, noise modulates it. */
	const LerpedDelay = useRef(20);
	const LastTime = useRef(performance.now());

	useEffect(() => {
		if (Text === PreviousText.current) return;

		// Respect reduced-motion preference - instant switch, no animation.
		if (
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			PreviousText.current = Text;
			SetRevealed(Text.length);
			return;
		}

		// Lock both dimensions so the element never collapses to zero
		// height/width during the typewriter reveal - a height collapse
		// causes the page to shrink and the browser snaps scroll to y=0.
		if (ContainerRef.current) {
			const Rect = ContainerRef.current.getBoundingClientRect();
			if (Rect.width > 0) {
				ContainerRef.current.style.minWidth = `${Rect.width}px`;
				ContainerRef.current.style.minHeight = `${Rect.height}px`;
				ContainerRef.current.style.display = "inline-block";
			}
		}

		PreviousText.current = Text;
		LerpedDelay.current = 20;
		LastTime.current = performance.now();
		cancelAnimationFrame(AnimRef.current);

		// Start from 0 characters revealed.
		SetIsAnimating(true);
		SetRevealed(0);

		let CharCount = 0;

		const Step = (Now: number): void => {
			// Noise-modulated character delay:
			// --StaccatoRaw ∈ [-1, 1] → target delay ∈ [8, 36] ms
			const NoiseRaw = ReadStaccatoRaw();
			const TargetDelay = 18 + (NoiseRaw + 1) * 0.5 * 18;
			LerpedDelay.current = Lerp(LerpedDelay.current, TargetDelay, 0.12);

			const Elapsed = Now - LastTime.current;
			if (Elapsed >= LerpedDelay.current) {
				CharCount++;
				SetRevealed(CharCount);
				LastTime.current = Now;

				if (CharCount >= Text.length) {
					SetIsAnimating(false);
					// Release dimension lock - allow natural reflow.
					if (ContainerRef.current) {
						ContainerRef.current.style.minWidth = "";
						ContainerRef.current.style.minHeight = "";
						ContainerRef.current.style.display = "";
					}
					return;
				}
			}

			AnimRef.current = requestAnimationFrame(Step);
		};

		AnimRef.current = requestAnimationFrame(Step);

		return () => cancelAnimationFrame(AnimRef.current);
	}, [Text]);

	// Feed the sliced text through the existing parser on every frame.
	const DisplayText = IsAnimating ? Text.slice(0, Revealed) : Text;
	const Paragraphs = DisplayText.split("\n\n").filter(Boolean);

	const RenderParagraph = (
		Paragraph: string,
		ParagraphIndex: number,
		IsLast: boolean,
	) => {
		const Lines = Paragraph.split("\n");
		return (
			<span key={ParagraphIndex} className="block">
				{Lines.map((Line, LineIndex) => {
					const IsLastLine = IsLast && LineIndex === Lines.length - 1;
					return (
						<span key={LineIndex}>
							{LineIndex > 0 && <br />}
							<LineNode Line={Line} ShowTerms={Terms} />
							{/* Cursor anchors to the last character of the last line */}
							{IsAnimating && IsLastLine && (
								<span
									className="StaccatoCursor"
									aria-hidden="true"
								/>
							)}
						</span>
					);
				})}
			</span>
		);
	};

	if (Paragraphs.length <= 1) {
		return (
			<span ref={ContainerRef} className={ClassName}>
				{RenderParagraph(DisplayText, 0, true)}
			</span>
		);
	}

	return (
		<span
			ref={ContainerRef}
			className={`block space-y-3 ${ClassName ?? ""}`}
		>
			{Paragraphs.map((Paragraph, Index) =>
				RenderParagraph(
					Paragraph,
					Index,
					Index === Paragraphs.length - 1,
				),
			)}
		</span>
	);
};

export { RichText };
export default RichText;
