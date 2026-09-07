import type FloatingCard from "../Card/Floating.js";

import type BadgeContent from "../Content/Badge.js";

import type ButtonContent from "../Content/Button.js";

export default interface Interface {
	Badge?: BadgeContent;

	Title: string;

	TitleHighlight?: string;

	Subtitle: string;

	PrimaryCTA: ButtonContent;

	SecondaryCTA?: ButtonContent;

	FloatingCard?: FloatingCard[];

	ShowConnectingLines?: boolean;

	ShowParticles?: boolean;

	RespectReducedMotion?: boolean;
}
