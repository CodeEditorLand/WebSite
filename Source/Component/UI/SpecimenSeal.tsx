import React from "react";

export const SpecimenSeal: React.FC<{ ClassName?: string }> = ({
	ClassName,
}) => {
	return (
		<svg
			className={ClassName}
			aria-hidden="true"
			viewBox="0 0 200 200"
			xmlns="http://www.w3.org/2000/svg"
			style={{ maxWidth: "12%", maxHeight: "12%" }}
		>
			<defs>
				<style>{`
          .seal-green { fill: var(--Accent, #1E742A); }
          .seal-detail { fill: #D6B947; stroke: #D6B947; }
        `}</style>
			</defs>

			{/* Outer circle */}
			<circle className="seal-green" cx="100" cy="100" r="95" />

			{/* Petals/leaf shapes arranged radially (8 elements) */}
			{[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
				<ellipse
					key={angle}
					className="seal-detail"
					cx="100"
					cy="35"
					rx="12"
					ry="28"
					transform={`rotate(${angle} 100 100)`}
					fill="none"
					strokeWidth="3"
					strokeLinecap="round"
				/>
			))}

			{/* Inner ring */}
			<circle
				className="seal-detail"
				cx="100"
				cy="100"
				r="55"
				fill="none"
				strokeWidth="2"
			/>

			{/* Second layer of smaller petals */}
			{[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(
				(angle) => (
					<ellipse
						key={`inner-${angle}`}
						className="seal-green"
						cx="100"
						cy="55"
						rx="8"
						ry="18"
						transform={`rotate(${angle} 100 100)`}
						fill="none"
						strokeWidth="2"
						stroke="#D6B947"
					/>
				),
			)}

			{/* Center circle */}
			<circle className="seal-detail" cx="100" cy="100" r="8" />

			{/* Small decorative dots around center */}
			{[0, 60, 120, 180, 240, 300].map((angle) => {
				const rad = (angle * Math.PI) / 180;
				const x = 100 + 22 * Math.cos(rad);
				const y = 100 + 22 * Math.sin(rad);
				return (
					<circle
						key={`dot-${angle}`}
						className="seal-green"
						cx={x}
						cy={y}
						r="3"
					/>
				);
			})}

			{/* Tiny detail lines radiating outward */}
			{[30, 90, 150, 210, 270, 330].map((angle) => {
				const rad = (angle * Math.PI) / 180;
				const x1 = 100 + 60 * Math.cos(rad);
				const y1 = 100 + 60 * Math.sin(rad);
				const x2 = 100 + 78 * Math.cos(rad);
				const y2 = 100 + 78 * Math.sin(rad);
				return (
					<line
						key={`line-${angle}`}
						className="seal-detail"
						x1={x1}
						y1={y1}
						x2={x2}
						y2={y2}
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				);
			})}
		</svg>
	);
};

export default SpecimenSeal;
