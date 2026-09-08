"use client";

import { useAuth0 } from "@auth0/auth0-react";

import { Copy, Mail, MessageSquare } from "lucide-react";

import { useState } from "react";

import {
	BuildEmailBody,
	BuildMailtoHref,
	GeneratePairId,
	type RequestConfig,
} from "../../Library/Contact/Request.js";

import Auth0Provider from "../Provider/Auth0Provider.js";

// ── Exported wrapper (Auth0 context) ──────────────────────────────────────

export default ({
	Config,
	Domain,
	ClientIdentifier,
}: {
	Config: RequestConfig;

	Domain?: string;

	ClientIdentifier?: string;
}) => (
	<Auth0Provider
		Children={<ContactFormInner Config={Config} />}
		{...(Domain ? { Domain } : {})}
		{...(ClientIdentifier ? { ClientIdentifier } : {})}
	/>
);

// ── Provider label helper ─────────────────────────────────────────────────

const ProviderLabel = (Sub?: string): string => {
	if (!Sub) return "Email / Password";

	if (Sub.startsWith("google-oauth2|")) return "Google";

	if (Sub.startsWith("github|")) return "GitHub";

	if (Sub.startsWith("gitlab|")) return "GitLab";

	if (Sub.startsWith("okta|")) return "Okta SSO";

	if (Sub.startsWith("samlp|")) return "SAML SSO";

	if (Sub.startsWith("waad|")) return "Azure AD";

	return "Auth0";
};

// ── Inner form component ──────────────────────────────────────────────────

