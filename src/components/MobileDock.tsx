// src/components/MobileDock.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
// Opcional: badge de itens no carrinho (não quebra se o hook mudar)
let useCartSafe: any;
try { useCartSafe = require('@/hooks/useCart').useCart; } catch {}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function MobileDock() {
  const pathname = usePathname();
  const is = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  // Contagem do carrinho (se disponível)
  const count = useMemo(() => {
    try {
      if (!useCartSafe) return 0;
      const { items } = useCartSafe() as any;
      if (!Array.isArray(items)) return 0;
      return items.reduce((sum: number, it: any) => sum + (it?.quantity ?? it?.qty ?? 1), 0);
    } catch { return 0; }
  }, [useCartSafe?.toString?.()]);

  return (
    <nav
      className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 6px)' } as any}
      aria-label="Navegação inferior"
    >
      <ul className="grid grid-cols-4 text-xs">
        <li>
          <Link href="/" className={cx(
            'flex flex-col items-center justify-center py-2 gap-1',
            is('/') ? 'text-emerald-700' : 'text-zinc-600 hover:text-zinc-900'
          )}>
            <HomeIcon className="h-6 w-6" />
            <span>Home</span>
          </Link>
        </li>

        <li>
          <Link href="/ofertas" className={cx(
            'flex flex-col items-center justify-center py-2 gap-1',
            is('/ofertas') ? 'text-emerald-700' : 'text-zinc-600 hover:text-zinc-900'
          )}>
            <TagIcon className="h-6 w-6" />
            <span>Ofertas</span>
          </Link>
        </li>

        <li>
          <Link href="/buscar" className={cx(
            'flex flex-col items-center justify-center py-2 gap-1',
            is('/buscar') ? 'text-emerald-700' : 'text-zinc-600 hover:text-zinc-900'
          )}>
            <SearchIcon className="h-6 w-6" />
            <span>Buscar</span>
          </Link>
        </li>

        <li className="relative">
          <Link href="/carrinho" className={cx(
            'flex flex-col items-center justify-center py-2 gap-1',
            is('/carrinho') ? 'text-emerald-700' : 'text-zinc-600 hover:text-zinc-900'
          )}>
            <CartIcon className="h-6 w-6" />
            <span>Carrinho</span>
          </Link>

          {count > 0 && (
            <span
              aria-label={`${count} itens no carrinho`}
              className="absolute right-4 top-0 -translate-y-1/2 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[11px] leading-[18px] text-center"
            >
              {count > 99 ? '99+' : count}
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

function HomeIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z" />
    </svg>
  );
}
function TagIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M10.4 2L2 10.4V22h11.6L22 13.6 10.4 2zM7 13a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  );
}
function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M10 18a8 8 0 110-16 8 8 0 010 16zm11 3l-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
function CartIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7 4H4L2 8h2l3.6 7.6-1.2 2.4c-.3.6.1 1.3.8 1.3H20v-2H8.8l.9-1.8H18c.8 0 1.5-.4 1.8-1.1l3-6.1c.2-.4 0-.8-.4-1H6.5L5.7 4zM7 22a2 2 0 110-4 2 2 0 010 4zm12 0a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  );
}
