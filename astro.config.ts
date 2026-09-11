export const __INCREMENT__ = `${(await import("./Source/Function/Configuration/Environment.js")).default}-${(await import("ulid")).ulid()}`;

const On = (await import("./Source/Function/Configuration/On.js")).default;

const Sourcemap = (await import("./Source/Function/Configuration/Sourcemap.js"))
	.default;

const { resolve: Resolve } = await import("node:path");

const { default: remarkCallout } =
	await import("./Source/Function/Markdown/Callout.js");

const { default: remarkMermaid } =
	await import("./Source/Function/Markdown/Mermaid.js");

export default (await import("astro/config")).defineConfig({
	markdown: {
		syntaxHighlight: "shiki",

		shikiConfig: {
			theme: "github-dark",
		},

		remarkPlugins: [remarkCallout, remarkMermaid],
	},

	srcDir: "./Source",

	publicDir: "./Public",

	outDir: "./Target",

	site: (await import("./Source/Function/Configuration/Site.js")).default,

	compressHTML: (
		await import("./Source/Function/Configuration/CompressHTML.js")
	).default,

	devToolbar: {
		enabled: (await import("./Source/Function/Configuration/DevToolbar.js"))
			.default,
	},

	prefetch: {
		defaultStrategy: (
			await import("./Source/Function/Configuration/PrefetchStrategy.js")
		).default,

		prefetchAll: (
			await import("./Source/Function/Configuration/PrefetchAll.js")
		).default,
	},

	server: {
		port: (await import("./Source/Function/Configuration/Port.js")).default,

		host: true,
	},

	build: {
		concurrency: (
			await import("./Source/Function/Configuration/BuildConcurrency.js")
		).default,
	},

	integrations: [
		(await import("@astrojs/react")).default({
			// @ts-ignore
			devtools: On,
		}),

		(await import("@astrojs/mdx")).default({
			syntaxHighlight: "shiki",

			shikiConfig: {
				theme: "github-dark",
			},

			remarkPlugins: [remarkCallout, remarkMermaid],
		}),

		(await import("@astrojs/sitemap")).default({
			filter: (Page) => {
				const Lower = Page.toLowerCase();

				return (
					!Lower.includes("/dashboard") &&
					!Lower.includes("/account/") &&
					!Lower.includes("/oauth/")
				);

				// TODO: Add blog slugs once B1/B2 (Blog Content Collections) are merged
			},
		}),

		// Route Redirect - local-first PascalCase URL routing + caching.
		// Must run AFTER @astrojs/sitemap so the sitemap post-processor
		// can rewrite lowercase URLs to PascalCase canonicals.
		// Handles:
		//   1. Route redirect (variant URLs → PascalCase canonical)
		//   2. Network-first page cache (offline support)
		//   3. Cache-first asset cache (_astro/*, Asset/*, Favicon/*)
		//   4. Cloudflare _redirects generation
		//   5. Sitemap URL canonicalization
		(await import("./Source/Function/Route/Integration.js")).default(),

		...((await import("./Source/Function/Configuration/InlineCSS.js"))
			.default
			? [
					(await import("@playform/inline")).default({
						Logger: 1,

						Beasties: {
							pruneSource: false,
						},
					}),
				]
			: []),

		...((await import("./Source/Function/Configuration/Compress.js"))
			.default
			? [
					(await import("@playform/compress")).default({
						Logger: 1,

						HTML: {
							"html-minifier-terser": {
								minifyCSS: false,
							},
						},

						CSS: {
							csso: false,
						},

						JavaScript: {
							terser: {
								compress: {
									passes: 2,

									drop_console: !On,

									dead_code: true,

									unused: true,
								},

								mangle: false,

								keep_classnames: true,

								keep_fnames: true,
							},
						},
					}),
				]
			: []),
	],

	experimental: {
		clientPrerender: (
			await import("./Source/Function/Configuration/ClientPrerender.js")
		).default,

		contentIntellisense: (
			await import("./Source/Function/Configuration/ContentIntellisense.js")
		).default,
	},

	vite: {
		optimizeDeps: {
			// @auth0/auth0-react is excluded from pre-bundling because its
			// peer-dep resolution is incompatible with Vite's optimizer.
			// The include list below ensures React itself is ALWAYS in the
			// pre-bundle - without this, auth0 (excluded) would resolve React
			// from its own node_modules while the rest of the app uses Vite's
			// pre-bundled copy, creating two React instances and triggering
			// "Invalid hook call" on every SSR render after a dep re-optimization.
			exclude: ["@auth0/auth0-react"],

			include: [
				"react",

				"react-dom",

				"react-dom/client",

				"react/jsx-runtime",

				"react/jsx-dev-runtime",

				"firebase/app",
			],
		},

		define: {
			__DEV__: JSON.stringify(On),

			__INCREMENT__: JSON.stringify(__INCREMENT__),

			__NOISE_SPEED__: JSON.stringify(
				Number(process.env["NOISE_SPEED"]) || undefined,
			),

			__NOISE_STEP__: JSON.stringify(
				Number(process.env["NOISE_STEP"]) || undefined,
			),
		},

		build: {
			sourcemap: Sourcemap,

			manifest: (
				await import("./Source/Function/Configuration/Manifest.js")
			).default,

			minify: (await import("./Source/Function/Configuration/Minify.js"))
				.default,

			cssMinify: (
				await import("./Source/Function/Configuration/CSSMinify.js")
			).default,

			terserOptions: On
				? {
						compress: false,

						ecma: 2020,

						enclose: false,

						format: {
							ascii_only: false,

							braces: false,

							comments: false,

							ie8: false,

							indent_level: 4,

							indent_start: 0,

							inline_script: false,

							keep_numbers: true,

							keep_quoted_props: true,

							max_line_len: 80,

							preamble: "",

							ecma: 5,

							preserve_annotations: true,

							quote_keys: false,

							quote_style: 3,

							safari10: true,

							semicolons: true,

							shebang: false,

							shorthand: false,

							webkit: true,

							wrap_func_args: true,

							wrap_iife: true,
						},

						sourceMap: true,

						ie8: true,

						keep_classnames: true,

						keep_fnames: true,

						mangle: false,

						module: true,

						toplevel: true,
					}
				: {},

			rollupOptions: {
				output: {
					manualChunks(Identifier: string) {
						if (Identifier.includes("node_modules")) {
							// React + Radix + i18next share one chunk.
							// Radix imports React internals (splitting
							// creates circular deps). i18next/react-i18next
							// call React.createContext() at module level -
							// keeping them in a separate async chunk caused
							// that call to see undefined on first navigation
							// because the top-level await in Client.ts made
							// the I18n chunk async, racing React's live
							// binding establishment.
							if (
								Identifier.includes("react-dom") ||
								Identifier.includes("react/") ||
								Identifier.includes("scheduler") ||
								Identifier.includes("@radix-ui") ||
								Identifier.includes("i18next") ||
								Identifier.includes("react-i18next")
							) {
								return "Vendor/React";
							}

							if (Identifier.includes("@auth0")) {
								return "Vendor/Auth0";
							}

							if (Identifier.includes("lucide-react")) {
								return "Vendor/Icon";
							}

							if (Identifier.includes("firebase")) {
								return "Vendor/Firebase";
							}

							if (
								Identifier.includes("recharts") ||
								Identifier.includes("d3-")
							) {
								return "Vendor/Chart";
							}
						}
					},
				},
			},
		},

		resolve: {
			// dedupe forces Vite to always resolve to one copy of React,

			// even when excluded packages (e.g. @auth0/auth0-react) bring
			// their own React into the module graph. Without this, two React
			// instances coexist and any hook call throws "Invalid hook call".
			dedupe: ["react", "react-dom"],

			alias: {
				"@": Resolve("./Source"),

				"@Stylesheet": Resolve("./Source/Stylesheet"),

				"@Function": Resolve("./Source/Function"),

				"@Layout": Resolve("./Source/Layout"),

				"@Script": Resolve("./Source/Script"),

				"@Variable": Resolve("./Source/Variable"),

		},

			preserveSymlinks: (
				await import("./Source/Function/Configuration/PreserveSymlinks.js")
			).default,
		},

		css: {
			devSourcemap: Sourcemap,

			transformer: (
				await import("./Source/Function/Configuration/CSSTransformer.js")
			).default,
		},

		plugins: [
			{
				name: "CrossOrigin",

				transform(Code, Identifier, _) {
					// Skip virtual modules (no real file path) - they contain
					// serialized data where injecting unescaped quotes breaks
					// string literals (e.g. astro:data-layer-content).
					if (!Identifier.startsWith("/")) return;

					const CrossOrigin =
						Identifier.includes(".mjs") ||
						Identifier.includes(".js") ||
						Identifier.includes(".astro")
							? `crossorigin=\\"anonymous\\"`
							: 'crossorigin="anonymous"';

					return Code.replace(/<script/g, `<script ${CrossOrigin}`)
						.replace(
							/<link[^>]*(?=.*rel="preload")(?=.*href="[^"]*\.js")(?=.*as="script")[^>]*/g,

							`$& ${CrossOrigin}`,
						)
						.replace(
							/<link[^>]*(?=.*rel="preload")(?=.*as="font")[^>]*/g,

							`$& ${CrossOrigin}`,
						)
						.replace(
							/<link[^>]*(?=.*rel="stylesheet")(?=.*href="https?:\/\/[^"]*")[^>]*/g,

							`$& ${CrossOrigin}`,
						);
				},
			},
		],
	},
});
