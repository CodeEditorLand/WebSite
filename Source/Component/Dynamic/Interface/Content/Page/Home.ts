import type { HeaderContent } from "../../../../Layout/Header.js";

import type FeaturesContent from "../Feature.js";

import type PlatformGridContent from "../Grid/Platform.js";

import type HeroContent from "../Hero.js";

import type PricingContent from "../Pricing.js";

import type TestimonialContent from "../Testimonial.js";

export default interface Interface {
	Hero: HeroContent;

	Feature: FeaturesContent;

	Pricing: PricingContent;

	Testimonial: TestimonialContent;

	Download: PlatformGridContent;

	Header?: HeaderContent | undefined;

	Footer?: Record<string, unknown> | undefined;
}
