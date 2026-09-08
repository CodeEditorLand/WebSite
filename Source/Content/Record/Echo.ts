import type { FieldRecord } from "./FieldRecord";

export const Echo: FieldRecord = {
	Id: "echo",
	Category: "Element",
	Title: "ECHO",
	Index: "# ECHO_01",
	Stamp: ["WORK-STEALING", "SCHEDULER"],
	Route: ["/FREQUENCY:ECHO", "TASK POOL"],
	Status: {
		Label: "STATUS",
		Value: "ACTIVE",
		Tone: "specimen",
	},
	Metadata: [
		{ Label: "FREQUENCY", Value: "HIGH" },
		{ Label: "RESPONSE", Value: "FAST" },
		{ Label: "NOISE", Value: "LOW" },
		{ Label: "RETURN", Value: "QUICK" },
	],
	Evidence: {
		Src: "/Evidence/Echo/RippleGrain-01.webp",
		Alt: "Ripple in grainy water",
		Position: "center",
	},
	Seal: "Echo",
};
