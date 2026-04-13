import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { z } from 'zod'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

    const { data: entries } = await supabase
      .from('gratitude_entries')
      .select('id, content, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    // Calculate streak
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      const hasEntry = entries?.some(e => e.created_at.startsWith(dateStr))
      if (hasEntry) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    return NextResponse.json({ entries: entries ?? [], streak })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

const GratitudeSchema = z.object({
  content: z.string().min(1).max(280),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

    const body: unknown = await request.json()
    const parsed = GratitudeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Contenu invalide' }, { status: 400 })
    }

    // Check daily limit (3 per day)
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabase
      .from('gratitude_entries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00`)

    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: 'Limite de 3 gratitudes par jour atteinte' }, { status: 429 })
    }

    const { data: entry, error } = await supabase
      .from('gratitude_entries')
      .insert({ user_id: user.id, content: parsed.data.content })
      .select('id, content, created_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ entry })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
