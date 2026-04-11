'use client'

import { Bell, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getGreeting, getInitials } from '@/lib/utils'

export default function Topbar() {
  const { profile } = useAuth()
  const name = profile?.display_name ?? profile?.email?.split('@')[0] ?? 'Astronaute'

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-base)]/75 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-[var(--text-secondary)]">
          {getGreeting()},{' '}
          <span className="font-medium text-[var(--text-primary)]">{name}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          aria-label="Rechercher"
          data-testid="topbar-search"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Rechercher</span>
          <kbd className="hidden rounded border border-[var(--border)] bg-[var(--bg-base)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] sm:inline">
            ⌘K
          </kbd>
        </button>

        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition-all hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          aria-label="Notifications"
          data-testid="topbar-notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--cyan)]" />
        </button>

        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] text-xs font-semibold text-white lg:hidden"
          aria-label="Profil"
          data-testid="topbar-avatar"
        >
          {getInitials(profile?.display_name ?? profile?.email ?? null)}
        </div>
      </div>
    </header>
  )
}
