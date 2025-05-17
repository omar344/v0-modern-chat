"use client"

import type React from "react"

import { useState, useRef, type FormEvent } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatInput() {
  const [input, setInput] = useState("")
  const { sendMessage, uploadFile, isLoading } = useStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    try {
      await sendMessage(input)
      setInput("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await uploadFile(file)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Failed to upload file:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="min-h-[60px] pr-24 resize-none w-full"
        disabled={isLoading}
      />

      <div className="absolute right-2 bottom-2 flex items-center gap-2">
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" disabled={isLoading} />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className={cn(isLoading && "opacity-50 cursor-not-allowed")}
        >
          <Paperclip className="h-4 w-4" />
          <span className="sr-only">Upload file</span>
        </Button>

        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
          className={cn((!input.trim() || isLoading) && "opacity-50 cursor-not-allowed")}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  )
}
