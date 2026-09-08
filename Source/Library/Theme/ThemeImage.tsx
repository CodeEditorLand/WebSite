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
 *
 * For LIGHT backgrounds (warm-white cards): use the LIGHT image variant.
 * For DARK backgrounds (black canvas): use the DARK image variant.
 *
 * Convention:
 *   Light: /Image/Foo.svg or /Asset/Foo.svg
 *   Dark:  /Dark/Image/Foo.svg or /Asset/Dark/Foo.svg
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
	const IsDark = src.includes("/Dark/") || src.includes("/Asset/Dark/");

	const Light =
		darkSrc ??
		(IsDark
			? src
					.replace(/^\/Dark\/Image\//, "/Image/")
					.replace(/^\/Asset\/Dark\//, "/Asset/")
			: src);

	const Dark = IsDark
		? src
		: src.includes("/Asset/")
			? src.replace(/^\/Asset\//, "/Asset/Dark/")
			: src.replace(/^\/Image\//, "/Dark/Image/");

	const sourceRef = useRef<HTMLSourceElement>(null);

	useEffect(() => {
		if (!sourceRef.current) return;

		sourceRef.current.media = "(prefers-color-scheme: dark)";
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
				src={Light}
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
