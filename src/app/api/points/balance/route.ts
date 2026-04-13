import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

    const { data } = await supabase
      .from('purama_points')
      .select('balance, lifetime_earned')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({
      balance: data?.balance ?? 0,
      lifetime_earned: data?.lifetime_earned ?? 0,
    })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
