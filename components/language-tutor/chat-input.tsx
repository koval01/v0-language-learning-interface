"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Lightbulb, Send, Loader2 } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => void
  hint?: string
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
}

export function ChatInput({ onSend, hint, disabled = false, value, onChange }: ChatInputProps) {
  const [localMessage, setLocalMessage] = useState("")
  const [showHint, setShowHint] = useState(false)

  // Use controlled or uncontrolled mode
  const message = value !== undefined ? value : localMessage
  const setMessage = onChange || setLocalMessage

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      if (!onChange) {
        setLocalMessage("")
      }
      setShowHint(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t border-border bg-card/80 backdrop-blur-sm p-4">
      <div className="max-w-3xl mx-auto">
        {showHint && hint && (
          <div className="mb-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Lightbulb className="w-4 h-4" />
              <span className="font-medium">Hint:</span>
              <span className="text-foreground">{hint}</span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message in English or try the target language..."
              className="min-h-[52px] max-h-32 resize-none bg-input border-border rounded-xl pr-12 text-base"
              rows={1}
              disabled={disabled}
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-[52px] w-[52px] rounded-xl hover:bg-primary/10 hover:text-primary"
                onClick={() => setShowHint(!showHint)}
                disabled={disabled}
              >
                <Lightbulb className="w-5 h-5" />
                <span className="sr-only">Show hint</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Get a hint</p>
            </TooltipContent>
          </Tooltip>
          <Button
            type="submit"
            size="icon"
            className="h-[52px] w-[52px] rounded-xl"
            disabled={!message.trim() || disabled}
          >
            {disabled ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Click on any word in the AI response to see its translation
        </p>
      </div>
    </div>
  )
}
