"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-slate-700/50 transition-colors"
      title={theme === "dark" ? "ライトモード" : "ダークモード"}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-slate-300" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );
}