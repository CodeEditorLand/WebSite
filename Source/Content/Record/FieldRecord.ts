export type RecordCategory =
	"Product" | "Element" | "Release" | "Document" | "Status";

export type RecordStatus =
	| "ready"
	| "active"
	| "loading"
	| "preparing"
	| "verified"
	| "unavailable"
	| "interrupted"
	| "archived";

export type StatusTone = "ink" | "specimen" | "quiet";

export type FieldRecord = {
	Id: string;
	Category: RecordCategory;
	Title: string;
	Relation?: string;
	Index: string;
	Stamp?: string[];
	Route?: string[];
	Program?: string[];
	Status: {
		Label: string;
		Value: string;
		Tone: StatusTone;
	};
	Metadata: Array<{
		Label: string;
		Value: string;
	}>;
	Evidence: {
		Src: string;
		Alt: string;
		Position?: string;
	};
	Seal:
		| "Land"
		| "Mountain"
		| "Cocoon"
		| "Wind"
		| "Sky"
		| "Air"
		| "Echo"
		| "Grove";
	Action?: {
		Label: string;
		Href: string;
	};
};
