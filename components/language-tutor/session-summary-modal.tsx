"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, TrendingDown, Star, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SessionSummaryModalProps {
  strongPoints: string[]
  needsWork: string[]
  vocabularyCount: number
  sessionTime: number
  children: React.ReactNode
}

export function SessionSummaryModal({
  strongPoints,
  needsWork,
  vocabularyCount,
  sessionTime,
  children,
}: SessionSummaryModalProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Session Summary
          </DialogTitle>
          <DialogDescription>
            AI-generated analysis of your learning progress
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-2xl font-bold text-primary">{vocabularyCount}</p>
              <p className="text-xs text-muted-foreground">Words Mastered</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-accent/10 border border-accent/10">
              <p className="text-2xl font-bold text-accent">{formatTime(sessionTime)}</p>
              <p className="text-xs text-muted-foreground">Session Time</p>
            </div>
          </div>

          {/* Strong Points */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <h3 className="font-medium text-sm">Strong Points</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {strongPoints.map((point, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                >
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {point}
                </Badge>
              ))}
            </div>
          </div>

          {/* Needs Work */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-amber-500" />
              <h3 className="font-medium text-sm">Needs Work</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {needsWork.map((point, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {point}
                </Badge>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">AI Recommendation:</span> Focus on practicing irregular verbs through conversation. 
              Try asking me to conjugate verbs in different tenses!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
