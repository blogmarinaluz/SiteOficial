"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";

function br(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function withCoupon(n: number) {
  // 30% OFF no carrinho
  return Math.round(n * 0.7);
}

const SELLER_NUMBER =
  process.env.NEXT_PUBLIC_SELLER_NUMBER || "55999984905715";

export default function CarrinhoPage() {
  const { items, add, decrease, remove, clear } = useCart();
  const [sending, setSending] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + (it.price || 0) * it.qty, 0),
    [items]
  );
  const totalComCupom = useMemo(() => withCoupon(subtotal), [subtotal]);
  const desconto = Math.max(0, subtotal - totalComCupom);

  // Frete grátis somente se TODOS os itens forem freeShipping
  const freteGratis = useMemo(
    () => items.length > 0 && items.every((i) => i.freeShipping === true),
    [items]
  );

  const enviarWhats = async () => {
    if (!items.length) return alert("Seu carrinho está vazio.");
    setSending(true);

    const linhas: string[] = [];
    linhas.push("*Pedido — proStore*");
    linhas.push("");
    linhas.push("*Itens:*");
    items.forEach((it) => {
      linhas.push(
        `• ${it.qty}x ${it.name}${it.color ? " - " + it.color : ""}${
          it.storage ? " " + it.storage + "GB" : ""
        } — ${br((it.price || 0) * it.qty)}`
      );
    });
    linhas.push("");
    linhas.push(`Subtotal: ${br(subtotal)}`);
    linhas.push(`Cupom 30% OFF: -${br(desconto)}`);
    linhas.push(`*Total com cupom*: *${br(totalComCupom)}*`);
    linhas.push(freteGratis ? "Frete: *Grátis*" : "Frete: a combinar");
    linhas.push("");
    linhas.push(
      "_Observação: pedido gerado pelo site para finalizar no WhatsApp._"
    );

    const msg = encodeURIComponent(linhas.join("\n"));
    window.location.href = `https://api.whatsapp.com/send?phone=${SELLER_NUMBER}&text=${msg}`;
    setSending(false);
  };

  return (
    <div className="container p-6 grid md:grid-cols-[2fr,1fr] gap-8">
      {/* COLUNA ESQUERDA — ITENS */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Carrinho</h1>

        {!items.length ? (
          <div className="rounded-2xl border p-6 text-zinc-600">
            Seu carrinho está vazio.{" "}
            <Link className="text-accent underline" href="/">
              Começar a comprar
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex gap-4 items-center border rounded-2xl p-3"
              >
                <div className="w-20 h-20 relative shrink-0">
                  <Image
                    src={it.image || "/products/placeholder.jpg"}
                    alt={it.name}
                    fill
                    sizes="80px"
                    className="object-contain rounded-lg bg-white"
                  />
                </div>

                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-zinc-500">
                    {it.color ? `${it.color}` : ""}
                    {it.storage ? ` • ${it.storage}GB` : ""}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      aria-label="Diminuir"
                      onClick={() => decrease(it.id)}
                      className="px-3 py-1 rounded-lg border"
                    >
                      –
                    </button>
                    <span className="w-8 text-center">{it.qty}</span>
                    <button
                      aria-label="Aumentar"
                      onClick={() =>
                        add({
                          id: it.id,
                          name: it.name,
                          price: it.price,
                          image: it.image,
                          color: it.color,
                          storage: it.storage,
                          freeShipping: it.freeShipping,
                          qty: 1,
                        })
                      }
                      className="px-3 py-1 rounded-lg border"
                    >
                      +
                    </button>

                    <button
                      onClick={() => remove(it.id)}
                      className="ml-4 text-sm text-red-600 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-zinc-500">Preço</div>
                  <div className="font-semibold">
                    {br((it.price || 0) * it.qty)}
                  </div>
                  <div className="text-xs mt-1">
                    10x de{" "}
                    <b>
                      {br(Math.round(((it.price || 0) * it.qty) / 10))}
                    </b>{" "}
                    <i>sem juros</i>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-3">
              <button onClick={clear} className="btn-outline">
                Limpar carrinho
              </button>
              <Link href="/" className="btn-outline">
                Continuar comprando
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* COLUNA DIREITA — RESUMO */}
      <aside className="border rounded-2xl p-4 h-fit sticky top-6">
        <h2 className="font-semibold mb-3">Resumo</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <b>{br(subtotal)}</b>
          </div>

          <div className="flex justify-between">
            <span>Desconto (cupom 30%)</span>
            <b className="text-green-600">- {br(desconto)}</b>
          </div>

          <div className="flex justify-between">
            <span>Frete</span>
            <b className={freteGratis ? "text-green-600" : ""}>
              {freteGratis ? "Grátis" : "a combinar"}
            </b>
          </div>

          <div className="h-px bg-zinc-200 my-2" />

          <div className="flex justify-between text-base">
            <span>Total</span>
            <b>{br(totalComCupom)}</b>
          </div>

          <div className="text-xs text-zinc-500">
            *Pagamento e envio finalizados no WhatsApp.
          </div>
        </div>

        <button
          onClick={enviarWhats}
          disabled={!items.length || sending}
          className="btn-primary w-full mt-4"
        >
          {sending ? "Abrindo WhatsApp..." : "Finalizar no WhatsApp"}
        </button>
      </aside>
    </div>
  );
}
