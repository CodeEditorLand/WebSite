"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import * as lucide from "lucide-react";

import * as React from "react";

import { cn } from "./Utility";

function Checkbox({
	className,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(
				"focus-visible:ring-[color-mix(in_srgb,var(--Ring)_50%,transparent)] aria-invalid:ring-[color-mix(in_srgb,var(--Destruct)_20%,transparent)] aria-invalid:border-destructive peer size-4 shrink-0 rounded-none border bg-background outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[1px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="flex items-center justify-center text-current transition-none"
			>
				<lucide.Check className="size-3.5" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
