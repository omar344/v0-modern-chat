"use client"

import { useEffect } from "react"
import { ChatLayout } from "@/components/chat-layout"
import { useStore } from "@/lib/store"

export default function Home() {
  const { initializeProject, initializeSidebarState } = useStore()

  useEffect(() => {
    // Initialize a new project when the app loads
    initializeProject()

    // Initialize sidebar state based on screen size
    initializeSidebarState()

    // Update sidebar state on window resize
    const handleResize = () => {
      initializeSidebarState()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [initializeProject, initializeSidebarState])

  return <ChatLayout />
}
