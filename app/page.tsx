"use client"

import { useState } from "react"
import { ProgressHeader } from "@/components/language-tutor/progress-header"
import { LearnedConceptsSidebar } from "@/components/language-tutor/learned-concepts-sidebar"
import { AssistantMessage } from "@/components/language-tutor/assistant-message"
import { UserMessage } from "@/components/language-tutor/user-message"
import { ChatInput } from "@/components/language-tutor/chat-input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

// Sample data for demonstration
const sampleConcepts = [
  { id: "1", name: "Verb: to be (ser/estar)", mastered: true },
  { id: "2", name: "Present Simple", mastered: true },
  { id: "3", name: "Subject Pronouns", mastered: true },
  { id: "4", name: "Question Formation", mastered: false },
  { id: "5", name: "Word Order", mastered: false },
]

interface Message {
  type: "user" | "assistant"
  content: string
  assistantData?: {
    phrase: string
    words: { original: string; translation: string }[]
    literalTranslation: string
    grammarHint: string
    explanation: string
  }
}

const initialMessages: Message[] = [
  {
    type: "assistant",
    content: "",
    assistantData: {
      phrase: "Hola, ¿cómo estás?",
      words: [
        { original: "Hola,", translation: "Hello," },
        { original: "¿cómo", translation: "how" },
        { original: "estás?", translation: "are you?" },
      ],
      literalTranslation: "Hello, how are-you?",
      grammarHint: "Informal Greeting + Question",
      explanation:
        "In Spanish, we use 'estás' (the informal 'you' form of 'estar') when asking about someone's current state or feeling. The verb 'estar' is used for temporary states, while 'ser' is used for permanent characteristics. The inverted question mark '¿' at the beginning is unique to Spanish and signals that a question is coming.",
    },
  },
  {
    type: "user",
    content: "I'm good, thank you! How do I say 'My name is John'?",
  },
  {
    type: "assistant",
    content: "",
    assistantData: {
      phrase: "Me llamo John.",
      words: [
        { original: "Me", translation: "Myself" },
        { original: "llamo", translation: "I call" },
        { original: "John.", translation: "John." },
      ],
      literalTranslation: "Myself I-call John.",
      grammarHint: "Reflexive Verb + Present Simple",
      explanation:
        "The phrase 'Me llamo' literally translates to 'I call myself.' Spanish uses reflexive verbs where the action reflects back on the subject. 'Llamarse' (to call oneself) is a reflexive verb. The 'me' part indicates that you are doing the action to yourself. This is a very common way to introduce yourself in Spanish!",
    },
  },
]

export default function LanguageTutorPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [concepts, setConcepts] = useState(sampleConcepts)

  const handleSend = (message: string) => {
    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: message }])

    // Simulate AI response after a short delay
    setTimeout(() => {
      const newAssistantMessage: Message = {
        type: "assistant",
        content: "",
        assistantData: {
          phrase: "¡Muy bien! Ahora puedes practicar.",
          words: [
            { original: "¡Muy", translation: "Very" },
            { original: "bien!", translation: "good!" },
            { original: "Ahora", translation: "Now" },
            { original: "puedes", translation: "you can" },
            { original: "practicar.", translation: "practice." },
          ],
          literalTranslation: "Very good! Now you-can practice.",
          grammarHint: "Modal Verb + Infinitive",
          explanation:
            "'Puedes' comes from the verb 'poder' (to be able to/can), conjugated for 'tú' (informal you). In Spanish, when using modal verbs like 'poder', the second verb stays in its infinitive form (-ar, -er, -ir ending). So 'puedes practicar' follows the pattern: conjugated modal verb + infinitive.",
        },
      }
      setMessages((prev) => [...prev, newAssistantMessage])

      // Simulate adding a new concept
      if (!concepts.find((c) => c.id === "6")) {
        setConcepts((prev) => [
          ...prev,
          { id: "6", name: "Modal Verbs", mastered: false },
        ])
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col h-screen">
      <ProgressHeader topic="Basic Greetings" mastery={45} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Welcome Message */}
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8 text-primary"
                  >
                    <path d="m5 8 6 6" />
                    <path d="m4 14 6-6 2-3" />
                    <path d="M2 5h12" />
                    <path d="M7 2h1" />
                    <path d="m22 22-5-10-5 10" />
                    <path d="M14 18h6" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Welcome to your Spanish lesson!
                </h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Click on any word to see its translation. Toggle literal translations
                  and explore grammar explanations to deepen your understanding.
                </p>
              </div>

              {/* Chat Messages */}
              {messages.map((message, index) => (
                <div key={index}>
                  {message.type === "user" ? (
                    <UserMessage message={message.content} />
                  ) : message.assistantData ? (
                    <AssistantMessage {...message.assistantData} />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <ChatInput
            onSend={handleSend}
            hint="Try saying 'Nice to meet you' - use 'Mucho gusto'"
          />
        </main>

        {/* Desktop Sidebar */}
        <LearnedConceptsSidebar
          concepts={concepts}
          className="hidden lg:block"
        />

        {/* Mobile Sidebar Sheet */}
        <div className="lg:hidden fixed bottom-24 right-4 z-20">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg"
              >
                <BookOpen className="w-5 h-5" />
                <span className="sr-only">View learned concepts</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <LearnedConceptsSidebar concepts={concepts} className="w-full border-0 h-full" />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
