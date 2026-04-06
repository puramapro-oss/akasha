import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="gradient-text font-[family-name:var(--font-display)] text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
          Tous les outils IA.
          <br />
          Un seul abonnement.
        </h1>
        <p className="max-w-xl text-lg text-[var(--text-secondary)]">
          47+ outils IA premium reunis en une seule plateforme. Cree, automatise, code et genere — sans jamais changer d&apos;app.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] px-8 py-3.5 text-base font-medium text-white transition-opacity hover:opacity-90 glow-pulse"
            data-testid="cta-signup"
          >
            Commencer gratuitement
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-white/5 px-8 py-3.5 text-base font-medium text-[var(--text-primary)] transition-all hover:border-[var(--border-glow)] hover:bg-white/10"
            data-testid="cta-login"
          >
            Connexion
          </Link>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          14 jours satisfait ou rembourse &bull; Aucune carte requise pour commencer
        </p>
      </div>
    </div>
  )
}
