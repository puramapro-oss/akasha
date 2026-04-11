'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Check, ChevronDown, Menu, X,
  MessageSquare, Image as ImageIcon, Bot, Workflow, Code2, Mic,
  Shield, Sparkles, Zap, Layers, Globe,
} from 'lucide-react'

/* ─── Reveal wrapper ──────────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'span'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const Component = motion[Tag]
  return (
    <Component
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Component>
  )
}

/* ─── Nav ─────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#features', label: 'Fonctionnalites' },
    { href: '#tools', label: 'Outils' },
    { href: '#pricing', label: 'Tarifs' },
    { href: '#faq', label: 'FAQ' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)]">
            <span className="font-display text-sm font-bold text-white">A</span>
          </div>
          <span className="font-display text-base font-bold text-[var(--text-primary)]">
            AKASHA
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className="btn btn-ghost text-sm">
            Connexion
          </Link>
          <Link href="/signup" className="btn btn-primary text-sm" data-testid="nav-cta-signup">
            Essayer
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-card)] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[var(--border)] bg-[var(--bg-base)]/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[var(--border)] pt-3">
                <Link href="/login" className="btn btn-secondary text-sm">
                  Connexion
                </Link>
                <Link href="/signup" className="btn btn-primary text-sm">
                  Essayer
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

/* ─── Hero ────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative z-10 px-4 pt-32 pb-20 sm:px-6 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] px-3.5 py-1.5 text-xs text-[var(--text-secondary)] backdrop-blur-md"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--cyan)] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--cyan)]" />
          </span>
          <span>L&apos;ecosysteme IA tout-en-un</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display text-[2.3rem] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)] sm:text-5xl md:text-6xl lg:text-[4.25rem]"
        >
          Tous tes outils IA.
          <br />
          <span className="gradient-text">Un seul abonnement.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg"
        >
          Chat multi-modeles, generation d&apos;images, agents autonomes, automatisations
          et bien plus. Une seule plateforme. Un seul prix. Sans compromis.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/signup"
            className="btn btn-primary w-full px-6 py-3.5 text-base sm:w-auto"
            data-testid="hero-cta-signup"
          >
            Commencer gratuitement
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#features" className="btn btn-secondary w-full px-6 py-3.5 text-base sm:w-auto">
            Voir les fonctionnalites
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-5 text-xs text-[var(--text-muted)]"
        >
          Sans carte bancaire &middot; Resiliation en 1 clic &middot; Hebergement Europe
        </motion.p>

        {/* Hero visual — clean dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-[var(--shadow-strong)]">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-card)] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="mx-auto hidden items-center gap-1.5 rounded-md bg-[var(--bg-base)] px-3 py-1 text-[10px] text-[var(--text-muted)] sm:flex">
                <Shield className="h-3 w-3" />
                akasha.purama.dev
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-[180px_1fr]">
              {/* Sidebar */}
              <div className="hidden border-r border-[var(--border)] bg-[var(--bg-card)]/50 p-3 sm:block">
                <div className="space-y-1">
                  {[
                    { icon: MessageSquare, label: 'Chat', active: true },
                    { icon: ImageIcon, label: 'Studio' },
                    { icon: Bot, label: 'Agents' },
                    { icon: Workflow, label: 'Automatisations' },
                    { icon: Code2, label: 'Code' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs ${
                        item.active
                          ? 'bg-[var(--cyan)]/10 text-[var(--cyan)]'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat preview */}
              <div className="flex flex-col gap-3 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                  <Sparkles className="h-3 w-3 text-[var(--cyan)]" />
                  AKASHA Sonnet
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] px-3.5 py-2 text-xs text-white sm:text-sm">
                      Resume cet article en 3 points
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--bg-card)] px-3.5 py-2.5 text-xs text-[var(--text-secondary)] sm:text-sm">
                      <div className="space-y-1">
                        <div className="text-[var(--text-primary)]">Voici les 3 points cles :</div>
                        <div>1. La methode propose une approche modulaire...</div>
                        <div>2. Les benchmarks montrent une amelioration de 40%...</div>
                        <div className="flex items-center gap-1 text-[var(--text-muted)]">
                          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--cyan)]" />
                          ecriture en cours
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2">
                  <input
                    type="text"
                    readOnly
                    placeholder="Pose ta question..."
                    className="flex-1 bg-transparent text-xs text-[var(--text-secondary)] outline-none placeholder:text-[var(--text-muted)] sm:text-sm"
                  />
                  <button className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)]">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Glow */}
          <div className="absolute -inset-x-10 -bottom-10 -z-10 h-40 bg-gradient-to-r from-[var(--cyan)]/20 via-[var(--purple)]/20 to-[var(--pink)]/20 blur-3xl" />
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Features grid ───────────────────────────────────────────────────── */
function Features() {
  const features = [
    {
      icon: MessageSquare,
      color: 'var(--cyan)',
      title: 'Chat multi-modeles',
      desc: 'Discute avec AKASHA Sonnet, Opus et Haiku. Compare les reponses, choisis la meilleure.',
    },
    {
      icon: ImageIcon,
      color: 'var(--pink)',
      title: 'Studio creatif',
      desc: 'Genere images, videos et sons depuis une seule interface. Modeles SOTA inclus.',
    },
    {
      icon: Bot,
      color: 'var(--purple)',
      title: 'Agents autonomes',
      desc: 'Cree des agents IA qui executent des taches en arriere-plan, 24h/24.',
    },
    {
      icon: Workflow,
      color: 'var(--green)',
      title: 'Automatisations',
      desc: 'Connecte tes outils, declenche des workflows, automatise tes processus repetitifs.',
    },
    {
      icon: Code2,
      color: 'var(--orange)',
      title: 'Outils developpeurs',
      desc: 'Genere du code, debogue, deploie. API REST disponible pour integrer AKASHA.',
    },
    {
      icon: Mic,
      color: 'var(--gold)',
      title: 'Voix & transcription',
      desc: 'Synthese vocale naturelle, transcription temps reel, traduction multilingue.',
    },
  ]

  return (
    <section id="features" className="relative z-10 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
            Tout ce dont tu as besoin.
            <br />
            <span className="gradient-text">Au meme endroit.</span>
          </h2>
          <p className="mt-5 text-base text-[var(--text-secondary)] sm:text-lg">
            Chaque outil est concu pour s&apos;integrer parfaitement aux autres.
            Plus de copier-coller entre dix applications.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="card card-hover h-full p-6">
                <div
                  className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    background: `${f.color}14`,
                    border: `1px solid ${f.color}33`,
                    color: f.color,
                  }}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Tools showcase ──────────────────────────────────────────────────── */
