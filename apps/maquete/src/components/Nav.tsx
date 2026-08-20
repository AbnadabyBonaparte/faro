'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

const ITENS = [
  { href: '/', rotulo: 'Início' },
  { href: '/teses', rotulo: 'Teses' },
  { href: '/fila', rotulo: 'Fila' },
  { href: '/watch', rotulo: 'Watch' },
  { href: '/painel', rotulo: 'Painel da tese' },
  { href: '/fontes', rotulo: 'Fontes' },
  { href: '/diario', rotulo: 'Diário' },
  { href: '/precos', rotulo: 'Preços' },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4">
        {ITENS.map((i) => {
          const ativo =
            i.href === '/'
              ? pathname === '/'
              : pathname === i.href || pathname.startsWith(`${i.href}/`)
          return (
            <Link
              key={i.href}
              href={i.href}
              aria-current={ativo ? 'page' : undefined}
              className={cn(
                'shrink-0 border-b-2 px-3 py-2.5 text-xs whitespace-nowrap transition-colors',
                ativo
                  ? 'border-signal text-signal'
                  : 'border-transparent text-text-secondary hover:text-text',
              )}
            >
              {i.rotulo}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
