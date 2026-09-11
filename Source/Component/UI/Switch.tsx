"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";

import * as React from "react";

import { cn } from "./Utility";

function Switch({
	className,
	...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			className={cn(
				"data-[state=unchecked]:bg-switch-background focus-visible:ring-[color-mix(in_srgb,var(--Ring)_50%,transparent)] flat peer inline-flex h-[1.15rem] w-8 shrink-0 items-center border border-transparent outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
				className,
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					"flat pointer-events-none block size-4 bg-card ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-3px)] data-[state=unchecked]:translate-x-0",
				)}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
