"use client";

import { ThemeImage } from "@Library/Theme";

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

/**
 * Local-First Air Daemon scanner.
 *
 * Attempts WebSocket connections to the Air Daemon on two ports:
 * - ws://localhost:7979 (primary)
 * - ws://localhost:7878 (fallback)
 *
 * Shows scan animation while probing, then displays:
 * - Connected: green status with daemon version
 * - Not found: gray status with download link
 *
 * Designed for /Dashboard?mode=local query param.
 * Timeout: 3 seconds per endpoint.
 */

type ScanStatus = "Scanning" | "Connected" | "NotFound";

interface DaemonInfo {
	Port: number;

	Version: string;
}

const SCAN_TIMEOUT = 3000;

const DAEMON_ENDPOINT = [
	{ Port: 7979, URL: "ws://localhost:7979" },

	{ Port: 7878, URL: "ws://localhost:7878" },
];

const ProbeDaemon = (
	URL: string,

	Port: number,

	TimeoutMillisecond: number,
): Promise<DaemonInfo | null> =>
	new Promise((Resolve) => {
		try {
			const Socket = new WebSocket(URL);

			const Timer = setTimeout(() => {
				Socket.close();

				Resolve(null);
			}, TimeoutMillisecond);

			Socket.onopen = () => {
				clearTimeout(Timer);

				// Attempt to get version via a simple message
				Socket.send(JSON.stringify({ Type: "Version" }));

				// Wait briefly for a response, then resolve with default version
				const VersionTimer = setTimeout(() => {
					Socket.close();

					Resolve({ Port, Version: "unknown" });
				}, 500);

				Socket.onmessage = (Event) => {
					clearTimeout(VersionTimer);

					try {
						const Data = JSON.parse(Event.data as string) as Record<
							string,
							unknown
						>;

						Socket.close();

						Resolve({
							Port,
							Version: (Data.Version as string) || "unknown",
						});
					} catch {
						Socket.close();

						Resolve({ Port, Version: "unknown" });
					}
				};
			};

			Socket.onerror = () => {
				clearTimeout(Timer);

				Socket.close();

				Resolve(null);
			};
		} catch {
			Resolve(null);
		}
	});

const ScanAnimation = () => (
	<div className="flex items-center gap-3">
		<div className="flex gap-1" aria-hidden="true">
			<span
				className="flat inline-block h-2 w-2 animate-pulse bg-orange-400"
				style={{ animationDelay: "0ms" }}
			/>
			<span
				className="flat inline-block h-2 w-2 animate-pulse bg-orange-400"
				style={{ animationDelay: "150ms" }}
			/>
			<span
				className="flat inline-block h-2 w-2 animate-pulse bg-orange-400"
				style={{ animationDelay: "300ms" }}
			/>
		</div>
		<span className="text-muted-foreground">
			Scanning for Air Daemon...
		</span>
	</div>
);

export default ({
	Domain,
	ClientIdentifier,
}: {
	Domain?: string;

	ClientIdentifier?: string;
}) => <LocalFirstScanInner />;

