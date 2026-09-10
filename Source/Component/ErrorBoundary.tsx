import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;

	fallback?: ReactNode;

	FallbackComponent?: (Error: Error, Reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;

	error: Error | null;
}

/**
 * React Error Boundary that catches render errors in child components.
 * Shows a flat, styled fallback UI consistent with the design system.
 * Accepts a FallbackComponent prop for custom error UI (e.g. skeletons).
 */
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);

		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	HandleRetry = () => {
		this.setState({ hasError: false, error: null });
	};

	override render() {
		if (this.state.hasError) {
			const CaughtError = this.state.error ?? new Error("Unknown error");

			if (this.props.FallbackComponent) {
				return this.props.FallbackComponent(
					CaughtError,

					this.HandleRetry,
				);
			}

			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex min-h-[200px] items-center justify-center p-8">
					<div className="w-full max-w-md border border-[var(--Destruct)] bg-card p-8 text-center">
						<div className="bg-destruct mx-auto mb-4 h-1 w-8" />
						<h2 className="text-card-foreground mb-2 text-xl font-semibold">
							Something went wrong
						</h2>
						<p className="mb-6 text-card-foreground opacity-70">
							{CaughtError.message ||
								"An unexpected error occurred. Please try again."}
						</p>
						<button
							type="button"
							onClick={this.HandleRetry}
							className="text-destruct hover:bg-destruct hover:text-destruct-fg inline-flex h-9 items-center justify-center border border-[var(--Destruct)] bg-card px-4 py-2 font-medium transition-all"
						>
							Try again
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
