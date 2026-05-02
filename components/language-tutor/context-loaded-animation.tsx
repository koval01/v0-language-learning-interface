"use client"

import { useEffect, useState } from "react"
import { Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContextLoadedAnimationProps {
  targetLanguage: string
  onComplete: () => void
}

const languageNames: Record<string, string> = {
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
}

export function ContextLoadedAnimation({ targetLanguage, onComplete }: ContextLoadedAnimationProps) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 300),
      setTimeout(() => setStage(2), 800),
      setTimeout(() => setStage(3), 1300),
      setTimeout(() => setStage(4), 1800),
      setTimeout(() => onComplete(), 2500),
    ]

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        {/* Animated Icon */}
        <div className={cn(
          "mx-auto w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center transition-all duration-500",
          stage >= 4 && "scale-110 bg-primary/20"
        )}>
          {stage < 4 ? (
            <Sparkles className={cn(
              "w-10 h-10 text-primary transition-all duration-300",
              stage >= 1 && "animate-pulse"
            )} />
          ) : (
            <Check className="w-10 h-10 text-primary animate-in zoom-in duration-300" />
          )}
        </div>

        {/* Loading Steps */}
        <div className="space-y-3">
          <p className={cn(
            "text-muted-foreground transition-all duration-300",
            stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}>
            <span className="inline-flex items-center gap-2">
              {stage >= 2 && <Check className="w-4 h-4 text-primary" />}
              Loading your profile...
            </span>
          </p>
          <p className={cn(
            "text-muted-foreground transition-all duration-300",
            stage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}>
            <span className="inline-flex items-center gap-2">
              {stage >= 3 && <Check className="w-4 h-4 text-primary" />}
              Preparing {languageNames[targetLanguage] || "language"} lessons...
            </span>
          </p>
          <p className={cn(
            "text-muted-foreground transition-all duration-300",
            stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}>
            <span className="inline-flex items-center gap-2">
              {stage >= 4 && <Check className="w-4 h-4 text-primary" />}
              Personalizing AI tutor...
            </span>
          </p>
        </div>

        {/* Final Message */}
        <p className={cn(
          "text-lg font-medium text-foreground transition-all duration-500",
          stage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          Context Loaded! Let&apos;s begin.
        </p>
      </div>
    </div>
  )
}
