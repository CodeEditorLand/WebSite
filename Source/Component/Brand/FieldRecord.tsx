import React from "react";

import { cn } from "../UI/Utility";

import {
	FieldRecordDataCard,
	type FieldRecordDataCardProps,
} from "./FieldRecordDataCard";
import {
	FieldRecordEvidence,
	type FieldRecordEvidenceProps,
} from "./FieldRecordEvidence";
import {
	FieldRecordIndex,
	type FieldRecordIndexProps,
} from "./FieldRecordIndex";
import {
	FieldRecordMetadata,
	type FieldRecordMetadataProps,
} from "./FieldRecordMetadata";
import { FieldRecordSeal, type FieldRecordSealProps } from "./FieldRecordSeal";
import {
	FieldRecordAction,
	type FieldRecordActionProps,
} from "./FieldRecordAction";
import {
	FieldRecordStatus,
	type FieldRecordStatusProps,
} from "./FieldRecordStatus";

export interface FieldRecordProps {
	index?: FieldRecordIndexProps;
	metadata?: FieldRecordMetadataProps;
	seal?: FieldRecordSealProps;
	action?: FieldRecordActionProps;
	status?: FieldRecordStatusProps;
	evidence: FieldRecordEvidenceProps;
	dataCard?: FieldRecordDataCardProps;
	className?: string;
}

const FieldRecord: React.FC<FieldRecordProps> = ({
	index,
	metadata,
	seal,
	action,
	status,
	evidence,
	dataCard,
	className,
}) => {
	return (
		<div
			className={cn(
				"flex flex-col md:flex-row",
				"bg-background",
				className,
			)}
			style={{
				borderRadius: 0,
			}}
		>
			{/* Left panel: warm-white data card */}
			<div className="min-w-0 flex-1">
				<FieldRecordDataCard {...dataCard} className="h-full">
					<div className="flex h-full flex-col gap-4">
						{index && <FieldRecordIndex {...index} />}
						{metadata && <FieldRecordMetadata {...metadata} />}
						{status && <FieldRecordStatus {...status} />}
						{seal && <FieldRecordSeal {...seal} />}
						{action && <FieldRecordAction {...action} />}
					</div>
				</FieldRecordDataCard>
			</div>

			{/* Black gutter */}
			<div
				className="hidden w-px bg-background md:block"
				style={{ backgroundColor: "var(--Background)" }}
			/>

			{/* Right panel: full-bleed evidence */}
			<div className="min-w-0 flex-1">
				<FieldRecordEvidence {...evidence} className="h-full" />
			</div>
		</div>
	);
};

export {
	FieldRecord,
	FieldRecordDataCard,
	FieldRecordEvidence,
	FieldRecordIndex,
	FieldRecordMetadata,
	FieldRecordSeal,
	FieldRecordAction,
	FieldRecordStatus,
};

export default FieldRecord;
