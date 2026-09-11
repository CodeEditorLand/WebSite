import React from "react";

import { cn } from "../UI/Utility";

import type { FieldRecord as FieldRecordData } from "../../Content/Record/FieldRecord";

import { FieldRecordDataCard } from "./FieldRecordDataCard";
import { FieldRecordEvidence } from "./FieldRecordEvidence";
import { FieldRecordIndex } from "./FieldRecordIndex";
import { FieldRecordMetadata } from "./FieldRecordMetadata";
import { FieldRecordSeal } from "./FieldRecordSeal";
import { FieldRecordAction } from "./FieldRecordAction";
import {
	FieldRecordStatus,
	type FieldRecordStatusState,
} from "./FieldRecordStatus";

export interface FieldRecordProps {
	record: FieldRecordData;
	className?: string;
}

/**
 * FieldRecord - canonical record-card template.
 *
 * Renders the Nocturnal Field Record series template from a single
 * `FieldRecord` content object (Source/Content/Record/<Element>.ts):
 *
 *   # <INDEX>              (FieldRecordIndex)
 *   〈<STAMP>〉              (runtime claims)
 *   /<ROUTE>               (route block)
 *   <PROGRAM>              (program line, em-quad separators)
 *   [blank zone]           (flex-1, 15-25% of the card)
 *   <TITLE>:               (title block)
 *   ↳<RELATION>            (proposition, when present)
 *   STATUS: <STATE>        (FieldRecordStatus)
 *   <METADATA ROWS>        (FieldRecordMetadata - TARGET/LICENSE/SIGNAL etc.)
 *   [ACTION]               (FieldRecordAction, when present)
 *   [SEAL]                 (FieldRecordSeal, upper-right, max 12% width)
 *
 * Composes the FieldRecordDataCard/Index/Metadata/Seal/Action/Status set
 * exactly like the hero (DynamicHeroSection). The hero renders its own
 * two-panel composition directly and does not use this orchestrator; this
 * component is the single-card template for element records (F4 series).
 */
const FieldRecord: React.FC<FieldRecordProps> = ({ record, className }) => {
	const Index = record.Index.replace(/^#\s*/, "");

	const Status = record.Status.Value.toLowerCase() as FieldRecordStatusState;

	return (
		<FieldRecordDataCard className={cn("h-full", className)}>
			<div className="flex h-full flex-col justify-between">
				{/* Top: Index (left) + Seal (upper-right) */}
				<div className="flex items-start justify-between">
					<FieldRecordIndex index={Index} />
					<FieldRecordSeal element={record.Seal} />
				</div>

				{/* Runtime stamp */}
				{record.Stamp?.length ? (
					<div className="mt-8">
						{record.Stamp.map((Line) => (
							<p
								key={Line}
								className="text-field-l font-mono font-normal leading-[1.0] tracking-[-0.02em] text-card-foreground"
							>
								〈{Line}〉
							</p>
						))}
					</div>
				) : null}

				{/* Route block */}
				{record.Route?.length ? (
					<div className="mt-6">
						{record.Route.map((Line) => (
							<p
								key={Line}
								className="text-field-s font-mono font-normal leading-[1.1] text-card-foreground opacity-70"
							>
								{Line}
							</p>
						))}
					</div>
				) : null}

				{/* Program line */}
				{record.Program?.length ? (
					<p className="text-field-s mt-6 font-mono uppercase tracking-[0.25em] text-card-foreground opacity-60">
						{record.Program.join("\u2001")}
					</p>
				) : null}

				{/* MAJOR BLANK ZONE */}
				<div className="my-8 flex-1" aria-hidden="true" />

				{/* Title block + proposition */}
				<div>
					<p className="text-field-l font-mono font-normal leading-[1.08] text-card-foreground">
						{record.Title}:
					</p>

					{record.Relation ? (
						<p className="text-field-s mt-3 font-mono font-normal leading-[1.1] text-card-foreground opacity-70">
							↳{record.Relation}
						</p>
					) : null}
				</div>

				{/* Status */}
				<div className="mt-6">
					<FieldRecordStatus
						status={Status}
						tone={record.Status.Tone}
					/>
				</div>

				{/* Metadata rows */}
				{record.Metadata?.length ? (
					<div className="mt-4">
						<FieldRecordMetadata
							rows={record.Metadata.map((Row) => ({
								label: Row.Label,
								value: Row.Value,
							}))}
						/>
					</div>
				) : null}

				{/* Action */}
				{record.Action ? (
					<div className="mt-6">
						<FieldRecordAction
							label={record.Action.Label}
							href={record.Action.Href}
						/>
					</div>
				) : null}
			</div>
		</FieldRecordDataCard>
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