import * as lucide from "lucide-react";

import React, { useEffect, useState } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../UI/Card";

import { DynamicButton } from "./DynamicButton";

import { DynamicInput } from "./DynamicInput";

import type Property from "./Interface/Property/Password/Reset.js";

import type { default as ResetState } from "./Type/State/Reset.js";

/**
 * Dynamic ResetPassword component for setting new password with token validation
 * Supports 4 states: checking, valid (form), invalid (error), success
 */
const DynamicResetPassword = ({
	Content,
	Token: PropToken,
	OnReset,
	OnNavigate,
	ClassName,
	IsLoading = false,
	ErrorMessage,
}: Property) => {
	const {
		Title,

		Description,

		PasswordField,

		ConfirmPasswordField,

		SubmitButton,

		SuccessMessage,

		InvalidTokenMessage,

		CheckingMessage,
	} = Content;

	const [State, SetState] = useState<ResetState>("checking");

	const [Token, SetToken] = useState<string>(PropToken || "");

	const [Password, SetPassword] = useState("");

	const [ConfirmPassword, SetConfirmPassword] = useState("");

	const [ShowPassword, SetShowPassword] = useState(false);

	const [ShowConfirmPassword, SetShowConfirmPassword] = useState(false);

	const [Errors, SetErrors] = useState<{
		password?: string;

		confirmPassword?: string;
	}>({});

	// Simulate token validation (would be API call in real implementation)
	useEffect(() => {
		const TokenFromUrl =
			PropToken ||
			new URLSearchParams(window.location.search).get("token");

		if (!TokenFromUrl) {
			SetState("invalid");

			return;
		}

		// Simulate API call to validate token
		const ValidateToken = async () => {
			await new Promise((Resolve) => setTimeout(Resolve, 1000)); // Simulate delay

			// In real implementation, call `/api/auth/verify-reset-token?token=${token}`
			SetToken(TokenFromUrl);

			SetState("valid"); // Assume valid for now
		};

		ValidateToken();
	}, [PropToken]);

	const Validate = () => {
		const NewErrors: typeof Errors = {};

		if (!Password) {
			NewErrors.password = "Password is required";
		} else if (Password.length < 8) {
			NewErrors.password = "Password must be at least 8 characters";
		}

		if (!ConfirmPassword) {
			NewErrors.confirmPassword = "Please confirm your password";
		} else if (Password !== ConfirmPassword) {
			NewErrors.confirmPassword = "Passwords do not match";
		}

		SetErrors(NewErrors);

		return Object.keys(NewErrors).length === 0;
	};

	const HandleSubmit = (Event: React.FormEvent) => {
		Event.preventDefault();

		if (Validate() && Token) {
			OnReset?.(Token, Password, ConfirmPassword);

			SetState("success");
		}
	};

	if (State === "checking") {
		return (
			<section className="py-20" aria-label="Reset password">
				<div className="container mx-auto px-4">
					<div
						className={`mx-auto max-w-md text-center ${ClassName}`}
					>
						<Card className="StaccatoCard StaccatoBorderShimmer StaccatoShadowLift">
							<CardContent className="pt-6">
								<div className="space-y-4" aria-live="polite">
									<div
										className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
										aria-hidden="true"
									></div>
									<p
										className="text-muted-foreground"
										role="status"
									>
										{CheckingMessage ||
											"Validating reset token..."}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		);
	}

	if (State === "invalid") {
		return (
			<section className="py-20" aria-label="Reset password">
				<div className="container mx-auto px-4">
					<div
						className={`mx-auto max-w-md text-center ${ClassName}`}
					>
						<Card className="StaccatoCard StaccatoBorderShimmer StaccatoShadowLift">
							<CardContent className="pt-6">
								<div className="space-y-4" role="alert">
									<DynamicButton
										Content={{
											Text: "Back to Sign In",
											Variant: "default",
											FullWidth: true,
										}}
										OnAction={() =>
											OnNavigate?.("/Account/SignIn")
										}
									/>
									<div className="flex items-center justify-center">
										<h3 className="text-lg font-semibold">
											Invalid or Expired Token
										</h3>
										{"\u2001"}
										<lucide.AlertCircle
											className="h-5 w-5 shrink-0 text-destructive"
											aria-hidden="true"
										/>
									</div>
									<p className="text-muted-foreground">
										{InvalidTokenMessage ||
											"This password reset link is invalid or has expired. Please request a new one."}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		);
	}

	if (State === "success") {
		return (
			<section className="py-20" aria-label="Reset password">
				<div className="container mx-auto px-4">
					<div
						className={`mx-auto max-w-md text-center ${ClassName}`}
					>
						<Card className="StaccatoCard StaccatoBorderShimmer StaccatoShadowLift">
							<CardContent className="pt-6">
								<div
									className="space-y-4"
									role="status"
									aria-live="polite"
								>
									<DynamicButton
										Content={{
											Text: "Go to Sign In",
											Variant: "default",
											FullWidth: true,
										}}
										OnAction={() =>
											OnNavigate?.("/Account/SignIn")
										}
									/>
									<div className="flex items-center justify-center">
										<h3 className="text-lg font-semibold">
											Password Reset Successful
										</h3>
										{"\u2001"}
										<lucide.CheckCircle
											className="h-5 w-5 shrink-0 text-green-600"
											aria-hidden="true"
										/>
									</div>
									<p className="text-muted-foreground">
										{SuccessMessage ||
											"Your password has been reset successfully. You can now sign in with your new password."}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		);
	}

	// Valid state - show form
	return (
		<section className="py-20" aria-label="Reset password">
			<div className="container mx-auto px-4">
				<div className={`mx-auto max-w-md ${ClassName}`}>
					<Card className="StaccatoCard StaccatoBorderShimmer StaccatoShadowLift">
						<CardHeader className="space-y-1 text-center">
							<CardTitle className="text-2xl">{Title}</CardTitle>
							<CardDescription>{Description}</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								className="space-y-4"
								onSubmit={HandleSubmit}
								aria-label="Reset password form"
							>
								<div aria-live="polite" aria-atomic="true">
									{ErrorMessage && (
										<div
											className="bg-destructive/10 flat p-3 text-destructive"
											role="alert"
										>
											{ErrorMessage}
										</div>
									)}
								</div>

								<div>
									<div className="relative">
										<DynamicInput
											Content={{
												...PasswordField,
												Type: ShowPassword
													? "text"
													: "password",
												OnChange: SetPassword,
												AutoComplete: "new-password",
												Error: Errors.password,
											}}
											Id="password"
										/>
										<button
											type="button"
											className="absolute right-3 top-2 text-muted-foreground hover:text-foreground"
											aria-label={
												ShowPassword
													? "Hide password"
													: "Show password"
											}
											onClick={() =>
												SetShowPassword(!ShowPassword)
											}
										>
											{ShowPassword ? (
												<lucide.EyeOff
													className="h-4 w-4"
													aria-hidden="true"
												/>
											) : (
												<lucide.Eye
													className="h-4 w-4"
													aria-hidden="true"
												/>
											)}
										</button>
									</div>
									{Password && (
										<div
											className="mt-1 flex gap-1"
											role="status"
											aria-label={
												Password.length >= 12 &&
												/[^a-zA-Z0-9]/.test(Password)
													? "Strong password"
													: "Weak password"
											}
										>
											{[0, 1, 2].map((Segment) => (
												<div
													key={Segment}
													className="flat h-1 flex-1 transition-colors"
													style={{
														backgroundColor:
															Password.length >=
																12 &&
															/[^a-zA-Z0-9]/.test(
																Password,
															)
																? "#16a34a"
																: Password.length >=
																			8 &&
																	  Segment <
																			2
																	? "#ca8a04"
																	: Password.length >=
																				6 &&
																		  Segment <
																				1
																		? "var(--Destruct)"
																		: "var(--Border, #e5e7eb)",
													}}
												/>
											))}
										</div>
									)}
								</div>

								<div className="relative">
									<DynamicInput
										Content={{
											...ConfirmPasswordField,
											Type: ShowConfirmPassword
												? "text"
												: "password",
											OnChange: SetConfirmPassword,
											AutoComplete: "new-password",
											Error: Errors.confirmPassword,
										}}
										Id="confirmPassword"
									/>
									<button
										type="button"
										className="absolute right-3 top-2 text-muted-foreground hover:text-foreground"
										aria-label={
											ShowConfirmPassword
												? "Hide confirm password"
												: "Show confirm password"
										}
										onClick={() =>
											SetShowConfirmPassword(
												!ShowConfirmPassword,
											)
										}
									>
										{ShowConfirmPassword ? (
											<lucide.EyeOff
												className="h-4 w-4"
												aria-hidden="true"
											/>
										) : (
											<lucide.Eye
												className="h-4 w-4"
												aria-hidden="true"
											/>
										)}
									</button>
								</div>

								<DynamicButton
									Content={{
										...SubmitButton,
										Type: "submit",
										FullWidth: true,
									}}
									IsLoading={IsLoading}
								/>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
};

export { DynamicResetPassword };

export default DynamicResetPassword;
