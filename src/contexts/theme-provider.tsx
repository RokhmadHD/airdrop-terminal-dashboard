"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider {...props}>
            {/* Kita tidak lagi memerlukan ThemeSwitcher karena logika bisa disederhanakan */}
            {children}
        </NextThemesProvider>
    );
}

// Hook kustom untuk digunakan di tombol theme toggle kita
export function useThemeTransition() {
    const { setTheme, theme } = useTheme();

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';

        document.documentElement.classList.add('theme-transition');

        setTheme(newTheme);

        // Cocokkan durasi timeout dengan transisi CSS
        window.setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 500);
    };

    return { toggleTheme, theme };
}