import type ButtonContent from "../Content/Button.js";

export default interface Interface {
	Identifier: string;

	Name: string;

	Description?: string;

	Price: {
		Monthly: number;

		Yearly: number;
	};

	Currency?: string;

	Element?: string[];

	Feature: string[];

	CTA: ButtonContent;

	Highlighted?: boolean;

	Popular?: boolean;

	Status?: "Ready" | "ComingSoon" | "WIP";
}
