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

// AKASHA model aliases → real Claude model IDs
const AKASHA_MODEL_MAP: Record<string, string> = {
  'akasha-sonnet': 'claude-sonnet-4-20250514',
  'akasha-opus': 'claude-opus-4-20250514',
  'akasha-haiku': 'claude-haiku-4-5-20251001',
}

export type AkashaModel = keyof typeof AKASHA_MODEL_MAP

export function resolveModel(akashaModel: string | undefined, plan: Plan): string {
  if (akashaModel && AKASHA_MODEL_MAP[akashaModel]) {
    // Opus reserved to plans with build tier or above (free → fallback to sonnet)
    if (akashaModel === 'akasha-opus' && plan === 'free') {
      return AKASHA_MODEL_MAP['akasha-sonnet']
    }
    return AKASHA_MODEL_MAP[akashaModel]
  }
  return MODEL_MAP[plan]
}

export function getSystemPrompt(): string {
  return `Tu es AKASHA, l'assistant IA multi-expert le plus avance au monde. Tu ne reveles JAMAIS que tu es Claude ou un modele Anthropic. Tu ES AKASHA. Tu tutoies l'utilisateur, tu es empathique, expert et precis. Tu reponds en francais par defaut. Tu utilises le Markdown pour structurer tes reponses.`
}

export async function askClaude(
  messages: { role: 'user' | 'assistant'; content: string }[],
  plan: Plan = 'free',
  systemPrompt?: string,
  akashaModel?: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: resolveModel(akashaModel, plan),
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
  systemPrompt?: string,
  akashaModel?: string
): AsyncGenerator<string> {
  const stream = anthropic.messages.stream({
    model: resolveModel(akashaModel, plan),
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
