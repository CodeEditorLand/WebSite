import * as lucide from "lucide-react";

import { Button } from "../UI/Button";

import type Property from "./Interface/Property/Button.js";

export type DynamicButtonProps = Property;

/**
 * Icon registry:direct imports for instant render.
 * Covers all icons used in CTA buttons across the site.
 */
const ButtonIconRegistry: Record<string, lucide.LucideIcon> = {
	ArrowRight: lucide.ArrowRight,

	ChevronRight: lucide.ChevronRight,

	Download: lucide.Download,

	ExternalLink: lucide.ExternalLink,

	GitFork: lucide.GitFork,

	Globe: lucide.Globe,

	Heart: lucide.Heart,

	LogIn: lucide.LogIn,

	Mail: lucide.Mail,

	Search: lucide.Search,

	Send: lucide.Send,

	Sparkles: lucide.Sparkles,
};

/**
 * Dynamic Button with simplex noise integration.
 * Icons render immediately via direct imports (no dynamic import flash).
 * Loading state uses StaccatoSpinner for breathing opacity.
 */
const DynamicButton = ({ Content, OnAction, IsLoading = false }: Property) => {
	const {
		Text,

		Icon,

		Variant = "ghost",

		Size = "default",

		Type = "button",

		Disabled = false,

		FullWidth = false,

		ClassName,

		Href,

		OnClick,
		...props
	} = Content;

	const IconComponent = Icon ? ButtonIconRegistry[Icon] || null : null;

	return (
		<Button
			variant={Variant}
			size={Size}
			type={Type}
			disabled={Disabled || IsLoading}
			className={`StaccatoButton ${FullWidth ? "w-full" : ""} ${ClassName || ""}`}
			aria-busy={IsLoading || undefined}
			onClick={() => {
				if (IsLoading) return;

				if (OnAction) OnAction();

				if (OnClick) OnClick();

				if (Href) window.location.href = Href;
			}}
			{...props}
		>
			{Text}
			{IsLoading ? (
				<>
					{"\u2001"}

					<lucide.Loader2
						className="StaccatoSpinner h-4 w-4 animate-spin"
						aria-hidden="true"
					/>
				</>
			) : IconComponent ? (
				<>
					{"\u2001"}

					<IconComponent
						className="StaccatoIcon h-5 w-5"
						aria-hidden="true"
					/>
				</>
			) : null}
		</Button>
	);
};

export { DynamicButton };

export default DynamicButton;
