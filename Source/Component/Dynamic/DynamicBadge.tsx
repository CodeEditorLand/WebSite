import { Badge } from "../UI/Badge";

import type Property from "./Interface/Property/Badge.js";

/**
 * Dynamic Badge with simplex noise integration.
 * Wraps the base Badge with StaccatoBadge for breathing scale.
 * The status dot pulses with StaccatoRhythm for a heartbeat effect.
 */
const DynamicBadge = ({ Content, ClassName }: Property) => {
	const {
		Text,

		Variant = "default",

		ShowDot = false,

		DotColor = "green",

		ClassName: ContentClassName,
		...props
	} = Content;

	const DotColorTokenMap: Record<string, string> = {
		green: "var(--SpinegRPC)",

		yellow: "var(--SpineTCP)",

		red: "var(--Destruct)",

		blue: "var(--SpineIPC)",
	};

	return (
		<Badge
			variant={Variant}
			className={`${ContentClassName || ""} ${ClassName || ""}`}
			{...props}
		>
			{Text}
			{ShowDot && (
				<>
					{"\u2001"}

					<span
						className="StaccatoDot StaccatoRhythmDot flat h-2 w-2"
						style={{
							backgroundColor:
								DotColorTokenMap[DotColor] ??
								"var(--SpinegRPC)",
						}}
						aria-hidden="true"
					/>
				</>
			)}
		</Badge>
	);
};

export { DynamicBadge };

export default DynamicBadge;
