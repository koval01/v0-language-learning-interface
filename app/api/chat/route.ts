import { streamText, convertToModelMessages, tool } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { messages, userProfile, sessionId } = await req.json()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const systemPrompt = `You are LinguaAI, a friendly and patient AI language tutor helping absolute beginners learn ${userProfile?.target_language || 'Spanish'}.

User Profile:
- Native language: ${userProfile?.native_language || 'English'}
- Target language: ${userProfile?.target_language || 'Spanish'}
- Current level: ${userProfile?.current_level || 'beginner'}
- Main goal: ${userProfile?.main_goal || 'travel'}

Your teaching style:
1. Always be encouraging and supportive
2. Use simple, everyday vocabulary appropriate for beginners
3. Introduce one new concept at a time
4. Provide literal translations and grammar hints for every phrase
5. Use lots of examples with common situations
6. When the user makes mistakes, gently correct them and explain why

Response format:
For each teaching moment, structure your response as JSON with these fields:
- targetPhrase: The phrase in the target language
- translation: The natural translation in the user's native language
- literalTranslation: Word-by-word literal translation (optional)
- grammarHint: Brief grammar note (e.g., "Informal Greeting + Question")
- explanation: Detailed explanation of the grammar/vocabulary (shown when user clicks "Explain Why")
- words: Array of {word, translation, partOfSpeech} for each word in the phrase
- conversationalResponse: Your friendly response to continue the conversation

Keep responses focused and digestible. One phrase at a time for beginners.`

  const result = streamText({
    model: 'anthropic/claude-sonnet-4-20250514',
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: {
      trackVocabulary: tool({
        description: 'Track a word the user has learned',
        inputSchema: z.object({
          word: z.string(),
          translation: z.string(),
          language: z.string(),
        }),
        execute: async ({ word, translation, language }) => {
          await supabase.from('vocabulary_progress').upsert({
            user_id: user.id,
            word,
            translation,
            language,
            times_seen: 1,
          }, {
            onConflict: 'user_id,word,language',
          })
          return { success: true }
        },
      }),
      trackConcept: tool({
        description: 'Track a grammar concept the user has learned',
        inputSchema: z.object({
          conceptName: z.string(),
          conceptType: z.enum(['grammar', 'vocabulary', 'phrase', 'culture']),
        }),
        execute: async ({ conceptName, conceptType }) => {
          await supabase.from('learned_concepts').upsert({
            user_id: user.id,
            concept_name: conceptName,
            concept_type: conceptType,
          }, {
            onConflict: 'user_id,concept_name',
          })
          return { success: true }
        },
      }),
    },
    onFinish: async ({ text }) => {
      // Save the assistant message to the session
      if (sessionId) {
        await supabase.from('session_messages').insert({
          session_id: sessionId,
          user_id: user.id,
          role: 'assistant',
          content: { text },
        })
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
