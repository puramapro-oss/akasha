'use client'

import Link from 'next/link'
import { MessageSquare, Wrench, Bot, Zap, Sparkles, TrendingUp, Star } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import { cn, formatNumber } from '@/lib/utils'

const QUICK_ACTIONS = [
  {
    href: '/dashboard/chat',
    icon: MessageSquare,
    label: 'Chat IA',
    desc: 'Discute avec AKASHA',
    gradient: 'from-[var(--cyan)] to-[var(--purple)]',
  },
  {
    href: '/dashboard/tools',
    icon: Wrench,
    label: 'Outils (47+)',
    desc: 'Tous les outils IA',
    gradient: 'from-[var(--purple)] to-[var(--pink)]',
  },
  {
    href: '/dashboard/agents',
    icon: Bot,
    label: 'Mes Agents',
    desc: 'Agents personnalises',
    gradient: 'from-[var(--pink)] to-[var(--orange)]',
  },
  {
    href: '/dashboard/automation',
    icon: Zap,
    label: 'Workflows',
    desc: 'Automatise tes taches',
    gradient: 'from-[var(--gold)] to-[var(--green)]',
  },
]

export default function DashboardPage() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  const planLabel: Record<string, string> = {
    free: 'Gratuit',
    automate: 'Automate',
    create: 'Create',
    build: 'Build',
    complete: 'Complete',
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome header */}
      <Card className="p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Ton espace{' '}
              <span className="gradient-text font-[family-name:var(--font-display)]">AKASHA</span>
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Niveau {profile?.level ?? 1} &bull; {formatNumber(profile?.xp ?? 0)} XP &bull;{' '}
              Plan{' '}
              <span className="font-semibold text-[var(--cyan)]">
                {planLabel[profile?.plan ?? 'free'] ?? 'Gratuit'}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-white/5 px-3 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-[var(--gold)]" />
              <span className="text-[var(--text-secondary)]">
                {profile?.streak_count ?? 0} jour{(profile?.streak_count ?? 0) !== 1 ? 's' : ''} de serie
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick actions */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Actions rapides
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {QUICK_ACTIONS.map(({ href, icon: Icon, label, desc, gradient }) => (
            <Link key={href} href={href} data-testid={`quick-action-${href.split('/').pop()}`}>
              <Card
                className="glass-hover flex h-full cursor-pointer flex-col gap-3 p-5 transition-all"
                spotlight
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br',
                    gradient
                  )}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{label}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Statistiques
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--cyan)]/10">
              <MessageSquare className="h-5 w-5 text-[var(--cyan)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {formatNumber(profile?.daily_questions ?? 0)}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">Requetes aujourd&apos;hui</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold)]/10">
              <TrendingUp className="h-5 w-5 text-[var(--gold)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {formatNumber(profile?.xp ?? 0)}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">XP total</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--purple)]/10">
              <Star className="h-5 w-5 text-[var(--purple)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {profile?.level ?? 1}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">Niveau actuel</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
