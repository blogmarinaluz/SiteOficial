"use client";
import { useMemo, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { br } from "@/lib/format";
import Link from "next/link";

export default function CarrinhoPage() {
  const { items, add, remove, clear, decrease, increase, total } = useCart();
  const [sending, setSending] = useState(false);

  const subtotal = useMemo(() => total(), [items, total]);
  const totalPix = useMemo(() => Math.round(subtotal * 0.85), [subtotal]);
  const desconto = Math.max(0, subtotal - totalPix);

  // frete grátis somente se TODOS os itens forem freeShipping
  const freteGratis = useMemo(
    () => items.length > 0 && items.every((i) => i.freeShipping === true),
    [items]
  );

  return (
    <div className="container mx-auto px-4 py-6 grid md:grid-cols-[2fr,1fr] gap-8">
      {/* itens */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Carrinho</h1>
        {items.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.id} className="flex gap-3 items-center border rounded-2xl p-3">
                <img src={it.image} alt={it.name} className="w-20 h-20 rounded object-cover" />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-zinc-500">
                    {it.color ? `${it.color} • ` : ""}{it.storage ? `${it.storage}GB • ` : ""}{br(it.price || 0)}
                  </div>
                  {it.freeShipping && (
                    <div className="text-xs text-emerald-700">Frete: <b>Grátis</b></div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-outline px-3" onClick={() => decrease(it.id)}>-</button>
                  <div className="w-8 text-center">{it.qty}</div>
                  <button className="btn-outline px-3" onClick={() => increase(it.id)}>+</button>
                </div>
                <div className="w-24 text-right font-semibold">{br((it.price || 0) * it.qty)}</div>
                <button className="text-sm text-red-600" onClick={() => remove(it.id)}>remover</button>
              </div>
            ))}
            <div className="flex justify-between">
              <button className="btn-outline" onClick={clear}>Limpar carrinho</button>
              <Link className="btn-outline" href="/">Continuar comprando</Link>
            </div>
          </div>
        )}
      </div>

      {/* resumo */}
      <aside className="border rounded-2xl p-4 h-fit sticky top-6">
        <h2 className="font-semibold mb-3">Resumo</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><b>{br(subtotal)}</b></div>
          <div className="flex justify-between"><span>Desconto PIX (15%)</span><b>- {br(desconto)}</b></div>
          <div className="flex justify-between"><span>Frete</span><b>{freteGratis ? "Grátis" : "a calcular"}</b></div>
          <hr/>
          <div className="flex justify-between text-base"><span>Total no PIX</span><b>{br(totalPix)}</b></div>
          <div className="flex justify-between text-xs text-zinc-500">
            <span>ou no cartão (10x sem juros)</span><b>{br(subtotal)}</b>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button
            disabled={items.length === 0 || sending}
            className="btn-primary w-full"
            onClick={() => {
              if (!items.length) return;
              setSending(true);
              const linhas: string[] = [];
              linhas.push("*Pedido proStore*");
              linhas.push("");
              items.forEach((i) => {
                linhas.push(`• ${i.qty}x ${i.name} — ${br((i.price || 0) * i.qty)}`);
              });
              linhas.push("");
              linhas.push(`Total no PIX: *${br(totalPix)}*`);
              if (freteGratis) linhas.push("_Frete gratuito disponível._");
              const msg = encodeURIComponent(linhas.join("\n"));
              const phone = process.env.NEXT_PUBLIC_SELLER_NUMBER || "55999984905715";
              window.location.href = `https://api.whatsapp.com/send?phone=${phone}&text=${msg}`;
            }}
          >
            Finalizar no WhatsApp
          </button>
          <div className="text-xs text-zinc-500 text-center">
            Pagamento finalizado no WhatsApp com nosso atendente.
          </div>
        </div>
      </aside>
    </div>
  );
}
