"use client";

import * as React from "react";

import * as RechartsPrimitive from "recharts";

import { cn } from "./Utility";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "" } as const;

export type ChartConfig = {
	[k in string]: {
		label?: React.ReactNode;

		icon?: React.ComponentType;
	} & (
		| { color?: string; theme?: never }
		| { color?: never; theme: Record<keyof typeof THEMES, string> }
	);
};

type ChartContextProps = {
	config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function UseChart() {
	const context = React.useContext(ChartContext);

	if (!context) {
		throw new Error("UseChart must be used within a <ChartContainer />");
	}

	return context;
}

function ChartContainer({
	id,
	className,
	children,
	config,
	...props
}: React.ComponentProps<"div"> & {
	config: ChartConfig;

	children: React.ComponentProps<
		typeof RechartsPrimitive.ResponsiveContainer
	>["children"];
}) {
	const UniqueId = React.useId();

	const ChartId = `chart-${id || UniqueId.replace(/:/g, "")}`;

	return (
		<ChartContext.Provider value={{ config }}>
			<div
				data-slot="chart"
				data-chart={ChartId}
				className={cn(
					"[&_.recharts-cartesian-grid_line]:stroke-[color-mix(in_srgb,var(--Border)_50%,transparent)] aspect-video [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden flex justify-center [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot]:stroke-transparent [&_.recharts-polar-grid_line]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_line]:stroke-border [&_.recharts-sector]:stroke-transparent",
					className,
				)}
				{...props}
			>
				<ChartStyle id={ChartId} config={config} />
				<RechartsPrimitive.ResponsiveContainer>
					{children}
				</RechartsPrimitive.ResponsiveContainer>
			</div>
		</ChartContext.Provider>
	);
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
	const ColorConfig = Object.entries(config).filter(
		([, config]) => config.theme || config.color,
	);

	if (!ColorConfig.length) {
		return null;
	}

	return (
		<style
			dangerouslySetInnerHTML={{
				__html: Object.entries(THEMES)
					.map(
						([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${ColorConfig.map(([key, ItemConfig]) => {
	const color =
		ItemConfig.theme?.[theme as keyof typeof ItemConfig.theme] ||
		ItemConfig.color;
	return color ? ` --color-${key}: ${color};` : null;
}).join("\n")}
}
`,
					)
					.join("\n"),
			}}
		/>
	);
};

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
	active,
	payload,
	className,
	indicator = "dot",
	hideLabel = false,
	hideIndicator = false,
	label,
	labelFormatter,
	labelClassName,
	formatter,
	color,
	nameKey,
	labelKey,
}: React.ComponentProps<"div"> & {
	active?: boolean;

	hideLabel?: boolean;

	hideIndicator?: boolean;

	indicator?: "line" | "dot" | "dashed";

	nameKey?: string;

	labelKey?: string;

	payload?: Array<Record<string, unknown>>;

	label?: string;

	color?: string;

	labelClassName?: string;

	labelFormatter?: (
		Value: React.ReactNode,

		Payload: Array<Record<string, unknown>>,
	) => React.ReactNode;

	formatter?: (
		Value: number,

		Name: string,

		Item: Record<string, unknown>,

		Index: number,

		Payload: unknown,
	) => React.ReactNode;
}) {
	const { config } = UseChart();

	const TooltipLabel = React.useMemo(() => {
		if (hideLabel || !payload?.length) {
			return null;
		}

		const [item] = payload;

		const key = `${labelKey || item?.["dataKey"] || item?.["name"] || "value"}`;

		const ItemConfig = GetPayloadConfigFromPayload(config, item, key);

		const value =
			!labelKey && typeof label === "string"
				? config[label as keyof typeof config]?.label || label
				: ItemConfig?.label;

		if (labelFormatter) {
			return (
				<div className={cn("font-medium", labelClassName)}>
					{labelFormatter(value, payload)}
				</div>
			);
		}

		if (!value) {
			return null;
		}

		return <div className={cn("font-medium", labelClassName)}>{value}</div>;
	}, [
		label,

		labelFormatter,

		payload,

		hideLabel,

		labelClassName,

		config,

		labelKey,
	]);

	if (!active || !payload?.length) {
		return null;
	}

	const NestLabel = payload.length === 1 && indicator !== "dot";

	return (
		<div
			className={cn(
				"border-[color-mix(in_srgb,var(--Border)_50%,transparent)] grid min-w-[8rem] items-start gap-1.5 rounded-none border bg-background px-2.5 py-1.5",
				className,
			)}
		>
			{!NestLabel ? TooltipLabel : null}
			<div className="grid gap-1.5">
				{payload.map((item: Record<string, unknown>, index: number) => {
					const key = `${nameKey || item["name"] || item["dataKey"] || "value"}`;

					const ItemConfig = GetPayloadConfigFromPayload(
						config,

						item,

						key,
					);

					const ItemPayload = item["payload"] as
						Record<string, unknown> | undefined;

					const IndicatorColor =
						color || ItemPayload?.["fill"] || item["color"];

					return (
						<div
							key={String(item["dataKey"])}
							className={cn(
								"flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
								indicator === "dot" && "items-center",
							)}
						>
							{formatter &&
							item["value"] !== undefined &&
							item["name"] ? (
								formatter(
									item["value"] as number,

									item["name"] as string,

									item,

									index,

									item["payload"],
								)
							) : (
								<>
									{ItemConfig?.icon ? (
										<ItemConfig.icon />
									) : (
										!hideIndicator && (
											<div
												className={cn(
													"border-(--color-border) bg-(--color-bg) shrink-0 rounded-none",
													{
														"h-2.5 w-2.5":
															indicator === "dot",
														"w-1":
															indicator ===
															"line",
														"w-0 border-[1.5px] border-dashed bg-transparent":
															indicator ===
															"dashed",
														"my-0.5":
															NestLabel &&
															indicator ===
																"dashed",
													},
												)}
												style={
													{
														"--color-bg":
															IndicatorColor,
														"--color-border":
															IndicatorColor,
													} as React.CSSProperties
												}
											/>
										)
									)}
									<div
										className={cn(
											"flex flex-1 justify-between leading-none",
											NestLabel
												? "items-end"
												: "items-center",
										)}
									>
										<div className="grid gap-1.5">
											{NestLabel ? TooltipLabel : null}
											<span className="text-muted-foreground">
												{ItemConfig?.label ||
													(item["name"] as string)}
											</span>
										</div>
										{item["value"] != null && (
											<span className="font-mono font-medium tabular-nums text-foreground">
												{(
													item["value"] as number
												).toLocaleString()}
											</span>
										)}
									</div>
								</>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
	className,
	hideIcon = false,
	payload,
	verticalAlign = "bottom",
	nameKey,
}: React.ComponentProps<"div"> &
	Partial<Pick<RechartsPrimitive.LegendProps, "verticalAlign">> & {
		hideIcon?: boolean;

		nameKey?: string;

		payload?: Array<Record<string, unknown>>;
	}) {
	const { config } = UseChart();

	if (!payload?.length) {
		return null;
	}

	return (
		<div
			className={cn(
				"flex items-center justify-center gap-4",
				verticalAlign === "top" ? "pb-3" : "pt-3",
				className,
			)}
		>
			{payload.map((item: Record<string, unknown>) => {
				const key = `${nameKey || item["dataKey"] || "value"}`;

				const ItemConfig = GetPayloadConfigFromPayload(
					config,

					item,

					key,
				);

				return (
					<div
						key={String(item["value"])}
						className={cn(
							"flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground",
						)}
					>
						{ItemConfig?.icon && !hideIcon ? (
							<ItemConfig.icon />
						) : (
							<div
								className="h-2 w-2 shrink-0 rounded-none"
								style={{
									backgroundColor: item["color"] as string,
								}}
							/>
						)}
						{ItemConfig?.label}
					</div>
				);
			})}
		</div>
	);
}

// Helper to extract item config from a payload.
function GetPayloadConfigFromPayload(
	config: ChartConfig,

	payload: unknown,

	key: string,
) {
	if (typeof payload !== "object" || payload === null) {
		return undefined;
	}

	const PayloadPayload =
		"payload" in payload &&
		typeof payload.payload === "object" &&
		payload.payload !== null
			? payload.payload
			: undefined;

	let ConfigLabelKey: string = key;

	if (
		key in payload &&
		typeof payload[key as keyof typeof payload] === "string"
	) {
		ConfigLabelKey = payload[key as keyof typeof payload] as string;
	} else if (
		PayloadPayload &&
		key in PayloadPayload &&
		typeof PayloadPayload[key as keyof typeof PayloadPayload] === "string"
	) {
		ConfigLabelKey = PayloadPayload[
			key as keyof typeof PayloadPayload
		] as string;
	}

	return ConfigLabelKey in config
		? config[ConfigLabelKey]
		: config[key as keyof typeof config];
}

export {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
	ChartStyle,
};
