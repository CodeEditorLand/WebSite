import type FeatureItem from "../Item/Feature.js";

export default interface Interface {
	Title?: string;

	Subtitle?: string;

	Feature: FeatureItem[];

	Columns?: 1 | 2 | 3 | 4 | 5 | 6;

	Gap?: "sm" | "md" | "lg" | "xl";
}
