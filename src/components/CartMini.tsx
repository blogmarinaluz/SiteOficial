"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";

type CartItem = {
  id: string;
  name: string;
  image?: string;
  price?: number;
  freeShipping?: boolean;
  qty: number;
  color?: string;
  storage?: string | number;
};

// normaliza caminho para sempre começar com "/"
function normalizeSrc(src?: string): string {
  if (!src) return "/";
  return src.startsWith("/") ? src : `/${src}`;
}
function isJfif(src: string): boolean {
  return /\.jfif($|\?|\#)/i.test(src);
}

export default function CartMini() {
  const [open, setOpen] = useState(false);

  const {
    items,
    increase,
    decrease,
    remove,
    clear,
  } = useCart();

  const count = useMemo(
    () => (items ?? []).reduce((acc, i) => acc + (i.qty || 0), 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      (items ?? []).reduce((acc, i) => {
        const p = Number(i.price || 0);
        const q = Number(i.qty || 0);
        return acc + p * q;
      }, 0),
    [items]
  );

  // mesma lógica do site (30% OFF em boleto/pix)
  const desconto = subtotal * 0.3;
  const total = subtotal - desconto;

  const allFreeShipping = useMemo(
    () => (items ?? []).length > 0 && (items ?? []).every((i) => !!i.freeShipping),
    [items]
  );

  const close = () => setOpen(false);

  return (
    <div>
      {/* Botão que abre o mini-carrinho */}
      <button
        onClick={() => setOpen(true)}
        className="relative inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        aria-label="Abrir mini carrinho"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600" aria-hidden="true">
          <path d="M7 4h-2a1 1 0 1 0 0 2h1.28l1.6 8A3 3 0 0 0 10.83 17H17a1 1 0 1 0 0-2h-6.17a1 1 0 0 1-.98-.8L9.6 12H17a2 2 0 0 0 1.94-1.52l1.16-4.66A1 1 0 0 0 19.13 4H7Zm11 16a1.5 1.5 0 1 1-1.5-1.5A1.5 1.5 0 0 1 18 20Zm-9.5-1.5A1.5 1.5 0 1 0 10 20a1.5 1.5 0 0 0-1.5-1.5Z" fill="currentColor"/>
        </svg>
        <span>Carrinho</span>
        {count > 0 && (
          <span className="ml-1 inline-flex items-center justify-center rounded bg-emerald-600 px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
            {count}
          </span>
        )}
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-[60]">
          {/* fundo */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
            onClick={close}
            aria-hidden="true"
          />
          {/* painel */}
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            {/* header */}
            <div className="flex items-center justify-between border-b border-neutral-100 p-4">
              <div className="text-base font-semibold">Seu carrinho</div>
              <button
                onClick={close}
                className="rounded-lg p-1.5 hover:bg-neutral-100"
                aria-label="Fechar"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6 6.4 5Z" fill="currentColor"/>
                </svg>
              </button>
            </div>

            {/* itens */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {items && items.length > 0 ? (
                <ul className="space-y-3">
                  {items.map((i: CartItem) => {
                    const src = normalizeSrc(i.image);
                    return (
                      <li key={i.id} className="flex gap-3 border border-neutral-100 rounded-xl p-2">
                        {/* === MINI CARD DA IMAGEM (mantém tamanho) === */}
                        <div className="relative h-16 w-16 shrink-0 rounded-lg bg-neutral-50 border border-neutral-100 overflow-hidden">
                          {i.image ? (
                            <Image
                              src={src}
                              alt={i.name}
                              fill
                              className="object-contain"
                              sizes="64px"
                              unoptimized={isJfif(src)}
                            />
                          ) : null}
                        </div>

                        {/* info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-neutral-900">{i.name}</p>
                              {(i.color || i.storage) && (
                                <p className="mt-0.5 text-xs text-neutral-500">
                                  {i.color ? <span>Cor: {i.color}</span> : null}
                                  {i.color && i.storage ? <span> • </span> : null}
                                  {i.storage ? <span>Armazenamento: {i.storage}</span> : null}
                                </p>
                              )}
                              {i.freeShipping && (
                                <p className="mt-0.5 text-[11px] font-semibold text-emerald-700">
                                  Frete grátis
                                </p>
                              )}
                              <p className="mt-1 text-sm font-semibold text-neutral-900">
                                {Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                  maximumFractionDigits: 2,
                                }).format((i.price || 0))}
                              </p>
                            </div>

                            {/* ações unitárias */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => decrease(i.id)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                                aria-label="Diminuir"
                              >
                                −
                              </button>
                              <span className="w-6 text-center text-sm font-medium">{i.qty}</span>
                              <button
                                onClick={() => increase(i.id)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                                aria-label="Aumentar"
                              >
                                +
                              </button>

                              <button
                                onClick={() => remove(i.id)}
                                className="ml-2 rounded p-1.5 text-neutral-500 hover:bg-neutral-100"
                                aria-label="Remover item"
                                title="Remover item"
                              >
                                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                                  <path d="M9 3h6a1 1 0 0 1 1 1v1h4a1 1 0 1 1 0 2h-1l-1 12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3L4 7H3a1 1 0 1 1 0-2h4V4a1 1 0 0 1 1-1Zm1 2v1h4V5h-4Zm-2 4a1 1 0 1 1 2 0v9a1 1 0 1 1-2 0V9Zm6 0a1 1 0 1 1 2 0v9a1 1 0 1 1-2 0V9Z" fill="currentColor"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-sm text-neutral-600">Seu carrinho está vazio.</div>
              )}
            </div>

            {/* resumo */}
            <div className="border-t border-neutral-100 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium text-neutral-900">
                  {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-neutral-600">Cupom (30% OFF)</span>
                <span className="font-medium text-emerald-700">
                  − {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(desconto)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>
                  {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}
                </span>
              </div>

              {allFreeShipping && (
                <div className="mt-2 text-xs font-medium text-emerald-700">Frete grátis</div>
              )}

              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  onClick={() => { clear(); }}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Limpar
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href="/carrinho"
                    onClick={close}
                    className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                  >
                    Ver carrinho
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Finalizar
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
