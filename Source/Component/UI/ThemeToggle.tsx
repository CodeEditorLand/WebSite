import * as lucide from "lucide-react";

import { Button } from "./Button";

/**
 * ThemeToggle - Nocturnal Field Record.
 * Single theme: renders a static moon icon indicating nocturnal mode.
 */
const ThemeToggle = ({ ClassName }: { ClassName?: string }) => {
	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label="Nocturnal theme active"
			title="Nocturnal"
			className={ClassName}
			disabled
		>
			<lucide.Moon className="h-4 w-4 opacity-50" />
		</Button>
	);
};

export { ThemeToggle };

export default ThemeToggle;
