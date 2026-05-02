"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ClickableWord } from "./clickable-word"
import { ChevronDown, ChevronRight, HelpCircle, Repeat } from "lucide-react"
import { cn } from "@/lib/utils"

interface Word {
  original: string
  translation: string
}

interface AssistantMessageProps {
  phrase: string
  words: Word[]
  literalTranslation: string
  grammarHint: string
  explanation: string
}

export function AssistantMessage({
  phrase,
  words,
  literalTranslation,
  grammarHint,
  explanation,
}: AssistantMessageProps) {
  const [showLiteral, setShowLiteral] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  return (
    <div className="flex gap-3 max-w-2xl">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-primary"
        >
          <path d="m5 8 6 6" />
          <path d="m4 14 6-6 2-3" />
          <path d="M2 5h12" />
          <path d="M7 2h1" />
          <path d="m22 22-5-10-5 10" />
          <path d="M14 18h6" />
        </svg>
      </div>
      <div className="flex-1 space-y-3">
        <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4 shadow-sm">
          {/* Original Phrase with Clickable Words */}
          <div className="text-lg font-medium text-foreground mb-3 leading-relaxed">
            {words.map((word, index) => (
              <ClickableWord key={index} word={word.original} translation={word.translation} />
            ))}
          </div>

          {/* Grammar Hint Badge */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs font-medium">
              {grammarHint}
            </Badge>
          </div>

          {/* Literal Translation Toggle */}
          <button
            onClick={() => setShowLiteral(!showLiteral)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <Repeat className="w-4 h-4" />
            <span>Literal Translation</span>
            {showLiteral ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-out",
              showLiteral ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 mb-3">
              {literalTranslation}
            </p>
          </div>

          {/* Explain Why Button */}
          <Collapsible open={showExplanation} onOpenChange={setShowExplanation}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
              >
                <HelpCircle className="w-4 h-4" />
                Explain Why
                {showExplanation ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-in slide-in-from-top-2 duration-300">
              <div className="mt-3 bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-sm text-foreground leading-relaxed">{explanation}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  )
}
