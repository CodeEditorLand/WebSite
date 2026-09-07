import { cleanup, render, screen } from "@testing-library/react";

import UserEvent from "@testing-library/user-event";

import i18n from "i18next";

import { I18nextProvider } from "react-i18next";

import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

import { DynamicPricing } from "../../Component/Dynamic/DynamicPricing";

beforeAll(() => {
	if (!i18n.isInitialized) {
		i18n.init({
			resources: {
				en: {
					home: {
						"pricing.labels.monthly": "Monthly",
						"pricing.labels.yearly": "Yearly",
						"pricing.labels.savings": "(Save up to 20%)",
						"pricing.labels.popular": "Most Popular",
						"pricing.labels.perMonth": "/month",
						"pricing.labels.perYear": "/year",
						"pricing.labels.free": "Free",
						"pricing.toggle.toMonthly": "Switch to Monthly billing",
						"pricing.toggle.toYearly": "Switch to Yearly billing",
					},
				},
			},
			lng: "en",
			fallbackLng: "en",
			ns: ["home"],
			defaultNS: "home",
			interpolation: { escapeValue: false },
		});
	}
});

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

const MakeTier = (Id: string, Name: string, Popular = false) => ({
	Id,
	Name,
	Price: { Monthly: 0, Yearly: 0 },
	Features: ["Feature A", "Feature B"],
	CTA: { Text: "Get started", Href: "/Download" },
	Popular,
});

const Wrap = (Node: React.ReactNode) => (
	<I18nextProvider i18n={i18n}>{Node}</I18nextProvider>
);

describe("DynamicPricing", () => {
	it("renders all tier names", () => {
		render(
			Wrap(
				<DynamicPricing
					Content={{
						Tier: [
							MakeTier("community", "Community"),
							MakeTier("pro", "Pro"),
						],
					}}
				/>,
			),
		);

		expect(screen.getByText("Community")).toBeInTheDocument();

		expect(screen.getByText("Pro")).toBeInTheDocument();
	});

	it("renders Elements section when Elements array is provided", () => {
		render(
			Wrap(
				<DynamicPricing
					Content={{
						Tier: [
							{
								...MakeTier("free", "Free"),
								Element: [
									"Mountain\u2001\u26f0\ufe0f\nNative Process Manager\nReplaces Electron",
									"Cocoon\u2001🦋\nExtension Host\nVS Code extensions run unchanged",
								],
							},
						],
					}}
				/>,
			),
		);

		expect(screen.getByText("Elements")).toBeInTheDocument();

		expect(screen.getByText("Native Process Manager")).toBeInTheDocument();
	});

	it("renders element name line in colored span", () => {
		render(
			Wrap(
				<DynamicPricing
					Content={{
						Tier: [
							{
								...MakeTier("free", "Free"),
								Element: [
									"Air\u2001🪁\nBackground Daemon\nSilent updates",
								],
							},
						],
					}}
				/>,
			),
		);

		expect(screen.getByText("Background Daemon")).toBeInTheDocument();

		expect(screen.getByText("Silent updates")).toBeInTheDocument();
	});

	it("renders Coming Up separator when tier has both Elements and Features", () => {
		render(
			Wrap(
				<DynamicPricing
					Content={{
						Tier: [
							{
								...MakeTier("free", "Free"),
								Element: [
									"Mountain\u2001\u26f0\ufe0f\nNative Process Manager\nReplaces Electron",
								],
							},
						],
					}}
				/>,
			),
		);

		// Coming Up section appears when both Elements and Features are present
		expect(screen.getByText("Elements")).toBeInTheDocument();
	});

	it("renders PopularLabel when Popular is true", () => {
		render(
			Wrap(
				<DynamicPricing
					Content={{
						Tier: [MakeTier("pro", "Pro", true)],
						Labels: { Popular: "Most Popular" },
					}}
				/>,
			),
		);

		expect(screen.getByText("Most Popular")).toBeInTheDocument();
	});

	it("does not render PopularLabel when Popular is false", () => {
		render(
			Wrap(
				<DynamicPricing
					Content={{
						Tier: [MakeTier("free", "Free", false)],
						Labels: { Popular: "Most Popular" },
					}}
				/>,
			),
		);

		expect(screen.queryByText("Most Popular")).not.toBeInTheDocument();
	});
});
