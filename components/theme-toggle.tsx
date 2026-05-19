
// components/theme-toggle.tsx
"use client"

import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-slate-800">
      <AnimatePresence mode="wait">
        {theme === "light" && (
          <motion.button
            key="light"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setTheme("dark")}
            className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <Sun className="h-4 w-4 text-orange-500" />
          </motion.button>
        )}
        {theme === "dark" && (
          <motion.button
            key="dark"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setTheme("system")}
            className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <Moon className="h-4 w-4 text-blue-400" />
          </motion.button>
        )}
        {theme === "system" && (
          <motion.button
            key="system"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setTheme("light")}
            className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <Laptop className="h-4 w-4 text-slate-500" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}