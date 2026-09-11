import * as lucide from "lucide-react";

import { useEffect, useRef } from "react";

import { IconTooltip } from "../UI/IconTooltip.js";

import { RichText } from "../UI/RichText.js";

import { DynamicBadge } from "./DynamicBadge";

import { DynamicButton } from "./DynamicButton";

import { FieldRecordDataCard } from "../Brand/FieldRecordDataCard.js";

import { FieldRecordEvidence } from "../Brand/FieldRecordEvidence.js";

import { FieldRecordIndex } from "../Brand/FieldRecordIndex.js";

import { FieldRecordMetadata } from "../Brand/FieldRecordMetadata.js";

import { FieldRecordSeal } from "../Brand/FieldRecordSeal.js";

import { FieldRecordAction } from "../Brand/FieldRecordAction.js";

import { FieldRecordStatus } from "../Brand/FieldRecordStatus.js";

import type Property from "./Interface/Property/Hero.js";

/**
 * Dynamic HeroSection - Nocturnal Field Record.
 *
 * Two-panel artifact:
 *   LEFT: warm-white data card with field-record grammar
 *   RIGHT: full-bleed evidence image
 *
 * Hierarchy (per design_system.md + further_design_system.md):
 *   # LAND_01 → 〈21.09.26〉〈20:18〉 (oversized bracketed timestamp,
 *   strongest top hierarchy) → 〈RUST + TAURI〉 → 〈NO ELECTRON〉 →
 *   /COMPAT:VS CODE → WALK · LISTEN · SIGNAL → NATIVE · OPEN ·
 *   CROSS-PLATFORM → STATUS: SOURCE ACTIVE → [MAJOR BLANK ZONE] →
 *   LAND: → ↳EDITOR WITHOUT CHROMIUM → TARGET / LICENSE / SIGNAL →
 *   SPECIES / TEMP / WIND → [ENTER]
 *
 * Animation logic (simplex noise, Staccato, Attention) preserved unchanged.
 */
