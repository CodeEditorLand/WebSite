import type { FieldRecord } from "./FieldRecord";

export const Wind: FieldRecord = {
	Id: "wind",
	Category: "Element",
	Title: "WIND",
	Index: "# WIND_01",
	Stamp: ["WORKBENCH", "EFFECT-TS LAYERS"],
	Route: ["/FLOW:WIND", "SERVICE LAYER"],
	Status: {
		Label: "STATUS",
		Value: "ACTIVE",
		Tone: "specimen",
	},
	Metadata: [
		{ Label: "FLOW", Value: "CONTROLLED" },
		{ Label: "DIRECTION", Value: "SOUTH" },
		{ Label: "LATENCY", Value: "LOW" },
		{ Label: "RANGE", Value: "FULL" },
	],
	Evidence: {
		Src: "/Evidence/Wind/WetCable-01.webp",
		Alt: "Wet cable in long exposure",
		Position: "left",
	},
	Seal: "Wind",
};
