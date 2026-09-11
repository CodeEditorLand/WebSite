import React, { useState } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../UI/Card";

import { DynamicButton } from "./DynamicButton";

import { DynamicInput } from "./DynamicInput";

import type Property from "./Interface/Property/Password/Forgot.js";

/**
 * Dynamic ForgotPassword component for password reset request
 * Renders email form, success state, and resend functionality
 */
const DynamicForgotPassword = ({
	Content,
	OnSubmit,
	OnResend,
	OnNavigate,
	ClassName,
	IsLoading = false,
	ErrorMessage,
}: Property) => {
	const {
		Title,

		Description,

		EmailField,

		SubmitButton,

		ResendButton,

		SuccessMessage,
	} = Content;

	const [Email, SetEmail] = useState("");

	const [IsSubmitted, SetIsSubmitted] = useState(false);

	const [InternalError, SetInternalError] = useState("");

	const HandleSubmit = (Event: React.FormEvent) => {
		Event.preventDefault();

		if (!Email) {
			SetInternalError("Email is required");

			return;
		}

		if (!/\S+@\S+\.\S+/.test(Email)) {
			SetInternalError("Please enter a valid email");

			return;
		}

		OnSubmit?.(Email);

		SetIsSubmitted(true);

		SetInternalError("");
	};

	return (
		<section className="py-20" aria-label="Forgot password">
			<div className="container mx-auto px-4">
				<div className={`mx-auto max-w-md ${ClassName}`}>
					<Card className="StaccatoCard StaccatoBorderShimmer StaccatoShadowLift">
						<CardHeader className="space-y-1 text-center">
							<CardTitle className="text-2xl">{Title}</CardTitle>
							<CardDescription>{Description}</CardDescription>
						</CardHeader>
						<CardContent>
							{!IsSubmitted ? (
								<form
									className="space-y-4"
									onSubmit={HandleSubmit}
									aria-label="Password reset request form"
								>
									<div aria-live="polite" aria-atomic="true">
										{(ErrorMessage || InternalError) && (
											<div
												className="bg-[color-mix(in_srgb,var(--Destruct)_10%,transparent)] flat p-3 text-destructive"
												role="alert"
											>
												{ErrorMessage || InternalError}
											</div>
										)}
									</div>

									<DynamicInput
										Content={{
											...EmailField,
											OnChange: SetEmail,
										}}
										Id="email"
									/>

									<DynamicButton
										Content={{
											...SubmitButton,
											Type: "submit",
											FullWidth: true,
										}}
										IsLoading={IsLoading}
									/>
								</form>
							) : (
								<div
									className="space-y-6 text-center"
									role="status"
									aria-live="polite"
								>
									<div className="space-y-2">
										<div
											className="flat mx-auto flex h-12 w-12 items-center justify-center bg-green-100"
											aria-hidden="true"
										>
											<svg
												className="h-6 w-6 text-green-600"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												aria-hidden="true"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
										<h3 className="text-lg font-medium">
											Check your email
										</h3>
										<p className="text-muted-foreground">
											{SuccessMessage ||
												"We've sent a password reset link to your email address."}
										</p>
									</div>

									{ResendButton && (
										<div className="border-t border-border pt-4">
											<DynamicButton
												Content={{
													...ResendButton,
													Variant: "outline",
													FullWidth: true,
												}}
												OnAction={() => OnResend?.()}
											/>
											<p className="mt-2 text-muted-foreground">
												Didn't receive the email?
											</p>
										</div>
									)}

									<div>
										<button
											type="button"
											className="font-medium text-primary hover:underline"
											onClick={() =>
												OnNavigate?.("/Account/SignIn")
											}
										>
											Back to Sign In
										</button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
};

export { DynamicForgotPassword };

export default DynamicForgotPassword;
