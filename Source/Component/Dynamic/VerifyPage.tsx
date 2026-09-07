import { useEffect, useState } from "react";

import { toast } from "sonner";

import { AuthAPI as AuthAPIClass } from "../../Library/API/Authentication";

import { DynamicEmailVerification } from "./DynamicEmailVerification";

import type Property from "./Interface/Property/Page/Verify.js";

const Authentication = new AuthAPIClass();

const NavigateToPath = (Path: string): void => {
	window.location.href = Path;
};

const VerifyPage = ({
	Content,
	Route,
	Token,
	Reason,
	ClassName,
	OnVerify,
	OnResend,
	OnNavigate,
}: Property) => {
	const { Verification } = Content;

	const Navigate = OnNavigate || NavigateToPath;

	const [UserEmail, SetUserEmail] = useState<string>("");

	// Extract email from localStorage if available
	useEffect(() => {
		try {
			const UserData = localStorage.getItem("current_user");

			if (UserData) {
				const ParsedUser = JSON.parse(UserData);

				SetUserEmail(ParsedUser.email || "");
			}
		} catch {
			// Not available during SSR
		}
	}, []);

	const HandleVerify = async (VerifyToken: string): Promise<boolean> => {
		try {
			await Authentication.VerifyEmail(VerifyToken);

			toast.success("Email verified successfully!");

			return true;
		} catch (ErrorInstance) {
			const ErrorMessage =
				ErrorInstance instanceof Error
					? ErrorInstance.message
					: "Verification failed";

			toast.error(ErrorMessage);

			return false;
		}
	};

	const HandleResend = async (_Email: string): Promise<boolean> => {
		try {
			await Authentication.ResendVerification();

			toast.success("Verification email sent!");

			return true;
		} catch (ErrorInstance) {
			const ErrorMessage =
				ErrorInstance instanceof Error
					? ErrorInstance.message
					: "Failed to resend email";

			toast.error(ErrorMessage);

			return false;
		}
	};

	return (
		<div className={`flex min-h-screen flex-col ${ClassName || ""}`}>
			<div className="flex-1">
				{(Route === "verify" || Route === "pending") && (
					<DynamicEmailVerification
						Content={Verification}
						{...(Token ? { Token } : {})}
						UserEmail={UserEmail}
						OnVerify={OnVerify || HandleVerify}
						OnResend={OnResend || HandleResend}
						OnNavigate={Navigate}
					/>
				)}

				{Route === "success" && (
					<section className="py-20">
						<div className="container mx-auto px-4">
							<div className="mx-auto max-w-md text-center">
								<div className="flat border border-green-500 p-8">
									<div className="flat mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-green-100">
										<svg
											className="h-10 w-10 text-green-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-hidden="true"
										>
											<title>Email verified</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<h1 className="mb-2 text-2xl font-bold">
										{"Email Verified Successfully!"}
									</h1>
									<p className="mb-6 text-muted-foreground">
										{
											"Your email address has been verified. You can now access all features."
										}
									</p>
									<button
										type="button"
										className="StaccatoButton flat inline-flex h-10 items-center justify-center gap-0 bg-primary px-4 py-2 font-medium text-primary-foreground transition-all hover:bg-primary disabled:pointer-events-none disabled:opacity-50"
										onClick={() => Navigate("/")}
									>
										{"Continue to Homepage"}
									</button>
								</div>
							</div>
						</div>
					</section>
				)}

				{Route === "failure" && (
					<section className="py-20">
						<div className="container mx-auto px-4">
							<div className="mx-auto max-w-md text-center">
								<div className="flat border border-destructive p-8">
									<div className="flat mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-red-100">
										<svg
											className="h-10 w-10 text-red-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-hidden="true"
										>
											<title>Verification failed</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</div>
									<h1 className="mb-2 text-2xl font-bold">
										{"Verification Failed"}
									</h1>
									<p className="mb-2 text-muted-foreground">
										{Reason
											? `Error: ${Reason}`
											: "This verification link is invalid or has expired."}
									</p>
									<p className="mb-6 text-muted-foreground">
										{
											"Please request a new verification email or contact support if the problem persists."
										}
									</p>
									<div className="flex justify-center gap-4">
										<button
											type="button"
											className="StaccatoButton flat inline-flex h-10 items-center justify-center gap-0 bg-primary px-4 py-2 font-medium text-primary-foreground transition-all hover:bg-primary"
											onClick={() => Navigate("/Verify")}
										>
											{"Send New Verification Email"}
										</button>
										<button
											type="button"
											className="StaccatoButton flat inline-flex h-10 items-center justify-center gap-0 bg-background px-4 py-2 font-medium transition-all hover:bg-accent"
											onClick={() =>
												Navigate("/Account/SignIn")
											}
										>
											{"Sign In"}
										</button>
									</div>
								</div>
							</div>
						</div>
					</section>
				)}
			</div>
		</div>
	);
};

export { VerifyPage };

export default VerifyPage;
