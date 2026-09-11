/**
 * DynamicTransparency - build transparency section showing SBOM,
 * dependency tree, and build reproducibility information.
 *
 * Renders categorized items with copy-to-clipboard and expandable
 * details. Content is driven by the Transparency interface.
 */
import * as lucide from "lucide-react";

import { useEffect, useRef } from "react";

import { Badge } from "../UI/Badge";

import { RichText } from "../UI/RichText";

import type Property from "./Interface/Property/Transparency.js";

const TransparencyIconRegistry: Record<string, lucide.LucideIcon> = {
	Shield: lucide.Shield,

	Eye: lucide.Eye,

	EyeOff: lucide.EyeOff,

	Lock: lucide.Lock,

	Server: lucide.Server,

	Cpu: lucide.Cpu,

	Code: lucide.Code,

	Layers: lucide.Layers,

	Zap: lucide.Zap,
};

const StatusColor: Record<string, string> = {
	Active: "bg-green-500",

	Disabled: "bg-green-500",

	Optional: "bg-yellow-500",

	Recommended: "bg-blue-500",
};

const StatusBadgeVariant: Record<string, "default" | "secondary" | "outline"> =
	{
		Active: "default",

		Disabled: "secondary",

		Optional: "outline",

		Recommended: "default",
	};

const VariantStatusColor: Record<string, string> = {
	Recommended: "bg-blue-500",

	Available: "bg-green-500",

	Legacy: "bg-yellow-500",

	Experimental: "bg-purple-500",

	Development: "bg-orange-500",
};

