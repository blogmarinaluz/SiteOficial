"use client";

import { useEffect, useMemo, useState } from "react";
import useCart, { CartItem } from "@/hooks/useCart";

type Form = {
  nome: string;
  cpf: string;
  whats: string;
  email: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  pagamento: "PIX" | "Cartão";
};

const SELLER_NUMBER =
  process.env.NEXT_PUBLIC_SELLER_NUMBER || "55999984905715"; // ex: 5585999999999
const COUPON_LABEL = "PRO30";
const COUPON_OFF = 0.30; // 30% OFF no site inteiro

function br(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CheckoutPage() {
  const { items, increase, decrease, remove, clear } = useCart();
  const [sending, setSending] = useState(false);
  const [f, setF] = useState<Form>({
    nome: "",
    cpf: "",
    whats: "",
    email: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    pagamento: "PIX",
  });

  // subtotal SEM desconto (corrigido p/ price opcional)
  const subtotal = useMemo(
    () => items.reduce((n, i) => n + ((i.price ?? 0) * i.qty), 0),
    [items]
  );

  // Cupom 30% OFF
  const desconto = useMemo(() => Math.round(subtotal * COUPON_OFF), [subtotal]);
  const total = useMemo(() => Math.max(0, subtotal - desconto), [subtotal, desconto]);

  // Frete grátis se TODOS os itens forem freeShipping
  const freteGratis = useMemo(
    () => items.length > 0 && items.every((i) => i.freeShipping === true),
    [items]
  );

  // CEP -> viaCEP (auto-preenchimento)
  useEffect(() => {
    const rawCep = (f.cep || "").replace(/\D/g, "");
    if (rawCep.length !== 8) return;

    let aborted = false;
    (async () => {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const json = await res.json();
        if (aborted || json.erro) return;
        setF((old) => ({
          ...old,
          endereco: json.logradouro || old.endereco,
          bairro: json.bairro || old.bairro,
          cidade: json.localidade || old.cidade,
          uf: json.uf || old.uf,
        }));
      } catch {
        // silencioso
      }
    })();

    return () => {
      aborted = true;
    };
  }, [f.cep]);

  function onChange<K extends keyof Form>(k: K, v: Form[K]) {
    setF((old) => ({ ...old, [k]: v }));
  }

  function toWhatsApp() {
    if (items.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }
    setSending(true);

    const linhas: string[] = [];
    linhas.push("*Pedido — proStore*");
    linhas.push(`*Cliente:* ${f.nome || "-"}`);
    linhas.push(`CPF: ${f.cpf || "-"}`);
    linhas.push(`WhatsApp: ${f.whats || "-"}`);
    linhas.push(`E-mail: ${f.email || "-"}`);
    linhas.push(
      `Endereço: ${f.endereco || "-"}, Nº ${f.numero || "-"}${
        f.complemento ? " - " + f.complemento : ""
      }`
    );
    linhas.push(`Bairro: ${f.bairro || "-"} - ${f.cidade || "-"} / ${f.uf || "-"}`);
    linhas.push(`CEP: ${f.cep || "-"}`);
    linhas.push("");
    linhas.push("*Itens:*");
    items.forEach((it) => {
      const price = (it.price ?? 0);
      linhas.push(
        `• ${it.qty}x ${it.name}${it.color ? " - " + it.color : ""}${
          it.storage ? " " + it.storage + "GB" : ""
        } — ${br(price * it.qty)}`
      );
    });
    linhas.push("");

    linhas.push(`Subtotal: ${br(subtotal)}`);
    linhas.push(`Cupom ${COUPON_LABEL} (30% OFF): -${br(desconto)}`);
    freteGratis
      ? linhas.push(`Frete: *Grátis*`)
      : linhas.push(`Frete: a combinar (calculado no WhatsApp)`);
    linhas.push(`*Total com desconto: ${br(total)}*`);
    linhas.push("");
    linhas.push(`Forma de pagamento preferida: ${f.pagamento}`);
    linhas.push("");
    linhas.push(`_Obs.: pedido enviado via site para finalizar no WhatsApp._`);

    const msg = encodeURIComponent(linhas.join("\n"));
    const link = `https://api.whatsapp.com/send?phone=${SELLER_NUMBER}&text=${msg}`;

    // redireciona
    window.location.href = link;
    setSending(false);
  }

  return (
    <div className="container p-6 grid md:grid-cols-[2fr,1fr] gap-8">
      {/* COLUNA ESQUERDA — ITENS & DADOS */}
      <div>
        <h1 className="text-2xl font-extrabold mb-4">Finalizar pedido</h1>

        {/* ITENS */}
        <section className="border rounded-2xl p-4 mb-6">
          <h2 className="font-semibold mb-3">Seus itens</h2>
          {items.length === 0 ? (
            <div className="text-sm text-zinc-500">Seu carrinho está vazio.</div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="flex gap-3 items-center border-b pb-3">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-16 h-16 rounded object-cover bg-white"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-zinc-500">
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
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{it.qty}</span>
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => increase(it.id)}
                    >
                      +
                    </button>
                  </div>
                  <div className="w-24 text-right font-medium">
                    {br((it.price ?? 0) * it.qty)}
                  </div>
                  <button
                    className="text-red-500 text-sm ml-2"
                    onClick={() => remove(it.id)}
                  >
                    remover
                  </button>
                </div>
              ))}
              <div className="text-right">
                <button className="btn-outline text-sm" onClick={clear}>
                  Limpar carrinho
                </button>
              </div>
            </div>
          )}
        </section>

        {/* DADOS DO CLIENTE */}
        <section className="border rounded-2xl p-4 mb-6">
          <h2 className="font-semibold mb-3">Seus dados</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="Nome completo"
              value={f.nome}
              onChange={(e) => onChange("nome", e.target.value)}
            />
            <input
              className="input"
              placeholder="CPF"
              value={f.cpf}
              onChange={(e) => onChange("cpf", e.target.value)}
            />
            <input
              className="input"
              placeholder="WhatsApp (DDD+Número)"
              value={f.whats}
              onChange={(e) => onChange("whats", e.target.value)}
            />
            <input
              className="input"
              placeholder="E-mail"
              value={f.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </div>
        </section>

        {/* ENDEREÇO */}
        <section className="border rounded-2xl p-4 mb-6">
          <h2 className="font-semibold mb-3">Endereço</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <input
              className="input"
              placeholder="CEP"
              value={f.cep}
              onChange={(e) => onChange("cep", e.target.value)}
            />
            <input
              className="input sm:col-span-2"
              placeholder="Endereço"
              value={f.endereco}
              onChange={(e) => onChange("endereco", e.target.value)}
            />
            <input
              className="input"
              placeholder="Número"
              value={f.numero}
              onChange={(e) => onChange("numero", e.target.value)}
            />
            <input
              className="input sm:col-span-2"
              placeholder="Complemento"
              value={f.complemento}
              onChange={(e) => onChange("complemento", e.target.value)}
            />
            <input
              className="input"
              placeholder="Bairro"
              value={f.bairro}
              onChange={(e) => onChange("bairro", e.target.value)}
            />
            <input
              className="input"
              placeholder="Cidade"
              value={f.cidade}
              onChange={(e) => onChange("cidade", e.target.value)}
            />
            <input
              className="input"
              placeholder="UF"
              value={f.uf}
              onChange={(e) => onChange("uf", e.target.value)}
            />
          </div>
        </section>

        {/* PAGAMENTO */}
        <section className="border rounded-2xl p-4 mb-6">
          <h2 className="font-semibold mb-3">Pagamento</h2>
          <div className="flex gap-3">
            <button
              className={`btn ${f.pagamento === "PIX" ? "btn-primary" : "btn-outline"}`}
              onClick={() => onChange("pagamento", "PIX")}
            >
              PIX
            </button>
            <button
              className={`btn ${f.pagamento === "Cartão" ? "btn-primary" : "btn-outline"}`}
              onClick={() => onChange("pagamento", "Cartão")}
            >
              Cartão (até 10x)
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Cupom <b>{COUPON_LABEL}</b> (30% OFF) já aplicado ao total.
          </p>
        </section>

        <div className="flex gap-3">
          <button className="btn-primary" onClick={toWhatsApp} disabled={sending || items.length === 0}>
            Finalizar no WhatsApp
          </button>
          <button className="btn-outline" onClick={clear}>Limpar carrinho</button>
        </div>
      </div>

      {/* COLUNA DIREITA — RESUMO */}
      <aside className="border rounded-2xl p-4 h-fit sticky top-6">
        <h2 className="font-semibold mb-3">Resumo</h2>
        {items.length === 0 ? (
          <div className="text-sm text-zinc-500">Seu carrinho está vazio.</div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="flex gap-3 items-center border-b pb-3">
                <img src={it.image} alt={it.name} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1">
                  <div className="text-sm">{it.name}</div>
                  <div className="text-xs text-zinc-500">
                    {it.color ? `${it.color}` : ""}
                    {it.storage ? ` • ${it.storage}GB` : ""}
                    {it.freeShipping ? " • Frete Grátis" : ""}
                    {" • "}{it.qty}x
                  </div>
                </div>
                <div className="text-sm">{br((it.price ?? 0) * it.qty)}</div>
              </div>
            ))}

            <div className="flex justify-between text-sm pt-2">
              <span>Subtotal</span>
              <b>{br(subtotal)}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Cupom {COUPON_LABEL} (30% OFF)</span>
              <b>- {br(desconto)}</b>
            </div>

            <div className="flex justify-between text-sm">
              <span>Frete</span>
              <b>{freteGratis ? "Grátis" : "A combinar"}</b>
            </div>

            <div className="flex justify-between text-base border-t pt-2">
              <span className="font-semibold">Total</span>
              <b className="font-semibold">{br(total)}</b>
            </div>
          </div>
        )}
        <div className="text-xs text-zinc-500 mt-4">
          *O pagamento e entrega são finalizados pelo WhatsApp com nosso atendente.
        </div>
      </aside>
    </div>
  );
}
