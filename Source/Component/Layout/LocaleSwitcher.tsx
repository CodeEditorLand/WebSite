"use client";

import {
	LocaleLabel,
	SupportedLocaleList,
	SwitchLocale,
	type SupportedLocale,
} from "@/Library/I18n/Client.js";

import { ChevronDown } from "lucide-react";

import { useTranslation } from "react-i18next";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../UI/DropdownMenu.js";

const LocaleSwitcher = () => {
	const { i18n } = useTranslation();

	const CurrentLocale = (i18n.language || "en") as SupportedLocale;

	const HandleChange = (Value: SupportedLocale) => {
		const ScrollY = window.scrollY;

		const MainContent = document.getElementById("main-content");

		const PreviousMinHeight = MainContent?.style.minHeight ?? "";

		if (MainContent) {
			MainContent.style.minHeight = `${MainContent.offsetHeight}px`;
		}

		const Guard = () => {
			if (window.scrollY !== ScrollY) {
				window.scrollTo({ top: ScrollY, behavior: "instant" });
			}
		};

		window.addEventListener("scroll", Guard, { passive: true });

		const ReleasePinnedLayout = () => {
			window.removeEventListener("scroll", Guard);

			window.scrollTo({ top: ScrollY, behavior: "instant" });

			if (MainContent) {
				MainContent.style.minHeight = PreviousMinHeight;
			}
		};

		SwitchLocale(Value)
			.then(() => {
				requestAnimationFrame(() => {
					requestAnimationFrame(ReleasePinnedLayout);
				});
			})
			.catch(() => {
				ReleasePinnedLayout();
			});
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<jelly-button
					squish
					aria-label="Select language"
					style={
						{
							"--jelly-button-height": "36px",
							"--jelly-button-padding-inline": "12px",
							"--jelly-button-min-width": "0px",
							"--jelly-button-radius": "0px",
							"--jelly-fill": "transparent",
							"--jelly-ring": "var(--Accent)",
							"--jelly-label":
								"var(--HeaderFg, var(--Foreground))",
						} as React.CSSProperties
					}
				>
					<span className="flex items-center gap-1.5 font-medium">
						<span>{LocaleLabel[CurrentLocale]}</span>
						<ChevronDown
							size={14}
							className="opacity-60 transition-transform duration-200 [[data-state=open]_&]:rotate-180"
						/>
					</span>
				</jelly-button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-[8rem]">
				{SupportedLocaleList.map((Locale) => (
					<DropdownMenuItem
						key={Locale}
						onClick={() => HandleChange(Locale)}
						className={
							Locale === CurrentLocale
								? "font-medium text-accent"
								: "text-card-foreground opacity-70"
						}
					>
						{LocaleLabel[Locale]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export { LocaleSwitcher };

export default LocaleSwitcher;
