"use client";

import { useEffect, useMemo, useState } from "react";
import useCart from "@/hooks/useCart";

type Form = {
  nome: string;
  cpf?: string;
  email: string;
  telefone: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  pagamento: "pix" | "cartao" | "boleto";
};

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const [form, setForm] = useState<Form>({
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    pagamento: "pix",
  } as Form);

  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.price * i.qty, 0),
    [items]
  );

  const freteGratis = items.length > 0 && items.every((i: any) => i.freeShipping);
  const frete = freteGratis ? 0 : 0; // por enquanto grátis para todos
  const totalPix = subtotal;
  const desconto = Math.max(0, subtotal - totalPix);

  // auto preencher pelo CEP
  useEffect(() => {
    const cep = form.cep?.replace(/\D/g, "");
    if (cep && cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(r => r.json())
        .then(d => {
          if (d.erro) return;
          setForm(f => ({
            ...f,
            rua: d.logradouro || f.rua,
            bairro: d.bairro || f.bairro,
            cidade: d.localidade || f.cidade,
            uf: d.uf || f.uf,
          }));
        })
        .catch(() => {});
    }
  }, [form.cep]);

  const finish = () => {
    const linhas = [
      `*Novo pedido — proStore*`,
      ``,
      `Nome: ${form.nome}`,
      `Email: ${form.email}`,
      `Tel: ${form.telefone}`,
      `Pagamento: ${form.pagamento.toUpperCase()}`,
      `Endereço: ${form.rua}, ${form.numero} - ${form.bairro} - ${form.cidade}/${form.uf} (CEP ${form.cep})`,
      ``,
      `Itens:`,
      ...items.map(i => `• ${i.qty}x ${i.name} — R$ ${(i.price*i.qty).toFixed(2).replace(".", ",")}`),
      ``,
      `Subtotal: R$ ${subtotal.toFixed(2).replace(".", ",")}`,
      freteGratis ? `Frete: Grátis` : `Frete: R$ ${frete.toFixed(2).replace(".", ",")}`,
      `Total no PIX: R$ ${totalPix.toFixed(2).replace(".", ",")} (cupom 30% OFF aplicado)`,
    ];
    const msg = encodeURIComponent(linhas.join("\n"));
    const url = `https://wa.me/5585999999999?text=${msg}`;
    window.open(url, "_blank");
  };

  return (
    <main className="container mx-auto px-4 py-8 grid md:grid-cols-[2fr,1fr] gap-8">
      <div>
        <h1 className="text-2xl font-extrabold mb-4">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Nome completo">
            <input className="input" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })}/>
          </Field>
          <Field label="CPF (opcional)">
            <input className="input" value={form.cpf ?? ""} onChange={e => setForm({ ...form, cpf: e.target.value })}/>
          </Field>
          <Field label="Email">
            <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/>
          </Field>
          <Field label="Telefone">
            <input className="input" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })}/>
          </Field>

          <Field label="CEP">
            <input className="input" placeholder="00000-000" value={form.cep} onChange={e => setForm({ ...form, cep: e.target.value })}/>
          </Field>
          <Field label="Rua">
            <input className="input" value={form.rua} onChange={e => setForm({ ...form, rua: e.target.value })}/>
          </Field>
          <Field label="Número">
            <input className="input" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })}/>
          </Field>
          <Field label="Bairro">
            <input className="input" value={form.bairro} onChange={e => setForm({ ...form, bairro: e.target.value })}/>
          </Field>
          <Field label="Cidade">
            <input className="input" value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })}/>
          </Field>
          <Field label="UF">
            <input className="input" value={form.uf} onChange={e => setForm({ ...form, uf: e.target.value })}/>
          </Field>
        </div>

        <div className="mt-6">
          <div className="font-semibold mb-2">Forma de pagamento</div>
          <div className="flex gap-4 text-sm">
            {(["pix", "cartao", "boleto"] as const).map(opt => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pg"
                  checked={form.pagamento === opt}
                  onChange={() => setForm({ ...form, pagamento: opt })}
                />
                {opt === "pix" ? "PIX (recomendado)" : opt === "cartao" ? "Cartão (em 10x sem juros)" : "Boleto (para negativados)"}
              </label>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Após finalizar, você será redirecionado ao WhatsApp para confirmar o pedido com nossos atendentes.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={finish} className="bg-[#25D366] text-white rounded-xl px-4 py-3 font-semibold">
            Finalizar no WhatsApp
          </button>
          <button onClick={() => clear()} className="border rounded-xl px-4 py-3">
            Limpar carrinho
          </button>
        </div>
      </div>

      {/* RESUMO */}
      <aside className="border rounded-2xl p-4 h-fit">
        <h2 className="font-bold mb-3">Resumo</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><b>R$ {subtotal.toFixed(2).replace(".", ",")}</b></div>
          <div className="flex justify-between"><span>Desconto (30%)</span><b>- R$ {desconto.toFixed(2).replace(".", ",")}</b></div>
          <div className="flex justify-between">
            <span>Frete</span>
            <b>{freteGratis ? "Grátis" : `R$ ${frete.toFixed(2).replace(".", ",")}`}</b>
          </div>
          <div className="h-px bg-zinc-200 my-2" />
          <div className="flex justify-between text-base">
            <span>Total no PIX</span><b>R$ {totalPix.toFixed(2).replace(".", ",")}</b>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        .input { @apply w-full border rounded-xl px-3 py-2; }
      `}</style>
    </main>
  );
}

function Field({ label, children }: any) {
  return (
    <label className="text-sm">
      <div className="mb-1 text-zinc-600">{label}</div>
      {children}
    </label>
  );
}
