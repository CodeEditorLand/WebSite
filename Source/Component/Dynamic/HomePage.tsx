import { useTranslation } from "react-i18next";

import { ErrorBoundary } from "../ErrorBoundary.js";

import { Header } from "../Layout/Header";

import {
	SkeletonCard,
	SkeletonFeatureCard,
	SkeletonPricingTier,
} from "../UI/Skeleton.js";

import { DynamicFeatures } from "./DynamicFeatures";

import { DynamicHeroSection } from "./DynamicHeroSection";

import { DynamicPlatformGrid } from "./DynamicPlatformGrid";

import { DynamicPricing } from "./DynamicPricing";

import { DynamicTestimonials } from "./DynamicTestimonials";

import type Interface from "./Interface/Content/Page/Home.js";

import type Property from "./Interface/Property/Page/Home.js";

/**
 * Dynamic HomePage composition - Nocturnal Field Record.
 * Black canvas, warm-white cards, mono type, green accent.
 */
const HomePage = ({ Content, ClassName }: Property) => {
	const { t: T } = useTranslation(["home", "common", "download", "footer"]);

	const TArr = (Key: string, Fallback: string[]) =>
		T(Key, {
			returnObjects: true,
			defaultValue: Fallback,
		}) as unknown as string[];

	const ResolvedContent: Interface = Content || {
		Hero: {
			Badge: {
				Text: T("home:hero.badge", {
					defaultValue: "NO ELECTRON NO CHROMIUM CC0",
				}),

				Variant: "secondary",
			},

			Title: T("home:hero.title", {
				defaultValue: "",
			}),

			TitleHighlight: T("home:hero.titleHighlight", {
				defaultValue: "LAND",
			}),

			Subtitle: T("home:hero.subtitle", {
				defaultValue:
					"A native code editor with the soul of VS Code - and none of the browser. Built on Rust and Tauri, compatible with the extensions you already use.",
			}),

			PrimaryCTA: {
				Text: T("common:button.download", {
					defaultValue: "ENTER",
				}),

				Variant: "default",

				Size: "lg",

				Icon: "Download",

				Href: "/Download",
			},

			SecondaryCTA: {
				Text: T("common:button.learnMore", {
					defaultValue: "TRACE",
				}),

				Variant: "ghost",

				Size: "lg",

				Icon: "ExternalLink",

				Href: "https://github.com/CodeEditorLand/Land#readme",
			},

			FloatingCard: [
				{
					Id: "1",

					Title: T("home:hero.scene.cards.1.title", {
						defaultValue: "RUST CORE",
					}),

					Tooltip: TArr("home:hero.scene.cards.1.tooltip", [
						"Mountain implements Common traits in Rust via Tauri.",

						"Handles windows, files, terminals, process control, and gRPC IPC through the Vine protocol.",

						"The ActionEffect system treats every operation as declarative data dispatched across layers.",
					]),

					Color: ["var(--ExtensionRust)", "var(--Mute)"],
				},

				{
					Id: "2",

					Title: T("home:hero.scene.cards.2.title", {
						defaultValue: "TAURI UI",
					}),

					Tooltip: TArr("home:hero.scene.cards.2.tooltip", [
						"Sky renders the editor interface in the OS WebView via Astro and routes Tauri events through SkyBridge to VS Code workbench APIs.",

						"Multiple workbench layouts adapt the UI layer to different runtimes: browser proxy, Mountain-native, or Electron.",
					]),

					Color: [
						"var(--ExtensionTauri)",

						"var(--Primary)",

						"var(--Secondary)",

						"var(--Mute)",
					],
				},

				{
					Id: "3",

					Title: T("home:hero.scene.cards.3.title", {
						defaultValue: "EFFECT-TS SERVICES",
					}),

					Tooltip: TArr("home:hero.scene.cards.3.tooltip", [
						"Cocoon and Wind use Effect-TS for typed errors, scoped resources, cancellation, and supervised concurrency.",

						"Wind composes workbench services into Layer stacks that make dependency paths traceable at compile time - one stack per runtime target.",
					]),

					Color: [
						"var(--ExtensionEffectTypeScript)",

						"var(--ExtensionEffectTypeScriptFore)",

						"var(--ExtensionEffectTypeScriptMute)",
					],
				},

				{
					Id: "4",

					Title: T("home:hero.scene.cards.4.title", {
						defaultValue: "GRPC IPC",
					}),

					Tooltip: TArr("home:hero.scene.cards.4.tooltip", [
						"Vine defines the gRPC protocol layer between Mountain, Cocoon, Air, and Grove.",

						"Proto definitions currently live in Mountain and Cocoon while Vine consolidates.",

						"Every gRPC call is a typed contract - the wire format is the interface.",
					]),

					Color: ["var(--SpinegRPC)", "var(--SpineIPC)"],
				},

				{
					Id: "5",

					Title: T("home:hero.scene.cards.5.title", {
						defaultValue: "EXTENSION HOST",
					}),

					Tooltip: TArr("home:hero.scene.cards.5.tooltip", [
						"Cocoon runs VS Code extensions via dual-track architecture:",

						"Track A loads unmodified extHost sources for maximum compatibility,",

						"Track B routes I/O-heavy operations to Mountain through gRPC.",

						"Effect-TS services implement the vscode API shim across both tracks.",
					]),

					Color: ["var(--TierProvider)"],
				},

				{
					Id: "6",

					Title: T("home:hero.scene.cards.6.title", {
						defaultValue: "CROSS-PLATFORM",
					}),

					Tooltip: TArr("home:hero.scene.cards.6.tooltip", [
						"Tauri bundles to native macOS, Windows, and Linux packages using the OS WebView - no embedded Chromium.",

						"Per-platform build configuration and binary management keep cross-compilation paths explicit rather than hidden in installer scripts.",
					]),

					Color: [
						"var(--OSMacOS)",

						"var(--OSWindows)",

						"var(--OSLinux)",
					],
				},

				{
					Id: "7",

					Title: T("home:hero.scene.cards.7.title", {
						defaultValue: "VS CODE API",
					}),

					Tooltip: TArr("home:hero.scene.cards.7.tooltip", [
						"Cocoon implements the VS Code API surface through Effect-TS services: commands, workspace, terminals, webviews, language providers, and diagnostics.",

						"The dual-track architecture preserves compatibility with published extension APIs while routing through native services.",
					]),

					Color: ["var(--SpineIPC)"],
				},

				{
					Id: "8",

					Title: T("home:hero.scene.cards.8.title", {
						defaultValue: "OPEN SOURCE CC0",
					}),

					Tooltip: TArr("home:hero.scene.cards.8.tooltip", [
						"All 15 element repos are under CC0 1.0 Universal public domain.",

						"No attribution required, no compliance restrictions.",

						"Funded by NLnet NGI0 Commons Fund.",
					]),

					Color: ["var(--SpinegRPC)", "var(--ExtensionTauri)"],
				},
			],

			ShowConnectingLines: true,

			ShowParticles: true,

			RespectReducedMotion: true,
		},

		Feature: {
			Title: T("home:features.title", {
				defaultValue: "VS CODE. WITHOUT ELECTRON.",
			}),

			Subtitle: T("home:features.subtitle", {
				defaultValue:
					"Native speed. VS Code compatibility. No Chromium, no compromises.",
			}),

			Feature: [
				{
					Id: "performance",

					Icon: "Zap",

					Icons: ["/Image/Rust.svg", "/Image/Tauri.svg", "Zap"],

					Title: T("home:features.item.designTokens.title", {
						defaultValue: "Native services where they count.",
					}),

					Description: T(
						"home:features.item.designTokens.description",

						{
							defaultValue:
								"Heavy editor work runs natively - not trapped in a web view. Window management, file I/O, and terminal IPC go straight through a Rust + Tauri services layer.",
						},
					),
				},

				{
					Id: "compatibility",

					Icon: "Box",

					Icons: ["/Image/EffectTS.svg", "Box", "Puzzle"],

					Title: T("home:features.item.componentLibrary.title", {
						defaultValue: "Unmodified extensions, no fork path.",
					}),

					Description: T(
						"home:features.item.componentLibrary.description",

						{
							defaultValue:
								"Your VS Code extensions run unmodified - no forks, no rewrites. A compatibility host speaks the VS Code extension API directly.",
						},
					),
				},

				{
					Id: "architecture",

					Icon: "Cpu",

					Icons: [
						"/Image/EffectTS.svg",

						"/Image/TypeScript.svg",

						"Layers",
					],

					Title: T("home:features.item.documentation.title", {
						defaultValue: "Fibers, not Promises.",
					}),

					Description: T(
						"home:features.item.documentation.description",

						{
							defaultValue:
								"Failures are typed, traceable, and cancellable - so the editor fails loudly in development instead of silently in production.",
						},
					),
				},

				{
					Id: "cross-platform",

					Icon: "Globe",

					Icons: ["/Image/Tauri.svg", "Globe", "Package"],

					Title: T("home:features.item.versionControl.title", {
						defaultValue: "One source tree, configured targets.",
					}),

					Description: T(
						"home:features.item.versionControl.description",

						{
							defaultValue:
								"Tauri uses the OS WebView on each platform - no bundled Chromium. One codebase compiles to native macOS, Windows, and Linux packages.",
						},
					),
				},

				{
					Id: "tooling",

					Icon: "Wrench",

					Icons: [
						"/Image/Rust.svg",

						"/Image/Biome.svg",

						"/Image/EffectTS.svg",
					],

					Title: T("home:features.item.cicdIntegration.title", {
						defaultValue: "Background daemon, always running.",
					}),

					Description: T(
						"home:features.item.cicdIntegration.description",

						{
							defaultValue:
								"Updates, indexing, signing, and health checks run in a persistent daemon - survives when the main window closes.",
						},
					),
				},

				{
					Id: "opensource",

					Icon: "Heart",

					Icons: ["/Image/CC0.svg", "/Image/NLnet.svg", "Heart"],

					Title: T("home:features.item.collaboration.title", {
						defaultValue: "CC0. No restrictions.",
					}),

					Description: T(
						"home:features.item.collaboration.description",

						{
							defaultValue:
								"Fork it, ship it, build commercial products on top of it. The entire codebase is CC0 public domain - no attribution required, no compliance headaches.",
						},
					),
				},
			],

			Columns: 3,

			Gap: "lg",
		},

		Pricing: {
			Title: T("home:roadmap.title", {
				defaultValue:
					"The Architecture Is Built. Here Is What Comes Next.",
			}),

			Subtitle: T("home:roadmap.subtitle", {
				defaultValue:
					"Funded by NLnet NGI0 Commons Fund.\n\nEach milestone is labelled by what it represents: active source, integration work in progress, or release preparation.",
			}),

			Tier: [
				{
					Identifier: "free",

					Name: T("home:roadmap.tiers.current.name", {
						defaultValue: "ACTIVE NOW",
					}),

					Description: T("home:roadmap.tiers.current.description", {
						defaultValue:
							"A native editor built on Rust and Tauri - no Chromium, no Electron. The active desktop path spans Mountain (backend), Cocoon (extensions), Sky (UI), and Wind (workbench), supported by Vine, Common, Echo, Air, Mist, Rest, Output, SideCar, and Maintain. Grove and Worker are present with integration scope that differs by build profile.",
					}),

					Price: { Monthly: 0, Yearly: 0 },

					Element: [
						T("home:roadmap.tiers.current.elements.mountain", {
							defaultValue:
								"Mountain\nNative Backend\nReplaces Electron main process, no bundled Chromium",
						}),

						T("home:roadmap.tiers.current.elements.cocoon", {
							defaultValue:
								"Cocoon\nExtension Host\nUnmodified VS Code extensions through Effect-TS routes",
						}),

						T("home:roadmap.tiers.current.elements.wind", {
							defaultValue:
								"Wind\nWorkbench Shell\nEffect-TS layers for native workbench services",
						}),

						T("home:roadmap.tiers.current.elements.sky", {
							defaultValue:
								"Sky\nAstro UI Layer\nWorkbench routes and WebView bridge",
						}),

						T("home:roadmap.tiers.current.elements.air", {
							defaultValue:
								"Air\nBackground Services\nUpdates, downloads, auth, indexing, and health",
						}),

						T("home:roadmap.tiers.current.elements.echo", {
							defaultValue:
								"Echo\nScheduler Primitives\nBounded background work for Rust services",
						}),
					],

					Feature: [
						T("home:roadmap.tiers.current.features.1", {
							defaultValue:
								"Installed extensions run unmodified through Cocoon",
						}),

						T("home:roadmap.tiers.current.features.2", {
							defaultValue:
								"Tauri desktop path uses the operating system WebView",
						}),

						T("home:roadmap.tiers.current.features.3", {
							defaultValue:
								"Effect fibers for cancellable service work",
						}),

						T("home:roadmap.tiers.current.features.4", {
							defaultValue:
								"Telemetry features are compile-gated in Rust",
						}),

						T("home:roadmap.tiers.current.features.5", {
							defaultValue: "CC0 public domain no restrictions",
						}),

						T("home:roadmap.tiers.current.features.6", {
							defaultValue:
								"macOS, Windows, and Linux build targets in source",
						}),
					],

					CTA: {
						Text: T("home:roadmap.tiers.current.button", {
							defaultValue: "VIEW ON GITHUB",
						}),

						Variant: "default",

						Href: "https://github.com/CodeEditorLand/Land",
					},

					Popular: true,
				},

				{
					Identifier: "progress",

					Name: T("home:roadmap.tiers.future.name", {
						defaultValue: "V1.0",
					}),

					Status: "WIP",

					Description: T("home:roadmap.tiers.future.description", {
						defaultValue:
							"Signed installers, verified downloads, and broad extension compatibility are the v1.0 target. Vine consolidates cross-element protocols. Grove adds WASM sandboxing for extensions. Rest and Echo tighten the build pipeline and scheduler. Long-tail VS Code API coverage rounds out the Cocoon compatibility pass.",
					}),

					Price: { Monthly: 0, Yearly: 0 },

					Element: [
						T("home:roadmap.tiers.future.elements.vine", {
							defaultValue:
								"Vine\nProtocol In Progress\nMountain, Cocoon, Air, and Grove contracts",
						}),

						T("home:roadmap.tiers.future.elements.cocoon", {
							defaultValue:
								"Cocoon\nExtension Compatibility Pass\nLong-tail VS Code API coverage",
						}),

						T("home:roadmap.tiers.future.elements.grove", {
							defaultValue:
								"Grove\nWASM Host Stabilizing\nCapability-based extension isolation path",
						}),

						T("home:roadmap.tiers.future.elements.rest", {
							defaultValue:
								"Rest\nSource Map Support\nOXC transformer integration in progress",
						}),

						T("home:roadmap.tiers.future.elements.echo", {
							defaultValue:
								"Echo\nScheduler Optimization\nFaster steal, lower latency",
						}),

						T("home:roadmap.tiers.future.elements.air", {
							defaultValue:
								"Air\nRelease Delivery\nSigning and distribution path",
						}),
					],

					Feature: [
						T("home:roadmap.tiers.future.features.1", {
							defaultValue:
								"Marketplace installation path under review",
						}),

						T("home:roadmap.tiers.future.features.2", {
							defaultValue: "Grove Wasmtime host integration",
						}),

						T("home:roadmap.tiers.future.features.3", {
							defaultValue: "Vine typed IPC coverage expanding",
						}),

						T("home:roadmap.tiers.future.features.4", {
							defaultValue:
								"Cross-platform public installers via Tauri",
						}),

						T("home:roadmap.tiers.future.features.5", {
							defaultValue: "Source map generation via OXC",
						}),

						T("home:roadmap.tiers.future.features.6", {
							defaultValue:
								"Download distribution and verification publishing",
						}),
					],

					CTA: {
						Text: T("home:roadmap.tiers.future.button", {
							defaultValue: "TRACK PROGRESS",
						}),

						Variant: "outline",

						Href: "https://github.com/CodeEditorLand/Land/milestones",
					},

					Popular: false,
				},
			],
		},

		Testimonial: {
			Title: T("home:architecture.title", {
				defaultValue: "Under the Hood",
			}),

			Subtitle: T("home:architecture.subtitle", {
				defaultValue:
					"Each element replaces one piece of the Electron stack. All inspectable in source.",
			}),

			Testimonial: [
				{
					Id: "Air",

					Emoji: "",

					Href: "https://github.com/CodeEditorLand/Air",

					Author: "Air",

					Role: T("home:architecture.air.subtitle", {
						defaultValue:
							"Background Services Downloader Workspace Indexer",
					}),

					Quote: T("home:architecture.air.description", {
						defaultValue:
							"Background daemon that runs independently - updates, indexing, signing, and health checks, all outside the main window.\n• Update downloads with staged atomic rollback\n• File indexing and symbol extraction\n• Cryptographic signing and authentication\n• Health monitoring with multi-level checks\n\nPrometheus-compatible metrics and distributed tracing with sampling.",
					}),
				},

				{
					Id: "Cocoon",

					Emoji: "",

					Href: "https://github.com/CodeEditorLand/Cocoon",

					Author: "Cocoon",

					Role: T("home:architecture.cocoon.subtitle", {
						defaultValue:
							"Extension Host Unmodified VS Code Extensions Effect-TS Services",
					}),

					Quote: T("home:architecture.cocoon.description", {
						defaultValue:
							"Node.js sidecar that hosts and executes VS Code extensions.\n\nDual-track architecture:\n• Track A loads unmodified extHost sources for maximum compatibility\n• Track B routes I/O-heavy operations to Mountain through gRPC\n\nEffect-TS provides typed errors, scoped resources, and supervised concurrency across all services.\n\nCodegen pipeline walks VS Code extHost source to emit type schemas.\n\nCore API surfaces:\n• Commands\n• Workspace\n• Window\n• Terminal\n• Webview\n• Language providers\n• Diagnostics",
					}),
				},

				{
					Id: "Common",

					Emoji: "",

					Href: "https://github.com/CodeEditorLand/Common",

					Author: "Common",

					Role: T("home:architecture.common.subtitle", {
						defaultValue:
							"Shared Foundation Traits Cross-Element Types",
					}),

					Quote: T("home:architecture.common.description", {
						defaultValue:
							"Pure abstract library - defines the contracts that all Rust components implement, not the implementations themselves.\n\nAsync traits for every service domain:\n• FileSystem\n• Terminal\n• Clipboard\n• Window\n• Configuration\n• Storage\n• Search\n• and more\n\nThe ActionEffect system treats every operation as declarative data - commands, events, and queries share a single type hierarchy across all layers.\n\nTransport-agnostic: supports gRPC, IPC, and WASM strategies.\n\nDual-pipe telemetry (PostHog + OTLP).",
					}),
				},

				{
					Id: "Echo",

					Emoji: "",

					Href: "https://github.com/CodeEditorLand/Echo",

					Author: "Echo",

					Role: T("home:architecture.echo.subtitle", {
						defaultValue:
							"Work-Stealing Scheduler crossbeam-deque Supervised Worker Pool",
					}),

					Quote: T("home:architecture.echo.description", {
						defaultValue:
							"Work-stealing task scheduler with lock-free queues for bounded background execution.\n\nPriority tiers:\n• High\n• Normal\n• Low\n\nEnsures UI responsiveness stays predictable under I/O load.\n\nWorkers consume from local queues and steal from peers when idle.\n\nIntegrates with the ActionEffect system for cancelable, supervised tasks.\n\nGraceful shutdown paths keep resources from leaking when services terminate.",
					}),
				},

				{
					Id: "Grove",

					Emoji: "",

					Href: "https://github.com/CodeEditorLand/Grove",

					Author: "Grove",

					Role: T("home:architecture.grove.subtitle", {
						defaultValue:
							"WASM Sandbox Wasmtime Runtime Capability-Based Isolation",
					}),

					Quote: T("home:architecture.grove.description", {
						defaultValue:
							"WebAssembly sandbox for running extensions in capability-isolated environments.\n\nWASMtime provides:\n• Memory limits\n• Resource controls\n• Fine-grained capability gates\n\nExtensions cannot access host APIs unless explicitly granted.\n\nMultiple transport strategies:\n• gRPC\n• IPC\n• Direct WASM host function calls\n\nShares the same VS Code API surface as Cocoon.\n\nComplements Cocoon's Node.js path with a sandboxed execution alternative.",
					}),
				},

				{
					Id: "Maintain",

					Emoji: "",

					Href: "https://github.com/CodeEditorLand/Maintain",

					Author: "Maintain",

					Role: T("home:architecture.maintain.subtitle", {
						defaultValue:
							"Build Orchestrator Configuration Release Profiles",
					}),

					Quote: T("home:architecture.maintain.description", {
						defaultValue:
							"Build system using an embedded Rhai scripting engine for flexible cross-element orchestration.\n\nManages build profiles across the Land ecosystem:\n• Development\n• Debug\n• Release\n\nType-safe editing of Cargo.toml and project configuration through scriptable resolvers.\n\nRelease pipeline preparation - signing, artifact publication, and distribution - is in progress.",
					}),
				},

				{
					Id: "Mist",

					Emoji: "",

					Href: "https://github.com/CodeEditorLand/Mist",

					Author: "Mist",

					Role: T("home:architecture.mist.subtitle", {
						defaultValue:
							"Local DNS Sandbox *.editor.land Resolution Network Boundary",
					}),

					Quote: T("home:architecture.mist.description", {
						defaultValue:
							"Local DNS server authoritative for the editor.land zone - all subdomains resolve to loopback, keeping internal services off the network.\n\nForward allowlisting controls which external domains sidecar processes can reach; everything else is blocked at the DNS layer.\n\nSecurity model:\n• ECDSA DNSSEC signing verifies zone integrity\n• Loopback binding only - no external port exposure\n\nProvides network isolation for Cocoon and Air processes so they cannot leak data to arbitrary hosts.",
					}),
				},

				{
					Id: "Mountain",

					Emoji: "⛰️",

					Href: "https://github.com/CodeEditorLand/Mountain",

					Author: "Mountain",

					Role: T("home:architecture.mountain.subtitle", {
						defaultValue:
							"Native Rust Backend Tauri Replaces Electron Main Process",
					}),

					Quote: T("home:architecture.mountain.description", {
						defaultValue:
							"Primary native backend and Tauri application shell - replaces the Electron main process entirely.\n\nImplements all service traits from Common through the declarative ActionEffect system:\n• Windows\n• Files\n• Terminals\n• Clipboard\n• Dialogs\n• Process control\n• OS keychain\n\nHosts the gRPC server for cross-process communication with Cocoon, Air, and Grove.\n\nOrchestrates sidecar lifecycle and manages application state across all connected processes.",
					}),
				},

				{
					Id: "Output",

					Emoji: "⚫",

					Href: "https://github.com/CodeEditorLand/Output",

					Author: "Output",

					Role: T("home:architecture.output.subtitle", {
						defaultValue:
							"Compilation Pipeline Plugin-Routed Deterministic Checksum",
					}),

					Quote: T("home:architecture.output.description", {
						defaultValue:
							"Build orchestration for VS Code platform source code.\n\nDual-compiler pipeline:\n• Primary ESBuild\n• Optional Rust-native compiler path for faster TypeScript compilation\n\nPlugin-routed transforms handle:\n• Module resolution remapping\n• Define substitution\n• CSS import interception\n• Dead code elimination\n\nEnvironment-variable-driven compiler selection.\n\nPlatform code markers separate platform-specific and cross-platform code at the source level.\n\nConsumed by Cocoon, Sky, and Wind as the shared compilation output.",
					}),
				},

				{
					Id: "Rest",

					Emoji: "⛱️",

					Href: "https://github.com/CodeEditorLand/Rest",

					Author: "Rest",

					Role: T("home:architecture.rest.subtitle", {
						defaultValue:
							"TypeScript Transform Pipeline OXC Rust-Native",
					}),

					Quote: T("home:architecture.rest.description", {
						defaultValue:
							"Rust-native TypeScript compilation pipeline built on the OXC toolchain - parser, transformer, and codegen in one process.\n\nHandles:\n• Decorator metadata emission\n• Legacy class field semantics\n• JSX\n• Parallel compilation\n\nSelectable as an alternative compiler to reduce reliance on Node-hosted compilation paths.\n\nSource map output and measured pipeline benchmarks are in active development.",
					}),
				},

				{
					Id: "SideCar",

					Emoji: "",

					Href: "https://github.com/CodeEditorLand/SideCar",

					Author: "SideCar",

					Role: T("home:architecture.sidecar.subtitle", {
						defaultValue:
							"Binary Distributor Compile-Time Target Triple Selection Per-Platform Node.js",
					}),

					Quote: T("home:architecture.sidecar.description", {
						defaultValue:
							"Manages pre-compiled platform-specific Node.js binaries for each target platform.\n\nCompile-time binary selection ensures the right runtime is available without runtime detection or download delays.\n\nIntegrity verification and cache management keep sidecar deployments deterministic and reproducible across build environments.",
					}),
				},

				{
					Id: "Sky",

					Emoji: "",

					Href: "https://github.com/CodeEditorLand/Sky",

					Author: "Sky",

					Role: T("home:architecture.sky.subtitle", {
						defaultValue:
							"Visual UI Layer Astro Components Three Workbench Layouts",
					}),

					Quote: T("home:architecture.sky.description", {
						defaultValue:
							"Renders the editor interface in the OS WebView using Astro component islands for efficient rendering.\n\nSkyBridge routes Tauri events to VS Code workbench APIs, translating runtime channels into workbench calls.\n\nSupports multiple workbench layouts that adapt the UI layer to different runtimes:\n• Browser proxy\n• Mountain-native\n• Electron\n\nSmart variant selection with conditional imports and tree-shaking keeps the bundle size target-specific.",
					}),
				},

				{
					Id: "Vine",

					Emoji: "",

					Href: "https://github.com/CodeEditorLand/Vine",

					Author: "Vine",

					Role: T("home:architecture.vine.subtitle", {
						defaultValue:
							"gRPC Backbone Contract-First .proto Definitions",
					}),

					Quote: T("home:architecture.vine.description", {
						defaultValue:
							"Protocol definitions for gRPC communication between Mountain, Cocoon, Air, and Grove.\n\nCurrent proto contracts live in Mountain/Proto/ and Cocoon:\n• Vine.proto - editor-host IPC\n• Spine.proto - extension coordination\n• Grove.proto - WASM extension protocols\n\nCentralized consolidation into the Vine element is planned as the protocol surface stabilizes.",
					}),
				},

				{
					Id: "Wind",

					Emoji: "",

					Href: "https://github.com/CodeEditorLand/Wind",

					Author: "Wind",

					Role: T("home:architecture.wind.subtitle", {
						defaultValue:
							"Workbench Services Effect-TS Layers Native Bridges",
					}),

					Quote: T("home:architecture.wind.description", {
						defaultValue:
							"UI service layer that recreates the VS Code workbench environment inside the Tauri WebView.\n\nEffect-TS services cover:\n• IPC\n• Configuration\n• Editor\n• Terminal\n• Clipboard\n• Dialog\n• FileSystem\n• Window\n• Search\n\nEach with explicit typed error handling and compile-time dependency tracking.\n\nComposed into Layer stacks that target specific runtimes:\n• Tauri (native)\n• Electron (compatibility)\n• Test (isolated)\n\nPreload shim establishes the bridge between VS Code workbench expectations and the Tauri runtime environment.",
					}),
				},

				{
					Id: "Worker",

					Emoji: "",

					Href: "https://github.com/CodeEditorLand/Worker",

					Author: "Worker",

					Role: T("home:architecture.worker.subtitle", {
						defaultValue:
							"Service Worker Offline Cache CSS Import Support",
					}),

					Quote: T("home:architecture.worker.description", {
						defaultValue:
							"Service worker that provides offline caching and dynamic CSS import handling for the web shell.\n\nCaching strategy:\n• Network-first for navigation requests\n• Cache-first for static assets\n\nIntercepts JavaScript imports of CSS files and injects them as <link> tags - handles VS Code's pattern of importing stylesheets as JS modules.\n\nAutomatic update detection with client reload when a new version is available.",
					}),
				},
			],

			Column: "masonry",
		},

		Download: {
			Title: T("download:title", { defaultValue: "DOWNLOAD LAND" }),

			Subtitle: T("download:subtitle", {
				defaultValue:
					"Source builds are active today. Public installers, signing, and verification artifacts are still being prepared.",
			}),

			Platforms: [
				{
					Id: "macos",

					Name: T("download:card.platform.macos.title", {
						defaultValue: "MACOS",
					}),

					Icon: "Apple" as const,

					Description: T(
						"download:card.platform.macos.universalBadge",

						{
							defaultValue:
								"Universal Binary: Apple Silicon and Intel",
						},
					),

					Version: "Pre-release",

					Size: "Coming Soon",
				},

				{
					Id: "windows",

					Name: T("download:card.platform.windows.title", {
						defaultValue: "WINDOWS",
					}),

					Icon: "Monitor" as const,

					Description: T(
						"download:card.platform.windows.description",

						{
							defaultValue: "64-bit (x64)",
						},
					),

					Version: "Pre-release",

					Size: "Coming Soon",
				},

				{
					Id: "linux",

					Name: T("download:card.platform.linux.title", {
						defaultValue: "LINUX",
					}),

					Icon: "Terminal" as const,

					Description: T("download:card.platform.linux.description", {
						defaultValue: "DEB, RPM, AppImage",
					}),

					Version: "Pre-release",

					Size: "Coming Soon",
				},
			],

			ShowVerification: true,

			OnDownload: async (Platform: { Name: string; id?: string }) => {
				if (Platform.id) {
					try {
						const { default: DownloadAPI } =
							await import("../../Library/API/Download.js");

						const Information = await DownloadAPI.GetInfo(
							Platform.id,
						);

						window.open(Information.downloadUrl, "_blank");

						await DownloadAPI.TrackDownload(Platform.id);
					} catch (DownloadError) {
						console.error("Download failed:", DownloadError);

						alert(
							T("download:labels.downloadFailed", {
								defaultValue:
									"Download failed. Please try again.",
							}),
						);
					}
				}
			},
		},

		Footer: {
			Brand: {
				Name: T("common:brand.name", {
					defaultValue: "CODE EDITOR LAND",
				}),

				Description: T("footer:brand.description", {
					defaultValue:
						"No Electron. No Chromium. Every extension runs unchanged.\n\nOpen source and free forever.",
				}),
			},

			Social: {
				GitHub: "https://github.com/CodeEditorLand/Land",
			},

			Columns: [
				{
					Title: T("footer:columns.product.title", {
						defaultValue: "PRODUCT",
					}),

					Links: [
						{
							Label: T("footer:columns.product.features", {
								defaultValue: "FEATURE",
							}),

							Href: "/#features",
						},

						{
							Label: T("footer:columns.product.downloads", {
								defaultValue: "DOWNLOAD",
							}),

							Href: "/Download",
						},

						{
							Label: T("footer:columns.product.docs", {
								defaultValue: "DOCUMENTATION",
							}),

							Href: "https://github.com/CodeEditorLand/Land#readme",
						},
					],
				},

				{
					Title: T("footer:columns.company.title", {
						defaultValue: "COMMUNITY",
					}),

					Links: [
						{
							Label: T("footer:columns.company.github", {
								defaultValue: "GITHUB",
							}),

							Href: "https://github.com/CodeEditorLand/Land",
						},

						{
							Label: T("footer:columns.company.issues", {
								defaultValue: "ISSUES",
							}),

							Href: "https://github.com/CodeEditorLand/Land/issues",
						},

						{
							Label: T("footer:columns.company.contributing", {
								defaultValue: "CONTRIBUTING",
							}),

							Href: "https://github.com/CodeEditorLand/Land/tree/Current/CONTRIBUTING.md",
						},
					],
				},

				{
					Title: T("footer:columns.legal.title", {
						defaultValue: "LEGAL",
					}),

					Links: [
						{
							Label: T("footer:columns.legal.privacy", {
								defaultValue: "PRIVACY",
							}),

							Href: "/Legal/Privacy",
						},

						{
							Label: T("footer:columns.legal.terms", {
								defaultValue: "TERMS",
							}),

							Href: "/Legal/Term",
						},

						{
							Label: T("footer:columns.legal.license", {
								defaultValue: "LICENSE",
							}),

							Href: "/License",
						},
					],
				},
			],

			BottomBar: { MadeWith: true },
		},
	};

	const {
		Hero,

		Feature,

		Pricing,

		Testimonial: Testimonials,

		Download,

		Header: HeaderContent,
	} = ResolvedContent;

	return (
		<div className={`flex min-h-screen flex-col ${ClassName || ""}`}>
			{HeaderContent !== undefined && (
				<Header Content={HeaderContent} Mode="minimal" />
			)}

			<div className="flex-1" role="region" aria-label="Page content">
				<ErrorBoundary
					FallbackComponent={() => (
						<SkeletonFeatureCard className="min-h-[60dvh]" />
					)}
				>
					<DynamicHeroSection Content={Hero} />
				</ErrorBoundary>
				<ErrorBoundary
					FallbackComponent={() => (
						<div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-3">
							{[1, 2, 3, 4, 5, 6].map((Index) => (
								<SkeletonFeatureCard key={Index} />
							))}
						</div>
					)}
				>
					<DynamicFeatures Content={Feature} />
				</ErrorBoundary>
				<ErrorBoundary
					FallbackComponent={() => (
						<div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-3">
							{[1, 2, 3].map((Index) => (
								<SkeletonPricingTier key={Index} />
							))}
						</div>
					)}
				>
					<DynamicPricing Content={Pricing} />
				</ErrorBoundary>
				<ErrorBoundary
					FallbackComponent={() => (
						<div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-3">
							{[1, 2, 3].map((Index) => (
								<SkeletonCard key={Index} />
							))}
						</div>
					)}
				>
					<DynamicTestimonials Content={Testimonials} />
				</ErrorBoundary>
				<ErrorBoundary
					FallbackComponent={() => (
						<SkeletonCard className="min-h-[30dvh]" />
					)}
				>
					<DynamicPlatformGrid Content={Download} />
				</ErrorBoundary>
			</div>
		</div>
	);
};

export { HomePage };

export default HomePage;
