import { cva, type VariantProps } from "class-variance-authority";

import * as React from "react";

import { cn } from "./Utility";

const AlertVariants = cva(
	"relative w-full rounded-none border px-4 py-3 grid has-[>svg]:grid-cols-[calc(var(--Spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",

	{
		variants: {
			variant: {
				default: "bg-card text-card-foreground",
				destructive:
					"text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-[color-mix(in_srgb,var(--Destruct)_90%,transparent)]",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Alert({
	className,
	variant,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof AlertVariants>) {
	return (
		<div
			data-slot="alert"
			role="alert"
			className={cn(AlertVariants({ variant }), className)}
			{...props}
		/>
	);
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-title"
			className={cn(
				"col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDescription({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-description"
			className={cn(
				"col-start-2 grid justify-items-start gap-1 text-card-foreground [&_p]:leading-relaxed",
				className,
			)}
			{...props}
		/>
	);
}

export { Alert, AlertTitle, AlertDescription };
