// ─── Copy command blocks ─────────────────────────────────────────────────────
// Wires <jelly-icon-button data-copy> buttons (each sitting next to a <pre> in
// a flex row) to copy the pre's text. Mirrors RichText.tsx CopyInlineButton:
// navigator.clipboard.writeText, "Copied" check feedback for 1800ms, and a
// label / aria-label / title swap. The slotted icon is swapped in the light
// DOM; --jelly-label inherits from the host's inline style so the icon color
// tracks the button surface.
//
// WireCodeBlockCopyButtons() is the sitewide Shiki variant: it auto-attaches a
// jelly copy button to every <pre class="astro-code"> (blog + doc code blocks),
// wrapping each pre in a relative container so the button floats top-right
// without touching the pre's own overflow-x: auto. The module self-initializes
// on DOMContentLoaded, so ONE side-effect import anywhere (Base.astro) covers
// every page.

const CheckMark = `<svg
	xmlns="http://www.w3.org/2000/svg"
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	style="color: var(--jelly-label)"
	aria-hidden="true"
><path d="M20 6 9 17l-5-5" /></svg>`;

const CopyIcon = `<svg
	xmlns="http://www.w3.org/2000/svg"
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	style="color: var(--jelly-label)"
	aria-hidden="true"
><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>`;

function AttachCopyHandler(Button: HTMLElement, Pre: HTMLElement): void {
	Button.addEventListener("click", async () => {
		try {
			await navigator.clipboard.writeText(
				Pre.textContent?.trim() ?? "",
			);
		} catch {
			// clipboard unavailable
			return;
		}

		const Label = Button.getAttribute("aria-label") ?? "Copy to clipboard";
		const Icon = Button.innerHTML;

		Button.innerHTML = CheckMark;
		Button.setAttribute("label", "Copied");
		Button.setAttribute("aria-label", "Copied");
		Button.setAttribute("title", "Copied");

		setTimeout(() => {
			Button.innerHTML = Icon;
			Button.setAttribute("label", Label);
			Button.setAttribute("aria-label", Label);
			Button.setAttribute("title", Label);
		}, 1800);
	});
}

export function WireCopyButtons(
	Selector: string = "jelly-icon-button[data-copy]",
): void {
	const Buttons = Array.from(
		document.querySelectorAll<HTMLElement>(Selector),
	);

	for (const Button of Buttons) {
		const Pre = Button.previousElementSibling as HTMLElement | null;
		if (!Pre) continue;

		AttachCopyHandler(Button, Pre);
	}
}

export function WireCodeBlockCopyButtons(): void {
	const Pres = Array.from(
		document.querySelectorAll<HTMLPreElement>("pre.astro-code"),
	);

	for (const Pre of Pres) {
		if (Pre.dataset.copyWired === "true") continue;

		// Leave manually-authored flex-row buttons alone (Contributing/License).
		if (
			Pre.nextElementSibling?.matches("jelly-icon-button[data-copy]")
		) {
			continue;
		}

		// Wrap so the button can float top-right without becoming part of the
		// pre's horizontally scrollable content.
		const Wrapper = document.createElement("div");
		Wrapper.style.position = "relative";
		Pre.parentNode?.insertBefore(Wrapper, Pre);
		Wrapper.appendChild(Pre);

		const Button = document.createElement("jelly-icon-button");
		Button.setAttribute("data-copy", "");
		Button.setAttribute("size", "small");
		Button.setAttribute("shape", "square");
		Button.setAttribute("label", "Copy to clipboard");
		Button.setAttribute("aria-label", "Copy to clipboard");
		Button.setAttribute("title", "Copy to clipboard");
		Button.setAttribute(
			"style",
			"--jelly-fill: var(--Mute); --jelly-label: var(--Foreground); --jelly-icon-button-radius: 0px; --jelly-ring: var(--Accent);",
		);
		Button.style.position = "absolute";
		Button.style.top = "0.5rem";
		Button.style.right = "0.5rem";
		Button.innerHTML = CopyIcon;

		Wrapper.appendChild(Button);
		Pre.dataset.copyWired = "true";

		AttachCopyHandler(Button, Pre);
	}
}

// Self-initialize: ONE import anywhere (Base.astro) wires every Shiki block.
if (typeof document !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", WireCodeBlockCopyButtons);
	} else {
		WireCodeBlockCopyButtons();
	}
}