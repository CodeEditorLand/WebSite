import type { FieldRecord } from "./FieldRecord";

export const Air: FieldRecord = {
	Id: "air",
	Category: "Element",
	Title: "AIR",
	Index: "# AIR_01",
	Stamp: ["BACKGROUND SERVICES", "DAEMON"],
	Route: ["/CHANNEL:AIR", "UPDATE SERVICE"],
	Status: {
		Label: "STATUS",
		Value: "ACTIVE",
		Tone: "specimen",
	},
	Metadata: [
		{ Label: "CHANNEL", Value: "OPEN" },
		{ Label: "PORT", Value: "SECURE" },
		{ Label: "PRESSURE", Value: "STABLE" },
		{ Label: "STATUS", Value: "NOMINAL" },
	],
	Evidence: {
		Src: "/Evidence/Air/Vapor-01.webp",
		Alt: "Vapor in low light macro",
		Position: "center",
	},
	Seal: "Air",
};