const LocalFirstScanInner = () => {
	const { t: T } = useTranslation("common");

	const [Status, SetStatus] = useState<ScanStatus>("Scanning");

	const [DaemonDetail, SetDaemonDetail] = useState<DaemonInfo | null>(null);

	const [ScanProgress, SetScanProgress] = useState(0);

	useEffect(() => {
		let Cancelled = false;

		const RunScan = async () => {
			SetStatus("Scanning");

			SetScanProgress(0);

			for (let Index = 0; Index < DAEMON_ENDPOINT.length; Index++) {
				if (Cancelled) return;

				const Endpoint = DAEMON_ENDPOINT[Index];

				if (!Endpoint) continue;

				SetScanProgress(
					Math.round(((Index + 1) / DAEMON_ENDPOINT.length) * 100),
				);

				const Result = await ProbeDaemon(
					Endpoint.URL,

					Endpoint.Port,

					SCAN_TIMEOUT,
				);

				if (Result && !Cancelled) {
					SetDaemonDetail(Result);

					SetStatus("Connected");

					return;
				}
			}

			if (!Cancelled) {
				SetScanProgress(100);

				SetStatus("NotFound");
			}
		};

		RunScan();

		return () => {
			Cancelled = true;
		};
	}, []);

	return (
		<div className="StaccatoCard StaccatoBorderShimmer bg-card p-6">
			<div className="flex items-center gap-4">
				<ThemeImage
					src="/Asset/Dark/Logo/Glyph/Land.svg"
					alt="Land"
					width={48}
					height={48}
				/>
				<div className="flex-1">
					<div className="flex items-center gap-3">
						<h3 className="font-medium text-card-foreground">
							{T("dashboard.localFirst.title", {
								defaultValue: "Air Daemon",
							})}
						</h3>
						{Status === "Scanning" && (
							<span className="inline-flex items-center border border-orange-200 bg-orange-50 px-2.5 py-0.5 font-medium text-orange-700">
								{T("dashboard.localFirst.scanning", {
									defaultValue: "Scanning",
								})}

								{"\u2001"}

								<span
									className="flat h-1.5 w-1.5 animate-pulse bg-orange-500"
									aria-hidden="true"
								/>
							</span>
						)}
						{Status === "Connected" && (
							<span className="inline-flex items-center border border-green-200 bg-green-50 px-2.5 py-0.5 font-medium text-green-700">
								{T("dashboard.localFirst.connected", {
									defaultValue: "Connected",
								})}

								{"\u2001"}

								<span
									className="flat h-1.5 w-1.5 bg-green-500"
									aria-hidden="true"
								/>
							</span>
						)}
						{Status === "NotFound" && (
							<span className="bg-mute inline-flex items-center px-2.5 py-0.5 font-medium text-muted-foreground">
								{T("dashboard.localFirst.notFound", {
									defaultValue: "Not Detected",
								})}

								{"\u2001"}

								<span
									className="flat h-1.5 w-1.5 bg-gray-400"
									aria-hidden="true"
								/>
							</span>
						)}
					</div>

					{/* Scan Animation */}
					{Status === "Scanning" && (
						<div className="mt-3">
							<ScanAnimation />
							<div className="mt-2 h-1 w-full overflow-hidden bg-gray-100">
								<div
									className="h-full bg-orange-400 transition-all duration-500"
									style={{ width: `${ScanProgress}%` }}
								/>
							</div>
							<p className="mt-1 text-muted-foreground">
								{T("dashboard.localFirst.scanDescription", {
									defaultValue:
										"Checking ws://localhost:7979 and ws://localhost:7878",
								})}
							</p>
						</div>
					)}

					{/* Connected State */}
					{Status === "Connected" && DaemonDetail && (
						<div className="mt-3 space-y-2">
							<p className="text-green-700">
								{T("dashboard.localFirst.connectedMessage", {
									defaultValue: "Connected to Air Daemon",
								})}
							</p>
							<div className="flex flex-wrap gap-3 text-muted-foreground">
								<span className="flex items-center gap-1">
									<span className="font-medium">
										{T("dashboard.localFirst.portLabel", {
											defaultValue: "Port",
										})}
									</span>
									<code>{DaemonDetail.Port}</code>
								</span>
								<span className="flex items-center gap-1">
									<span className="font-medium">
										{T(
											"dashboard.localFirst.versionLabel",
											{
												defaultValue: "Version",
											},
										)}
									</span>
									<code>{DaemonDetail.Version}</code>
								</span>
								<span className="flex items-center gap-1">
									<span className="font-medium">
										{T(
											"dashboard.localFirst.protocolLabel",
											{
												defaultValue: "Protocol",
											},
										)}
									</span>
									<code>WebSocket</code>
								</span>
							</div>
							<div className="flex flex-wrap gap-2 pt-1">
								<span className="inline-flex items-center border border-blue-200 bg-blue-50 px-2 py-0.5 text-blue-700">
									Peer-to-peer design{"\u2001"}
									<span
										className="flat h-1 w-1 bg-blue-500"
										aria-hidden="true"
									/>
								</span>
								<span className="inline-flex items-center border border-blue-200 bg-blue-50 px-2 py-0.5 text-blue-700">
									Local-first{"\u2001"}
									<span
										className="flat h-1 w-1 bg-blue-500"
										aria-hidden="true"
									/>
								</span>
								<span className="inline-flex items-center border border-blue-200 bg-blue-50 px-2 py-0.5 text-blue-700">
									No cloud required{"\u2001"}
									<span
										className="flat h-1 w-1 bg-blue-500"
										aria-hidden="true"
									/>
								</span>
							</div>
						</div>
					)}

					{/* Not Found State */}
					{Status === "NotFound" && (
						<div className="mt-3 space-y-3">
							<p className="text-muted-foreground">
								{T("dashboard.localFirst.notFoundMessage", {
									defaultValue:
										"Air Daemon not detected. Launch Code Editor Land to enable local-first features.",
								})}
							</p>
							<div className="flex flex-wrap gap-3">
								<a
									href="/Download"
									className="StaccatoButton inline-flex items-center justify-center border border-orange-300 bg-orange-50 px-4 py-2 font-medium text-orange-700 transition-all hover:bg-orange-100"
								>
									{T("dashboard.localFirst.downloadButton", {
										defaultValue: "Download Land",
									})}

									<span className="InlineSeparator">
										&#8595;
									</span>
								</a>
								<button
									type="button"
									onClick={() => window.location.reload()}
									className="StaccatoButton inline-flex items-center justify-center bg-card px-4 py-2 font-medium transition-all hover:bg-secondary"
								>
									{T("dashboard.localFirst.retryButton", {
										defaultValue: "Retry Scan",
									})}
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
