export default interface Interface {
	Id: string;

	Title: string;

	/** Benefit-oriented tooltip for the card icon (falls back to Title). */
	Tooltip?: string | string[];

	Icon?: string;

	Color?: string[];
}
