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
 * Serves the standard /Image/ variant. No theme switching.
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
	const sourceRef = useRef<HTMLSourceElement>(null);

	useEffect(() => {
		if (!sourceRef.current) return;

		// Nocturnal theme: serve standard images
		sourceRef.current.media = "(prefers-color-scheme: dark)";
	}, []);

	return (
		<picture>
			<source
				ref={sourceRef}
				srcSet={src}
				media="(prefers-color-scheme: dark)"
				data-theme-dark=""
			/>
			<img
				src={src}
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
