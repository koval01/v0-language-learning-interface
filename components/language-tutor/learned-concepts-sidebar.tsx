"use client"

import { CheckCircle2, BookOpen, Star, AlertCircle, TrendingUp, TrendingDown, Hash } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Concept {
  id: string
  name: string
  mastered: boolean
}

interface UserDNA {
  strongPoints: string[]
  needsWork: string[]
  vocabularyCount: number
}

interface LearnedConceptsSidebarProps {
  concepts: Concept[]
  userDNA?: UserDNA
  className?: string
}

export function LearnedConceptsSidebar({ concepts, userDNA, className }: LearnedConceptsSidebarProps) {
  return (
    <aside className={cn("w-64 border-l border-border bg-card p-4 overflow-y-auto", className)}>
      {/* User DNA Section */}
      {userDNA && (
        <>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <Hash className="w-3.5 h-3.5 text-primary" />
              </div>
              <h2 className="font-semibold text-sm text-foreground">User DNA</h2>
            </div>

            {/* Vocabulary Count */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Words Mastered</span>
                <span className="text-lg font-bold text-primary">{userDNA.vocabularyCount}</span>
              </div>
            </div>

            {/* Strong Points */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs font-medium text-muted-foreground">Strong Points</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {userDNA.strongPoints.map((point, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                  >
                    <Star className="w-2.5 h-2.5 mr-1 fill-current" />
                    {point}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Needs Work */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-medium text-muted-foreground">Needs Work</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {userDNA.needsWork.map((point, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                  >
                    <AlertCircle className="w-2.5 h-2.5 mr-1" />
                    {point}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-4" />
        </>
      )}

      {/* Learned Concepts Section */}
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
              {concept.mastered ? (
                <Star className="w-4 h-4 flex-shrink-0 fill-primary text-primary" />
              ) : (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-muted-foreground/50" />
              )}
              <span className="truncate">{concept.name}</span>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
