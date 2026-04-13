'use client'

/**
 * Micro-textes empowering — remplace les textes generiques par des messages inspirants.
 * Usage: const { t } = useEmpowerment()
 *        <p>{t('loading')}</p> → "Ton espace se prepare..."
 */

const EMPOWERING_TEXTS: Record<string, string> = {
  loading: 'Ton espace se prepare...',
  error: 'Petit detour, on revient plus fort.',
  empty: 'L\'espace de toutes les possibilites.',
  welcome: 'Bienvenue chez toi.',
  logout: 'A tres vite, belle ame.',
  congrats: 'Tu vois ? Tu es capable de tout.',
  retry: 'On reessaie ensemble.',
  searching: 'L\'univers cherche pour toi...',
  saving: 'On immortalise ca...',
  success: 'Magnifique. Continue.',
  generating: 'La magie opere...',
  connecting: 'Les energies s\'alignent...',
  uploading: 'Ton talent prend forme...',
  processing: 'L\'intelligence s\'eveille...',
}

export function useEmpowerment() {
  const t = (key: string): string => {
    return EMPOWERING_TEXTS[key] ?? key
  }

  return { t, texts: EMPOWERING_TEXTS }
}

export function getEmpoweringText(key: string): string {
  return EMPOWERING_TEXTS[key] ?? key
}
