'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Wrench, Film, Store, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/dashboard/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/dashboard/tools', icon: Wrench, label: 'Outils' },
  { href: '/dashboard/studio', icon: Film, label: 'Studio' },
  { href: '/dashboard/marketplace', icon: Store, label: 'Market' },
  { href: '/dashboard/settings', icon: User, label: 'Profil' },
]

export default function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[var(--border)] bg-[var(--bg-nebula)]/90 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navigation principale"
    >
      {TABS.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            data-testid={`tab-${href.split('/').pop()}`}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors',
              active
                ? 'text-[var(--cyan)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            <Icon className={cn('h-5 w-5', active && 'drop-shadow-[0_0_6px_var(--cyan)]')} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