const DynamicHeroSection = ({ Content, ClassName }: Property) => {
	const SceneReference = useRef<HTMLDivElement>(null);

	const SectionReference = useRef<HTMLElement>(null);

	const {
		Title,
		TitleHighlight,
		Subtitle,
		PrimaryCTA: PrimaryCTA,
		SecondaryCTA: SecondaryCTA,
		FloatingCard: FloatingCard = [],
		...HeroConfiguration
	} = Content;

	useEffect(() => {
		const Scene = SceneReference.current;

		if (
			!Scene ||
			(HeroConfiguration.RespectReducedMotion &&
				window.matchMedia("(prefers-reduced-motion: reduce)").matches)
		) {
			return;
		}

		const CardElement =
			Scene.querySelectorAll<HTMLElement>(".FloatingCard");

		let FrameIdentifier: number;

		let NoiseFunction: ((X: number, Y: number) => number) | null = null;

		interface CardState {
			CurrentX: number;

			CurrentY: number;

			IsHovered: boolean;
		}

		const CardStates = new Map<HTMLElement, CardState>();

		const LoadNoise = async () => {
			const { createNoise2D } = await import("simplex-noise");

			NoiseFunction = createNoise2D();

			const StaccatoModule =
				await import("../../Function/Noise/Staccato.js");

			const Engine = await StaccatoModule.default;

			CardElement.forEach((Card, Index) => {
				Engine.SeedElement(Card, Index);

				const State: CardState = {
					CurrentX: 0,

					CurrentY: 0,

					IsHovered: false,
				};

				CardStates.set(Card, State);

				Card.addEventListener("mouseenter", () => {
					State.IsHovered = true;
				});

				Card.addEventListener("mouseleave", () => {
					State.IsHovered = false;
				});
			});

			const AttentionModule =
				await import("../../Function/Noise/Attention.js");

			const Attention = await AttentionModule.default;

			Attention.ApplyToSelector(".FloatingCard", 6, 4);
		};

		const AnimateCards = (Time: number) => {
			if (!NoiseFunction) {
				FrameIdentifier = requestAnimationFrame(AnimateCards);

				return;
			}

			const TimeFactor = Time * 0.00007;

			CardElement.forEach((Card, Index) => {
				const State = CardStates.get(Card);

				if (!State) return;

				const Seed = Index * 1.3;

				const TargetX = State.IsHovered
					? 0
					: NoiseFunction!(TimeFactor + Seed, Seed * 0.4) * 5;

				const TargetY = State.IsHovered
					? 0
					: NoiseFunction!(Seed * 0.4, TimeFactor + Seed) * 3.5;

				State.CurrentX += (TargetX - State.CurrentX) * 0.04;

				State.CurrentY += (TargetY - State.CurrentY) * 0.04;

				Card.style.transform = `translate(-50%, -50%) translate3d(${State.CurrentX.toFixed(2)}px, ${State.CurrentY.toFixed(2)}px, 0)`;
			});

			FrameIdentifier = requestAnimationFrame(AnimateCards);
		};

		LoadNoise();

		FrameIdentifier = requestAnimationFrame(AnimateCards);

		return () => {
			cancelAnimationFrame(FrameIdentifier);

			CardElement.forEach((Card) => {
				const Fresh: CardState = {
					CurrentX: 0,

					CurrentY: 0,

					IsHovered: false,
				};

				CardStates.set(Card, Fresh);
			});
		};
	}, [HeroConfiguration.RespectReducedMotion]);

	const HandleHeroClick = () => {
		if (PrimaryCTA?.Href) {
			window.location.href = PrimaryCTA.Href;
		}
	};

	return (
		<section
			ref={SectionReference}
			id="hero"
			aria-label="Hero"
			className={`relative w-full overflow-hidden ${ClassName || ""}`}
			onClick={HandleHeroClick}
			onKeyDown={(Event) => {
				if (Event.key === "Enter" || Event.key === " ") {
					Event.preventDefault();

					HandleHeroClick();
				}
			}}
			role="button"
			tabIndex={0}
		>
			{/* Nocturnal Field Record: faint grid on black canvas */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
				style={{ backgroundColor: "var(--Background)" }}
			/>

			{/* ── TWO-PANEL ARTIFACT ── */}
			<div
				className="relative mx-auto flex min-h-[80dvh] flex-col md:flex-row"
				style={{
					padding: "clamp(2rem, 5vw, 5rem)",
					gap: "clamp(0.5rem, 1.5vw, 1.875rem)",
				}}
			>
				{/* ══ LEFT: Warm-white data card ══ */}
				<div className="flex flex-1 flex-col justify-center">
					<FieldRecordDataCard className="h-full">
						<div className="flex h-full flex-col justify-between">
							{/* Top: Index + Seal */}
							<div className="flex items-start justify-between">
								<FieldRecordIndex index="LAND_01" />

								<FieldRecordSeal element="Land" />
							</div>

							{/* Oversized bracketed timestamp — strongest top hierarchy (design_system.md §Text syntax / Template copy:154, 174-175) */}
							<div className="mt-10">
								<p className="text-field-xl font-mono font-normal leading-[0.95] tracking-[-0.02em] text-card-foreground">
									〈21.09.26〉
								</p>

								<p className="text-field-l mt-2 font-mono font-normal leading-[1.0] tracking-[-0.02em] text-card-foreground">
									〈20:18〉
								</p>
							</div>

							{/* Middle: Oversized stamp */}
							<div className="mt-10">
								<p className="text-field-xl font-mono font-normal leading-[0.95] tracking-[-0.02em] text-card-foreground">
									〈RUST + TAURI〉
								</p>

								<p className="text-field-l mt-2 font-mono font-normal leading-[1.0] tracking-[-0.02em] text-card-foreground">
									〈NO ELECTRON〉
								</p>
							</div>

							{/* Route block */}
							<div className="mt-10">
								<p className="text-field-l font-mono font-normal leading-[1.05] text-card-foreground">
									/COMPAT:VS CODE
								</p>

								<p className="text-field-s mt-1 font-mono font-normal leading-[1.1] text-card-foreground opacity-70">
									EXTENSIONS / UNMODIFIED
								</p>
							</div>

							{/* Program verbs (design_system.md:157-158, 486) — em quad U+2001 separators (DesignSystem-Grammar §3) */}
							<p className="text-field-s mt-6 font-mono uppercase tracking-[0.25em] text-card-foreground opacity-60">
								{"WALK\u2001LISTEN\u2001SIGNAL"}
							</p>

							{/* Program + Status */}
							<p className="text-field-s mt-6 font-mono uppercase tracking-[0.25em] text-card-foreground opacity-60">
								{"NATIVE\u2001OPEN\u2001CROSS-PLATFORM"}
							</p>

							<div className="mt-3">
								<FieldRecordStatus
									status="active"
									copy="STATUS: SOURCE ACTIVE"
								/>
							</div>

							{/* MAJOR BLANK ZONE */}
							<div className="my-12 flex-1" aria-hidden="true" />

							{/* Project / artist block */}
							<div>
								<p className="text-field-l font-mono font-normal leading-[1.08] text-card-foreground">
									{Title || "LAND:"}
								</p>

								<p className="text-field-s mt-3 font-mono font-normal leading-[1.1] text-card-foreground opacity-70">
									↳EDITOR WITHOUT CHROMIUM
								</p>
							</div>

							{/* Metadata footer */}
							<div className="mt-10">
								<FieldRecordMetadata
									rows={[
										{
											label: "TARGET",
											value: "MACOS / WINDOWS / LINUX",
										},
										{ label: "LICENSE", value: "CC0" },
										{
											label: "SIGNAL",
											value: "LOCAL-FIRST",
										},
									]}
								/>
							</div>

							{/* Observational metadata footer (design_system.md:162-163, 186-189, 492-495) — specimen data verbatim from the spec example, no invented fields */}
							<div className="mt-3">
								<FieldRecordMetadata
									rows={[
										{ label: "SPECIES", value: "NOCTUA PRONUBA" },
										{ label: "TEMP", value: "16.2 C" },
										{ label: "WIND", value: "01.8 KM/H" },
									]}
								/>
							</div>

							{/* Program line + CTA */}
							<div className="mt-10">
								<p className="text-field-s mb-4 font-mono uppercase tracking-[0.25em] text-card-foreground opacity-60">
									{"OPEN\u2001EDIT\u2001SHIP"}
								</p>

								<FieldRecordAction
									label="ENTER"
									href={PrimaryCTA?.Href || "/Download"}
								/>
							</div>
						</div>
					</FieldRecordDataCard>
				</div>

				{/* ══ Black gutter ══ */}
				<div
					className="hidden w-px md:block"
					style={{ backgroundColor: "var(--Background)" }}
					aria-hidden="true"
				/>

				{/* ══ RIGHT: Evidence image ══ */}
				<div className="flex flex-1 items-center justify-center">
					<FieldRecordEvidence
						src="/Evidence/Land/NightGlass-01.png"
						alt="Rain-speckled glass reflecting a green light at night"
						position="right"
						className="h-full min-h-[40dvh] w-full"
					/>
				</div>
			</div>

			{/* ── TECH STACK GRID (below artifact) ── */}
			<div className="relative mx-auto mt-20 max-w-5xl px-6 pb-20 lg:px-10">
				<p className="mb-8 font-mono text-sm uppercase tracking-[0.25em] text-muted-foreground">
					TECH STACK
				</p>

				<div
					ref={SceneReference}
					className="grid grid-cols-2 items-center gap-3 sm:grid-cols-3 lg:grid-cols-4"
					aria-hidden="true"
				>
					{FloatingCard.map((Card, Index) => {
						const GetIcon = () => {
							const Title = Card.Title.toLowerCase();

							if (
								Title.includes("rust") ||
								Title.includes("core")
							)
								return lucide.Cpu;

							if (Title.includes("tauri") || Title.includes("ui"))
								return lucide.Box;

							if (
								Title.includes("effect") ||
								Title.includes("service")
							)
								return lucide.Layers;

							if (Title.includes("grpc") || Title.includes("ipc"))
								return lucide.Network;

							if (Title.includes("extension"))
								return lucide.Puzzle;

							if (
								Title.includes("cross") ||
								Title.includes("platform")
							)
								return lucide.Globe;

							if (
								Title.includes("vs code") ||
								Title.includes("api")
							)
								return lucide.Server;

							if (
								Title.includes("open") ||
								Title.includes("source")
							)
								return lucide.Zap;

							return lucide.Cpu;
						};

						const IconComponent = GetIcon();

						const GetIconColor = (): string => {
							const Title = Card.Title.toLowerCase();

							if (
								Title.includes("rust") ||
								Title.includes("core")
							)
								return "var(--SpineTCP)";

							if (Title.includes("tauri") || Title.includes("ui"))
								return "var(--SpineIPC)";

							if (
								Title.includes("effect") ||
								Title.includes("service")
							)
								return "var(--SpineWASM)";

							if (Title.includes("grpc") || Title.includes("ipc"))
								return "var(--SpinegRPC)";

							if (Title.includes("extension"))
								return "var(--SpineWASM)";

							if (
								Title.includes("cross") ||
								Title.includes("platform")
							)
								return "var(--SpineIPC)";

							if (
								Title.includes("vs code") ||
								Title.includes("api")
							)
								return "var(--SpinegRPC)";

							if (
								Title.includes("open") ||
								Title.includes("source")
							)
								return "var(--SpineTCP)";

							return "var(--SpineIPC)";
						};

						return (
							<div
								key={Card.Id}
								className="FloatingCard group relative flex h-full items-center border border-border bg-background p-4 transition-colors hover:border-accent"
							>
								<div className="flex items-center gap-3">
									<IconComponent
										className="h-5 w-5 shrink-0"
										strokeWidth={1.5}
										style={{ color: GetIconColor() }}
									/>

									<span className="truncate font-mono text-sm uppercase tracking-wider text-foreground">
										{Card.Title}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export { DynamicHeroSection };

export default DynamicHeroSection;
