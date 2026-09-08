import { useEffect, useRef } from "react";

export interface ThemeImageProps {
	src: string;

	darkSrc?: string;

	alt?: string;

	width?: number | string;

	height?: number | string;

	className?: string;

	[key: string]: unknown;
}

/**
 * ThemeImage - Nocturnal Field Record (single theme).
 * Serves the dark variant. If src already points to a /Dark/ path, uses it
 * directly. Otherwise, derives the dark path from the light src.
 */
export function ThemeImage({
	src,
	darkSrc,
	alt = "",
	width,
	height,
	className,
	...props
}: ThemeImageProps) {
	const Dark =
		darkSrc ??
		(src.includes("/Dark/")
			? src
			: src
					.replace(/^\/Image\//, "/Dark/Image/")
					.replace(/^\/Asset\//, "/Asset/Dark/"));
	const sourceRef = useRef<HTMLSourceElement>(null);

	useEffect(() => {
		if (!sourceRef.current) return;

		// Nocturnal theme: always serve dark images
		sourceRef.current.media = "all";
	}, []);

	return (
		<picture>
			<source
				ref={sourceRef}
				srcSet={Dark}
				media="(prefers-color-scheme: dark)"
				data-theme-dark=""
			/>
			<img
				src={Dark}
				alt={alt}
				width={width}
				height={height}
				className={className}
				{...props}
			/>
		</picture>
	);
}

export default ThemeImage;
