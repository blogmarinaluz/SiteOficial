"use client";

import { ReactNode, useMemo, useState } from "react";
import useCart from "@/hooks/useCart";
import Link from "next/link";

export default function CartMini({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { items, add, remove, clear } = useCart();

  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.price * i.qty, 0),
    [items]
  );

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />

          <aside className="absolute right-0 top-0 h-full w-[92%] sm:w-[420px] bg-white shadow-xl flex flex-col">
            <header className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg">Seu carrinho</h3>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-900">✕</button>
            </header>

            <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
              {items.length === 0 && (
                <p className="text-sm text-zinc-500">Seu carrinho está vazio.</p>
              )}
              {items.map((i) => (
                <div key={i.id} className="flex gap-3">
                  <img src={i.image} alt={i.name} className="w-16 h-16 object-contain border rounded-lg" />
                  <div className="flex-1">
                    <div className="font-medium">{i.name}</div>
                    <div className="text-sm text-zinc-500">Qtd: {i.qty}</div>
                    <div className="text-sm font-semibold">R$ {(i.price * i.qty).toFixed(2).replace(".", ",")}</div>
                  </div>
                  <button
                    onClick={() => remove(i.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    remover
                  </button>
                </div>
              ))}
            </div>

            <footer className="p-4 border-t">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-600">Subtotal</span>
                <b>R$ {subtotal.toFixed(2).replace(".", ",")}</b>
              </div>

              {/* resumo simples com frete grátis quando todos os itens tiverem essa flag (seu hook guarda os itens completos) */}
              {items.length > 0 && items.every((i: any) => i.freeShipping) && (
                <div className="mb-2 text-sm text-emerald-600">Frete: <b>Grátis</b></div>
              )}

              <div className="flex gap-2">
                <Link
                  href="/checkout"
                  className="flex-1 bg-[#4b4bfb] text-white rounded-xl px-3 py-2 text-center font-medium"
                  onClick={() => setOpen(false)}
                >
                  Finalizar compra
                </Link>
                <button
                  onClick={() => clear()}
                  className="px-3 py-2 rounded-xl border text-zinc-700"
                >
                  Limpar
                </button>
              </div>
            </footer>
          </aside>
        </div>
      )}
    </>
  );
}
