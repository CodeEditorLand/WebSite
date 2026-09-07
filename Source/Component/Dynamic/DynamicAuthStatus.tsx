"use client";

import { useAuth0 } from "@auth0/auth0-react";

import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "../UI/Avatar";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../UI/DropdownMenu";

import { Skeleton } from "../UI/Skeleton";

/**
 * Auth0-aware status display for header/nav.
 * Shows user avatar + dropdown when authenticated, Sign In button when not.
 *
 * Loading state: skeleton matching avatar size (no layout shift).
 * Authenticated state: Radix Avatar (picture + initials fallback)
 * with Radix DropdownMenu - Dashboard, Account, Sign Out items.
 * Unauthenticated state: Sign In link button.
 */
export default ({
	SignInHref = "/Account/SignIn",
	DashboardHref = "/Dashboard",
	AccountHref = "/Account",
}: {
	SignInHref?: string;

	DashboardHref?: string;

	AccountHref?: string;
}) => {
	const {
		isLoading: IsLoading,

		isAuthenticated: IsAuthenticated,

		user: User,

		logout: Auth0Logout,
	} = useAuth0();

	const { t: T } = useTranslation("header");

	if (IsLoading) {
		return (
			<Skeleton
				className="h-7 w-7"
				aria-label={T("actions.loading", { defaultValue: "Loading…" })}
			/>
		);
	}

	if (!IsAuthenticated || !User) {
		return (
			<a
				href={SignInHref}
				className="inline-flex items-center font-medium text-foreground hover:underline"
				aria-label={T("actions.signIn", { defaultValue: "Sign In" })}
			>
				{T("actions.signIn", { defaultValue: "Sign In" })}
				{"\u2001"}
				<svg
					className="h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
					<polyline points="10 17 15 12 10 7" />
					<line x1="15" y1="12" x2="3" y2="12" />
				</svg>
			</a>
		);
	}

	const DisplayName =
		User.name && User.name !== User.email
			? User.name
			: User.nickname || User.email?.split("@")[0] || "User";

	const Initials = DisplayName.slice(0, 2).toUpperCase();

	const Logout = () =>
		Auth0Logout({ logoutParams: { returnTo: window.location.origin } });

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flat flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					aria-label={T("user.avatarAlt", {
						defaultValue: "User menu",
					})}
				>
					<Avatar className="h-7 w-7">
						<AvatarImage
							src={User.picture}
							alt={T("user.avatarAlt", {
								defaultValue: "{{name}} avatar",
								name: DisplayName,
							})}
						/>
						<AvatarFallback className="">{Initials}</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuItem asChild>
					<a
						href={DashboardHref}
						aria-label={T("user.menu.dashboard", {
							defaultValue: "Dashboard",
						})}
					>
						{T("user.menu.dashboard", {
							defaultValue: "Dashboard",
						})}
					</a>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<a
						href={AccountHref}
						aria-label={T("user.menu.account", {
							defaultValue: "Account",
						})}
					>
						{T("user.menu.account", { defaultValue: "Account" })}
					</a>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onClick={Logout}
					aria-label={T("user.menu.signOut", {
						defaultValue: "Sign Out",
					})}
				>
					{T("user.menu.signOut", { defaultValue: "Sign Out" })}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
