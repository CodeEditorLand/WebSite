import React from "react";

import { cn } from "../UI/Utility";

export interface FieldRecordMetadataPair {
	label: string;
	value: string;
}

export interface FieldRecordMetadataProps {
	pairs?: FieldRecordMetadataPair[];
	rows?: FieldRecordMetadataPair[];
	className?: string;
}

const FieldRecordMetadata: React.FC<FieldRecordMetadataProps> = ({
	pairs,
	rows,
	className,
}) => {
	const items = pairs || rows || [];

	return (
		<dl
			className={cn("space-y-1", className)}
			style={{ color: "var(--CardForeground)" }}
		>
			{items.map((pair, i) => (
				<div key={i} className="flex gap-2">
					<dt
						className="text-field-s font-mono uppercase tracking-wider"
						style={{ color: "var(--MuteForeground)" }}
					>
						{pair.label}:
					</dt>
					<dd className="text-field-s font-mono uppercase tracking-wider">
						{pair.value}
					</dd>
				</div>
			))}
		</dl>
	);
};

export { FieldRecordMetadata };
export default FieldRecordMetadata;
