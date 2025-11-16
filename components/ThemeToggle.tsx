"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes"
import { useEffect, useState } from "react";
import TooltipAbstract from "./TooltipAbstract";

const ThemeToggle = () => {

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

  return (
    <TooltipAbstract content={theme === "light" ? "Dark Mode" : "Light Mode"}>
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700
                    bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200
                    cursor-pointer
                    shadow hover:shadow-md transition-all"
        >
        {theme === "light" ? 
            <Moon size={18}/> : <Sun size={18}/>  } 
        </button>
    </TooltipAbstract>
  )
}

export default ThemeToggle
