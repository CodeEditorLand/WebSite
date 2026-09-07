import React from "react";

import { cn } from "./Utility";

const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
	return (
		<jelly-card
			ref={ref as unknown as React.Ref<HTMLElement>}
			className={cn("text-card-fg", className)}
			style={
				{
					"--jelly-fill": "var(--Card)",
					"--jelly-radius": "0px",
					"--jelly-card-color": "inherit",
					"--jelly-card-padding-block": "0px",
					"--jelly-card-padding-inline": "0px",
					"--jelly-card-font-size": "inherit",
				} as React.CSSProperties
			}
			{...props}
		>
			{children}
		</jelly-card>
	);
});

Card.displayName = "Card";

const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn("flex flex-col space-y-1.5 p-6", className)}
			{...props}
		/>
	);
});

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
	return (
		<h3
			ref={ref}
			className={cn(
				"font-mono text-sm font-semibold leading-snug tracking-tight",
				className,
			)}
			{...props}
		/>
	);
});

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	return (
		<p
			ref={ref}
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
});

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;
});

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn("flex items-center p-6 pt-0", className)}
			{...props}
		/>
	);
});

CardFooter.displayName = "CardFooter";

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent,
};