const DynamicTransparency = ({ Content, ClassName }: Property) => {
	const {
		Title,

		Subtitle,

		Policy,

		Variant,

		Strategy,

		MatrixPermutation,

		SourceURL,
	} = Content;

	const SectionReference = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const Section = SectionReference.current;

		if (!Section) return;

		const ReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (ReducedMotion) return;

		const ApplyNoise = async () => {
			const StaccatoModule =
				await import("../../Function/Noise/Staccato.js");

			const Engine = await StaccatoModule.default;

			Engine.SeedSelector(".TransparencyCard");
		};

		ApplyNoise();
	}, []);

	const GetIcon = (IconName: string): lucide.LucideIcon | null => {
		return TransparencyIconRegistry[IconName] || null;
	};

	return (
		<section
			id="Transparency"
			aria-label="Build Transparency"
			className={`w-full py-20 ${ClassName || ""}`}
		>
			<div className="container mx-auto px-4">
				{(Title || Subtitle) && (
					<div className="StaccatoBreath mb-16 text-center">
						{Title && (
							<h2 className="mb-4 text-3xl tracking-tight md:text-4xl lg:text-5xl">
								{Title}
							</h2>
						)}

						{Subtitle && (
							<div className="mx-auto max-w-3xl text-lg text-muted-foreground opacity-70">
								<RichText Text={Subtitle} />
							</div>
						)}
					</div>
				)}

				{/* Telemetry Policy */}
				<div className="mb-16">
					<h3 className="mb-2 text-2xl tracking-tight text-foreground">
						Telemetry Policy
					</h3>
					<p className="mb-8 text-muted-foreground">
						Full disclosure on what Land collects - and what it does
						not.
					</p>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{Policy.map((Item) => {
							const Icon = GetIcon(Item.Icon);

							return (
								<div
									key={Item.Identifier}
									className="TransparencyCard StaccatoCard StaccatoBorderShimmer flat flex flex-col space-y-4 bg-card p-6"
								>
									<div className="flex items-start justify-between">
										<h4 className="font-mono text-sm font-medium text-card-foreground">
											{Item.Title}
										</h4>
										<div className="ml-4 flex items-center gap-3">
											<Badge
												variant={
													StatusBadgeVariant[
														Item.Status
													]
												}
												className="StaccatoBadge"
											>
												{Item.Status}
												{"\u2001"}
												<span
													className={`StaccatoDot StaccatoRhythmDot flat h-2 w-2 ${StatusColor[Item.Status]}`}
													aria-hidden="true"
												/>
											</Badge>
											{Icon && (
												<div
													className="flat flex h-10 w-10 shrink-0 items-center justify-center bg-secondary"
													aria-hidden="true"
												>
													<Icon
														className="StaccatoIcon h-5 w-5 text-secondary-fg"
														aria-hidden="true"
													/>
												</div>
											)}
										</div>
									</div>
									<div className="StaccatoBreath text-card-foreground opacity-70">
										<RichText Text={Item.Description} />
									</div>
									{Item.Detail && (
										<div className="text-card-foreground opacity-50">
											<RichText
												Text={Item.Detail}
												Terms
											/>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* Build Variants */}
				<div className="mb-16">
					<h3 className="mb-2 text-2xl tracking-tight text-foreground">
						Build Variants
					</h3>
					<p className="mb-8 text-foreground opacity-70">
						{Variant.length} named profiles across{" "}
						{MatrixPermutation} test permutations. Every combination
						verified.
					</p>
					<div className="overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr className="border-b border-[var(--Border)]">
									<th className="px-4 py-3 text-left font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
										Profile
									</th>
									<th className="px-4 py-3 text-left font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
										Tier
									</th>
									<th className="px-4 py-3 text-left font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
										Workbench
									</th>
									<th className="px-4 py-3 text-left font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
										Features
									</th>
									<th className="px-4 py-3 text-left font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
										Status
									</th>
								</tr>
							</thead>
							<tbody>
								{Variant.map((Item) => (
									<tr
										key={Item.Identifier}
										className="border-b border-[var(--Border)] last:border-b-0"
									>
										<td className="px-4 py-3 font-mono text-foreground">
											{Item.Name}
										</td>
										<td className="px-4 py-3 text-foreground">
											<Badge
												variant="outline"
												className="StaccatoBadge"
											>
												{Item.Tier}
											</Badge>
										</td>
										<td className="px-4 py-3 text-foreground">
											{Item.Workbench}
										</td>
										<td className="px-4 py-3 text-foreground opacity-70">
											{Item.Feature}
										</td>
										<td className="px-4 py-3 text-foreground">
											<Badge className="StaccatoBadge">
												{Item.Status}

												{"\u2001"}

												<span
													className={`StaccatoDot flat h-2 w-2 ${VariantStatusColor[Item.Status]}`}
													aria-hidden="true"
												/>
											</Badge>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Deployment Strategies */}
				<div className="mb-16">
					<h3 className="mb-2 text-2xl tracking-tight text-foreground">
						Deployment Strategies
					</h3>
					<p className="mb-8 text-foreground opacity-70">
						Four deployment modes from development to production.
					</p>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{Strategy.map((Item) => {
							const Icon = GetIcon(Item.Icon);

							return (
								<div
									key={Item.Identifier}
									className="TransparencyCard StaccatoCard StaccatoBorderShimmer flat flex flex-col space-y-4 bg-card p-6"
								>
									<div className="flex items-start justify-between">
										<h4 className="font-mono text-sm font-medium text-card-foreground">
											{Item.Name}
										</h4>
										{Icon && (
											<div
												className="flat ml-4 flex h-10 w-10 shrink-0 items-center justify-center bg-secondary"
												aria-hidden="true"
											>
												<Icon
													className="StaccatoIcon h-5 w-5 text-secondary-fg"
													aria-hidden="true"
												/>
											</div>
										)}
									</div>
									<div className="StaccatoBreath text-card-foreground opacity-70">
										<RichText Text={Item.Description} />
									</div>
									<div className="flat flex items-baseline bg-secondary px-3 py-2">
										<code className="font-mono text-secondary-fg">
																{Item.Command}
															</code>
										<button
											type="button"
											onClick={async () => {
												try {
													await navigator.clipboard.writeText(
														Item.Command,
													);
												} catch {
													// clipboard unavailable
												}
											}}
											aria-label="Copy command"
											title="Copy command"
											className="flat RichTextCopyButton ml-2 inline-flex h-[1.1em] w-[1.1em] shrink-0 items-center justify-center opacity-50 transition-opacity hover:opacity-100"
										>
											<lucide.Copy
												className="h-[0.65em] w-[0.65em]"
												aria-hidden="true"
											/>
										</button>
									</div>
									<div className="flex flex-wrap gap-2">
										{Item.Feature.map(
											(FeatureName, Index) => (
												<Badge
													key={Index}
													variant="outline"
													className="StaccatoBadge"
												>
													{FeatureName}
												</Badge>
											),
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Source Verification */}
				{SourceURL && (
					<div className="text-center">
						<a
							href={SourceURL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center text-foreground underline underline-offset-4 opacity-70 hover:opacity-100"
						>
							Verify in source code
							<span className="InlineSeparator">
								<lucide.Code
									className="h-4 w-4"
									aria-hidden="true"
								/>
							</span>
						</a>
					</div>
				)}
			</div>
		</section>
	);
};

export { DynamicTransparency };

export default DynamicTransparency;
