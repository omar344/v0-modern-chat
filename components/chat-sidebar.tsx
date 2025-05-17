"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { PlusCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect, useRef } from "react"

export function ChatSidebar() {
  const { isSidebarOpen, toggleSidebar, setSidebarOpen, initializeProject, clearMessages } = useStore()
  const isMobile = useIsMobile()
  const sidebarRef = useRef<HTMLDivElement>(null)

  const handleNewChat = async () => {
    await initializeProject()
    clearMessages()
    if (isMobile) {
      setSidebarOpen(false) // Close sidebar on mobile after creating new chat
    }
  }

  // Handle clicks outside the sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false)
      }
    }

    if (isMobile && isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, isSidebarOpen, setSidebarOpen])

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden" aria-hidden="true" />
      )}

      <div
        ref={sidebarRef}
        className={cn(
          "bg-muted/40 border-r transition-all duration-300 ease-in-out overflow-hidden z-50",
          // Desktop: always visible, fixed width, full height
          "md:w-64 md:relative md:block md:h-full md:shrink-0",
          // Mobile: fixed position, full height, toggleable
          isMobile ? "fixed left-0 top-0 bottom-0 w-64 h-full" : "",
          // Mobile: translate when closed
          isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0",
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Chats</h2>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
                <X className="h-4 w-4" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            )}
          </div>

          <Button onClick={handleNewChat} className="mb-4 flex items-center justify-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>New Chat</span>
          </Button>

          <div className="flex-1 overflow-auto">
            {/* Chat history would go here */}
            <div className="text-sm text-muted-foreground py-2">Your chat history will appear here</div>
          </div>
        </div>
      </div>
    </>
  )
}
