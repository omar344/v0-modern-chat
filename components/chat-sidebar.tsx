"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatSidebar() {
  const { isSidebarOpen, initializeProject, clearMessages } = useStore()

  const handleNewChat = async () => {
    await initializeProject()
    clearMessages()
  }

  return (
    <div
      className={cn(
        "w-64 h-full bg-muted/40 border-r transition-all duration-300 ease-in-out overflow-hidden",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex flex-col h-full p-4">
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
  )
}
