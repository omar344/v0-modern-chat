"use client"

import { useStore } from "@/lib/store"
import { ChatSidebar } from "./chat-sidebar"
import { ChatContainer } from "./chat-container"
import { ThemeToggle } from "./theme-toggle"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

export function ChatLayout() {
  const { isSidebarOpen, toggleSidebar, setSidebarOpen } = useStore()
  const isMobile = useIsMobile()

  // Force sidebar to be open on desktop
  useEffect(() => {
    if (!isMobile && !isSidebarOpen) {
      setSidebarOpen(true)
    }
  }, [isMobile, isSidebarOpen, setSidebarOpen])

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      <ChatSidebar />

      <div className={cn("flex flex-col flex-1 h-full overflow-hidden")}>
        <header className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            )}
            <h1 className="text-xl font-bold">AI Chat</h1>
          </div>
          <ThemeToggle />
        </header>

        <ChatContainer />
      </div>
    </div>
  )
}
