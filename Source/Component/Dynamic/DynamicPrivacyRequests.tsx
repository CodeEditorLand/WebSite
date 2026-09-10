"use client";

import { Requests } from "../../Library/Contact/Request.js";

/**
 * Privacy & Data Rights directory for the Dashboard.
 *
 * Each card links to a dedicated /Contact/<Slug> form page
 * where the user fills out a structured request with their
 * income code, pre-filled Auth0 data, and three delivery options.
 *
 * No mailto: links are generated here - all email composition
 * happens on the dedicated form pages to ensure plain-text
 * formatting and proper income code tagging.
 */
export default () => {
	const GdprRights = [
		Requests.REACH,

		Requests.AMEND,

		Requests.PAUSE,

		Requests.QUERY,

		Requests.LEAVE,

		Requests.LODGE,
	] as const;

	const SupportChannels = [
		Requests.SCOUT,

		Requests.GUARD,

		Requests.CLAIM,

		Requests.LEGAL,
	] as const;

	const BadgeColor = (Article?: string): string =>
		Article
			? "border border-blue-200 bg-blue-50 text-blue-700"
			: "bg-mute text-muted-foreground";

	return (
		<div className="space-y-12">
			{/* GDPR Rights */}
			<div>
				<h3 className="mb-2 font-mono text-sm font-semibold">
					Your Rights Under GDPR
				</h3>
				<p className="mb-6 text-muted-foreground">
					As a resident of the EU/EEA or a user of our service, you
					hold the following rights. Each link opens a dedicated form
					page that pre-fills your account details and generates a
					properly formatted, income-coded request.
				</p>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{GdprRights.map((Right) => (
						<a
							key={Right.Code}
							href={`/Contact/${Right.Slug.charAt(0).toUpperCase()}${Right.Slug.slice(1)}`}
							className="StaccatoCard StaccatoBorderShimmer flex flex-col bg-card p-5 transition-all hover:bg-secondary focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
						>
							<div className="mb-3 flex items-start justify-between gap-2">
								<h4 className="font-medium leading-snug text-card-foreground">
									{Right.Title}
								</h4>
								<div className="flex shrink-0 flex-col items-end gap-1">
									<span
										className={`px-2 py-0.5 font-mono text-sm font-bold tracking-widest ${BadgeColor(Right.Article)}`}
									>
										{Right.Code}
									</span>
									{Right.Article && (
										<span className="font-mono text-[9px] text-card-foreground">
											{Right.Article}
										</span>
									)}
								</div>
							</div>
							<p className="mb-4 flex-1 text-sm leading-relaxed text-card-foreground">
								{Right.Subtitle}
							</p>
							<span className="mt-auto inline-flex items-center text-sm font-medium text-primary">
								Open form{" "}
								<span aria-hidden="true" className="ml-1">
									{"→"}
								</span>
							</span>
						</a>
					))}
				</div>
			</div>

			{/* Support Channels */}
			<div>
				<h3 className="mb-2 font-mono text-sm font-semibold">
					Support & Assistance
				</h3>
				<p className="mb-6 text-muted-foreground">
					Direct channels for technical issues, security reports,
					copyright claims, and legal enquiries. Each form pre-fills
					your details and generates a plain-text, income-coded email.
				</p>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					{SupportChannels.map((Channel) => (
						<a
							key={Channel.Code}
							href={`/Contact/${Channel.Slug.charAt(0).toUpperCase()}${Channel.Slug.slice(1)}`}
							className="StaccatoCard StaccatoBorderShimmer flex flex-col bg-card p-5 transition-all hover:bg-secondary focus:outline-2 focus:outline-offset-2 focus:outline-[var(--Primary)]"
						>
							<div className="mb-2 flex items-center justify-between gap-2">
								<h4 className="font-medium text-card-foreground">
									{Channel.Title}
								</h4>
								<span className="shrink-0 font-mono text-sm font-bold tracking-widest text-card-foreground">
									{Channel.Code}
								</span>
							</div>
							<p className="mb-4 flex-1 text-sm leading-relaxed text-card-foreground">
								{Channel.Subtitle}
							</p>
							<span className="mt-auto font-mono text-sm text-card-foreground">
								{Channel.To}
							</span>
						</a>
					))}
				</div>
			</div>

			{/* Delete Account */}
			<div>
				<h3 className="mb-2 font-mono text-sm font-semibold">
					Delete Account
				</h3>
				<p className="mb-6 text-muted-foreground">
					Permanently delete your account and all associated personal
					data under GDPR Article 17. This action is irreversible.
				</p>
				<a
					href="/Contact/Erase"
					className="StaccatoCard block border border-red-200 bg-card p-6 transition-all hover:bg-red-50 focus:outline-2 focus:outline-offset-2 focus:outline-red-400"
				>
					<div className="mb-4 flex items-start gap-4">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center border border-red-200 bg-red-50 text-red-600">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="M3 6h18" />
								<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
								<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
								<line x1="10" y1="11" x2="10" y2="17" />
								<line x1="14" y1="11" x2="14" y2="17" />
							</svg>
						</div>
						<div className="flex-1">
							<div className="mb-1 flex items-center gap-2">
								<h4 className="font-semibold text-red-700">
									Permanent Account Deletion
								</h4>
								<span className="font-mono text-sm font-bold tracking-widest text-red-400">
									ERASE
								</span>
							</div>
							<p className="text-sm text-card-foreground">
								Opens a structured erasure request form. The
								generated email includes income code [ERASE] and
								covers Auth0, PostHog, Cloudflare, and all
								backup copies - citing GDPR Art. 17 with a
								30-day response requirement.
							</p>
						</div>
						<span className="shrink-0 font-medium text-red-600">
							{"→"}
						</span>
					</div>
				</a>
			</div>
		</div>
	);
};
