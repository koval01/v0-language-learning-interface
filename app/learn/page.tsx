import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LearnClient } from '@/components/language-tutor/learn-client'

export default async function LearnPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch learned concepts
  const { data: concepts } = await supabase
    .from('learned_concepts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  // Fetch vocabulary count
  const { count: vocabularyCount } = await supabase
    .from('vocabulary_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Fetch latest session or create new one
  let { data: currentSession } = await supabase
    .from('learning_sessions')
    .select('*')
    .eq('user_id', user.id)
    .is('ended_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .single()

  // If no active session, create one
  if (!currentSession) {
    const { data: newSession } = await supabase
      .from('learning_sessions')
      .insert({
        user_id: user.id,
        topic: 'Basic Greetings',
      })
      .select()
      .single()
    currentSession = newSession
  }

  // Fetch session messages if session exists
  let sessionMessages: Array<{ role: string; content: unknown }> = []
  if (currentSession) {
    const { data: messages } = await supabase
      .from('session_messages')
      .select('*')
      .eq('session_id', currentSession.id)
      .order('created_at', { ascending: true })

    sessionMessages = messages || []
  }

  // Check if user needs onboarding (new user with default values)
  const needsOnboarding = !profile || (
    profile.native_language === 'English' &&
    profile.target_language === 'Spanish' &&
    profile.current_level === 'beginner' &&
    profile.main_goal === 'travel' &&
    profile.total_sessions === 0
  )

  return (
    <LearnClient
      user={user}
      initialProfile={profile}
      initialConcepts={concepts || []}
      vocabularyCount={vocabularyCount || 0}
      currentSession={currentSession}
      sessionMessages={sessionMessages}
      needsOnboarding={needsOnboarding}
    />
  )
}
