/**
 * AccountPage - orchestrates sign-in, sign-up, forgot-password, and
 * reset-password views as a single-page flow.
 *
 * Switches between views based on Route prop ("SignIn" | "SignUp" |
 * "ForgotPassword" | "ResetPassword"). Handles Auth0 token exchange
 * and error display via toast notifications.
 */
import { useEffect, useState } from "react";

import { toast } from "sonner";

import { AuthAPI as AuthAPIClass } from "../../Library/API/Authentication";

import { Header } from "../Layout/Header";

import { DynamicForgotPassword } from "./DynamicForgotPassword";

import { DynamicResetPassword } from "./DynamicResetPassword";

import { DynamicSignIn } from "./DynamicSignIn";

import { DynamicSignUp } from "./DynamicSignUp";

import type Property from "./Interface/Property/Page/Account.js";

const Authentication = new AuthAPIClass();

const SetSessionToken = (Token: string): void => {
	try {
		document.cookie = `session=${Token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
	} catch {
		// Cookie API not available during SSR
	}

	localStorage.setItem("session_token", Token);
};

const SetCurrentUser = (CurrentUser: unknown): void => {
	try {
		localStorage.setItem("current_user", JSON.stringify(CurrentUser));
	} catch {
		// Not available during SSR
	}
};

const NavigateToPath = (Path: string): void => {
	window.location.href = Path;
};

const AccountPage = ({
	Content,
	Route,
	ResetToken,
	ClassName,
	OnSignIn,
	OnSignUp,
	OnForgotPassword,
	OnResetPassword,
	OnNavigate,
}: Property) => {
	const { SignIn, SignUp, ForgotPassword, ResetPassword } = Content;

	const Navigate = OnNavigate || NavigateToPath;

	// Loading states
	const [, SetIsSignInLoading] = useState(false);

	const [, SetIsSignUpLoading] = useState(false);

	const [, SetIsForgotPasswordLoading] = useState(false);

	const [, SetIsResetPasswordLoading] = useState(false);

	const [, SetIsOAuthLoading] = useState(false);

	// Error states
	const [, SetSignInErrorMessage] = useState<string>("");

	const [, SetSignUpErrorMessage] = useState<string>("");

	const [, SetForgotPasswordErrorMessage] = useState<string>("");

	const [, SetResetPasswordErrorMessage] = useState<string>("");

	const HandleSignIn = async (
		Email: string,

		Password: string,
	): Promise<void> => {
		SetIsSignInLoading(true);

		SetSignInErrorMessage("");

		try {
			const ResponseData = await Authentication.Login(Email, Password);

			const { session: SessionData, user: UserData } = ResponseData;

			SetSessionToken(SessionData.token);

			SetCurrentUser(UserData);

			toast.success(`Welcome back, ${UserData.username}!`);

			OnSignIn?.(Email, Password);

			// Redirect to account dashboard
			setTimeout(() => {
				Navigate("/Dashboard");
			}, 1000);
		} catch (ErrorInstance) {
			const ErrorMessage =
				ErrorInstance instanceof Error
					? ErrorInstance.message
					: "An unexpected error occurred";

			SetSignInErrorMessage(ErrorMessage);

			toast.error(ErrorMessage);
		} finally {
			SetIsSignInLoading(false);
		}
	};

	const HandleSignUp = async (
		Email: string,

		Password: string,

		ConfirmPassword: string,

		TermsAccepted: boolean,
	): Promise<void> => {
		SetIsSignUpLoading(true);

		SetSignUpErrorMessage("");

		try {
			const Username = Email.split("@")[0] || "user";

			const ResponseData = await Authentication.Register(
				Email,

				Password,

				Username,

				undefined,
			);

			const { session: SessionData, user: UserData } = ResponseData;

			SetSessionToken(SessionData.token);

			SetCurrentUser(UserData);

			toast.success(
				"Account created successfully! Please verify your email.",
			);

			OnSignUp?.(Email, Password, ConfirmPassword, TermsAccepted);

			// Redirect to email verification page
			setTimeout(() => {
				Navigate("/Verify");
			}, 1000);
		} catch (ErrorInstance) {
			const ErrorMessage =
				ErrorInstance instanceof Error
					? ErrorInstance.message
					: "An unexpected error occurred";

			SetSignUpErrorMessage(ErrorMessage);

			toast.error(ErrorMessage);
		} finally {
			SetIsSignUpLoading(false);
		}
	};

	const HandleForgotPassword = async (Email: string): Promise<void> => {
		SetIsForgotPasswordLoading(true);

		SetForgotPasswordErrorMessage("");

		try {
			await Authentication.ForgotPassword(Email);

			toast.success(
				"Password reset email sent. Please check your inbox.",
			);

			OnForgotPassword?.(Email);
		} catch (ErrorInstance) {
			const ErrorMessage =
				ErrorInstance instanceof Error
					? ErrorInstance.message
					: "An unexpected error occurred";

			SetForgotPasswordErrorMessage(ErrorMessage);

			toast.error(ErrorMessage);
		} finally {
			SetIsForgotPasswordLoading(false);
		}
	};

	const HandleResetPassword = async (
		Token: string,

		Password: string,

		ConfirmPassword: string,
	): Promise<void> => {
		SetIsResetPasswordLoading(true);

		SetResetPasswordErrorMessage("");

		try {
			await Authentication.ResetPassword(Token, Password);

			toast.success(
				"Password reset successful! You can now sign in with your new password.",
			);

			OnResetPassword?.(Token, Password, ConfirmPassword);

			setTimeout(() => {
				Navigate("/Account/SignIn");
			}, 2000);
		} catch (ErrorInstance) {
			const ErrorMessage =
				ErrorInstance instanceof Error
					? ErrorInstance.message
					: "An unexpected error occurred";

			SetResetPasswordErrorMessage(ErrorMessage);

			toast.error(ErrorMessage);
		} finally {
			SetIsResetPasswordLoading(false);
		}
	};

	const HandleOAuth = async (Provider?: string) => {
		SetIsOAuthLoading(true);

		try {
			// Default to github if no provider specified
			const AuthProvider =
				(Provider as "github" | "google" | "gitlab") || "github";

			await Authentication.OAuth(AuthProvider);

			// oauth() redirects the browser via window.location.href,
			// so we only reach here if something went wrong
		} catch (ErrorInstance) {
			const ErrorMessage =
				ErrorInstance instanceof Error
					? ErrorInstance.message
					: "OAuth initialization failed";

			toast.error(ErrorMessage);

			SetIsOAuthLoading(false);
		}
	};

	// OAuth callback handler:extract token from URL when returning from OAuth
	useEffect(() => {
		const UrlParameters = new URLSearchParams(window.location.search);

		const OAuthToken = UrlParameters.get("token");

		if (OAuthToken && Route === "signin") {
			SetSessionToken(OAuthToken);

			toast.success("OAuth authentication successful!");

			// Fetch user profile with the new token
			Authentication.GetSession()
				.then((SessionResponse) => {
					SetCurrentUser(SessionResponse.user);
				})
				.catch(() => {
					// Session fetch failed but token is set:user can still proceed
				});

			Navigate("/Dashboard");
		}
	}, [Route, Navigate]);

	return (
		<div className={`flex min-h-screen flex-col ${ClassName || ""}`}>
			<Header
				{...(Content.Header ? { content: Content.Header } : {})}
				Mode="functional"
			/>

			<div className="flex-1">
				{Route === "signin" && (
					<DynamicSignIn
						Content={SignIn}
						OnSubmit={HandleSignIn}
						OnOAuth={HandleOAuth}
						OnNavigate={Navigate}
					/>
				)}

				{Route === "signup" && (
					<DynamicSignUp
						Content={SignUp}
						OnSubmit={HandleSignUp}
						OnOAuth={HandleOAuth}
						OnNavigate={Navigate}
					/>
				)}

				{Route === "forgot-password" && (
					<DynamicForgotPassword
						Content={ForgotPassword}
						OnSubmit={HandleForgotPassword}
						OnResend={() => HandleForgotPassword("")}
						OnNavigate={Navigate}
					/>
				)}

				{Route === "reset-password" && (
					<DynamicResetPassword
						Content={ResetPassword}
						Token={ResetToken || ""}
						OnReset={HandleResetPassword}
						OnNavigate={Navigate}
					/>
				)}
			</div>
		</div>
	);
};

export { AccountPage };

export default AccountPage;
