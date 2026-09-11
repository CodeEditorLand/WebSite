import { cva, type VariantProps } from "class-variance-authority";

import React from "react";

import { cn } from "./Utility";

const BadgeVariants = cva(
	"inline-flex items-center rounded-none border px-4 py-1.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--Ring)] focus:ring-offset-2",

	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-fg hover:opacity-80",
				secondary:
					"border-transparent bg-secondary text-secondary-fg hover:opacity-80",
				destructive:
					"border-transparent bg-destruct text-destruct-fg hover:opacity-80",
				outline: "text-card-fg",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends
		React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof BadgeVariants> {}

// Jelly variant mapping: our semantic names → Jelly's palette names.
// Jelly's built-in palette is NOT used - we override --jelly-fill and
// --jelly-label with our design tokens via inline style so the soft-body
// canvas paints in our exact colours instead of Jelly's default palette.
const JellyBadgeVariant: Record<
	NonNullable<BadgeProps["variant"]>,
	{ variant: string; fill: string; label: string }
> = {
	default: {
		variant: "graphite",
		fill: "var(--Primary)",
		label: "var(--PrimaryForeground)",
	},
	secondary: {
		variant: "platinum",
		fill: "var(--Secondary)",
		label: "var(--SecondaryForeground)",
	},
	destructive: {
		variant: "rose",
		fill: "var(--Destruct)",
		label: "var(--DestructForeground)",
	},
	outline: {
		variant: "platinum",
		fill: "transparent",
		label: "var(--Foreground)",
	},
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
	({ className, variant = "default", children, ...props }, ref) => {
		const jelly = JellyBadgeVariant[variant];

		return (
			<jelly-badge
				ref={ref as unknown as React.Ref<HTMLElement>}
				variant={jelly.variant}
				shape="square"
				outline={variant === "outline" ? true : undefined}
				className={className}
				style={
					{
						"--jelly-fill": jelly.fill,
						"--jelly-label": jelly.label,
						"--jelly-badge-radius": "0px",
						"--jelly-badge-font-size": "inherit",
						"--jelly-color-border-default":
							variant === "outline"
								? "var(--Border)"
								: "transparent",
					} as React.CSSProperties
				}
				{...props}
			>
				{children}
			</jelly-badge>
		);
	},
);

Badge.displayName = "Badge";

export { BadgeVariants };
