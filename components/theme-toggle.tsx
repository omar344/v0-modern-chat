"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect } from "react"

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useStore()
  const { setTheme } = useTheme()

  // Sync the theme with the store
  useEffect(() => {
    setTheme(isDarkMode ? "dark" : "light")
  }, [isDarkMode, setTheme])

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
