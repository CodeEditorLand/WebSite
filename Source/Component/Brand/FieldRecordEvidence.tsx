import React from "react";

import { cn } from "../UI/Utility";

export interface FieldRecordEvidenceProps {
	src: string;
	alt: string;
	position?: string;
	className?: string;
}

const FieldRecordEvidence: React.FC<FieldRecordEvidenceProps> = ({
	src,
	alt,
	position = "center",
	className,
}) => {
	return (
		<div
			className={cn("overflow-hidden", className)}
			style={{ borderRadius: 0 }}
		>
			<img
				src={src}
				alt={alt}
				aria-label={alt}
				className="block h-full w-full"
				style={{
					objectFit: "cover",
					objectPosition: position,
					borderRadius: 0,
				}}
			/>
		</div>
	);
};

export { FieldRecordEvidence };
export default FieldRecordEvidence;
