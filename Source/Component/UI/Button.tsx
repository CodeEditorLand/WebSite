import { Slot } from "@radix-ui/react-slot";

import { cva, type VariantProps } from "class-variance-authority";

import React from "react";

import { cn } from "./Utility";

// Nocturnal Field Record: flat corners, mono label, dark variant.
// Original look (colors, sizing) is unchanged - only the physics/
// motion layer is Jelly's.
const ButtonVariants = cva(
	"inline-flex items-center justify-center gap-0 whitespace-nowrap select-none touch-manipulation rounded-[var(--RadiusButton)] font-mono text-sm font-medium uppercase tracking-wider transition-[background-color,color,transform] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[color-mix(in_srgb,var(--Ring)_40%,transparent)] focus-visible:ring-[2px] aria-invalid:ring-[color-mix(in_srgb,var(--Destruct)_20%,transparent)]",

	{
		variants: {
			variant: {
				default: "bg-foreground text-bg hover:bg-[color-mix(in_srgb,var(--Foreground)_85%,transparent)]",
				destructive:
					"bg-destruct text-destruct-fg hover:bg-[color-mix(in_srgb,var(--Destruct)_85%,transparent)] focus-visible:ring-[color-mix(in_srgb,var(--Destruct)_20%,transparent)]",
				outline:
					"bg-background text-fg border border-border hover:bg-mute",
				secondary: "bg-secondary text-secondary-fg hover:bg-surface3",
				ghost: "text-fg hover:bg-mute",
				link: "text-fg underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-[2.1rem] py-2 has-[>svg]:px-[1.8rem]",
				sm: "h-9 gap-0 px-3 has-[>svg]:px-2.5",
				lg: "h-11 px-[2.6rem] has-[>svg]:px-[2.2rem]",
				icon: "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const JellyColorOverride: Partial<
	Record<NonNullable<ButtonProps["variant"]>, Record<string, string>>
> = {
	default: {
		"--jelly-color-background-accent": "var(--Foreground)",
		"--jelly-color-foreground-on-accent": "var(--Background)",
	},
	destructive: {
		"--jelly-color-background-rose": "var(--Destruct)",
		"--jelly-color-foreground-on-emphasis": "var(--DestructForeground)",
	},
	outline: {
		"--jelly-color-background-neutral": "var(--Background)",
		"--jelly-color-foreground-on-neutral": "var(--Foreground)",
	},
	secondary: {
		"--jelly-color-background-neutral-emphasis": "var(--Secondary)",
		"--jelly-color-foreground-on-emphasis": "var(--SecondaryForeground)",
	},
};

const JellySizeOverride: Partial<
	Record<NonNullable<ButtonProps["size"]>, Record<string, string>>
> = {
	default: {
		"--jelly-button-height": "40px",
		"--jelly-button-padding-inline": "2.1rem",
		"--jelly-button-min-width": "0px",
	},
	sm: {
		"--jelly-button-height": "36px",
		"--jelly-button-padding-inline": "0.75rem",
		"--jelly-button-min-width": "0px",
	},
	lg: {
		"--jelly-button-height": "44px",
		"--jelly-button-padding-inline": "2.6rem",
		"--jelly-button-min-width": "0px",
	},
	icon: {
		"--jelly-icon-button-size": "40px",
	},
};

export interface ButtonProps
	extends
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof ButtonVariants> {
	asChild?: boolean;
}

const JellyVariantAttribute: Partial<
	Record<
		NonNullable<ButtonProps["variant"]>,
		"rose" | "platinum" | "graphite"
	>
> = {
	destructive: "rose",
	outline: "platinum",
	secondary: "graphite",
};

const JellySizeAttribute: Partial<
	Record<NonNullable<ButtonProps["size"]>, "sm" | "md" | "lg">
> = {
	default: "md",
	sm: "sm",
	lg: "lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = "default",
			size = "default",
			asChild = false,
			children,
			...props
		},
		ref,
	) => {
		if (asChild) {
			return (
				<Slot
					data-slot="button"
					ref={ref}
					className={cn(ButtonVariants({ variant, size, className }))}
					{...props}
					draggable={false}
				>
					{children}
				</Slot>
			);
		}

		if (variant === "ghost" || variant === "link" || props.style) {
			return (
				<button
					data-slot="button"
					ref={ref}
					className={cn(ButtonVariants({ variant, size, className }))}
					{...props}
				>
					{children}
				</button>
			);
		}

		const JellyRef = ref as unknown as React.Ref<HTMLElement>;

		if (size === "icon") {
			return (
				<jelly-icon-button
					data-slot="button"
					ref={JellyRef}
					variant={JellyVariantAttribute[variant]}
					label={props["aria-label"]}
					className={className}
					style={
						{
							"--jelly-icon-button-radius": "var(--RadiusButton)",
							...JellySizeOverride.icon,
							...JellyColorOverride[variant],
						} as React.CSSProperties
					}
					{...props}
				>
					{children}
				</jelly-icon-button>
			);
		}

		return (
			<jelly-button
				data-slot="button"
				ref={JellyRef}
				variant={JellyVariantAttribute[variant]}
				size={JellySizeAttribute[size ?? "default"]}
				block={className?.includes("w-full") || undefined}
				className={className}
				style={
					{
						"--jelly-button-radius": "var(--RadiusButton)",
						...JellySizeOverride[size ?? "default"],
						...JellyColorOverride[variant],
					} as React.CSSProperties
				}
				{...props}
			>
				{children}
			</jelly-button>
		);
	},
);

Button.displayName = "Button";

export { ButtonVariants };
