"use client";

import * as lucide from "lucide-react";

import {
	Group,
	Panel,
	Separator,
	type GroupProps,
	type PanelProps,
	type SeparatorProps,
} from "react-resizable-panels";

import { cn } from "./Utility";

function ResizablePanelGroup({ className, ...props }: GroupProps) {
	return (
		<Group
			data-slot="resizable-panel-group"
			className={cn(
				"flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
				className,
			)}
			{...props}
		/>
	);
}

function ResizablePanel({ ...props }: PanelProps) {
	return <Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
	withHandle,
	className,
	...props
}: SeparatorProps & {
	withHandle?: boolean;
}) {
	return (
		<Separator
			data-slot="resizable-handle"
			className={cn(
				"focus-visible:outline-hidden relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
				className,
			)}
			{...props}
		>
			{withHandle && (
				<div className="rounded-none z-10 flex h-4 w-3 items-center justify-center border bg-border">
					<lucide.GripVerticalIcon className="size-2.5" />
				</div>
			)}
		</Separator>
	);
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
