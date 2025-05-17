"use client"

import { useEffect } from "react"
import { ChatLayout } from "@/components/chat-layout"
import { useStore } from "@/lib/store"

export default function Home() {
  const { initializeProject } = useStore()

  useEffect(() => {
    // Initialize a new project when the app loads
    initializeProject()
  }, [initializeProject])

  return <ChatLayout />
}
