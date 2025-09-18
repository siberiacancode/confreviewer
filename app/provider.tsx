"use client";

import * as React from "react";

import { ThemeProvider } from "./(contexts)/theme";

interface ProviderProps {
  children: React.ReactNode;
}

export const Provider = ({ children }: ProviderProps) => (
  <ThemeProvider>{children}</ThemeProvider>
);
