"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import * as lucide from "lucide-react";

import * as React from "react";

import { cn } from "./Utility";

function RadioGroup({
	className,
	...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
	return (
		<RadioGroupPrimitive.Root
			data-slot="radio-group"
			className={cn("grid gap-3", className)}
			{...props}
		/>
	);
}

function RadioGroupItem({
	className,
	...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
	return (
		<RadioGroupPrimitive.Item
			data-slot="radio-group-item"
			className={cn(
				"focus-visible:ring-[color-mix(in_srgb,var(--Ring)_50%,transparent)] aria-invalid:ring-[color-mix(in_srgb,var(--Destruct)_20%,transparent)] aria-invalid:border-destructive aspect-square size-4 shrink-0 rounded-none border border-input text-primary outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator
				data-slot="radio-group-indicator"
				className="relative flex items-center justify-center"
			>
				<lucide.Circle className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
}

export { RadioGroup, RadioGroupItem };
