import * as lucide from "lucide-react";

import { useEffect, useRef } from "react";

import { IconTooltip } from "../UI/IconTooltip.js";

import { RichText } from "../UI/RichText.js";

import { SpecimenSeal } from "../UI/SpecimenSeal.js";

import { DynamicBadge } from "./DynamicBadge";

import { DynamicButton } from "./DynamicButton";

import type Property from "./Interface/Property/Hero.js";

/**
 * Dynamic HeroSection - Nocturnal Field Record.
 *
 * Hierarchy (per design_system.md):
 *   series label → specimen seal → oversized timestamp → route block →
 *   program + duration → MAJOR BLANK ZONE → project/artist → metadata footer →
 *   CTAs → tech stack grid.
 *
 * Animation logic (simplex noise, Staccato, Attention) is preserved unchanged.
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
			className={`relative flex min-h-0 w-full items-start overflow-hidden pb-12 pt-20 lg:items-center lg:pb-24 lg:pt-32 ${ClassName || ""}`}
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
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
					backgroundSize: "48px 48px",
					maskImage:
						"radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent 75%)",
					WebkitMaskImage:
						"radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent 75%)",
				}}
			/>

			<div className="container relative mx-auto px-4">
				{/* ── Micro label ── */}
				<p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
					# NOCTURNAL FIELD RECORD
				</p>

				{/* ── Specimen seal (upper-right) ── */}
				<SpecimenSeal className="absolute right-4 top-0 w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24" />

				{/* ── Oversized bracketed timestamp - LARGEST element ── */}
				<div className="mt-10 md:mt-14">
					<p className="font-mono text-field-xl font-normal leading-[0.95] tracking-[-0.02em] text-foreground">
						〈08.09.26〉
					</p>

					<p className="mt-1 font-mono text-field-l font-normal leading-[1.0] tracking-[-0.02em] text-foreground">
						〈20:18〉
					</p>
				</div>

				{/* ── Route block ── */}
				<div className="mt-10 md:mt-14">
					<p className="font-mono text-field-l font-normal leading-[1.05] text-foreground">
						/MEET:EDITOR LAND
					</p>

					<p className="mt-1 font-mono text-field-s font-normal leading-[1.1] text-muted-foreground">
						MOUNTAIN GATE ◎1
					</p>
				</div>

				{/* ── Program line ── */}
				<p className="mt-6 font-mono text-field-xs uppercase tracking-[0.25em] text-muted-foreground">
					OBSERVE · TRACE · RECORD
				</p>

				{/* ── Duration ── */}
				<p className="mt-2 font-mono text-field-xs uppercase tracking-[0.2em] text-muted-foreground">
					20:18 → 01:40
				</p>

				{/* ── MAJOR BLANK ZONE (15-25% of card) ── */}
				<div className="my-20 md:my-28 lg:my-36" aria-hidden="true" />

				{/* ── Project / artist block ── */}
				<div>
					<p className="font-mono text-field-l font-normal leading-[1.08] text-foreground">
						{Title || "LAND:"}
					</p>

					<p className="mt-3 font-mono text-field-s font-normal leading-[1.1] text-accent">
						↳CODE EDITOR LAND
					</p>
				</div>

				{/* ── Specimen metadata footer ── */}
				<div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 font-mono text-field-xs uppercase tracking-[0.15em] text-muted-foreground">
					<span>
						SPECIES:{" "}
						<em className="not-italic text-foreground">*ACTIAS LUNA*</em>
					</span>

					<span>TEMP: 16.2 C</span>

					<span>WIND: 01.8 KM/H</span>

					<span>HUMIDITY: 71%</span>
				</div>

				{/* ── CTAs ── */}
				<div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row sm:[&>button]:w-auto">
					<DynamicButton Content={PrimaryCTA} />

					{SecondaryCTA && <DynamicButton Content={SecondaryCTA} />}
				</div>

				{/* ── Tech stack label ── */}
				<p className="mt-24 mb-8 font-mono text-sm uppercase tracking-[0.25em] text-muted-foreground">
					TECH STACK
				</p>

				{/* ── Tech stack grid - flat, mono, single-color per card ── */}
				<div
					className="mx-auto max-w-5xl px-6 py-10 lg:px-10"
					aria-hidden="true"
				>
					<div className="grid grid-cols-2 items-center gap-3 sm:grid-cols-3 lg:grid-cols-4">
						{FloatingCard.map((Card, Index) => {
							const GetIcon = () => {
								const Title = Card.Title.toLowerCase();

								if (
									Title.includes("rust") ||
									Title.includes("core")
								)
									return lucide.Cpu;

								if (
									Title.includes("tauri") ||
									Title.includes("ui")
								)
									return lucide.Box;

								if (
									Title.includes("effect") ||
									Title.includes("service")
								)
									return lucide.Layers;

								if (
									Title.includes("grpc") ||
									Title.includes("ipc")
								)
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

								if (
									Title.includes("tauri") ||
									Title.includes("ui")
								)
									return "var(--SpineIPC)";

								if (
									Title.includes("effect") ||
									Title.includes("service")
								)
									return "var(--SpineWASM)";

								if (
									Title.includes("grpc") ||
									Title.includes("ipc")
								)
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
									className="group relative flex h-full items-center border border-border bg-background p-4 transition-colors hover:border-accent"
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
			</div>
		</section>
	);
};

export { DynamicHeroSection };

export default DynamicHeroSection;
