/**
 * Static page metadata for OpenGraph image generation.
 *
 * Maps slug paths to their title, description, and section for the
 * OG image SVG template. Status / License / Target are the field-record
 * info lines rendered on the artifact card (STATUS: / LICENSE: / TARGET:).
 * Blog and Doc entries are resolved dynamically from content collections
 * in the endpoint; this covers static pages.
 */

interface PageMeta {
	Title: string;

	Description: string;

	Section?: string;

	Status?: string;

	License?: string;

	Target?: string;
}

const PageMetadata: Record<string, PageMeta> = {
	"": {
		Title: "Land | The Next-Generation Code Editor",

		Description:
			"A high-performance, resource-efficient code editor built with Rust and Tauri. Experience VS Code compatibility without the Electron bloat.",

		Section: "Home",
	},

	Download: {
		Title: "Download Land",

		Description:
			"Download Land for Windows, macOS, and Linux. Free and open-source.",

		Section: "Download",

		Status: "READY",

		License: "CC0",

		Target: "MACOS / WINDOWS / LINUX",
	},

	Blog: {
		Title: "Blog | Code Editor Land",

		Description:
			"Updates, tutorials, and insights from the Code Editor Land team.",

		Section: "Blog",

		Status: "READY",

		License: "CC0",

		Target: "PUBLIC",
	},

	Doc: {
		Title: "Documentation | Code Editor Land",

		Description:
			"Guides, API references, and tutorials for Code Editor Land.",

		Section: "Doc",

		Status: "READY",

		License: "CC0",

		Target: "GUIDES / API / REFERENCE",
	},

	Portal: {
		Title: "Portal | Code Editor Land",

		Description:
			"Sign in to your Code Editor Land account. Manage settings, sync, and cloud features.",

		Section: "Portal",

		Status: "READY",

		License: "CC0",

		Target: "CLOUD / SYNC",
	},

	Contributing: {
		Title: "Contributing | Code Editor Land",

		Description:
			"Learn how to contribute to Code Editor Land. Guidelines, setup, and community resources.",

		Section: "Contributing",

		Status: "READY",

		License: "CC0",

		Target: "GITHUB",
	},

	License: {
		Title: "License | Code Editor Land",

		Description:
			"Code Editor Land licensing information. CC0 1.0 Universal public domain dedication.",

		Section: "License",

		Status: "PUBLIC DOMAIN",

		License: "CC0",

		Target: "CC0 1.0",
	},

	Dashboard: {
		Title: "Dashboard | Code Editor Land",

		Description:
			"Your Code Editor Land dashboard. Manage your account and settings.",

		Section: "Dashboard",

		Status: "READY",

		License: "CC0",

		Target: "ACCOUNT",
	},

	"Contact/Sale": {
		Title: "Contact Sales | Code Editor Land",

		Description:
			"Get in touch with our sales team for enterprise licensing and support.",

		Section: "Contact",

		Status: "READY",

		License: "CC0",

		Target: "SALES",
	},

	"Account/SignIn": {
		Title: "Sign In | Code Editor Land",

		Description: "Sign in to your Code Editor Land account.",

		Section: "Account",

		Status: "READY",

		License: "CC0",

		Target: "ACCOUNT",
	},

	"Account/SignUp": {
		Title: "Sign Up | Code Editor Land",

		Description: "Create a new Code Editor Land account.",

		Section: "Account",

		Status: "READY",

		License: "CC0",

		Target: "ACCOUNT",
	},

	"Account/ForgotPassword": {
		Title: "Forgot Password | Code Editor Land",

		Description: "Reset your Code Editor Land account password.",

		Section: "Account",

		Status: "READY",

		License: "CC0",

		Target: "ACCOUNT",
	},

	"Account/ResetPassword": {
		Title: "Reset Password | Code Editor Land",

		Description: "Set a new password for your Code Editor Land account.",

		Section: "Account",

		Status: "READY",

		License: "CC0",

		Target: "ACCOUNT",
	},

	"Legal/Term": {
		Title: "Terms of Service | Code Editor Land",

		Description: "Code Editor Land terms of service and usage agreement.",

		Section: "Legal",

		Status: "READY",

		License: "CC0",

		Target: "LEGAL",
	},

	"Legal/Privacy": {
		Title: "Privacy Policy | Code Editor Land",

		Description:
			"Code Editor Land privacy policy. How we handle your data.",

		Section: "Legal",

		Status: "READY",

		License: "CC0",

		Target: "LEGAL",
	},

	Verify: {
		Title: "Verify Email | Code Editor Land",

		Description: "Verify your Code Editor Land email address.",

		Section: "Account",

		Status: "READY",

		License: "CC0",

		Target: "EMAIL",
	},

	Visit: {
		Title: "Visit | Code Editor Land",

		Description: "Explore Code Editor Land features and capabilities.",

		Section: "Visit",

		Status: "READY",

		License: "CC0",

		Target: "FEATURES",
	},
};

export default PageMetadata;