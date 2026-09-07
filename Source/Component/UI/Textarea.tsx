import * as React from "react";

import { cn } from "./Utility";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive field-sizing-content flat flex min-h-16 w-full resize-none border border-input bg-background px-3 py-2 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
