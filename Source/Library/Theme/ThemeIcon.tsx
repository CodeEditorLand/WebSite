export interface ThemeIconProps {
	src: string;

	alt?: string;

	width?: number | string;

	height?: number | string;

	className?: string;

	[key: string]: unknown;
}

/**
 * ThemeIcon - Nocturnal Field Record (single theme).
 * Renders the standard /Image/ variant directly.
 */
export function ThemeIcon({
	src,
	alt = "",
	width,
	height,
	className,
	...props
}: ThemeIconProps) {
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

export default ThemeIcon;
