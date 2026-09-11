import type { FieldRecord } from "./FieldRecord";

export const Land: FieldRecord = {
	Id: "land",
	Category: "Product",
	Title: "LAND",
	Index: "# LAND_01",
	Stamp: ["RUST + TAURI", "NO ELECTRON"],
	Route: ["/COMPAT:VS CODE", "EXTENSIONS / UNMODIFIED"],
	Program: ["NATIVE\u2001OPEN\u2001CROSS-PLATFORM"],
	Status: {
		Label: "STATUS",
		Value: "SOURCE ACTIVE",
		Tone: "specimen",
	},
	Metadata: [
		{ Label: "TARGET", Value: "MACOS / WINDOWS / LINUX" },
		{ Label: "LICENSE", Value: "CC0" },
		{ Label: "SIGNAL", Value: "LOCAL-FIRST" },
	],
	Evidence: {
		Src: "/Evidence/Land/NightGlass-01.png",
		Alt: "Rain-speckled glass reflecting a green light at night",
		Position: "right",
	},
	Seal: "Land",
	Action: {
		Label: "ENTER",
		Href: "/Download",
	},
};
