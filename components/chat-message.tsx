"use client"

import type { Message } from "@/lib/store"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Bot } from "lucide-react"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={cn("flex items-start gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
      {message.role !== "user" && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {message.role === "assistant" ? <Bot className="h-4 w-4" /> : "S"}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "rounded-lg p-3 max-w-[80%]",
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : message.role === "assistant"
              ? "bg-muted"
              : "bg-accent text-accent-foreground text-sm",
        )}
      >
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "")
              return !inline && match ? (
                <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={cn("bg-muted-foreground/20 rounded px-1", className)} {...props}>
                  {children}
                </code>
              )
            },
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            ul({ children }) {
              return <ul className="list-disc pl-4 mb-2">{children}</ul>
            },
            ol({ children }) {
              return <ol className="list-decimal pl-4 mb-2">{children}</ol>
            },
            li({ children }) {
              return <li className="mb-1">{children}</li>
            },
            a({ href, children }) {
              return (
                <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              )
            },
          }}
        >
          {message.content || " "}
        </ReactMarkdown>
      </div>

      {message.role === "user" && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
