import * as lucide from "lucide-react";

import { useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import { IconTooltip } from "../UI/IconTooltip.js";

import { RichText } from "../UI/RichText.js";

import type RequirementItem from "./Interface/Item/Requirement.js";

import type Property from "./Interface/Property/Requirement/System.js";

/**
 * Dynamic SystemRequirements component for displaying platform requirements
 * Shows minimum and recommended specs in Card format
 */
const DynamicSystemRequirements = ({ Content, ClassName }: Property) => {
	const { t: T } = useTranslation("download");

	const { Title, Description, Requirements } = Content;

	const GridReference = useRef<HTMLDivElement>(null);

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

			const Cards = Grid.querySelectorAll<HTMLElement>(".StaccatoCard");

			Cards.forEach((Card, Index) => {
				Attention.ApplyToElement(Card, Index, 4, 3);
			});
		};

		ApplyScatter();
	}, [Requirements]);

	const RequirementList = ({
		items: ItemList,
		variant: Variant = "minimum",
	}: {
		items: RequirementItem[];

		variant?: "minimum" | "recommended";
	}) => (
		<div className="space-y-3">
			{ItemList.map((Requirement) => (
				<div key={Requirement.Id} className="flex items-start">
					<div className="flex-1">
						<span className="font-medium">
							{Requirement.Label}:
						</span>{" "}
						<span className="text-muted-foreground">
							{Requirement.Value}
						</span>
					</div>
					{"\u2001"}

					<div className="mt-1 shrink-0">
						{Variant === "minimum" ? (
							<IconTooltip
								Label="Your code runs at native CPU speed"
								Icon={lucide.Cpu}
								Color="var(--PlatformDesktopFore)"
								SizeClass="h-4 w-4"
							/>
						) : (
							<IconTooltip
								Label="Span your work across every monitor"
								Icon={lucide.Monitor}
								Color="var(--PlatformDesktopFore)"
								SizeClass="h-4 w-4"
							/>
						)}
					</div>
				</div>
			))}
		</div>
	);

	return (
		<section
			className={`py-20 ${ClassName || ""}`}
			aria-label="System requirements"
		>
			<div className="container mx-auto px-4">
				<div className="mb-16 text-center">
					<h2 className="mb-4 text-3xl tracking-tight md:text-4xl lg:text-5xl">
						{Title}
					</h2>
					{Description && (
						<div className="mx-auto max-w-2xl text-lg text-muted-foreground">
							<RichText Text={Description} />
						</div>
					)}
				</div>

				<div
					ref={GridReference}
					className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2"
				>
					{/* Minimum Requirements */}
					<div className="StaccatoCard StaccatoBorderShimmer flat bg-card p-6">
						<h3 className="mb-6 font-mono text-sm font-medium text-card-foreground">
							{T(
								"systemRequirements.minimum",
								"Minimum Requirements",
							)}
						</h3>
						<RequirementList
							items={Requirements.Minimum}
							variant="minimum"
						/>
					</div>

					{/* Recommended Requirements */}
					<div className="StaccatoCard StaccatoBorderShimmer flat border border-primary bg-card p-6">
						<h3 className="mb-6 font-mono text-sm font-medium text-card-foreground">
							{T(
								"systemRequirements.recommended",
								"Recommended for the Best Experience",
							)}
						</h3>
						<RequirementList
							items={Requirements.Recommended}
							variant="recommended"
						/>
					</div>
				</div>

				{/* OS Support */}
				{Content.Os && Content.Os.length > 0 && (
					<div className="mt-12 text-center">
						<h4 className="mb-4 font-mono text-sm font-medium">
							{T(
								"systemRequirements.supportedOS",
								"Supported Operating Systems",
							)}
						</h4>
						<div className="flex flex-wrap justify-center gap-4">
							{Content.Os.map((OperatingSystem, Index) => (
								<span
									key={Index}
									className="bg-secondary px-4 py-2 font-medium"
								>
									{OperatingSystem}
								</span>
							))}
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export { DynamicSystemRequirements };

export default DynamicSystemRequirements;
