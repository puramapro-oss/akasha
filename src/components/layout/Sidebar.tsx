'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MessageSquare, Wrench, Bot, Store, Zap, Film, Users,
  BarChart3, Gamepad2, Plug, Settings, ChevronLeft, ChevronRight,
  LogOut,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const NAV_ITEMS = [
  { href: '/dashboard/chat', icon: MessageSquare, label: 'Chat IA' },
  { href: '/dashboard/tools', icon: Wrench, label: 'Outils (47+)' },
  { href: '/dashboard/agents', icon: Bot, label: 'Mes Agents' },
  { href: '/dashboard/marketplace', icon: Store, label: 'Marketplace' },
  { href: '/dashboard/automation', icon: Zap, label: 'Automatisation' },
  { href: '/dashboard/studio', icon: Film, label: 'Studio Creatif' },
  { href: '/dashboard/collab', icon: Users, label: 'Collaboration' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/xp', icon: Gamepad2, label: 'XP & Badges' },
  { href: '/dashboard/api', icon: Plug, label: 'API Console' },
  { href: '/dashboard/settings', icon: Settings, label: 'Parametres' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-[var(--border)] bg-[var(--bg-nebula)] transition-all duration-300 lg:flex',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex h-16 items-center border-b border-[var(--border)] px-4', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && (
          <span className="gradient-text font-[family-name:var(--font-display)] text-xl font-bold">
            AKASHA
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] transition-colors"
          aria-label={collapsed ? 'Agrandir la sidebar' : 'Reduire la sidebar'}
          data-testid="sidebar-toggle"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              data-testid={`nav-${href.split('/').pop()}`}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                collapsed ? 'justify-center' : '',
                active
                  ? 'bg-[var(--cyan)]/10 text-[var(--cyan)]'
                  : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-[var(--border)] p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] text-sm font-semibold text-white">
              {getInitials(profile?.display_name ?? profile?.email ?? null)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                {profile?.display_name ?? profile?.email ?? 'Utilisateur'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Niv. {profile?.level ?? 1}
              </p>
            </div>
            <button
              onClick={signOut}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
              aria-label="Se deconnecter"
              data-testid="logout-sidebar"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] text-sm font-semibold text-white">
              {getInitials(profile?.display_name ?? profile?.email ?? null)}
            </div>
            <button
              onClick={signOut}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
              aria-label="Se deconnecter"
              data-testid="logout-sidebar"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
