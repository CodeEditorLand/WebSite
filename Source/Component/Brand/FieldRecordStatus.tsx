import React from "react";

import { cn } from "../UI/Utility";

export type FieldRecordStatusState =
	| "ready"
	| "active"
	| "loading"
	| "preparing"
	| "verified"
	| "unavailable"
	| "interrupted"
	| "archived";

export type FieldRecordStatusTone = "ink" | "specimen" | "quiet";

export interface FieldRecordStatusProps {
	status: FieldRecordStatusState;
	tone?: FieldRecordStatusTone;
	className?: string;
}

const toneColor: Record<FieldRecordStatusTone, string> = {
	ink: "var(--CardForeground)",
	specimen: "var(--Accent)",
	quiet: "var(--MuteForeground)",
};

const FieldRecordStatus: React.FC<FieldRecordStatusProps> = ({
	status,
	tone = "ink",
	className,
}) => {
	const color = status === "verified" ? "var(--Accent)" : toneColor[tone];

	return (
		<span
			className={cn(
				"text-field-s font-mono uppercase tracking-wider",
				className,
			)}
			style={{ color }}
		>
			STATUS: {status.toUpperCase()}
		</span>
	);
};

export { FieldRecordStatus };
export default FieldRecordStatus;
