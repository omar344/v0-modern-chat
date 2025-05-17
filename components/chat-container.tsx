"use client"

import { useRef, useEffect } from "react"
import { useStore } from "@/lib/store"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function ChatContainer() {
  const { messages, error } = useStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome to AI Chat</h2>
              <p className="text-muted-foreground">Start a conversation or upload a file to begin</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mx-4 mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="p-4 border-t">
        <ChatInput />
      </div>
    </div>
  )
}
