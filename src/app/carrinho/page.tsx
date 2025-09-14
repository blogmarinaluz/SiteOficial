"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

function br(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function withPix(n: number) {
  return Math.round(n * 0.85); // 15% OFF no PIX
}

export default function Carrinho() {
  const { items, remove, setQty, clear, total } = useCart();
  const subtotal = total();
  const totalPix = withPix(subtotal);

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Carrinho</h1>

      {items.length === 0 ? (
        <p>
          Seu carrinho está vazio.{" "}
          <Link href="/" className="text-accent underline">
            Voltar às ofertas
          </Link>
        </p>
      ) : (
        <div className="grid md:grid-cols-[2fr,1fr] gap-8">
          {/* LISTA DE ITENS */}
          <div className="space-y-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex gap-4 items-center border rounded-2xl p-3"
              >
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-20 h-20 rounded object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-zinc-500">
                    {it.color} {it.storage ? `• ${it.storage}GB` : ""}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="btn-outline px-3"
                      onClick={() => setQty(it.id, Math.max(0, it.qty - 1))}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{it.qty}</span>
                    <button
                      className="btn-outline px-3"
                      onClick={() => setQty(it.id, it.qty + 1)}
                    >
                      +
                    </button>
                    <button
                      className="btn text-red-600"
                      onClick={() => remove(it.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>

                <div className="text-sm">
                  {br((it.price || 0) * it.qty)}
                </div>
              </div>
            ))}

            <button className="btn-outline" onClick={clear}>
              Esvaziar carrinho
            </button>
          </div>

          {/* RESUMO */}
          <aside className="border rounded-2xl p-4 h-fit sticky top-6">
            <h2 className="font-semibold mb-3">Resumo</h2>
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <b>{br(subtotal)}</b>
            </div>
            <div className="flex justify-between text-sm">
              <span>PIX (15% OFF)</span>
              <b>{br(totalPix)}</b>
            </div>

            <Link href="/checkout" className="btn-primary mt-4 block text-center">
              Finalizar no WhatsApp
            </Link>
            <Link href="/" className="btn-outline mt-2 block text-center">
              Continuar comprando
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
