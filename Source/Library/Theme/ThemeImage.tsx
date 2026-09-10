export interface ThemeImageProps {
	src: string;

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
	alt = "",
	width,
	height,
	className,
	...props
}: ThemeImageProps) {
	return (
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={className}
			{...props}
		/>
	);
}

export default ThemeImage;