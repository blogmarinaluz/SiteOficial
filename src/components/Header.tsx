"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/useCart";

/**
 * Header completo
 * - Top bar: título promo (esq) / contagem regressiva (centro) / cupom (dir)
 * - Tagline alinhada à esquerda
 * - Linha principal: logo / busca / ações (Entrar + Carrinho)
 * - Nav secundária com alinhamento estável
 *
 * Observações:
 * - Sem dependências externas (ícones via SVG inline).
 * - Contagem regressiva: guarda um "deadline" no localStorage por 7 dias a partir do primeiro acesso.
 * - Caso queira usar um código de cupom real, defina NEXT_PUBLIC_COUPON_CODE; se não, mostramos só "30% OFF no site inteiro".
 */

type Remain = { d: number; h: number; m: number; s: number };

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function usePromoCountdown() {
  const [remain, setRemain] = useState<Remain>({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const key = "promo_deadline";
    const now = Date.now();
    const saved = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    let deadline = saved ? Number(saved) : 0;

    if (!deadline || Number.isNaN(deadline) || deadline < now) {
      // 7 dias a partir de agora
      deadline = now + 7 * 24 * 60 * 60 * 1000;
      try {
        localStorage.setItem(key, String(deadline));
      } catch {}
    }

    const calc = () => {
      const diff = Math.max(0, deadline - Date.now());
      const s = Math.floor(diff / 1000);
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      setRemain({ d, h, m, s: sec });
    };

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return remain;
}

/* Ícones SVG */
const IconUser = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.761-3.582-5-8-5Z" fill="currentColor"/>
  </svg>
);

const IconCart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M7 4h-2a1 1 0 1 0 0 2h1.28l1.6 8A3 3 0 0 0 10.83 17h5.84a3 3 0 0 0 2.94-2.37l1-4.63A1 1 0 0 0 19.66 9h-11l-.49-3A2 2 0 0 0 7 4Zm2 16a1.5 1.5 0 1 0-1.5-1.5A1.5 1.5 0 0 0 9 20Zm9 0a1.5 1.5 0 1 0-1.5-1.5A1.5 1.5 0 0 0 18 20Z" fill="currentColor"/>
  </svg>
);

const IconSearch = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M10.5 3a7.5 7.5 0 1 0 4.74 13.35l4.2 4.21a1 1 0 1 0 1.42-1.42l-4.21-4.2A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1-5.5 5.5A5.5 5.5 0 0 1 10.5 5Z" fill="currentColor"/>
  </svg>
);

export default function Header() {
  const { count, items } = useCart();
  const cartCount = useMemo(() => (typeof count === "number" ? count : items?.length ?? 0), [count, items]);
  const couponCode = process.env.NEXT_PUBLIC_COUPON_CODE || "";

  const remain = usePromoCountdown();

  const CountdownItem = ({ label, value }: { label: string; value: string }) => (
    <div className="min-w-[58px] rounded-xl bg-white/10 px-2 py-1 text-center backdrop-blur-sm">
      <div className="text-lg font-semibold text-white leading-none">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-white/80">{label}</div>
    </div>
  );

  return (
    <header className="w-full border-b border-neutral-100">
      {/* TOP BAR */}
      <div className="w-full bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-3 py-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            {/* ESQUERDA: Título */}
            <div className="flex sm:justify-start justify-center">
              <div className="inline-flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm sm:text-base font-semibold tracking-wide text-white">
                  SEMANA DE PREÇOS BAIXOS
                </span>
              </div>
            </div>

            {/* CENTRO: Countdown */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <CountdownItem label="dias" value={String(remain.d)} />
                <span className="text-white/60">:</span>
                <CountdownItem label="horas" value={pad2(remain.h)} />
                <span className="text-white/60">:</span>
                <CountdownItem label="min" value={pad2(remain.m)} />
                <span className="text-white/60">:</span>
                <CountdownItem label="seg" value={pad2(remain.s)} />
              </div>
            </div>

            {/* DIREITA: Cupom */}
            <div className="flex sm:justify-end justify-center">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-600/15 text-emerald-300 border border-emerald-400/30 px-3 py-1 text-xs sm:text-sm font-medium">
                  30% OFF no site inteiro
                </span>
                {couponCode ? (
                  <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs sm:text-sm font-semibold text-white shadow-sm">
                    CUPOM: {couponCode}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAGLINE alinhada à ESQUERDA */}
      <div className="bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-xs sm:text-sm text-neutral-600">
            Especialista em celulares novos com garantia!
          </p>
        </div>
      </div>

      {/* LINHA PRINCIPAL: logo / busca / ações */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <span className="text-2xl font-extrabold select-none">
                <span className="text-neutral-900">pro</span>
                <span className="text-emerald-600">Store</span>
              </span>
            </Link>

            {/* Busca */}
            <form action="/buscar" className="flex-1">
              <div className="flex items-stretch rounded-2xl border border-neutral-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/30 overflow-hidden">
                <input
                  name="q"
                  placeholder="Buscar por modelo, cor, armazenamento..."
                  className="w-full px-4 py-2.5 text-sm outline-none placeholder:text-neutral-400"
                  defaultValue=""
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-emerald-600 px-4 py-2.5 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  <IconSearch className="h-4 w-4" />
                  Buscar
                </button>
              </div>
            </form>

            {/* Ações: Entrar / Carrinho */}
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <Link
                href="/entrar"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <IconUser className="h-5 w-5 text-emerald-600" />
                Entrar
              </Link>

              <Link
                href="/carrinho"
                className="relative inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <IconCart className="h-5 w-5 text-emerald-600" />
                <span>Carrinho</span>
                {cartCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center rounded-full bg-emerald-600 px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Navegação secundária */}
          <nav className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-700">
            <Link className="hover:text-neutral-900" href="/categoria/apple">iPhone</Link>
            <Link className="hover:text-neutral-900" href="/categoria/samsung">Samsung</Link>
            <Link className="hover:text-neutral-900" href="/mais-buscados">Mais buscados</Link>
            <Link className="hover:text-neutral-900" href="/ofertas">BBB do dia</Link>
            <Link className="hover:text-neutral-900" href="/ofertas">Ofertas em destaque</Link>

            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/analise-de-cadastro"
                className="inline-flex items-center rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
              >
                Análise de Boleto
              </Link>
              <Link
                href="/checkout"
                className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
              >
                Checkout
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
