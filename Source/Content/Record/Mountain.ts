import type { FieldRecord } from "./FieldRecord";

export const Mountain: FieldRecord = {
	Id: "mountain",
	Category: "Element",
	Title: "MOUNTAIN",
	Index: "# MOUNTAIN_01",
	Stamp: ["NATIVE BACKEND", "RUST + TAURI"],
	Route: ["/HOST:MOUNTAIN", "RUST SERVICES"],
	Status: {
		Label: "STATUS",
		Value: "ACTIVE",
		Tone: "specimen",
	},
	Metadata: [
		{ Label: "ROLE", Value: "FOUNDATION" },
		{ Label: "BOUNDARY", Value: "SYSTEM" },
		{ Label: "LOAD", Value: "HEAVY" },
		{ Label: "PHASE", Value: "CORE" },
	],
	Evidence: {
		Src: "/Evidence/Mountain/StoneTrace-01.webp",
		Alt: "Stone strata in low light",
		Position: "center",
	},
	Seal: "Mountain",
};
