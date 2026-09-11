/**
 * DynamicSignIn - email/password sign-in form for the Cloud tier.
 *
 * Handles form validation, password visibility toggle, error display,
 * and "forgot password" link. Submits to Auth0 via Auth0AccountGate.
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

import { DynamicInput } from "./DynamicInput";

import type Property from "./Interface/Property/SignIn.js";

/**
 * Dynamic SignIn component that accepts form schema
 * Renders email/password form with optional OAuth and footer links
 */
const DynamicSignIn = ({
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

		SubmitButton,

		OauthButton,

		ShowDivider = true,

		FooterLinks,
	} = Content;

	const [Email, SetEmail] = useState("");

	const [Password, SetPassword] = useState("");

	const [ShowPassword, SetShowPassword] = useState(false);

	const [, SetErrors] = useState<{ email?: string; password?: string }>({});

	const { t: T } = useTranslation("account");

	const Validate = () => {
		const NewErrors: { email?: string; password?: string } = {};

		if (!Email) {
			NewErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(Email)) {
			NewErrors.email = "Please enter a valid email";
		}

		if (!Password) {
			NewErrors.password = "Password is required";
		}

		SetErrors(NewErrors);

		return Object.keys(NewErrors).length === 0;
	};

	const HandleSubmit = (Event: React.FormEvent) => {
		Event.preventDefault();

		if (!IsLoading && Validate()) {
			OnSubmit?.(Email, Password);
		}
	};

	return (
		<section className="py-20" aria-label="Sign in">
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
								aria-label="Sign in form"
							>
								<div aria-live="polite" aria-atomic="true">
									{ErrorMessage && (
										<div
											className="bg-[color-mix(in_srgb,var(--Destruct)_10%,transparent)] flat p-3 text-destructive"
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

								<div className="relative">
									<DynamicInput
										Content={{
											...PasswordField,
											Type: ShowPassword
												? "text"
												: "password",
											OnChange: SetPassword,
										}}
										Id="password"
									/>
									<button
										type="button"
										className="absolute right-3 top-2 text-muted-foreground hover:text-foreground"
										aria-label={
											ShowPassword
												? T("signIn.hidePassword", {
														defaultValue:
															"Hide password",
													})
												: T("signIn.showPassword", {
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

								<DynamicButton
									Content={{
										...SubmitButton,
										Type: "submit",
										FullWidth: true,
									}}
									IsLoading={IsLoading}
								/>
							</form>

							{ShowDivider && (
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

							{OauthButton && (
								<DynamicButton
									Content={{
										...OauthButton,
										FullWidth: true,
									}}
									{...(OnOAuth ? { OnAction: OnOAuth } : {})}
								/>
							)}
						</CardContent>
						<CardFooter className="flex flex-col gap-3 text-center">
							{FooterLinks?.SignUp && (
								<div>
									<button
										type="button"
										className="font-medium text-card-foreground hover:underline"
										onClick={() =>
											FooterLinks.SignUp &&
											OnNavigate?.(
												FooterLinks.SignUp.Href,
											)
										}
									>
										{FooterLinks.SignUp.Label}
									</button>
									<p className="mt-1 text-card-foreground">
										Don't have an account?
									</p>
								</div>
							)}
							{FooterLinks?.ForgotPassword && (
								<div>
									<button
										type="button"
										className="font-medium text-card-foreground hover:underline"
										onClick={() =>
											FooterLinks.ForgotPassword &&
											OnNavigate?.(
												FooterLinks.ForgotPassword.Href,
											)
										}
									>
										{FooterLinks.ForgotPassword.Label}
									</button>
									<p className="mt-1 text-card-foreground">
										Forgot your password?
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

export { DynamicSignIn };

export default DynamicSignIn;
