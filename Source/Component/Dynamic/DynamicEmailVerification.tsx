import * as lucide from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../UI/Card";

import { DynamicButton } from "./DynamicButton";

import { DynamicInput } from "./DynamicInput";

import type Property from "./Interface/Property/Verification/Email.js";

import type { default as VerificationState } from "./Type/State/Verification.js";

/**
 * Dynamic EmailVerification component with states: pending, verifying, success, error
 * Auto-verifies if token present in URL, otherwise shows pending state with resend
 */
const DynamicEmailVerification = ({
	Content,
	Token: PropToken,
	UserEmail,
	OnVerify,
	OnResend,
	OnNavigate,
	ClassName,
}: Property) => {
	const { t: T } = useTranslation("verify");

	const [State, SetState] = useState<VerificationState>("pending");

	const [, SetToken] = useState<string>(PropToken || "");

	const [Email, SetEmail] = useState<string>(UserEmail || "");

	const [ErrorMessage, SetErrorMessage] = useState("");

	const [ResendSuccess, SetResendSuccess] = useState(false);

	const [ResendCooldown, SetResendCooldown] = useState(0);

	const CooldownInterval = useRef<ReturnType<typeof setInterval> | null>(
		null,
	);

	const HandleVerify = useCallback(
		async (VerifyToken: string) => {
			try {
				const Success = OnVerify ? await OnVerify(VerifyToken) : true; // Mock success for demo

				if (Success) {
					SetState("success");
				} else {
					SetState("error");

					SetErrorMessage(Content.Error.Description);
				}
			} catch {
				SetState("error");

				SetErrorMessage(
					T("errorGeneric", {
						defaultValue:
							"An error occurred during verification.\nPlease try again.",
					}),
				);
			}
		},

		[OnVerify, Content.Error.Description],
	);

	// Auto-verify if token in URL
	useEffect(() => {
		const UrlToken =
			PropToken ||
			new URLSearchParams(window.location.search).get("token");

		if (UrlToken) {
			SetToken(UrlToken);

			SetState("verifying");

			HandleVerify(UrlToken);
		}
	}, [PropToken, HandleVerify]);

	const StartCooldown = () => {
		SetResendCooldown(60);

		CooldownInterval.current = setInterval(() => {
			SetResendCooldown((Previous) => {
				if (Previous <= 1) {
					if (CooldownInterval.current) {
						clearInterval(CooldownInterval.current);

						CooldownInterval.current = null;
					}

					return 0;
				}

				return Previous - 1;
			});
		}, 1000);
	};

	useEffect(() => {
		return () => {
			if (CooldownInterval.current) {
				clearInterval(CooldownInterval.current);
			}
		};
	}, []);

	const HandleResend = async () => {
		if (!Email || ResendCooldown > 0) return;

		try {
			(await OnResend?.(Email)) || Promise.resolve(true);

			SetResendSuccess(true);

			StartCooldown();

			setTimeout(() => SetResendSuccess(false), 5000);
		} catch {
			SetErrorMessage(
				T("resendFailed", {
					defaultValue: "Failed to resend email.\nPlease try again.",
				}),
			);
		}
	};

	const RenderPending = () => (
		<Card className="StaccatoCard StaccatoBorderShimmer StaccatoShadowLift">
			<CardHeader className="text-center">
				<div className="bg-[color-mix(in_srgb,var(--Primary)_10%,transparent)] flat mx-auto mb-4 flex h-12 w-12 items-center justify-center">
					<lucide.Mail
						className="h-6 w-6 text-primary"
						aria-hidden="true"
					/>
				</div>
				<CardTitle className="text-2xl">
					{Content.Pending.Title}
				</CardTitle>
				<CardDescription>{Content.Pending.Description}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<DynamicInput
						Content={{
							Label: T("emailLabel", { defaultValue: "Email" }),
							Placeholder: T("emailPlaceholder", {
								defaultValue:
									"Enter your email to resend verification",
							}),
							Type: "email",
							Value: Email,
							OnChange: SetEmail,
						}}
						Id="email"
					/>

					<DynamicButton
						Content={{
							...Content.Pending.ResendButton,
							Text:
								ResendCooldown > 0
									? T("resendCooldown", {
											defaultValue:
												"Resend in {{seconds}}s",
											seconds: ResendCooldown,
										})
									: (Content.Pending.ResendButton.Text ?? ""),
							FullWidth: true,
							Disabled: !Email || ResendCooldown > 0,
						}}
						OnAction={HandleResend}
					/>

					{ResendSuccess && (
						<p className="text-center text-green-600" role="status">
							{Content.Pending.ResendSuccessMessage ||
								T("resendSuccess", {
									defaultValue: "Verification email resent!",
								})}
						</p>
					)}

					{Content.Pending.EmailSentMessage && (
						<p className="text-center text-muted-foreground">
							{Content.Pending.EmailSentMessage}
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);

	const RenderVerifying = () => (
		<Card className="StaccatoCard StaccatoBorderShimmer StaccatoShadowLift">
			<CardHeader className="text-center">
				<div
					className="bg-[color-mix(in_srgb,var(--Primary)_10%,transparent)] flat mx-auto mb-4 flex h-12 w-12 items-center justify-center"
					aria-hidden="true"
				>
					<div className="h-6 w-6 animate-spin rounded-none border-2 border-primary border-t-transparent"></div>
				</div>
				<CardTitle>
					{Content.Verifying?.Title ||
						T("verifying.title", {
							defaultValue: "Verifying your email",
						})}
				</CardTitle>
				<CardDescription role="status">
					{Content.Verifying?.Description ||
						T("verifying.description", {
							defaultValue:
								"Please wait while we verify your email address...",
						})}
				</CardDescription>
			</CardHeader>
		</Card>
	);

	const RenderSuccess = () => (
		<Card className="StaccatoCard StaccatoBorderShimmer StaccatoShadowLift">
			<CardHeader className="text-center">
				<DynamicButton
					Content={{
						...Content.Success.ContinueButton,
						FullWidth: true,
					}}
					OnAction={() => OnNavigate?.("/Dashboard")}
				/>
				<div className="flex items-center justify-center pt-4">
					<CardTitle className="text-2xl">
						{Content.Success.Title}
					</CardTitle>
					{"\u2001"}
					<lucide.CheckCircle
						className="h-5 w-5 shrink-0 text-green-600"
						aria-hidden="true"
					/>
				</div>
				<CardDescription className="">
					{Content.Success.Description}
				</CardDescription>
			</CardHeader>
		</Card>
	);

	const RenderError = () => (
		<Card className="StaccatoCard StaccatoBorderShimmer StaccatoShadowLift">
			<CardHeader className="text-center">
				<DynamicButton
					Content={{
						...Content.Error.BackToSignInButton,
						FullWidth: true,
					}}
					OnAction={() => OnNavigate?.("/Account/SignIn")}
				/>
				<div className="flex items-center justify-center pt-4">
					<CardTitle className="text-2xl">
						{Content.Error.Title}
					</CardTitle>
					{"\u2001"}
					<lucide.XCircle
						className="h-5 w-5 shrink-0 text-red-600"
						aria-hidden="true"
					/>
				</div>
				<CardDescription className="">
					{ErrorMessage || Content.Error.Description}
				</CardDescription>
			</CardHeader>
		</Card>
	);

	return (
		<section className="py-20" aria-label="Email verification">
			<div className="container mx-auto px-4">
				<div
					className={`mx-auto max-w-md ${ClassName}`}
					aria-live="polite"
				>
					{State === "pending" && RenderPending()}
					{State === "verifying" && RenderVerifying()}
					{State === "success" && RenderSuccess()}
					{State === "error" && RenderError()}
				</div>
			</div>
		</section>
	);
};

export { DynamicEmailVerification };

export default DynamicEmailVerification;
