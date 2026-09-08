import React from "react";

import { cn } from "../UI/Utility";

export interface FieldRecordDataCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const FieldRecordDataCard = React.forwardRef<
	HTMLDivElement,
	FieldRecordDataCardProps
>(({ className, children, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={cn("text-card-fg bg-card", className)}
			style={
				{
					"--card-padding-block": "1.5rem",
					"--card-padding-inline": "1.5rem",
				} as React.CSSProperties
			}
			{...props}
		>
			<div
				style={{
					padding:
						"var(--card-padding-block) var(--card-padding-inline)",
				}}
			>
				{children}
			</div>
		</div>
	);
});

FieldRecordDataCard.displayName = "FieldRecordDataCard";

export { FieldRecordDataCard };
export default FieldRecordDataCard;
