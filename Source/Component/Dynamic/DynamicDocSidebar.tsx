import { useState } from "react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../UI/Collapsible.js";

import type {
	DocGroup,
	DocItem,
	DocSection,
} from "./Interface/Content/Page/Doc.js";

const IsDocGroup = (Item: DocItem): Item is DocGroup => "Children" in Item;

interface DynamicDocSidebarProps {
	Sections: DocSection[];

	ActiveId?: string;

	/** Rendered inline as a mobile panel (no sticky wrapper, full width) */
	Mobile?: boolean;
}

const DynamicDocSidebar = ({
	Sections,
	ActiveId,
	Mobile = false,
}: DynamicDocSidebarProps) => {
	// Auto-expand the section that contains the active page; collapse all others.
	const ActiveSectionId = Sections.find((S) =>
		S.Children?.some((Item) =>
			IsDocGroup(Item)
				? Item.Children.some((C) => C.Id === ActiveId)
				: Item.Id === ActiveId,
		),
	)?.Id;

	const [CollapsedSections, SetCollapsedSections] = useState<Set<string>>(
		new Set(
			Sections.filter((S) => S.Id !== ActiveSectionId).map((S) => S.Id),
		),
	);

	const ToggleSection = (Id: string) => {
		SetCollapsedSections((Previous) => {
			const Next = new Set(Previous);

			if (Next.has(Id)) {
				Next.delete(Id);
			} else {
				Next.add(Id);
			}

			return Next;
		});
	};

	// Same auto-expand behavior one level deeper, for groups nested inside a section.
	const AllGroups = Sections.flatMap((S) => S.Children ?? []).filter(
		IsDocGroup,
	);

	const ActiveGroupId = AllGroups.find((G) =>
		G.Children.some((C) => C.Id === ActiveId),
	)?.Id;

	const [CollapsedGroups, SetCollapsedGroups] = useState<Set<string>>(
		new Set(
			AllGroups.filter((G) => G.Id !== ActiveGroupId).map((G) => G.Id),
		),
	);

	const ToggleGroup = (Id: string) => {
		SetCollapsedGroups((Previous) => {
			const Next = new Set(Previous);

			if (Next.has(Id)) {
				Next.delete(Id);
			} else {
				Next.add(Id);
			}

			return Next;
		});
	};

	const Nav = (
		<nav
			aria-label="Documentation sections"
			className={Mobile ? "pt-2" : undefined}
		>
			<ul role="list" className="space-y-0.5">
				{Sections.map((Section) => {
					const HasChildren =
						Section.Children && Section.Children.length > 0;

					const IsOpen = !CollapsedSections.has(Section.Id);

					if (HasChildren) {
						return (
							<li key={Section.Id}>
								<Collapsible
									open={IsOpen}
									onOpenChange={() =>
										ToggleSection(Section.Id)
									}
								>
									<CollapsibleTrigger className="flat flex w-full items-center justify-between px-2 py-1.5 text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]">
										<span className="font-mono">
											{Section.Label}
										</span>
										<span
											aria-hidden="true"
											className={`transition-transform duration-150 ${IsOpen ? "rotate-90" : ""}`}
										>
											›
										</span>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<ul
											role="list"
											className="ml-2 mt-0.5 space-y-0.5 border-l border-border pl-3"
										>
											{Section.Children!.map((Item) => {
												if (IsDocGroup(Item)) {
													const IsGroupOpen =
														!CollapsedGroups.has(
															Item.Id,
														);

													return (
														<li key={Item.Id}>
															<Collapsible
																open={
																	IsGroupOpen
																}
																onOpenChange={() =>
																	ToggleGroup(
																		Item.Id,
																	)
																}
															>
																<CollapsibleTrigger className="flat flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]">
																	<span>
																		{
																			Item.Label
																		}
																	</span>
																	<span
																		aria-hidden="true"
																		className={`transition-transform duration-150 ${IsGroupOpen ? "rotate-90" : ""}`}
																	>
																		›
																	</span>
																</CollapsibleTrigger>
																<CollapsibleContent>
																	<ul
																		role="list"
																		className="ml-2 mt-0.5 space-y-0.5 border-l border-border pl-3"
																	>
																		{Item.Children.map(
																			(
																				Child,
																			) => {
																				const IsActive =
																					ActiveId ===
																					Child.Id;

																				return (
																					<li
																						key={
																							Child.Id
																						}
																					>
																						<a
																							href={`/Doc/${Child.Id}`}
																							aria-current={
																								IsActive
																									? "page"
																									: undefined
																							}
																							className={`flat block px-2 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)] ${
																								IsActive
																									? "bg-accent font-medium text-accent-foreground"
																									: "text-muted-foreground"
																							}`}
																						>
																							{
																								Child.Label
																							}
																						</a>
																					</li>
																				);
																			},
																		)}
																	</ul>
																</CollapsibleContent>
															</Collapsible>
														</li>
													);
												}

												const IsActive =
													ActiveId === Item.Id;

												return (
													<li key={Item.Id}>
														<a
															href={`/Doc/${Item.Id}`}
															aria-current={
																IsActive
																	? "page"
																	: undefined
															}
															className={`flat block px-2 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)] ${
																IsActive
																	? "bg-accent font-medium text-accent-foreground"
																	: "text-muted-foreground"
															}`}
														>
															{Item.Label}
														</a>
													</li>
												);
											})}
										</ul>
									</CollapsibleContent>
								</Collapsible>
							</li>
						);
					}

					return (
						<li key={Section.Id}>
							<a
								href={`/Doc/${Section.Id}`}
								className="flat block px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
							>
								{Section.Label}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);

	if (!Mobile) return Nav;

	// Mobile: wrap in a collapsible panel
	const AllLeaves = Sections.flatMap((S) => S.Children ?? []).flatMap(
		(Item) => (IsDocGroup(Item) ? Item.Children : [Item]),
	);

	const ActiveLabel =
		AllLeaves.find((C) => C.Id === ActiveId)?.Label ??
		ActiveSectionId ??
		"Navigation";

	const [MobileOpen, SetMobileOpen] = useState(false);

	return (
		<div className="border-b border-border pb-3 lg:hidden">
			<button
				type="button"
				onClick={() => SetMobileOpen((O) => !O)}
				className="flex w-full items-center justify-between px-1 py-2 text-sm font-medium text-foreground hover:text-accent-foreground focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
				aria-expanded={MobileOpen}
			>
				<span className="flex items-center gap-2">
					<span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
						Docs
					</span>
					<span className="text-muted-foreground">/</span>
					<span className="truncate">{ActiveLabel}</span>
				</span>
				<span
					aria-hidden="true"
					className={`ml-2 shrink-0 transition-transform duration-150 ${MobileOpen ? "rotate-90" : ""}`}
				>
					›
				</span>
			</button>

			{MobileOpen && (
				<div className="mt-2 border-t border-border pt-2">{Nav}</div>
			)}
		</div>
	);
};

export { DynamicDocSidebar };

export default DynamicDocSidebar;
