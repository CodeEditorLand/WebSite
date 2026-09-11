"use client";

import { Header, type HeaderContent } from "../Layout/Header";

import Auth0Provider from "../Provider/Auth0Provider";

import DynamicAuthStatus from "./DynamicAuthStatus";

/**
 * Auth0-aware header island for Astro pages.
 *
 * Wraps the standard Header with Auth0Provider so auth state
 * is available. Replaces the static "Sign In" action with
 * DynamicAuthStatus that shows username/avatar when logged in.
 *
 * Usage in .astro:
 * <DynamicAuthHeader client:load Domain={Auth0Domain} ClientIdentifier={Auth0ClientIdentifier} />
 */
export default ({
	Domain,
	ClientIdentifier,
	Content,
}: {
	Domain?: string;

	ClientIdentifier?: string;

	Content?: HeaderContent;
}) => (
	<Auth0Provider
		Children={<HeaderWithAuth {...(Content ? { Content } : {})} />}
		{...(Domain ? { Domain } : {})}
		{...(ClientIdentifier ? { ClientIdentifier } : {})}
	/>
);

const HeaderWithAuth = ({ Content }: { Content?: HeaderContent }) => (
	<Header
		{...(Content ? { Content } : {})}
		AuthSlot={<DynamicAuthStatus />}
		Mode="functional"
	/>
);
