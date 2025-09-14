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

function br(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CartMini() {
  const { items, increase, decrease, remove, clear } = useCart();
  const [open, setOpen] = useState(false);

  const count = useMemo(() => items?.reduce((n: number, i: CartItem) => n + (i.qty || 0), 0) || 0, [items]);

  const subtotal = useMemo(
    () => (items || []).reduce((n: number, i: CartItem) => n + ((i.price || 0) * (i.qty || 0)), 0),
    [items]
  );

  // Cupom global 30% OFF
  const desconto = Math.round(subtotal * 0.30);
  const total = Math.max(0, subtotal - desconto);

  const allFreeShipping = useMemo(
    () => (items || []).length > 0 && (items || []).every((i: CartItem) => !!i.freeShipping),
    [items]
  );

  const close = () => setOpen(false);

  return (
    <div className="relative">
      {/* Botão que abre o mini-carrinho */}
      <button
        onClick={() => setOpen(true)}
        className="relative inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        aria-label="Abrir mini carrinho"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600" aria-hidden="true">
          <path d="M7 4h-2a1 1 0 1 0 0 2h1.28l1.6 8A3 3 0 0 0 10.83 17h5.84a3 3 0 0 0 2.94-2.37l1-4.63A1 1 0 0 0 19.66 9h-11l-.49-3A2 2 0 0 0 7 4Zm2 16a1.5 1.5 0 1 0-1.5-1.5A1.5 1.5 0 0 0 9 20Zm9 0a1.5 1.5 0 1 0-1.5-1.5A1.5 1.5 0 0 0 18 20Z" fill="currentColor"/>
        </svg>
        <span>Carrinho</span>
        {count > 0 && (
          <span className="ml-1 inline-flex items-center justify-center rounded-full bg-emerald-600 px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
            {count}
          </span>
        )}
      </button>

      {/* Overlay + Drawer */}
      {open && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={close}
            aria-hidden="true"
          />
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Mini carrinho"
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <h3 className="text-base font-semibold text-neutral-900">Seu carrinho</h3>
              <button
                onClick={close}
                className="rounded-lg p-1.5 hover:bg-neutral-100"
                aria-label="Fechar"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M6.4 5.0 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z" fill="currentColor"/>
                </svg>
              </button>
            </div>

            {/* Lista de itens */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {items && items.length > 0 ? (
                <ul className="space-y-3">
                  {items.map((i: CartItem) => (
                    <li key={i.id} className="flex gap-3 border border-neutral-100 rounded-xl p-2">
                      <div className="relative h-16 w-16 shrink-0 rounded-lg bg-neutral-50 border border-neutral-100 overflow-hidden">
                        {i.image ? (
                          <Image
                            src={i.image.startsWith("/") ? i.image : `/import_imgs/${i.image}`}
                            alt={i.name}
                            fill
                            className="object-contain"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-neutral-900">{i.name}</p>
                            <p className="mt-0.5 text-xs text-neutral-500">
                              {i.color ? `Cor: ${i.color} • ` : ""}{i.storage ? `Armazenamento: ${i.storage}` : ""}
                            </p>
                          </div>
                          <button
                            onClick={() => remove(i.id)}
                            className="rounded-lg p-1 hover:bg-neutral-100"
                            aria-label={`Remover ${i.name}`}
                          >
                            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                              <path d="M6 7h12v2H6zm2 3h2v8H8zm6 0h2v8h-2zm-5-6h6l1 1h4v2H4V5h4z" fill="currentColor"/>
                            </svg>
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-lg border border-neutral-200">
                            <button
                              onClick={() => decrease(i.id)}
                              className="px-2 py-1 text-sm hover:bg-neutral-50"
                              aria-label={`Diminuir ${i.name}`}
                            >
                              −
                            </button>
                            <span className="w-9 text-center text-sm">{i.qty}</span>
                            <button
                              onClick={() => increase(i.id)}
                              className="px-2 py-1 text-sm hover:bg-neutral-50"
                              aria-label={`Aumentar ${i.name}`}
                            >
                              +
                            </button>
                          </div>
                          <div className="text-sm font-medium text-neutral-900">{br((i.price || 0) * (i.qty || 0))}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-neutral-600">Seu carrinho está vazio.</div>
              )}
            </div>

            {/* Resumo */}
            <div className="border-t border-neutral-100 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium text-neutral-900">{br(subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-neutral-600">Cupom (30% OFF)</span>
                <span className="font-medium text-emerald-700">− {br(desconto)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{br(total)}</span>
              </div>
              {allFreeShipping && (
                <div className="mt-2 text-xs font-medium text-emerald-700">Frete grátis</div>
              )}

              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  onClick={() => { clear(); }}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Limpar
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={close}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Continuar
                  </button>
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