function Tools() {
  const universes = [
    {
      key: 'automate',
      label: 'AUTOMATE',
      color: 'var(--cyan)',
      desc: 'Workflows, agents et integrations pour deleguer tes taches repetitives.',
      items: ['Workflows visuels', 'Agents autonomes', 'Webhooks', 'Cron jobs', 'API integrations'],
    },
    {
      key: 'create',
      label: 'CREATE',
      color: 'var(--pink)',
      desc: 'Studio creatif complet — du concept a la production en quelques minutes.',
      items: ['Generation d\'images', 'Video AI', 'Synthese vocale', 'Musique generative', 'Edition prompts'],
    },
    {
      key: 'build',
      label: 'BUILD',
      color: 'var(--green)',
      desc: 'Outils developpeurs : multi-modeles, generation de code, debug intelligent.',
      items: ['Chat multi-LLM', 'Code generation', 'Debug assistant', 'API REST', 'Docs interactives'],
    },
    {
      key: 'complete',
      label: 'COMPLET',
      color: 'var(--gold)',
      desc: 'Acces total a tous les univers, sans limite. Pour les utilisateurs avances.',
      items: ['Tous les outils', 'Quotas premium', 'Marketplace', 'Acces API', 'Support prioritaire'],
    },
  ]

  return (
    <section id="tools" className="relative z-10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
            Quatre univers.
            <br />
            <span className="gradient-text">Une seule plateforme.</span>
          </h2>
          <p className="mt-5 text-base text-[var(--text-secondary)] sm:text-lg">
            Choisis l&apos;univers qui correspond a ton usage, ou prends-les tous.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {universes.map((u, i) => (
            <Reveal key={u.key} delay={i * 0.08}>
              <div
                className="card card-hover h-full p-7"
                style={{ borderColor: `${u.color}33` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-display text-xs font-bold tracking-[0.18em]"
                    style={{ color: u.color }}
                  >
                    {u.label}
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ background: `linear-gradient(90deg, ${u.color}55, transparent)` }}
                  />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {u.desc}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {u.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--text-primary)]">
                      <span
                        className="flex h-4 w-4 items-center justify-center rounded-full"
                        style={{ background: `${u.color}22`, color: u.color }}
                      >
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Pricing ─────────────────────────────────────────────────────────── */
function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'pour toujours',
      desc: 'Pour decouvrir AKASHA',
      features: [
        '10 requetes par jour',
        'Chat AKASHA Sonnet',
        'Acces a la communaute',
        'Mises a jour gratuites',
      ],
      cta: 'Commencer',
      highlight: false,
    },
    {
      name: 'Specialise',
      price: '7',
      period: '/ mois',
      desc: 'AUTOMATE, CREATE ou BUILD',
      features: [
        '100 requetes par jour',
        'Acces a un univers complet',
        'Agents et workflows',
        'Support standard',
      ],
      cta: 'Choisir un univers',
      highlight: false,
    },
    {
      name: 'Complet',
      price: '22',
      period: '/ mois',
      desc: 'Tous les univers, tous les outils',
      features: [
        '300 requetes par jour',
        'Tous les univers AKASHA',
        'Marketplace inclus',
        'API REST',
        'Support prioritaire',
      ],
      cta: 'Tout debloquer',
      highlight: true,
    },
  ]

  return (
    <section id="pricing" className="relative z-10 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
            Tarification simple.
            <br />
            <span className="gradient-text">Sans surprise.</span>
          </h2>
          <p className="mt-5 text-base text-[var(--text-secondary)] sm:text-lg">
            Pas de frais caches. Pas d&apos;engagement. Tu peux annuler a tout moment.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div
                className={`relative card h-full p-7 ${
                  p.highlight ? 'border-[var(--cyan)]/40 shadow-[var(--shadow-glow)]' : ''
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Le plus populaire
                  </div>
                )}
                <div>
                  <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{p.desc}</p>
                </div>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-bold text-[var(--text-primary)]">
                    {p.price === '0' ? '0' : `${p.price}€`}
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">{p.period}</span>
                </div>

                <Link
                  href="/signup"
                  className={`mt-6 block w-full text-center ${
                    p.highlight ? 'btn btn-primary' : 'btn btn-secondary'
                  }`}
                >
                  {p.cta}
                </Link>

                <div className="my-6 h-px bg-[var(--border)]" />

                <ul className="space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--cyan)]" strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-10 text-center">
          <Link href="/pricing" className="text-sm text-[var(--cyan)] hover:underline">
            Voir tous les plans et options &rarr;
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Trust strip (real, verifiable claims only) ─────────────────────── */
function Trust() {
  const items = [
    { icon: Shield, label: 'RGPD', desc: 'Conforme et hebergement Europe' },
    { icon: Layers, label: 'Multi-modeles', desc: 'Sonnet, Opus et Haiku' },
    { icon: Globe, label: '16 langues', desc: 'Interface internationalisee' },
    { icon: Zap, label: 'Annulation 1 clic', desc: 'Sans engagement' },
  ]
  return (
    <section className="relative z-10 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="card grid grid-cols-2 gap-px overflow-hidden bg-[var(--border)] p-0 sm:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.label}
              className="flex flex-col items-start gap-2 bg-[var(--bg-elevated)] p-5 sm:p-6"
            >
              <it.icon className="h-5 w-5 text-[var(--cyan)]" />
              <div className="font-display text-sm font-semibold text-[var(--text-primary)]">
                {it.label}
              </div>
              <div className="text-xs text-[var(--text-muted)]">{it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ─────────────────────────────────────────────────────────────── */
function FAQ() {
  const faqs = [
    {
      q: 'Qu\'est-ce qu\'AKASHA AI ?',
      a: 'AKASHA AI est une plateforme tout-en-un qui regroupe chat multi-modeles, generation d\'images et de videos, agents autonomes et automatisations dans une seule interface. Un compte, un prix, tous les outils.',
    },
    {
      q: 'Combien coute AKASHA ?',
      a: 'Le plan gratuit te donne 10 requetes par jour, sans carte bancaire. Les plans specialises (AUTOMATE, CREATE ou BUILD) commencent a 7€/mois. Le plan Complet, qui debloque tous les univers, commence a 22€/mois.',
    },
    {
      q: 'Puis-je annuler quand je veux ?',
      a: 'Oui. La resiliation se fait en un clic depuis tes parametres. Aucun engagement, aucuns frais caches. Tu gardes l\'acces jusqu\'a la fin de la periode payee.',
    },
    {
      q: 'Mes donnees sont-elles securisees ?',
      a: 'Oui. AKASHA est conforme RGPD, heberge en Europe, et tes donnees sont chiffrees en transit et au repos. Tu peux exporter ou supprimer ton compte a tout moment.',
    },
    {
      q: 'Y a-t-il une API pour les developpeurs ?',
      a: 'Oui, une API REST est disponible avec le plan Complet. Documentation et exemples disponibles dans la section developpeurs.',
    },
    {
      q: 'AKASHA est-il disponible en plusieurs langues ?',
      a: 'L\'interface est disponible en 16 langues. Les modeles IA repondent dans la langue de ton choix.',
    },
  ]

  return (
    <section id="faq" className="relative z-10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
            Questions <span className="gradient-text">frequentes</span>
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faqs.map((item, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <details className="card group overflow-hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-sm font-medium text-[var(--text-primary)] sm:text-base">
                  <span>{item.q}</span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0 text-[var(--text-muted)] transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="border-t border-[var(--border)] px-6 py-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {item.a}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Final ───────────────────────────────────────────────────────── */
function CTAFinal() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-card)] p-10 text-center sm:p-14 lg:p-16">
            <div className="absolute -inset-x-20 -top-20 h-60 bg-gradient-to-r from-[var(--cyan)]/15 via-[var(--purple)]/15 to-[var(--pink)]/15 blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
                Pret a tout simplifier ?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base text-[var(--text-secondary)] sm:text-lg">
                Cree ton compte en 30 secondes. Sans carte bancaire.
              </p>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/signup"
                  className="btn btn-primary w-full px-7 py-3.5 text-base sm:w-auto"
                  data-testid="footer-cta-signup"
                >
                  Commencer gratuitement
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/pricing" className="btn btn-secondary w-full px-7 py-3.5 text-base sm:w-auto">
                  Voir les tarifs
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Footer ──────────────────────────────────────────────────────────── */
function Footer() {
  const cols = [
    {
      title: 'Produit',
      links: [
        { label: 'Fonctionnalites', href: '#features' },
        { label: 'Tarifs', href: '/pricing' },
        { label: 'API', href: '/dashboard/api' },
        { label: 'Changelog', href: '/changelog' },
      ],
    },
    {
      title: 'Ressources',
      links: [
        { label: 'Centre d\'aide', href: '/aide' },
        { label: 'Status', href: '/status' },
        { label: 'Contact', href: '/contact' },
        { label: 'Ecosysteme', href: '/ecosystem' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Mentions legales', href: '/mentions-legales' },
        { label: 'CGU', href: '/cgu' },
        { label: 'CGV', href: '/cgv' },
        { label: 'Confidentialite', href: '/politique-confidentialite' },
        { label: 'Cookies', href: '/cookies' },
      ],
    },
  ]

  return (
    <footer className="relative z-10 border-t border-[var(--border)] px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-4 lg:gap-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)]">
                <span className="font-display text-sm font-bold text-white">A</span>
              </div>
              <span className="font-display text-base font-bold text-[var(--text-primary)]">
                AKASHA
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-[var(--text-muted)]">
              L&apos;ecosysteme IA tout-en-un. Concu et heberge en Europe.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-[var(--border)] pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; 2026 AKASHA AI &middot; SASU PURAMA &middot; Frasne, France
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            TVA non applicable, art. 293 B du CGI
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <Nav />
      <main className="overflow-hidden">
        <Hero />
        <Features />
        <Tools />
        <Pricing />
        <Trust />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </>
  )
}
