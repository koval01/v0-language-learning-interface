import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Languages, MessageCircle, Brain, Sparkles, ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is logged in, redirect to learn page
  if (user) {
    redirect('/learn')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <Languages className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-lg">LinguaAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Language Learning
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Learn any language with your personal AI tutor
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Designed for absolute beginners. Get instant translations, grammar explanations, 
            and personalized lessons that adapt to your learning style.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/auth/sign-up">
                Start learning free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link href="/auth/login">
                Sign in
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Conversations</h3>
            <p className="text-muted-foreground">
              Learn through natural dialogue. Click any word to see translations, 
              pronunciations, and usage examples.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Grammar Made Simple</h3>
            <p className="text-muted-foreground">
              Every phrase comes with grammar hints and detailed explanations. 
              Understand the why behind every sentence.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Personalized Progress</h3>
            <p className="text-muted-foreground">
              Track your vocabulary, concepts learned, and areas for improvement. 
              Your AI tutor remembers everything.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/5 rounded-3xl p-8 md:p-12 text-center border border-primary/10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to start your language journey?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Join thousands of learners using AI to master new languages. 
            No credit card required.
          </p>
          <Button size="lg" asChild className="text-lg px-8">
            <Link href="/auth/sign-up">
              Create free account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>LinguaAI - Your personal AI language tutor</p>
        </div>
      </footer>
    </div>
  )
}
