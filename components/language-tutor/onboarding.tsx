"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check, ChevronRight, Globe, Target, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

// Language data with flag emojis
const languages = [
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
]

const nativeLanguages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "pt", name: "Portuguese" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
]

const levels = [
  { id: "beginner", label: "Absolute Beginner", description: "I know nothing or just a few words" },
  { id: "basics", label: "I know some basics", description: "I can say hello and introduce myself" },
  { id: "intermediate", label: "Intermediate", description: "I can hold simple conversations" },
]

const goals = [
  { id: "travel", label: "Travel", icon: "✈️", description: "Navigate foreign countries with ease" },
  { id: "work", label: "Work", icon: "💼", description: "Communicate professionally" },
  { id: "fun", label: "Fun", icon: "🎉", description: "Learn for personal enjoyment" },
]

export interface UserProfile {
  nativeLanguage: string
  targetLanguage: string
  level: string
  goal: string
}

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<UserProfile>({
    nativeLanguage: "",
    targetLanguage: "",
    level: "",
    goal: "",
  })
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNativeLanguages = nativeLanguages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const canProceed = () => {
    switch (step) {
      case 1:
        return profile.nativeLanguage !== ""
      case 2:
        return profile.targetLanguage !== ""
      case 3:
        return profile.level !== ""
      case 4:
        return profile.goal !== ""
      default:
        return false
    }
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      onComplete(profile)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-lg">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                s === step
                  ? "w-8 bg-primary"
                  : s < step
                    ? "w-2 bg-primary"
                    : "w-2 bg-border"
              )}
            />
          ))}
        </div>

        <Card className="border-border/50 shadow-lg">
          {/* Step 1: Native Language */}
          {step === 1 && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{"What's your native language?"}</CardTitle>
                <CardDescription>
                  {"We'll use this to provide better translations"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search languages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {filteredNativeLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setProfile({ ...profile, nativeLanguage: lang.code })}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all",
                        profile.nativeLanguage === lang.code
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <span className="font-medium">{lang.name}</span>
                      {profile.nativeLanguage === lang.code && (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Target Language */}
          {step === 2 && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">What language do you want to learn?</CardTitle>
                <CardDescription>
                  Choose your adventure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setProfile({ ...profile, targetLanguage: lang.code })}
                      disabled={lang.code === profile.nativeLanguage}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                        profile.targetLanguage === lang.code
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-muted/50",
                        lang.code === profile.nativeLanguage && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <span className="text-3xl">{lang.flag}</span>
                      <span className="font-medium text-sm">{lang.name}</span>
                      {profile.targetLanguage === lang.code && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Level */}
          {step === 3 && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">What is your current level?</CardTitle>
                <CardDescription>
                  {"We'll personalize your learning path"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setProfile({ ...profile, level: level.id })}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                      profile.level === level.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <div>
                      <p className="font-medium">{level.label}</p>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                    {profile.level === level.id && (
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </CardContent>
            </>
          )}

          {/* Step 4: Goal */}
          {step === 4 && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">What is your main goal?</CardTitle>
                <CardDescription>
                  This helps us tailor your lessons
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setProfile({ ...profile, goal: goal.id })}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                      profile.goal === goal.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{goal.label}</p>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                    {profile.goal === goal.id && (
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </CardContent>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="px-6 pb-6 flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className={cn("flex-1", step === 1 && "w-full")}
            >
              {step === 4 ? "Start Learning" : "Continue"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
