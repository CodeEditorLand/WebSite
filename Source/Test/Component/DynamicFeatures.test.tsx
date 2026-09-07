import { cleanup, render, screen } from "@testing-library/react";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DynamicFeatures } from "../../Component/Dynamic/DynamicFeatures";

beforeEach(() => {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: vi.fn().mockReturnValue({
			matches: false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		}),
	});
});

afterEach(() => {
	cleanup();

	vi.restoreAllMocks();
});

const SampleFeatures = [
	{
		Id: "performance",

		Icon: "Zap",

		Title: "Performance",

		Description: "Native speed via Rust.",
	},

	{
		Id: "compatibility",

		Icon: "Box",

		Title: "Compatibility",

		Description: "Run existing VS Code extensions.",
	},

	{
		Id: "architecture",

		Icon: "Cpu",

		Title: "Architecture",

		Description: "Effect-TS powered services.",
	},
];

const SampleContent = {
	Title: "Features",

	Subtitle: "What makes Land different.",

	Features: SampleFeatures,
};

describe("DynamicFeatures", () => {
	it("renders all feature cards", () => {
		render(<DynamicFeatures Content={SampleContent} />);

		for (const Feature of SampleFeatures) {
			expect(screen.getByText(Feature.Title)).toBeInTheDocument();
		}
	});

	it("renders each feature description", () => {
		render(<DynamicFeatures Content={SampleContent} />);

		for (const Feature of SampleFeatures) {
			expect(screen.getByText(Feature.Description)).toBeInTheDocument();
		}
	});

	it("renders section title and subtitle", () => {
		render(<DynamicFeatures Content={SampleContent} />);

		// The section also has its own hardcoded "// Features" eyebrow label,
		// which collides with Content.Title's sample value here - target the
		// heading specifically so this asserts Content.Title, not the label.
		expect(
			screen.getByRole("heading", { name: "Features" }),
		).toBeInTheDocument();

		expect(
			screen.getByText("What makes Land different."),
		).toBeInTheDocument();
	});

	it("renders the section with aria-label", () => {
		render(<DynamicFeatures Content={SampleContent} />);

		const Section = screen.getByRole("region", { name: /features/i });

		expect(Section).toBeInTheDocument();
	});

	it("renders without title or subtitle when omitted", () => {
		render(<DynamicFeatures Content={{ Feature: SampleFeatures }} />);

		for (const Feature of SampleFeatures) {
			expect(screen.getByText(Feature.Title)).toBeInTheDocument();
		}
	});
});
