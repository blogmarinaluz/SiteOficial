"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { br, withCoupon } from "@/lib/format";

type CartItem = {
  id: string;
  name: string;
  image?: string;
  storage?: string | number;
  color?: string;
  price?: number;
  qty: number;
};

export default function Carrinho() {
  const { items, remove, clear, total } = useCart();

  const subtotal = total();                // soma dos itens
  const totalPix = withCoupon(subtotal);   // aplica 30% OFF (PIX) – ajuste em lib/format se quiser outro %.
  const desconto = Math.max(0, subtotal - totalPix);

  return (
    <div className="container p-6 grid md:grid-cols-[2fr,1fr] gap-8">
      {/* COLUNA ESQUERDA — ITENS */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Carrinho</h1>

        {!items.length ? (
          <div className="rounded-2xl border p-6 text-zinc-600">
            Seu carrinho está vazio.{" "}
            <Link href="/" className="text-accent underline">
              Voltar e escolher produtos
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border divide-y">
            {items.map((it: CartItem) => (
              <div key={it.id} className="flex items-center gap-4 p-4">
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-16 h-16 rounded object-cover bg-zinc-100"
                />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-zinc-500">
                    {it.color ? `${it.color} • ` : ""}
                    {it.storage ? `${it.storage}GB • ` : ""}
                    {it.qty}x
                  </div>
                </div>
                <div className="text-sm whitespace-nowrap">
                  {br((it.price || 0) * it.qty)}
                </div>
                <button
                  className="text-xs text-red-600 underline ml-2"
                  onClick={() => remove(it.id)}
                  aria-label="Remover item"
                >
                  remover
                </button>
              </div>
            ))}
          </div>
        ))}

        {items.length > 0 && (
          <div className="mt-4 flex gap-3">
            <Link href="/checkout" className="btn-primary">
              Finalizar pedido
            </Link>
            <button className="btn-outline" onClick={clear}>
              Limpar carrinho
            </button>
            <Link className="btn-outline" href="/">
              Continuar comprando
            </Link>
          </div>
        )}
      </div>

      {/* COLUNA DIREITA — RESUMO */}
      <aside className="border rounded-2xl p-4 h-fit sticky top-6">
        <h2 className="font-semibold mb-3">Resumo</h2>

        {!items.length ? (
          <div className="text-sm text-zinc-500">
            Adicione produtos para ver o resumo da compra.
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <b>{br(subtotal)}</b>
            </div>

            {/* AQUI ESTÁ O FRETE GRÁTIS */}
            <div className="flex justify-between text-green-600">
              <span>Frete</span>
              <b>Grátis</b>
            </div>

            <div className="flex justify-between">
              <span>Cupom 30% OFF (PIX)</span>
              <b>-{br(desconto)}</b>
            </div>

            <hr className="my-1" />

            <div className="flex justify-between text-base">
              <span>Total no PIX</span>
              <b>{br(totalPix)}</b>
            </div>
            <div className="text-xs text-zinc-500">
              No cartão: {br(subtotal)} em até 10x sem juros.
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
