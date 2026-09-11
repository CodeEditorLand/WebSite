import { useEffect, useRef } from "react";

import { RichText } from "../UI/RichText.js";

import { DynamicButton } from "./DynamicButton";

import { DynamicTable } from "./DynamicTable";

import type Property from "./Interface/Property/Release/Previous.js";

import type ReleaseVersion from "./Interface/Version/Release.js";

const DynamicPreviousReleases = ({ Content, ClassName }: Property) => {
	const { Title, Description, Releases, ShowChangelog = true } = Content;

	const SectionReference = useRef<HTMLElement>(null);

	useEffect(() => {
		const Section = SectionReference.current;

		if (!Section) return;

		const ReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (ReducedMotion) return;

		const ApplyScatter = async () => {
			const StaccatoModule =
				await import("../../Function/Noise/Staccato.js");

			const Staccato = await StaccatoModule.default;

			Staccato.SeedElement(Section, 0);
		};

		ApplyScatter();
	}, []);

	const ColumnDefinitions = [
		{
			Key: "Version" as const,

			Header: "Version",

			Render: (Value: unknown, _Row: ReleaseVersion) => (
				<span className="font-semibold text-card-foreground">
					{String(Value)}
				</span>
			),
		},

		{
			Key: "PublishedAt" as const,

			Header: "Published",

			Render: (Value: unknown) => (
				<time dateTime={String(Value)}>
					{new Date(String(Value)).toLocaleDateString("en-US", {
						year: "numeric",
						month: "short",
						day: "numeric",
					})}
				</time>
			),
		},

		{
			Key: "Size" as const,

			Header: "Size",

			Render: (Value: unknown) => (
				<span className="text-card-foreground opacity-70">{String(Value)}</span>
			),
		},

		{
			Key: "Downloads" as const,

			Header: "Downloads",

			Render: (Value: unknown) => (
				<span className="text-card-foreground opacity-70">
					{(Value as number).toLocaleString()}
				</span>
			),
		},

		{
			Key: "actions" as const,

			Header: "",

			Render: (_Value: unknown, Row: ReleaseVersion) => (
				<div className="flex gap-2">
					{Row.Assets.map((Asset) => (
						<DynamicButton
							key={Asset.Platform}
							Content={{
								Text: Asset.Platform,
								Variant: "outline",
								Size: "sm",
								Icon:
									Asset.Platform === "macOS"
										? "Apple"
										: Asset.Platform === "Windows"
											? "Monitor"
											: "Terminal",
							}}
							OnAction={() =>
								Content.OnDownload?.(
									Row.Version,

									Asset.Platform,
								)
							}
						/>
					))}
					{ShowChangelog && Row.Changelog && (
						<DynamicButton
							Content={{
								Text: "Changelog",
								Variant: "ghost",
								Size: "sm",
							}}
							OnAction={() =>
								Content.OnViewChangelog?.(Row.Version)
							}
						/>
					)}
				</div>
			),
		},
	];

	return (
		<section
			ref={SectionReference}
			className={`py-20 ${ClassName || ""}`}
			aria-label="Previous releases"
		>
			<div className="container mx-auto px-4">
				{(Title || Description) && (
					<div className="mb-16 text-center">
						{Title && (
							<h2 className="mb-4 text-3xl tracking-tight md:text-4xl lg:text-5xl">
								{Title}
							</h2>
						)}

						{Description && (
							<div className="mx-auto max-w-2xl text-lg text-muted-foreground">
								<RichText Text={Description} />
							</div>
						)}
					</div>
				)}

				<div className="StaccatoCard StaccatoBorderShimmer flat mx-auto max-w-5xl overflow-hidden bg-card">
					<DynamicTable<ReleaseVersion>
						Content={{
							Columns: ColumnDefinitions,
							Data: Releases,
							Striped: true,
							Hoverable: true,
							Bordered: false, // Table already has outer border
							Compact: false,
						}}
					/>
				</div>
			</div>
		</section>
	);
};

export { DynamicPreviousReleases };

export default DynamicPreviousReleases;
