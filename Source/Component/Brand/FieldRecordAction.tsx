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
		const IsExternal = href?.startsWith("http");

		return (
			<a
				href={href}
				{...(IsExternal
					? { target: "_blank", rel: "noopener noreferrer" }
					: {})}
				className={cn(
					"inline-block FieldRecordActionButton",
					className,
				)}
			>
				<jelly-button
					squish
					style={
						{
							"--jelly-button-radius": "var(--RadiusButton)",
							"--jelly-button-height": "44px",
							"--jelly-button-padding-inline": "2.6rem",
							"--jelly-button-min-width": "0px",
							"--jelly-color-background-accent":
								"var(--Foreground)",
							"--jelly-color-foreground-on-accent":
								"var(--Background)",
						} as React.CSSProperties
					}
				>
					<span className="font-mono text-sm font-medium uppercase tracking-wider">
						{label}
					</span>
				</jelly-button>
			</a>
		);
	}

	return (
		<a
			href={href}
			className={cn(
				"text-field-s font-mono uppercase tracking-wider",
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
