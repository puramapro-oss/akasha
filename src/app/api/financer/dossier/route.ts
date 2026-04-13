import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { z } from 'zod'

const DossierSchema = z.object({
  profil: z.enum(['particulier', 'entreprise', 'association', 'etudiant']),
  situation: z.enum(['salarie', 'demandeur_emploi', 'independant', 'auto_entrepreneur', 'retraite', 'rsa', 'cej', 'etudiant']),
  departement: z.string().optional(),
  handicap: z.boolean().optional(),
  aide_ids: z.array(z.string().uuid()).min(1, 'Selectionne au moins une aide'),
})

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const parsed = DossierSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Donnees invalides' },
        { status: 400 }
      )
    }

    const { profil, situation, departement, handicap, aide_ids } = parsed.data
    const supabase = await createServerSupabaseClient()

    // Check auth (optional — page is public but dossier creation needs account)
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch selected aides
    const { data: aides, error: aidesErr } = await supabase
      .from('aides')
      .select('*')
      .in('id', aide_ids)
      .eq('active', true)

    if (aidesErr || !aides?.length) {
      return NextResponse.json({ error: 'Aides introuvables' }, { status: 404 })
    }

    // If authenticated, save dossiers
    if (user) {
      const dossiers = aides.map(aide => ({
        user_id: user.id,
        aide_id: aide.id,
        statut: 'en_cours',
        profil_type: profil,
        situation,
        departement: departement ?? null,
        handicap: handicap ?? false,
        metadata: { generated_at: new Date().toISOString() },
      }))

      await supabase.from('dossiers_financement').insert(dossiers)
    }

    // Return success — PDF generation will be client-side with jsPDF in a future iteration
    // For now we return a structured response
    return NextResponse.json({
      url: null,
      count: aides.length,
      aides: aides.map(a => ({
        id: a.id,
        nom: a.nom,
        montant_max: a.montant_max,
        url_officielle: a.url_officielle,
        description: a.description,
      })),
      profil,
      situation,
      departement,
      handicap,
      message: `Dossier cree pour ${aides.length} aide(s). Consulte les sites officiels pour deposer tes demandes.`,
    })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
