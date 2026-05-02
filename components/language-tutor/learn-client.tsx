"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useChat, type UseChatOptions } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { createClient } from "@/lib/supabase/client"
import { Onboarding, type UserProfile as OnboardingProfile } from "@/components/language-tutor/onboarding"
import { ContextLoadedAnimation } from "@/components/language-tutor/context-loaded-animation"
import { ProgressHeader } from "@/components/language-tutor/progress-header"
import { LearnedConceptsSidebar } from "@/components/language-tutor/learned-concepts-sidebar"
import { AssistantMessage } from "@/components/language-tutor/assistant-message"
import { UserMessage } from "@/components/language-tutor/user-message"
import { ChatInput } from "@/components/language-tutor/chat-input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { BookOpen, Languages, Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import type { UserProfile, LearnedConcept, LearningSession } from "@/lib/types"

interface LearnClientProps {
  user: User
  initialProfile: UserProfile | null
  initialConcepts: LearnedConcept[]
  vocabularyCount: number
  currentSession: LearningSession | null
  sessionMessages: Array<{ role: string; content: unknown }>
  needsOnboarding: boolean
}

type AppState = "onboarding" | "loading" | "chat"

// Language code to name mapping
const languageNames: Record<string, string> = {
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  en: "English",
}

export function LearnClient({
  user,
  initialProfile,
  initialConcepts,
  vocabularyCount: initialVocabCount,
  currentSession,
  sessionMessages,
  needsOnboarding,
}: LearnClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [appState, setAppState] = useState<AppState>(needsOnboarding ? "onboarding" : "chat")
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile)
  const [concepts, setConcepts] = useState<LearnedConcept[]>(initialConcepts)
  const [vocabularyCount, setVocabularyCount] = useState(initialVocabCount)
  const [isSyncing, setIsSyncing] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [parsedMessages, setParsedMessages] = useState<Array<{
    role: "user" | "assistant"
    content: string
    assistantData?: {
      phrase: string
      words: { original: string; translation: string }[]
      literalTranslation: string
      grammarHint: string
      explanation: string
    }
  }>>([])

  // Get target language name
  const targetLanguage = profile?.target_language
    ? languageNames[profile.target_language] || profile.target_language
    : "Spanish"

  // Chat configuration with AI SDK
  const chatOptions: UseChatOptions = {
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          messages,
          userProfile: profile,
          sessionId: currentSession?.id,
        },
      }),
    }),
    onFinish: () => {
      // Trigger sync animation
      setIsSyncing(true)
      setTimeout(() => setIsSyncing(false), 1500)
      // Refresh data
      router.refresh()
    },
  }

  const { messages, sendMessage, status, input, setInput } = useChat(chatOptions)

  // Session time counter
  useEffect(() => {
    if (appState !== "chat") return

    const timeInterval = setInterval(() => {
      setSessionTime((prev) => prev + 1)
    }, 60000) // Update every minute

    return () => clearInterval(timeInterval)
  }, [appState])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, parsedMessages])

  // Parse session messages into display format
  useEffect(() => {
    if (sessionMessages.length > 0) {
      const parsed = sessionMessages.map((msg) => {
        const content = msg.content as { text?: string }
        return {
          role: msg.role as "user" | "assistant",
          content: content.text || "",
        }
      })
      setParsedMessages(parsed)
    }
  }, [sessionMessages])

  const handleOnboardingComplete = async (onboardingProfile: OnboardingProfile) => {
    // Update profile in Supabase
    const { error } = await supabase
      .from("user_profiles")
      .update({
        native_language: onboardingProfile.nativeLanguage,
        target_language: onboardingProfile.targetLanguage,
        current_level: onboardingProfile.level,
        main_goal: onboardingProfile.goal,
        total_sessions: 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (!error) {
      setProfile({
        ...profile!,
        native_language: onboardingProfile.nativeLanguage,
        target_language: onboardingProfile.targetLanguage,
        current_level: onboardingProfile.level as "beginner" | "basics" | "intermediate",
        main_goal: onboardingProfile.goal as "travel" | "work" | "fun",
      })
      setAppState("loading")
    }
  }

  const handleLoadingComplete = () => {
    setAppState("chat")
    router.refresh()
  }

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || status === "streaming") return

    // Trigger sync animation
    setIsSyncing(true)

    // Save user message to session
    if (currentSession) {
      await supabase.from("session_messages").insert({
        session_id: currentSession.id,
        user_id: user.id,
        role: "user",
        content: { text: messageText },
      })
    }

    // Send to AI
    sendMessage({ text: messageText })
    setInput("")

    setTimeout(() => setIsSyncing(false), 1500)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  // User DNA for sidebar
  const userDNA = {
    vocabularyCount,
    strongPoints: concepts
      .filter((c) => c.mastery_level >= 4)
      .slice(0, 3)
      .map((c) => c.concept_name),
    needsWork: concepts
      .filter((c) => c.mastery_level < 3)
      .slice(0, 3)
      .map((c) => c.concept_name),
  }

  // Onboarding Screen
  if (appState === "onboarding") {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  // Loading Animation
  if (appState === "loading") {
    return (
      <ContextLoadedAnimation
        targetLanguage={targetLanguage}
        onComplete={handleLoadingComplete}
      />
    )
  }

  // Main Chat Interface
  return (
    <div className="flex flex-col h-screen">
      <ProgressHeader
        topic="Basic Greetings"
        mastery={Math.min(100, (vocabularyCount / 50) * 100)}
        isSyncing={isSyncing}
        strongPoints={userDNA.strongPoints}
        needsWork={userDNA.needsWork}
        vocabularyCount={vocabularyCount}
        sessionTime={sessionTime}
        onSignOut={handleSignOut}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Welcome Message */}
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                  <Languages className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Welcome to your {targetLanguage} lesson!
                </h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Ask me anything! I&apos;ll help you learn with translations,
                  grammar hints, and detailed explanations.
                </p>
              </div>

              {/* Existing Session Messages */}
              {parsedMessages.map((message, index) => (
                <div key={`session-${index}`}>
                  {message.role === "user" ? (
                    <UserMessage message={message.content} />
                  ) : (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Languages className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 bg-card rounded-2xl rounded-tl-md p-4 border border-border shadow-sm">
                        <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* New AI Chat Messages */}
              {messages.map((message) => (
                <div key={message.id}>
                  {message.role === "user" ? (
                    <UserMessage
                      message={
                        message.parts
                          ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                          .map((p) => p.text)
                          .join("") || ""
                      }
                    />
                  ) : (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Languages className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 bg-card rounded-2xl rounded-tl-md p-4 border border-border shadow-sm">
                        <p className="text-foreground whitespace-pre-wrap">
                          {message.parts
                            ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                            .map((p) => p.text)
                            .join("") || ""}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming indicator */}
              {status === "streaming" && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Languages className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <ChatInput
            onSend={handleSend}
            hint={`Try asking: "How do I say 'hello' in ${targetLanguage}?"`}
            disabled={status === "streaming"}
            value={input}
            onChange={setInput}
          />
        </main>

        {/* Desktop Sidebar */}
        <LearnedConceptsSidebar
          concepts={concepts.map((c) => ({
            id: c.id,
            name: c.concept_name,
            mastered: c.mastery_level >= 4,
          }))}
          userDNA={{
            strongPoints: userDNA.strongPoints,
            needsWork: userDNA.needsWork,
            vocabularyCount: userDNA.vocabularyCount,
          }}
          className="hidden lg:block"
        />

        {/* Mobile Sidebar Sheet */}
        <div className="lg:hidden fixed bottom-24 right-4 z-20">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
                <BookOpen className="w-5 h-5" />
                <span className="sr-only">View learned concepts</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <LearnedConceptsSidebar
                concepts={concepts.map((c) => ({
                  id: c.id,
                  name: c.concept_name,
                  mastered: c.mastery_level >= 4,
                }))}
                userDNA={{
                  strongPoints: userDNA.strongPoints,
                  needsWork: userDNA.needsWork,
                  vocabularyCount: userDNA.vocabularyCount,
                }}
                className="w-full border-0 h-full"
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
