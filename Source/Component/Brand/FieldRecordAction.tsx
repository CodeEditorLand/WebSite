import React from "react";

import { cn } from "../UI/Utility";

export interface FieldRecordActionProps {
	label: string;
	href?: string;
	variant?: "record" | "button";
	className?: string;
}

const FieldRecordAction: React.FC<FieldRecordActionProps> = ({
	label,
	href,
	variant = "record",
	className,
}) => {
	if (variant === "button") {
		return (
			<a
				href={href}
				className={cn(
					"inline-flex h-10 items-center justify-center px-[2.1rem] py-2",
					"font-mono text-sm font-medium uppercase tracking-wider",
					"text-bg hover:bg-foreground/85 bg-foreground",
					"touch-manipulation select-none rounded-[var(--RadiusButton)]",
					"transition-[background-color,color] active:scale-[0.97]",
					className,
				)}
				style={{ borderRadius: 0 }}
			>
				{label}
			</a>
		);
	}

	return (
		<a
			href={href}
			className={cn(
				"text-field-xs font-mono uppercase tracking-wider",
				"underline-offset-4 hover:underline",
				className,
			)}
			style={{ color: "var(--Accent)" }}
		>
			/{label}
		</a>
	);
};

export { FieldRecordAction };
export default FieldRecordAction;
