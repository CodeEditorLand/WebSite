import React from "react";

import { cn } from "../UI/Utility";

export type FieldRecordElement =
	"Land" | "Mountain" | "Cocoon" | "Wind" | "Sky" | "Air" | "Echo" | "Grove";

export interface FieldRecordSealProps {
	element: FieldRecordElement;
	className?: string;
	size?: number;
}

const SealPattern: React.FC<{ element: FieldRecordElement }> = ({
	element,
}) => {
	const stroke = "var(--Accent)";
	const detail = "#D6B947";

	switch (element) {
		case "Land":
			return (
				<svg
					viewBox="0 0 64 64"
					xmlns="http://www.w3.org/2000/svg"
					className="h-full w-full"
				>
					<circle
						cx="32"
						cy="32"
						r="28"
						fill="none"
						stroke={stroke}
						strokeWidth="1"
					/>
					<circle
						cx="32"
						cy="32"
						r="20"
						fill="none"
						stroke={stroke}
						strokeWidth="1"
					/>
					<circle
						cx="32"
						cy="32"
						r="12"
						fill="none"
						stroke={stroke}
						strokeWidth="1"
					/>
					<circle cx="32" cy="32" r="4" fill={stroke} />
				</svg>
			);
		case "Mountain":
			return (
				<svg
					viewBox="0 0 64 64"
					xmlns="http://www.w3.org/2000/svg"
					className="h-full w-full"
				>
					<path
						d="M4 56 L20 28 L32 44 L44 20 L60 56"
						fill="none"
						stroke={stroke}
						strokeWidth="1"
					/>
					<path
						d="M8 60 L24 36 L36 50 L48 28 L56 60"
						fill="none"
						stroke={detail}
						strokeWidth="0.5"
					/>
					<path
						d="M12 64 L28 44 L38 56 L50 36 L52 64"
						fill="none"
						stroke={stroke}
						strokeWidth="0.5"
					/>
				</svg>
			);
		case "Cocoon":
			return (
				<svg
					viewBox="0 0 64 64"
					xmlns="http://www.w3.org/2000/svg"
					className="h-full w-full"
				>
					<path
						d="M32 4 C48 16 56 32 52 52 C48 60 38 64 32 64 C26 64 16 60 12 52 C8 32 16 16 32 4 Z"
						fill="none"
						stroke={stroke}
						strokeWidth="1"
					/>
					<path
						d="M32 12 C42 20 48 34 44 50 C42 56 36 58 32 58 C28 58 22 56 20 50 C16 34 22 20 32 12"
						fill="none"
						stroke={detail}
						strokeWidth="0.5"
					/>
					<path
						d="M32 20 C38 26 42 38 38 50 C36 54 34 54 32 54 C30 54 28 54 26 50 C22 38 26 26 32 20"
						fill="none"
						stroke={stroke}
						strokeWidth="0.5"
					/>
				</svg>
			);
		case "Wind":
			return (
				<svg
					viewBox="0 0 64 64"
					xmlns="http://www.w3.org/2000/svg"
					className="h-full w-full"
				>
					<circle
						cx="32"
						cy="32"
						r="28"
						fill="none"
						stroke={stroke}
						strokeWidth="1"
					/>
					<path d="M32 4 L32 60" stroke={stroke} strokeWidth="0.5" />
					<path d="M4 32 L60 32" stroke={stroke} strokeWidth="0.5" />
					<path d="M10 10 L54 54" stroke={detail} strokeWidth="0.5" />
					<path d="M54 10 L10 54" stroke={detail} strokeWidth="0.5" />
					<path d="M32 8 L36 28 L32 32 L28 28 Z" fill={stroke} />
				</svg>
			);
		case "Sky":
			return (
				<svg
					viewBox="0 0 64 64"
					xmlns="http://www.w3.org/2000/svg"
					className="h-full w-full"
				>
					<circle
						cx="32"
						cy="32"
						r="28"
						fill="none"
						stroke={stroke}
						strokeWidth="1"
					/>
					<circle
						cx="32"
						cy="32"
						r="20"
						fill="none"
						stroke={stroke}
						strokeWidth="0.5"
					/>
					<circle
						cx="32"
						cy="32"
						r="12"
						fill="none"
						stroke={stroke}
						strokeWidth="0.5"
					/>
					<circle cx="24" cy="20" r="1" fill={detail} />
					<circle cx="44" cy="16" r="1" fill={detail} />
					<circle cx="48" cy="40" r="1" fill={detail} />
					<circle cx="20" cy="44" r="1" fill={detail} />
					<circle cx="36" cy="48" r="1" fill={detail} />
				</svg>
			);
		case "Air":
			return (
				<svg
					viewBox="0 0 64 64"
					xmlns="http://www.w3.org/2000/svg"
					className="h-full w-full"
				>
					<circle
						cx="32"
						cy="32"
						r="20"
						fill="none"
						stroke={stroke}
						strokeWidth="1"
					/>
					<circle
						cx="32"
						cy="32"
						r="12"
						fill="none"
						stroke={stroke}
						strokeWidth="0.5"
					/>
					<path
						d="M52 32 A20 20 0 0 1 32 52"
						fill="none"
						stroke={detail}
						strokeWidth="0.5"
					/>
					<path
						d="M12 32 A20 20 0 0 1 32 12"
						fill="none"
						stroke={detail}
						strokeWidth="0.5"
					/>
					<circle cx="52" cy="32" r="2" fill={stroke} />
					<circle cx="12" cy="32" r="2" fill={stroke} />
				</svg>
			);
		case "Echo":
			return (
				<svg
					viewBox="0 0 64 64"
					xmlns="http://www.w3.org/2000/svg"
					className="h-full w-full"
				>
					<circle cx="32" cy="32" r="4" fill={stroke} />
					<circle
						cx="32"
						cy="32"
						r="12"
						fill="none"
						stroke={stroke}
						strokeWidth="1"
					/>
					<circle
						cx="32"
						cy="32"
						r="20"
						fill="none"
						stroke={stroke}
						strokeWidth="0.5"
					/>
					<circle
						cx="32"
						cy="32"
						r="28"
						fill="none"
						stroke={detail}
						strokeWidth="0.5"
					/>
				</svg>
			);
		case "Grove":
			return (
				<svg
					viewBox="0 0 64 64"
					xmlns="http://www.w3.org/2000/svg"
					className="h-full w-full"
				>
					<path d="M32 60 L32 20" stroke={stroke} strokeWidth="1" />
					<path d="M32 40 L20 28" stroke={stroke} strokeWidth="0.5" />
					<path d="M32 40 L44 28" stroke={stroke} strokeWidth="0.5" />
					<path d="M32 30 L18 20" stroke={detail} strokeWidth="0.5" />
					<path d="M32 30 L46 20" stroke={detail} strokeWidth="0.5" />
					<circle cx="32" cy="16" r="3" fill={stroke} />
					<circle cx="18" cy="18" r="2" fill={detail} />
					<circle cx="46" cy="18" r="2" fill={detail} />
					<circle cx="20" cy="26" r="1.5" fill={stroke} />
					<circle cx="44" cy="26" r="1.5" fill={stroke} />
				</svg>
			);
		default:
			return null;
	}
};

const FieldRecordSeal: React.FC<FieldRecordSealProps> = ({
	element,
	className,
	size = 64,
}) => {
	return (
		<div
			className={cn("inline-block", className)}
			style={{
				width: size,
				height: size,
				maxWidth: "12%",
			}}
			aria-hidden="true"
		>
			<SealPattern element={element} />
		</div>
	);
};

export { FieldRecordSeal };
export default FieldRecordSeal;
