interface MetaTagsProperty {
	title: string;

	description: string;

	image?: string;

	url?: string;

	type?: "website" | "article";

	lang?: string;

	siteName?: string;

	publishedTime?: string;

	author?: string;

	noIndex?: boolean;
}

export default ({
	title,
	description,
	image = "/Favicon/og-image.png",
	url = "",
	type = "website",
	lang = "en",
	siteName = "Code Editor Land",
	publishedTime,
	author,
	noIndex = false,
}: MetaTagsProperty) => {
	const SafeTitle = title || siteName;

	const SafeDescription =
		description ||
		"Rust and Tauri editor stack with VS Code API compatibility in progress.";

	// url is always Astro.url.href (absolute) when passed from Base.astro.
	const SiteURL = url;

	// Origin (scheme + host) for absolutising relative asset paths.
	const SiteOrigin = SiteURL.startsWith("http")
		? new URL(SiteURL).origin
		: "";

	const JSONLD: any = {
		"@context": "https://schema.org",

		"@type": "WebSite",

		name: siteName,

		url: SiteURL,

		description: SafeDescription,
	};

	if (type === "article" && publishedTime) {
		JSONLD.datePublished = publishedTime;
	}

	JSONLD.author = author
		? { "@type": "Organization", name: author }
		: [
				{
					"@type": "Person",

					name: "Nikola R. Hristov",

					url: "https://github.com/NikolaRHristov",
				},

				{
					"@type": "Organization",

					name: "Code Editor Land",

					url: SiteOrigin,
				},

				{
					"@type": "Organization",

					name: "PlayForm",

					url: "https://PlayForm.Cloud",
				},
			];

	return (
		<>
			<title>{SafeTitle}</title>
			<meta name="description" content={SafeDescription} />
			<meta
				name="author"
				content="Nikola R. Hristov, Code Editor Land, PlayForm"
			/>
			<meta
				name="robots"
				content={noIndex ? "noindex, nofollow" : "index, follow"}
			/>
			<link rel="canonical" href={SiteURL} />

			<meta property="og:type" content={type} />
			<meta property="og:url" content={SiteURL} />
			<meta property="og:title" content={SafeTitle} />
			<meta property="og:description" content={SafeDescription} />
			<meta
				property="og:image"
				content={
					image.startsWith("http") ? image : `${SiteOrigin}${image}`
				}
			/>
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="675" />
			<meta
				property="og:image:type"
				content={image.endsWith(".svg") ? "image/svg+xml" : "image/png"}
			/>
			<meta property="og:site_name" content={siteName} />
			<meta property="og:locale" content={lang} />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:url" content={SiteURL} />
			<meta name="twitter:title" content={SafeTitle} />
			<meta name="twitter:description" content={SafeDescription} />
			<meta
				name="twitter:image"
				content={
					image.startsWith("http") ? image : `${SiteOrigin}${image}`
				}
			/>
			<meta name="twitter:site" content="@CodeEditorLand" />
			<meta name="twitter:creator" content="@CodeEditorLand" />

			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0"
			/>
			<meta property="og:locale:alternate" content="bg" />
			<meta property="og:locale:alternate" content="de" />
			<meta name="theme-color" content="#000000" />
			<meta name="format-detection" content="telephone=no" />

			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(JSONLD),
				}}
			/>
		</>
	);
};
