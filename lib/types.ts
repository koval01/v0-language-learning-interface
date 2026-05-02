export interface UserProfile {
  id: string
  native_language: string
  target_language: string
  current_level: 'beginner' | 'basics' | 'intermediate'
  main_goal: 'travel' | 'work' | 'fun'
  total_vocabulary_count: number
  total_sessions: number
  streak_days: number
  last_session_at: string | null
  created_at: string
  updated_at: string
}

export interface LearningSession {
  id: string
  user_id: string
  started_at: string
  ended_at: string | null
  duration_minutes: number | null
  words_learned: number
  topic: string | null
  summary: string | null
  strong_points: string[] | null
  areas_to_improve: string[] | null
  created_at: string
}

export interface SessionMessage {
  id: string
  session_id: string
  user_id: string
  role: 'user' | 'assistant'
  content: MessageContent
  created_at: string
}

export interface MessageContent {
  text?: string
  targetPhrase?: string
  translation?: string
  grammarHint?: string
  explanation?: string
  words?: WordInfo[]
  parts?: MessagePart[]
}

export interface WordInfo {
  word: string
  translation: string
  partOfSpeech?: string
}

export interface MessagePart {
  type: 'text'
  text: string
}

export interface VocabularyProgress {
  id: string
  user_id: string
  word: string
  translation: string
  language: string
  mastery_level: number
  times_seen: number
  times_correct: number
  last_seen_at: string
  created_at: string
}

export interface LearnedConcept {
  id: string
  user_id: string
  concept_name: string
  concept_type: 'grammar' | 'vocabulary' | 'phrase' | 'culture'
  mastery_level: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface UserDNA {
  vocabularyCount: number
  strongPoints: string[]
  areasToImprove: string[]
}
