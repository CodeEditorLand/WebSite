/**
 * DynamicSignUp - account registration form for the Cloud tier.
 *
 * Collects email, password (with strength indicator and visibility toggle),
 * and display name. Submits to Auth0 via Auth0AccountGate.
 */
import * as lucide from "lucide-react";

import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../UI/Card";

import { DynamicButton } from "./DynamicButton";

import { DynamicCheckbox } from "./DynamicCheckbox";

import { DynamicInput } from "./DynamicInput";

import type Property from "./Interface/Property/SignUp.js";

/**
 * Dynamic SignUp component that accepts registration form schema
 * Renders email, password, confirm password, terms checkbox, social OAuth
 */
const DynamicSignUp = ({
	Content,
	OnSubmit,
	OnOAuth,
	OnNavigate,
	ClassName,
	IsLoading = false,
	ErrorMessage,
}: Property) => {
	const {
		Title,

		Description,

		EmailField,

		PasswordField,

		ConfirmPasswordField,

		TermsCheckbox,

		SubmitButton,

		OauthButtons = [],

		ShowDivider = true,

		FooterLinks,
	} = Content;

	const [Email, SetEmail] = useState("");

	const [Password, SetPassword] = useState("");

	const [ConfirmPassword, SetConfirmPassword] = useState("");

	const [ShowPassword, SetShowPassword] = useState(false);

	const [TermsAccepted, SetTermsAccepted] = useState(false);

	const { t: T } = useTranslation("account");

	const [Errors, SetErrors] = useState<{
		email?: string;

		password?: string;

		confirmPassword?: string;

		terms?: string;
	}>({});

	const Validate = () => {
		const NewErrors: typeof Errors = {};

		if (!Email) {
			NewErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(Email)) {
			NewErrors.email = "Please enter a valid email";
		}

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

		if (!TermsAccepted) {
			NewErrors.terms = "You must accept the terms and conditions";
		}

		SetErrors(NewErrors);

		return Object.keys(NewErrors).length === 0;
	};

	const HandleSubmit = (Event: React.FormEvent) => {
		Event.preventDefault();

		if (Validate()) {
			OnSubmit?.(Email, Password, ConfirmPassword, TermsAccepted);
		}
	};

	return (
		<section className="py-20" aria-label="Sign up">
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
								aria-label="Sign up form"
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

								<DynamicInput
									Content={{
										...EmailField,
										OnChange: SetEmail,
									}}
									Id="email"
								/>

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
													? T("signUp.hidePassword", {
															defaultValue:
																"Hide password",
														})
													: T("signUp.showPassword", {
															defaultValue:
																"Show password",
														})
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
											aria-label={
												Password.length >= 12 &&
												/[^a-zA-Z0-9]/.test(Password)
													? T(
															"signUp.passwordStrength.strong",

															{
																defaultValue:
																	"Strong password",
															},
														)
													: Password.length >= 8
														? T(
																"signUp.passwordStrength.weak",

																{
																	defaultValue:
																		"Weak password",
																},
															)
														: T(
																"signUp.passwordStrength.weak",

																{
																	defaultValue:
																		"Weak password",
																},
															)
											}
											role="status"
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

								<DynamicInput
									Content={{
										...ConfirmPasswordField,
										Type: "password",
										OnChange: SetConfirmPassword,
										AutoComplete: "new-password",
										Error: Errors.confirmPassword,
									}}
									Id="confirmPassword"
								/>

								<DynamicCheckbox
									Content={{
										...TermsCheckbox,
										Checked: TermsAccepted,
										OnChange: SetTermsAccepted,
									}}
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

							{ShowDivider && OauthButtons.length > 0 && (
								<div className="relative my-6">
									<div className="absolute inset-0 flex items-center">
										<span className="StaccatoSeparator w-full border-t" />
									</div>
									<div className="relative flex justify-center uppercase">
										<span className="bg-background px-2 text-muted-foreground">
											{"Or"}
										</span>
									</div>
								</div>
							)}

							{OauthButtons.length > 0 && (
								<div className="space-y-3">
									{OauthButtons.map((ButtonItem, Index) => (
										<DynamicButton
											key={Index}
											Content={{
												...ButtonItem,
												FullWidth: true,
											}}
											OnAction={() =>
												OnOAuth?.(
													ButtonItem.Icon as string,
												)
											}
										/>
									))}
								</div>
							)}
						</CardContent>
						<CardFooter className="flex flex-col gap-3 text-center">
							{FooterLinks?.SignIn && (
								<div>
									<button
										type="button"
										className="font-medium text-primary hover:underline"
										onClick={() =>
											FooterLinks.SignIn &&
											OnNavigate?.(
												FooterLinks.SignIn.Href,
											)
										}
									>
										{FooterLinks.SignIn.Label}
									</button>
									<p className="mt-1 text-muted-foreground">
										Already have an account?
									</p>
								</div>
							)}
						</CardFooter>
					</Card>
				</div>
			</div>
		</section>
	);
};

export { DynamicSignUp };

export default DynamicSignUp;
