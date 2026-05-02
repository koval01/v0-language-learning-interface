"use client"

import { CheckCircle2, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface Concept {
  id: string
  name: string
  mastered: boolean
}

interface LearnedConceptsSidebarProps {
  concepts: Concept[]
  className?: string
}

export function LearnedConceptsSidebar({ concepts, className }: LearnedConceptsSidebarProps) {
  return (
    <aside className={cn("w-64 border-l border-border bg-card p-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-sm text-foreground">Learned Concepts</h2>
      </div>
      <div className="space-y-2">
        {concepts.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            Start chatting to unlock concepts!
          </p>
        ) : (
          concepts.map((concept) => (
            <div
              key={concept.id}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                concept.mastered
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <CheckCircle2
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  concept.mastered ? "text-primary" : "text-muted-foreground/50"
                )}
              />
              <span className="truncate">{concept.name}</span>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
