import type PricingLabels from "../Label/Pricing.js";

import type PricingTier from "../Tier/Pricing.js";

export default interface Interface {
	Title?: string;

	Subtitle?: string;

	Tier: PricingTier[];

	ShowMonthlyYearlyToggle?: boolean;

	DefaultYearly?: boolean;

	Labels?: PricingLabels;
}
