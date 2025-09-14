"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

function br(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CartMini() {
  const { items, increase, decrease, remove, clear } = useCart();
  const [open, setOpen] = useState(false);

  const count = useMemo(
    () => items.reduce((n, i) => n + i.qty, 0),
    [items]
  );

  // <<<<<< CORREÇÃO AQUI: usa (i.price ?? 0) >>>>>>
  const subtotal = useMemo(
    () => items.reduce((n, i) => n + ((i.price ?? 0) * i.qty), 0),
    [items]
  );

  // Cupom 30% OFF sempre ativo
  const desconto = Math.round(subtotal * 0.30);
  const total = Math.max(0, subtotal - desconto);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-zinc-50"
        aria-label="Abrir mini carrinho"
      >
        {/* ícone carrinho (SVG inline, sem libs) */}
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0">
          <path
            d="M7 4h-2l-1 2v2h2l3.6 7.59-1.35 2.45A1 1 0 0 0 9 19h10v-2H9.42l.93-1.68h6.45a1 1 0 0 0 .9-.55l3.58-6.49A1 1 0 0 0 20.42 6H6.21l-.94-2ZM7 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 .001-3.999A2 2 0 0 0 17 22Z"
            fill="currentColor"
          />
        </svg>
        <span className="text-sm font-medium">Carrinho</span>
        {count > 0 && (
          <span className="ml-1 inline-flex items-center justify-center text-xs font-bold bg-emerald-600 text-white rounded-full w-5 h-5">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-96 max-w-[92vw] bg-white border rounded-2xl shadow-xl p-4 z-50"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Seu carrinho</h3>
            {count > 0 && (
              <button
                className="text-xs text-red-600 hover:underline"
                onClick={() => clear()}
              >
                Limpar tudo
              </button>
            )}
          </div>

          {count === 0 ? (
            <div className="text-sm text-zinc-500">Seu carrinho está vazio.</div>
          ) : (
            <>
              <div className="max-h-64 overflow-auto space-y-3 pr-1">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center gap-3 border-b pb-3 last:border-b-0"
                  >
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-14 h-14 rounded object-cover bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{it.name}</div>
                      <div className="text-[12px] text-zinc-500 truncate">
                        {it.color ? `${it.color}` : ""}
                        {it.storage ? ` • ${it.storage}GB` : ""}
                        {it.freeShipping ? " • Frete Grátis" : ""}
                      </div>
                      <div className="text-sm mt-1">{br((it.price ?? 0))}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => decrease(it.id)}
                        aria-label="Diminuir quantidade"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm">{it.qty}</span>
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => increase(it.id)}
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="text-red-500 text-xs ml-2"
                      onClick={() => remove(it.id)}
                    >
                      remover
                    </button>
                  </div>
                ))}
              </div>

              {/* Resumo */}
              <div className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <b>{br(subtotal)}</b>
                </div>
                <div className="flex justify-between">
                  <span>Cupom PRO30 (30% OFF)</span>
                  <b>- {br(desconto)}</b>
                </div>
                <div className="flex justify-between text-base border-t pt-2">
                  <span className="font-semibold">Total</span>
                  <b className="font-semibold">{br(total)}</b>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href="/checkout"
                  className="btn-primary text-center"
                  onClick={() => setOpen(false)}
                >
                  Finalizar
                </Link>
                <button
                  className="btn-outline"
                  onClick={() => setOpen(false)}
                >
                  Continuar
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
