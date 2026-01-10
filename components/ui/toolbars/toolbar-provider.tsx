"use client";

import type { Editor } from "@tiptap/react";

import React from "react";

export interface ToolbarContextProps {
	editor: Editor;
}

export const ToolbarContext = React.createContext<ToolbarContextProps | null>(
	null,
);

interface ToolbarProviderProps {
	children: React.ReactNode;
	editor: Editor;
}

export const ToolbarProvider = ({ editor, children }: ToolbarProviderProps) => {
	return (
		<ToolbarContext value={{ editor }}>
			{children}
		</ToolbarContext>
	);
};

export const useToolbar = () => {
	const context = React.use(ToolbarContext);

	if (!context) {
		throw new Error("useToolbar must be used within a ToolbarProvider");
	}

	return context;
};
