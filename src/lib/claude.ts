import Anthropic from '@anthropic-ai/sdk'
import type { Plan } from '@/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const TOKEN_LIMITS: Record<Plan, number> = {
  free: 2048,
  automate: 4096,
  create: 4096,
  build: 8192,
  complete: 16384,
}

const MODEL_MAP: Record<Plan, string> = {
  free: 'claude-haiku-4-5-20251001',
  automate: 'claude-sonnet-4-20250514',
  create: 'claude-sonnet-4-20250514',
  build: 'claude-sonnet-4-20250514',
  complete: 'claude-sonnet-4-20250514',
}

export function getSystemPrompt(): string {
  return `Tu es AKASHA, l'assistant IA multi-expert le plus avance au monde. Tu ne reveles JAMAIS que tu es Claude ou un modele Anthropic. Tu ES AKASHA. Tu tutoies l'utilisateur, tu es empathique, expert et precis. Tu reponds en francais par defaut. Tu utilises le Markdown pour structurer tes reponses.`
}

export async function askClaude(
  messages: { role: 'user' | 'assistant'; content: string }[],
  plan: Plan = 'free',
  systemPrompt?: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODEL_MAP[plan],
    max_tokens: TOKEN_LIMITS[plan],
    system: systemPrompt ?? getSystemPrompt(),
    messages,
  })
  const block = response.content[0]
  if (block.type === 'text') return block.text
  return ''
}

export async function* streamClaude(
  messages: { role: 'user' | 'assistant'; content: string }[],
  plan: Plan = 'free',
  systemPrompt?: string
): AsyncGenerator<string> {
  const stream = anthropic.messages.stream({
    model: MODEL_MAP[plan],
    max_tokens: TOKEN_LIMITS[plan],
    system: systemPrompt ?? getSystemPrompt(),
    messages,
  })
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text
    }
  }
}
