import { ThemeImage } from "@Library/Theme";

import * as lucide from "lucide-react";

import React from "react";

import { Button } from "../UI/Button";

import { ThemeToggle } from "../UI/ThemeToggle";

import type Property from "./Interface/Property/Header.js";

/**
 * Dynamic Header component that accepts navigation and action schemas
 * Renders sticky header with logo, nav links, and CTA buttons
 */
const DynamicHeader = ({ Content, ClassName }: Property) => {
	const {
		Logo,

		Navigation,

		Actions,

		Sticky = true,

		ShowMobileMenu = true,
	} = Content;

	const [MobileMenuOpen, SetMobileMenuOpen] = React.useState(false);

	return (
		<header
			className={` ${Sticky ? "sticky top-0 z-50" : ""} w-full border-b bg-background ${ClassName || ""} `}
		>
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Logo */}
				<div className="flex items-center space-x-3">
					<div
						className="relative flex h-8 w-8 items-center justify-center overflow-hidden"
						aria-hidden="true"
					>
						<ThemeImage
							src="/Asset/Dark/Logo/Glyph/Land.svg"
							alt="Code Editor Land"
							title="Code Editor Land"
							width={32}
							height={32}
							className="h-full w-full"
						/>
					</div>
					<span className="font-medium">{Logo.Text}</span>
				</div>

				{/* Desktop Navigation */}
				<nav
					className="hidden items-center space-x-6 md:flex"
					aria-label="Main navigation"
				>
					{Navigation.map((Link, Index) => (
						<a
							key={Index}
							href={Link.Href}
							className={`transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)] ${
								Link.IsActive
									? "font-medium text-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}
							{...(Link.IsActive
								? { "aria-current": "page" as const }
								: {})}
						>
							{Link.Label}
						</a>
					))}
				</nav>

				{/* Actions */}
				<div className="flex items-center space-x-4">
					<ThemeToggle />
					{Actions.map((Action, Index) => {
						if (
							"Type" in Action &&
							Action.Type === "mobile-menu" &&
							ShowMobileMenu
						) {
							return (
								<Button
									key={Index}
									variant="ghost"
									size="icon"
									className="md:hidden"
									onClick={() =>
										SetMobileMenuOpen(!MobileMenuOpen)
									}
									aria-label="Toggle menu"
									aria-expanded={MobileMenuOpen}
								>
									<lucide.Menu className="h-4 w-4" />
								</Button>
							);
						}

						// Action is a button config
						return (
							<React.Fragment key={Index}>
								{MobileMenuOpen && ShowMobileMenu && (
									<div className="absolute left-0 right-0 top-16 z-50 flex flex-col space-y-2 border-b bg-background p-4 md:hidden">
										{Navigation.map(
											(Link, NavigationIndex) => (
												<a
													key={NavigationIndex}
													href={Link.Href}
													className="flat px-4 py-2 hover:bg-accent"
													onClick={() =>
														SetMobileMenuOpen(false)
													}
												>
													{Link.Label}
												</a>
											),
										)}
									</div>
								)}
							</React.Fragment>
						);
					})}
				</div>
			</div>
		</header>
	);
};

export { DynamicHeader };

export default DynamicHeader;
