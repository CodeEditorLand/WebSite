import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./Public/**/*.html",

		"./Source/**/*.{astro,js,jsx,ts,tsx,vue,svelte}",

		"./src/**/*.{astro,js,jsx,ts,tsx}",
	],

	darkMode: false,

	theme: {
		container: {
			center: true,
		},

		extend: {
			transitionTimingFunction: {
				Ease: "cubic-bezier(0.21, 0.1, 0.21, 1)",
			},

			fontFamily: {
				sans: ["var(--FontSans)", ...fontFamily.sans],

				mono: ["var(--FontMono)", ...fontFamily.mono],

				serif: ["var(--FontSans)", ...fontFamily.serif],
			},

			typography: {
				DEFAULT: {
					css: {
						a: {
							"font-weight": "400",
						},

						// Tables: block + overflow-x-auto so they scroll on mobile
						// instead of blowing out the layout.
						table: {
							display: "block",

							"overflow-x": "auto",

							"-webkit-overflow-scrolling": "touch",
						},

						// Tables: design-system hairline rows. --Border is the
						// dark-canvas token; warm-white prose cards override with
						// prose-thead:/prose-tr: ink hairlines in the page wrapper.
						thead: {
							"border-bottom-width": "1px",

							"border-bottom-color": "var(--Border)",
						},

						// Headers: mono, uppercase, tracked, muted.
						"thead th": {
							color: "var(--MuteForeground)",

							"font-family": "var(--FontMono)",

							"font-size": "0.75rem",

							"font-weight": "500",

							"letter-spacing": "0.2em",

							"text-transform": "uppercase",

							"text-align": "left",

							"vertical-align": "bottom",

							"padding-inline-end": "0.75em",

							"padding-top": "0.75em",

							"padding-bottom": "0.75em",

							"padding-inline-start": "0.75em",
						},

						"tbody tr": {
							"border-bottom-width": "1px",

							"border-bottom-color": "var(--Border)",
						},

						// Body cells: light text for the dark canvas (blog).
						// Warm-white prose cards override with prose-td:.
						td: {
							color: "var(--Foreground)",

							"vertical-align": "baseline",

							"padding-inline-end": "0.75em",

							"padding-top": "0.75em",

							"padding-bottom": "0.75em",

							"padding-inline-start": "0.75em",
						},

						// Pre / code blocks: prevent overflow blowout
						pre: {
							"overflow-x": "auto",
						},

						// Headings: no ligatures, tighter tracking
						"h1, h2, h3, h4": {
							"letter-spacing": "-0.02em",
						},
					},
				},
			},

			borderRadius: {
				none: "0",
				full: "9999px",
			},

			borderColor: {
				DEFAULT: "var(--Border)",
			},

			colors: {
				/* Design system tokens - maps Tailwind utilities to CSS custom properties in Base.css */
				background: "var(--Background)",

				foreground: "var(--Foreground)",

				card: {
					DEFAULT: "var(--Card)",

					foreground: "var(--CardForeground)",
				},

				popover: {
					DEFAULT: "var(--Popover)",

					foreground: "var(--PopoverForeground)",
				},

				primary: {
					DEFAULT: "var(--Primary)",

					foreground: "var(--PrimaryForeground)",
				},

				secondary: {
					DEFAULT: "var(--Secondary)",

					foreground: "var(--SecondaryForeground)",
				},

				muted: {
					DEFAULT: "var(--Mute)",

					foreground: "var(--MuteForeground)",
				},

				accent: {
					DEFAULT: "var(--Accent)",

					foreground: "var(--AccentForeground)",
				},

				destructive: {
					DEFAULT: "var(--Destruct)",

					foreground: "var(--DestructForeground)",
				},

				border: "var(--Border)",

				input: "var(--Input)",

				ring: "var(--Ring)",

				// Sidebar
				sidebar: {
					DEFAULT: "var(--Background)",
					foreground: "var(--Foreground)",
					primary: "var(--Primary)",
					"primary-foreground": "var(--PrimaryForeground)",
					accent: "var(--Accent)",
					"accent-foreground": "var(--AccentForeground)",
					border: "var(--Border)",
					ring: "var(--Ring)",
				},

				// Bridge colors from Example/src/index.css
				"color-green-500": "var(--ColorGreen500)",

				"color-yellow-500": "var(--ColorYellow500)",

				// Extended technology badge palette - Protocol Spines
				"spine-grpc": "#22c55e",

				"spine-ipc": "#3b82f6",

				"spine-tcp": "#f97316",

				"spine-wasm": "#a855f7",

				// Extensions & Libraries
				"ext-rust": "#ea580c",

				"ext-tauri": "#eab308",

				"ext-effect-ts": "#06b6d4",

				"ext-react": "#60a5fa",

				"ext-vue": "#4ade80",

				"ext-svelte": "#fb923c",

				"ext-next": "#171717",

				"ext-nuxt": "#16a34a",

				"ext-solid": "#2563eb",

				"ext-astro": "#9333ea",

				// Platform indicators
				"platform-web": "#4f46e5",

				"platform-desktop": "#475569",

				"platform-mobile": "#ec4899",
			},
		},
	},

	variants: {},

	plugins: [
		require("@tailwindcss/forms"),

		require("@tailwindcss/typography"),

		require("@tailwindcss/aspect-ratio"),
	],

	// TODO: Link that to the dynamic components inside ./Source/Function/Scroll/Layout.astro
	safelist: [
		"h-2",

		"w-2",

		// Include badge color utilities
		"bg-spine-grpc",

		"text-spine-grpc",

		"border-spine-grpc",

		"bg-spine-ipc",

		"text-spine-ipc",

		"border-spine-ipc",

		"bg-spine-tcp",

		"text-spine-tcp",

		"border-spine-tcp",

		"bg-spine-wasm",

		"text-spine-wasm",

		"border-spine-wasm",

		"bg-ext-rust",

		"text-ext-rust",

		"border-ext-rust",

		"bg-ext-tauri",

		"text-ext-tauri",

		"border-ext-tauri",

		"bg-ext-effect-ts",

		"text-ext-effect-ts",

		"border-ext-effect-ts",

		"bg-platform-web",

		"text-platform-web",

		"border-platform-web",

		"bg-platform-desktop",

		"text-platform-desktop",

		"border-platform-desktop",

		"bg-platform-mobile",

		"text-platform-mobile",

		"border-platform-mobile",
	],
};
