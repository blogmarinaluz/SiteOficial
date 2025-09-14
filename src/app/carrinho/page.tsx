"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  image?: string;
  price?: number;
  qty: number;
  color?: string;
  storage?: string | number;
  freeShipping?: boolean;
};

const br = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const with30off = (n: number) => Math.round(n * 0.7); // 30% OFF no carrinho

const SELLER_NUMBER =
  process.env.NEXT_PUBLIC_SELLER_NUMBER || "55999984905715";

export default function CarrinhoPage() {
  const { items, add, remove, clear, decrease } = useCart();
  const [sending, setSending] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + (it.price ?? 0) * (it.qty ?? 1), 0),
    [items]
  );
  const totalComCupom = useMemo(() => with30off(subtotal), [subtotal]);
  const desconto = Math.max(0, subtotal - totalComCupom);

  // Frete: grátis somente se TODOS os itens do carrinho forem freeShipping
  const freteGratis = useMemo(
    () => items.length > 0 && items.every((i) => i.freeShipping),
    [items]
  );

  async function finalizarWhatsApp() {
    if (!items.length) return alert("Seu carrinho está vazio.");

    setSending(true);
    try {
      const linhas: string[] = [];
      linhas.push("*Pedido proStore*");
      linhas.push("");
      linhas.push("*Itens:*");
      items.forEach((it) => {
        const obs =
          (it.color ? ` ${it.color}` : "") +
          (it.storage ? ` ${it.storage}GB` : "");
        linhas.push(
          `• ${it.qty}x ${it.name}${obs} — ${br((it.price ?? 0) * it.qty)}`
        );
      });
      linhas.push("");
      linhas.push(`Subtotal: ${br(subtotal)}`);
      linhas.push(`Cupom 30% OFF: -${br(desconto)}`);
      linhas.push(
        `Frete: ${freteGratis ? "*Grátis*" : "A combinar no atendimento"}`
      );
      linhas.push(`Total com cupom: *${br(totalComCupom)}*`);
      linhas.push("");
      linhas.push(
        "_Obs.: finalizei o pedido no site e gostaria de concluir pelo WhatsApp._"
      );

      const msg = encodeURIComponent(linhas.join("\n"));
      const url = `https://api.whatsapp.com/send?phone=${SELLER_NUMBER}&text=${msg}`;
      window.location.href = url;
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container p-6 grid md:grid-cols-[2fr,1fr] gap-8">
      {/* COLUNA ESQUERDA — ITENS */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Carrinho</h1>

        {!items.length ? (
          <div className="border rounded-2xl p-6 text-center text-zinc-600">
            Seu carrinho está vazio.{" "}
            <Link className="text-indigo-600 font-semibold" href="/">
              Voltar às ofertas
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((it: CartItem) => (
              <div
                key={it.id}
                className="flex items-center gap-4 border rounded-2xl p-3"
              >
                {/* imagem */}
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-20 h-20 object-cover rounded-lg bg-white"
                />

                {/* infos */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{it.name}</div>
                  <div className="text-xs text-zinc-500">
                    {it.color ? `${it.color} • ` : ""}
                    {it.storage ? `${it.storage}GB • ` : ""}
                    {it.freeShipping ? "Frete: Grátis" : "Frete: a combinar"}
                  </div>
                  <div className="mt-1 text-sm">{br(it.price ?? 0)}</div>
                </div>

                {/* qty */}
                <div className="flex items-center gap-2">
                  <button
                    className="btn-outline px-2"
                    aria-label="Diminuir"
                    onClick={() => decrease(it.id)}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-10 text-center">{it.qty}</div>
                  <button
                    className="btn-outline px-2"
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
                      })
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* remover */}
                <button
                  className="btn-outline"
                  aria-label="Remover"
                  onClick={() => remove(it.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover
                </button>
              </div>
            ))}

            <div className="flex gap-3">
              <Link href="/" className="btn-outline">
                Continuar comprando
              </Link>
              <button className="btn-outline" onClick={() => clear()}>
                Limpar carrinho
              </button>
            </div>
          </div>
        )}
      </div>

      {/* COLUNA DIREITA — RESUMO */}
      <aside className="border rounded-2xl p-4 h-fit sticky top-6">
        <h2 className="font-semibold mb-3">Resumo do pedido</h2>

        {!items.length ? (
          <div className="text-sm text-zinc-500">
            Adicione produtos para ver o resumo.
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <Row label="Subtotal" value={br(subtotal)} />
            <Row label="Cupom 30% OFF" value={`- ${br(desconto)}`} />
            <Row
              label="Frete"
              value={freteGratis ? "Grátis" : "A combinar no atendimento"}
              emphasize={freteGratis}
            />
            <hr className="my-2" />
            <Row
              label="Total com cupom"
              value={br(totalComCupom)}
              bold
              big
              accent
            />

            <button
              onClick={finalizarWhatsApp}
              disabled={sending}
              className="btn-primary w-full mt-3"
            >
              {sending ? "Abrindo WhatsApp…" : "Finalizar no WhatsApp"}
            </button>

            <div className="text-xs text-zinc-500 mt-3">
              *O pagamento é concluído com nosso atendente via WhatsApp. O
              desconto de 30% já foi aplicado ao total.
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  big,
  accent,
  emphasize,
}: {
  label: string;
  value: string;
  bold?: boolean;
  big?: boolean;
  accent?: boolean;
  emphasize?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline">
      <span className={`text-zinc-600 ${emphasize ? "text-emerald-600" : ""}`}>
        {label}
      </span>
      <span
        className={[
          bold ? "font-semibold" : "",
          big ? "text-lg" : "",
          accent ? "text-indigo-700" : "",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}
