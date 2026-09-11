// ─── Copy command blocks ─────────────────────────────────────────────────────
// Wires <jelly-icon-button data-copy> buttons (each sitting next to a <pre> in
// a flex row) to copy the pre's text. Mirrors RichText.tsx CopyInlineButton:
// navigator.clipboard.writeText, "Copied" check feedback for 1800ms, and a
// label / aria-label / title swap. The slotted icon is swapped in the light
// DOM; --jelly-label inherits from the host's inline style so the icon color
// tracks the button surface.

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

export function WireCopyButtons(
	Selector: string = "jelly-icon-button[data-copy]",
): void {
	const Buttons = Array.from(
		document.querySelectorAll<HTMLElement>(Selector),
	);

	for (const Button of Buttons) {
		Button.addEventListener("click", async () => {
			const Pre = Button.previousElementSibling as HTMLElement | null;
			if (!Pre) return;

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
}