import React from "react";

import { cn } from "../UI/Utility";

export interface FieldRecordIndexProps {
	index: string;
	className?: string;
}

const FieldRecordIndex: React.FC<FieldRecordIndexProps> = ({
	index,
	className,
}) => {
	return (
		<span
			className={cn(
				"text-field-xs font-mono uppercase tracking-widest",
				className,
			)}
			style={{ color: "var(--Foreground)" }}
		>
			# {index}
		</span>
	);
};

export { FieldRecordIndex };
export default FieldRecordIndex;
