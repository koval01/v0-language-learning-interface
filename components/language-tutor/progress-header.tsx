"use client"

import { Progress } from "@/components/ui/progress"

interface ProgressHeaderProps {
  topic: string
  mastery: number
}

export function ProgressHeader({ topic, mastery }: ProgressHeaderProps) {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-primary"
            >
              <path d="m5 8 6 6" />
              <path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-foreground">LinguaAI</h1>
            <p className="text-xs text-muted-foreground">Your AI Language Tutor</p>
          </div>
        </div>
        <div className="flex-1 max-w-xs hidden sm:block">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">{topic}</span>
            <span className="text-xs font-medium text-primary">{mastery}%</span>
          </div>
          <Progress value={mastery} className="h-2" />
        </div>
      </div>
    </header>
  )
}
