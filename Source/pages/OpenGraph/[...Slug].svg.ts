/**
 * OpenGraph SVG image endpoint.
 *
 * Generates per-page social sharing images at /OpenGraph/{Slug}.svg.
 * Static pages resolve from PageMetadata; Blog/Doc entries resolve
 * from Astro content collections at build time via getStaticPaths.
 */

import type { APIRoute, GetStaticPaths } from "astro";

export const GET: APIRoute = async ({ params }) => {
	const Slug = params.Slug ?? "";

	const GenerateOpenGraphSvg = (await import("../../Function/OpenGraph.js"))
		.default;

	const PageMetadata = (
		await import("../../Function/OpenGraph/PageMetadata.js")
	).default;

	// Try static page metadata first
	const StaticMeta = PageMetadata[Slug];

	if (StaticMeta) {
		const {
			Title: StaticTitle,
			Description: StaticDescription,
			Section: StaticSection,
			Status: StaticStatus,
			License: StaticLicense,
			Target: StaticTarget,
		} = StaticMeta;

		const Svg = GenerateOpenGraphSvg(
			StaticTitle,

			StaticDescription,

			StaticSection,

			{
				Slug,

				Status: StaticStatus,

				License: StaticLicense,

				Target: StaticTarget,
			},
		);

		return new Response(Svg, {
			status: 200,
			headers: {
				"Content-Type": "image/svg+xml",
				"Cache-Control": "public, max-age=86400",
			},
		});
	}

	// Try Blog content collection
	if (Slug.startsWith("Blog/")) {
		const BlogSlug = Slug.replace("Blog/", "");

		try {
			const { getCollection } = await import("astro:content");

			const BlogEntry = (await getCollection("blog")).find(
				(Entry) => Entry.id === BlogSlug,
			);

			if (BlogEntry) {
				const Svg = GenerateOpenGraphSvg(
					BlogEntry.data.title,

					BlogEntry.data.summary ?? BlogEntry.data.title,

					"Blog",

					{
						Slug: BlogSlug,

						Target: "PUBLIC",
					},
				);

				return new Response(Svg, {
					status: 200,
					headers: {
						"Content-Type": "image/svg+xml",
						"Cache-Control": "public, max-age=86400",
					},
				});
			}
		} catch {
			// Collection may not exist yet - fall through to fallback
		}
	}

	// Try Doc content collection
	if (Slug.startsWith("Doc/")) {
		const DocSlug = Slug.replace("Doc/", "");

		try {
			const { getCollection } = await import("astro:content");

			const DocEntry = (await getCollection("doc")).find(
				(Entry) => Entry.id === DocSlug,
			);

			if (DocEntry) {
				const Svg = GenerateOpenGraphSvg(
					DocEntry.data.title,

					DocEntry.data.description ?? DocEntry.data.title,

					"Doc",

					{
						Slug: DocSlug,

						Target: "GUIDES / API / REFERENCE",
					},
				);

				return new Response(Svg, {
					status: 200,
					headers: {
						"Content-Type": "image/svg+xml",
						"Cache-Control": "public, max-age=86400",
					},
				});
			}
		} catch {
			// Collection may not exist yet - fall through to fallback
		}
	}

	// Fallback: generate a generic card from the slug
	const FallbackTitle = Slug.replace(/\//g, " | ") || "Code Editor Land";

	const Svg = GenerateOpenGraphSvg(
		FallbackTitle,

		"The next-generation code editor built with Rust and Tauri.",

		undefined,

		{ Slug },
	);

	return new Response(Svg, {
		status: 200,
		headers: {
			"Content-Type": "image/svg+xml",
			"Cache-Control": "public, max-age=86400",
		},
	});
};

export const getStaticPaths: GetStaticPaths = async () => {
	const PageMetadata = (
		await import("../../Function/OpenGraph/PageMetadata.js")
	).default;

	// Static pages - skip the home slug ("") which is served by /OpenGraph.svg.ts
	const StaticPath = Object.keys(PageMetadata)
		.filter((Slug) => Slug !== "")
		.map((Slug) => ({ params: { Slug } }));

	// Blog entries
	let BlogPath: { params: { Slug: string } }[] = [];

	try {
		const { getCollection } = await import("astro:content");

		const BlogEntry = await getCollection("blog");

		BlogPath = BlogEntry.map((Entry) => ({
			params: { Slug: `Blog/${Entry.id}` },
		}));
	} catch {
		// Blog collection may not exist yet
	}

	// Doc entries
	let DocPath: { params: { Slug: string } }[] = [];

	try {
		const { getCollection } = await import("astro:content");

		const DocEntry = await getCollection("doc");

		DocPath = DocEntry.map((Entry) => ({
			params: { Slug: `Doc/${Entry.id}` },
		}));
	} catch {
		// Doc collection may not exist yet
	}

	return [...StaticPath, ...BlogPath, ...DocPath];
};
