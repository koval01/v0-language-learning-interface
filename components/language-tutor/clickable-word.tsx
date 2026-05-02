"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ClickableWordProps {
  word: string
  translation: string
}

export function ClickableWord({ word, translation }: ClickableWordProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-block px-0.5 mx-0.5 rounded hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer underline decoration-dotted decoration-primary/40 underline-offset-2">
          {word}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-foreground text-background px-3 py-1.5">
        <p className="text-sm font-medium">{translation}</p>
      </TooltipContent>
    </Tooltip>
  )
}