const ContactFormInner = ({ Config }: { Config: RequestConfig }) => {
	const { user: User } = useAuth0();

	const Year = new Date().getFullYear();

	// Build initial values - prefill from Auth0 where possible
	const InitialValues = (): Record<string, string | string[]> => {
		const V: Record<string, string | string[]> = {};

		for (const Field of Config.Fields) {
			if (Field.prefill === "name")
				V[Field.id] = User?.name || User?.nickname || "";
			else if (Field.prefill === "email") V[Field.id] = User?.email || "";
			else if (Field.prefill === "sub") V[Field.id] = User?.sub || "";
			else if (Field.prefill === "provider")
				V[Field.id] = ProviderLabel(User?.sub);
			else if (Field.type === "checkboxes") V[Field.id] = [];
			else V[Field.id] = "";
		}

		return V;
	};

	// Stable pair ID for this form session - generated once, never changes.
	// Appears as CODE-XXXXX in the subject and body so the team can match
	// a reply to its original submission immediately.
	const [PairId] = useState<string>(GeneratePairId);

	const [Values, SetValues] =
		useState<Record<string, string | string[]>>(InitialValues);

	const [CopyState, SetCopyState] = useState<"idle" | "copied">("idle");

	const [Errors, SetErrors] = useState<Record<string, string>>({});

	const HandleChange = (Id: string, Value: string | string[]) => {
		SetValues((Prev) => ({ ...Prev, [Id]: Value }));

		SetErrors((Prev) => ({ ...Prev, [Id]: "" }));
	};

	const HandleCheckboxGroup = (Id: string, Option: string) => {
		const Current = (Values[Id] as string[]) || [];

		const Next = Current.includes(Option)
			? Current.filter((V) => V !== Option)
			: [...Current, Option];

		HandleChange(Id, Next);
	};

	const Validate = (): boolean => {
		const NewErrors: Record<string, string> = {};

		for (const Field of Config.Fields) {
			if (!Field.required) continue;

			const Value = Values[Field.id];

			if (Field.type === "checkbox" && Value !== "true") {
				NewErrors[Field.id] = "This confirmation is required.";
			} else if (
				Field.type === "checkboxes" &&
				(Value as string[]).length === 0
			) {
				NewErrors[Field.id] = "Select at least one option.";
			} else if (
				Field.type !== "checkbox" &&
				Field.type !== "checkboxes" &&
				(!Value || (Value as string).trim() === "")
			) {
				NewErrors[Field.id] = "This field is required.";
			}
		}

		SetErrors(NewErrors);

		return Object.keys(NewErrors).length === 0;
	};

	const HandleCopy = async () => {
		if (!Validate()) return;

		const Body = BuildEmailBody(Config, Values, Year, PairId);

		const Subject = `[${Config.Code}-${PairId}] ${Config.Title} Request`;

		const Full = `To: ${Config.To}\nSubject: ${Subject}\n\n${Body}`;

		try {
			await navigator.clipboard.writeText(Full);

			SetCopyState("copied");

			setTimeout(() => SetCopyState("idle"), 3000);
		} catch {
			// Clipboard not available
		}
	};

	// Never call Validate() during render - it calls SetErrors which triggers
	// a state update causing an infinite re-render loop during SSR prerender.
	// Always build the full href; validation fires only on user interaction.
	const MailtoHref = BuildMailtoHref(Config, Values, Year, PairId);

	const BadgeColor = Config.Destructive
		? "border-red-200 bg-red-50 text-red-700"
		: Config.Article
			? "border-blue-200 bg-blue-50 text-blue-700"
			: "border-[var(--Border)] bg-mute text-muted-foreground";

	return (
		<div className="mx-auto max-w-2xl space-y-8 px-4 py-12">
			{/* Income code badge + header */}
			<div className="space-y-3">
				<div className="flex flex-wrap items-center gap-3">
					<span
						className={`inline-flex items-center gap-2 border px-3 py-1 text-foreground`}
						title="Pair reference - income code + instance ID. Quote this in all replies."
					>
						{Config.Code}-{PairId}
					</span>
					{Config.Article && (
						<span className="bg-mute inline-flex items-center border border-[var(--Border)] px-2 py-0.5 font-mono text-sm text-muted-foreground">
							{Config.Article}
						</span>
					)}
					<span className="bg-mute inline-flex items-center px-2 py-0.5 font-mono text-sm text-muted-foreground">
						{Config.ResponseDays}d SLA
					</span>
				</div>
				<h1 className="font-mono text-lg font-semibold tracking-tight">
					{Config.Title}
				</h1>
				<p className="text-muted-foreground">{Config.Subtitle}</p>
				<p className="font-mono text-sm text-muted-foreground">
					Sends to:{" "}
					<span className="text-foreground">{Config.To}</span>
				</p>
			</div>

			{/* Form */}
			<div className="StaccatoCard space-y-5 bg-card p-6">
				{Config.Fields.map((Field) => {
					const Value = Values[Field.id];

					const Error = Errors[Field.id];

					if (Field.type === "checkbox") {
						return (
							<div key={Field.id}>
								<label className="flex cursor-pointer items-start gap-3 text-sm">
									<input
										type="checkbox"
										className="mt-0.5 accent-[var(--Primary)]"
										checked={Value === "true"}
										onChange={(E) =>
											HandleChange(
												Field.id,

												E.target.checked
													? "true"
													: "false",
											)
										}
									/>
									<span className="leading-snug">
										{Field.label}
									</span>
								</label>
								{Error && (
									<p className="mt-1 text-sm text-red-600">
										{Error}
									</p>
								)}
							</div>
						);
					}

					if (Field.type === "checkboxes") {
						const Selected = (Value as string[]) || [];

						return (
							<div key={Field.id}>
								<label className="mb-2 block text-sm font-medium">
									{Field.label}
									{Field.required && (
										<span
											className="ml-1 text-red-500"
											aria-hidden="true"
										>
											*
										</span>
									)}
								</label>
								<div className="space-y-2">
									{(Field.options || []).map((Opt) => (
										<label
											key={Opt}
											className="flex cursor-pointer items-center gap-2.5 text-sm"
										>
											<input
												type="checkbox"
												className="accent-[var(--Primary)]"
												checked={Selected.includes(Opt)}
												onChange={() =>
													HandleCheckboxGroup(
														Field.id,

														Opt,
													)
												}
											/>
											{Opt}
										</label>
									))}
								</div>
								{Error && (
									<p className="mt-1 text-sm text-red-600">
										{Error}
									</p>
								)}
							</div>
						);
					}

					if (Field.type === "select") {
						return (
							<div key={Field.id}>
								<label
									htmlFor={Field.id}
									className="mb-1 block text-sm font-medium"
								>
									{Field.label}
									{Field.required && (
										<span
											className="ml-1 text-red-500"
											aria-hidden="true"
										>
											*
										</span>
									)}
								</label>
								<select
									id={Field.id}
									className="w-full border border-[var(--Border)] bg-card px-3 py-2 text-sm focus:outline-2 focus:outline-[var(--Primary)]"
									value={(Value as string) || ""}
									onChange={(E) =>
										HandleChange(Field.id, E.target.value)
									}
								>
									<option value="">Select...</option>
									{(Field.options || []).map((Opt) => (
										<option key={Opt} value={Opt}>
											{Opt}
										</option>
									))}
								</select>
								{Error && (
									<p className="mt-1 text-sm text-red-600">
										{Error}
									</p>
								)}
							</div>
						);
					}

					if (Field.type === "textarea") {
						return (
							<div key={Field.id}>
								<label
									htmlFor={Field.id}
									className="mb-1 block text-sm font-medium"
								>
									{Field.label}
									{Field.required && (
										<span
											className="ml-1 text-red-500"
											aria-hidden="true"
										>
											*
										</span>
									)}
								</label>
								<textarea
									id={Field.id}
									rows={4}
									className="w-full border border-[var(--Border)] bg-card px-3 py-2 text-sm focus:outline-2 focus:outline-[var(--Primary)]"
									placeholder={Field.placeholder}
									value={(Value as string) || ""}
									onChange={(E) =>
										HandleChange(Field.id, E.target.value)
									}
								/>
								{Field.hint && (
									<p className="mt-0.5 text-sm text-card-foreground">
										{Field.hint}
									</p>
								)}
								{Error && (
									<p className="mt-1 text-sm text-red-600">
										{Error}
									</p>
								)}
							</div>
						);
					}

					// text / email
					return (
						<div key={Field.id}>
							<label
								htmlFor={Field.id}
								className="mb-1 block text-sm font-medium"
							>
								{Field.label}
								{Field.required && (
									<span
										className="ml-1 text-red-500"
										aria-hidden="true"
									>
										*
									</span>
								)}
							</label>
							<input
								id={Field.id}
								type={Field.type}
								className="w-full border border-[var(--Border)] bg-card px-3 py-2 text-sm focus:outline-2 focus:outline-[var(--Primary)]"
								placeholder={Field.placeholder}
								value={(Value as string) || ""}
								onChange={(E) =>
									HandleChange(Field.id, E.target.value)
								}
							/>
							{Field.hint && (
								<p className="mt-0.5 text-sm text-card-foreground">
									{Field.hint}
								</p>
							)}
							{Error && (
								<p className="mt-1 text-sm text-red-600">
									{Error}
								</p>
							)}
						</div>
					);
				})}
			</div>

			{/* Three action options */}
			<div className="space-y-4">
				<p className="text-sm font-medium">
					How would you like to send this?
				</p>

				{/* Option A - Email client */}
				<a
					href={MailtoHref}
					onClick={Validate}
					className={`StaccatoButton flex w-full items-center gap-3 border px-5 py-3 font-medium transition-all hover:bg-secondary focus:outline-2 focus:outline-[var(--Primary)] ${Config.Destructive ? "border-red-200 hover:bg-red-50" : "border-[var(--Border)]"}`}
				>
					<Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
					<div className="flex-1 text-left">
						<div className="font-medium">Open in email client</div>
						<div className="text-sm text-muted-foreground">
							Opens your default mail app with the form pre-filled
							as plain text - ready to review and send.
						</div>
					</div>
				</a>

				{/* Option B - Copy text */}
				<button
					type="button"
					onClick={HandleCopy}
					className="StaccatoButton flex w-full items-center gap-3 border border-[var(--Border)] px-5 py-3 font-medium transition-all hover:bg-secondary focus:outline-2 focus:outline-[var(--Primary)]"
				>
					<Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
					<div className="flex-1 text-left">
						<div className="font-medium">
							{CopyState === "copied"
								? "Copied to clipboard"
								: "Copy request text"}
						</div>
						<div className="text-sm text-muted-foreground">
							Copies a formatted plain-text version with pair
							reference{" "}
							<span className="font-mono">
								{Config.Code}-{PairId}
							</span>{" "}
							- paste into any email, ticket, or chat.
						</div>
					</div>
				</button>

				{/* Option C - Conversation (GitHub / external) */}
				{Config.ConversationHref && (
					<a
						href={Config.ConversationHref}
						target="_blank"
						rel="noopener noreferrer"
						className="StaccatoButton flex w-full items-center gap-3 border border-[var(--Border)] px-5 py-3 font-medium transition-all hover:bg-secondary focus:outline-2 focus:outline-[var(--Primary)]"
					>
						<MessageSquare
							className="h-4 w-4 shrink-0"
							aria-hidden="true"
						/>
						<div className="flex-1 text-left">
							<div className="font-medium">
								Open a conversation
							</div>
							<div className="text-sm text-muted-foreground">
								Start a public or private thread - good for
								questions that benefit from community input.
							</div>
						</div>
					</a>
				)}
			</div>

			{/* Pair reference explanation */}
			<div className="bg-mute border border-[var(--Border)] px-5 py-4 text-sm text-muted-foreground">
				<span className="font-mono font-semibold text-foreground">
					{Config.Code}-{PairId}
				</span>{" "}
				is your unique pair reference for this submission -{" "}
				<span className="font-mono">{Config.Code}</span> identifies the
				request type, <span className="font-mono">{PairId}</span> is the
				instance ID. Quote{" "}
				<span className="font-mono text-foreground">
					{Config.Code}-{PairId}
				</span>{" "}
				in any reply so our team can locate and track your request
				immediately without searching by email address.
			</div>
		</div>
	);
};
