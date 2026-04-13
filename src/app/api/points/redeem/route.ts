import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { z } from 'zod'

const RedeemSchema = z.object({
  item_id: z.string().min(1),
  cost: z.number().positive(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

    const body: unknown = await request.json()
    const parsed = RedeemSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Donnees invalides' }, { status: 400 })
    }

    const { item_id, cost } = parsed.data

    // Get current balance
    const { data: pointsData } = await supabase
      .from('purama_points')
      .select('balance')
      .eq('user_id', user.id)
      .single()

    const balance = pointsData?.balance ?? 0
    if (balance < cost) {
      return NextResponse.json({ error: `Solde insuffisant. Il te manque ${cost - balance} points.` }, { status: 400 })
    }

    // Deduct points
    await supabase
      .from('purama_points')
      .update({ balance: balance - cost })
      .eq('user_id', user.id)

    // Log transaction
    await supabase
      .from('point_transactions')
      .insert({
        user_id: user.id,
        amount: -cost,
        type: 'redeem',
        source: 'boutique',
        description: `Achat boutique: ${item_id}`,
      })

    return NextResponse.json({
      success: true,
      new_balance: balance - cost,
      item_id,
    })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
