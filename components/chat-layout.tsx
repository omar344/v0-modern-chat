"use client"

import { useStore } from "@/lib/store"
import { ChatSidebar } from "./chat-sidebar"
import { ChatContainer } from "./chat-container"
import { ThemeToggle } from "./theme-toggle"
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChatLayout() {
  const { isSidebarOpen, toggleSidebar } = useStore()

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar />

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
            <h1 className="text-xl font-bold">AI Chat</h1>
          </div>
          <ThemeToggle />
        </header>

        <ChatContainer />
      </div>
    </div>
  )
}
