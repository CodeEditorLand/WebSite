import type { FieldRecord } from "./FieldRecord";

export const Sky: FieldRecord = {
	Id: "sky",
	Category: "Element",
	Title: "SKY",
	Index: "# SKY_01",
	Stamp: ["ASTRO UI", "WEBVIEW BRIDGE"],
	Route: ["/SCOPE:SKY", "UI LAYER"],
	Status: {
		Label: "STATUS",
		Value: "ACTIVE",
		Tone: "specimen",
	},
	Metadata: [
		{ Label: "SCOPE", Value: "GLOBAL" },
		{ Label: "VISIBILITY", Value: "HIGH" },
		{ Label: "SIGNAL", Value: "CLEAR" },
		{ Label: "ALT", Value: "SURFACE" },
	],
	Evidence: {
		Src: "/Evidence/Sky/NightSky-01.webp",
		Alt: "Night sky with distant light",
		Position: "top",
	},
	Seal: "Sky",
};
