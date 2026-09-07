import { cleanup, render, screen } from "@testing-library/react";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DynamicHeroSection } from "../../Component/Dynamic/DynamicHeroSection";

afterEach(() => {
	cleanup();

	vi.restoreAllMocks();
});

const MinimalContent = {
	Title: "Build the future",

	TitleHighlight: "together",

	Subtitle: "A native code editor built with Rust and TypeScript.",

	PrimaryCta: { Text: "Download", Href: "/Download" },

	FloatingCards: [],
};

describe("DynamicHeroSection", () => {
	it("renders the badge when provided", () => {
		render(
			<DynamicHeroSection
				Content={{
					...MinimalContent,
					Badge: { Text: "v1.0", Label: "New release" },
				}}
			/>,
		);

		expect(screen.getByText("v1.0")).toBeInTheDocument();
	});

	it("renders TitleHighlight span", () => {
		render(<DynamicHeroSection Content={MinimalContent} />);

		const Highlight = screen.getByText("together");

		expect(Highlight.tagName).toBe("SPAN");

		expect(Highlight.className).toContain("text-ipc");
		expect(Highlight.className).not.toContain("italic");
	});

	it("renders primary CTA button", () => {
		render(<DynamicHeroSection Content={MinimalContent} />);

		expect(screen.getByText("Download")).toBeInTheDocument();
	});

	it("renders secondary CTA button when provided", () => {
		render(
			<DynamicHeroSection
				Content={{
					...MinimalContent,
					SecondaryCTA: {
						Text: "View Source",
						Href: "https://github.com",
					},
				}}
			/>,
		);

		expect(screen.getByText("View Source")).toBeInTheDocument();
	});

	it("renders FloatingCards container", () => {
		render(
			<DynamicHeroSection
				Content={{
					...MinimalContent,
					FloatingCard: [
						{ Id: "card-1", Title: "Rust Core", Color: [] },
					],
				}}
			/>,
		);

		expect(screen.getByText("Rust Core")).toBeInTheDocument();
	});

	it("skips animation when RespectReducedMotion is true", () => {
		const MatchMediaMock = vi.fn().mockReturnValue({
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		});

		Object.defineProperty(window, "matchMedia", {
			value: MatchMediaMock,
			writable: true,
		});

		// Should render without throwing even with reduced motion
		expect(() =>
			render(
				<DynamicHeroSection
					Content={{ ...MinimalContent, RespectReducedMotion: true }}
				/>,
			),
		).not.toThrow();
	});
});
