"use client";

import { useEffect, useMemo, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  image?: string;
  storage?: string | number;
  color?: string;
  price?: number;
  qty: number;
};

function br(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function withPix(n: number) {
  return Math.round(n * 0.85); // 15% OFF no PIX
}

const SELLER_NUMBER =
  process.env.NEXT_PUBLIC_SELLER_NUMBER || "55999984905715";

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Dados do cliente
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [whats, setWhats] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [pagamento, setPagamento] = useState<"PIX" | "Cartão">("PIX");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      const list: CartItem[] = raw ? JSON.parse(raw) : [];
      setCart(list);
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // AUTO-PREENCHER POR CEP – blindado
  useEffect(() => {
    const digits = (cep || "").replace(/\D/g, "");
    if (digits.length !== 8) return;
    let aborted = false;
    (async () => {
      try {
        const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { cache: "no-store" });
        const d = await r.json();
        if (!aborted && d && !d.erro) {
          setEndereco(d.logradouro || "");
          setBairro(d.bairro || "");
          setCidade(d.localidade || "");
          setUf(d.uf || "");
        }
      } catch { /* silencioso */ }
    })();
    return () => { aborted = true; };
  }, [cep]);

  const subtotal = useMemo(
    () => cart.reduce((acc, it) => acc + (it.price || 0) * it.qty, 0),
    [cart]
  );
  const totalPix = useMemo(() => withPix(subtotal), [subtotal]);

  function limparCarrinho() {
    localStorage.removeItem("cart");
    setCart([]);
  }

  function toWhatsApp() {
    if (!cart.length) {
      alert("Seu carrinho está vazio.");
      return;
    }
    const linhas: string[] = [];
    linhas.push("*Pedido proStore*");
    linhas.push(`*Cliente:* ${nome || "-"}`);
    linhas.push(`CPF: ${cpf || "-"}`);
    linhas.push(`WhatsApp: ${whats || "-"}`);
    linhas.push(`E-mail: ${email || "-"}`);
    linhas.push(
      `Endereço: ${endereco || "-"}, Nº ${numero || "-"} ${
        complemento ? " - " + complemento : ""
      }`
    );
    linhas.push(`Bairro: ${bairro || "-"} - ${cidade || "-"} / ${uf || "-"}`);
    linhas.push(`CEP: ${cep || "-"}`);
    linhas.push("");
    linhas.push("*Itens:*");
    cart.forEach((it) => {
      linhas.push(
        `• ${it.qty}x ${it.name}${it.color ? " - " + it.color : ""}${
          it.storage ? " " + it.storage + "GB" : ""
        } — ${br((it.price || 0) * it.qty)}`
      );
    });
    linhas.push("");
    linhas.push(`Subtotal: ${br(subtotal)}`);
    if (pagamento === "PIX") {
      linhas.push(`Total no PIX (15% OFF): *${br(totalPix)}*`);
    } else {
      linhas.push(`Total no Cartão (até 10x): *${br(subtotal)}*`);
    }
    linhas.push("");
    linhas.push(`Forma de pagamento: ${pagamento}`);
    linhas.push("");
    linhas.push("_Obs.: pedido enviado via site para finalizar no WhatsApp._");

    const msg = encodeURIComponent(linhas.join("\n"));
    const link = `https://api.whatsapp.com/send?phone=${SELLER_NUMBER}&text=${msg}`;
    window.location.href = link;
  }

  if (loading) return <div className="p-6">Carregando…</div>;

  return (
    <div className="container p-6 grid md:grid-cols-[2fr,1fr] gap-8">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Checkout seguro</h1>
        <p className="text-sm text-zinc-600 -mt-2">
          Preencha seus dados. Ao final, abriremos o WhatsApp com seu pedido.
        </p>

        <section className="border rounded-2xl p-4">
          <h2 className="font-semibold mb-3">Seus dados</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="input" placeholder="Nome completo" value={nome} onChange={e=>setNome(e.target.value)} />
            <input className="input" placeholder="CPF" value={cpf} onChange={e=>setCpf(e.target.value)} />
            <input className="input" placeholder="WhatsApp (DDD+Número)" value={whats} onChange={e=>setWhats(e.target.value)} />
            <input className="input" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
        </section>

        <section className="border rounded-2xl p-4">
          <h2 className="font-semibold mb-3">Endereço</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <input className="input" placeholder="CEP" value={cep} onChange={e=>setCep(e.target.value)} />
            <input className="input sm:col-span-2" placeholder="Endereço" value={endereco} onChange={e=>setEndereco(e.target.value)} />
            <input className="input" placeholder="Número" value={numero} onChange={e=>setNumero(e.target.value)} />
            <input className="input sm:col-span-2" placeholder="Complemento" value={complemento} onChange={e=>setComplemento(e.target.value)} />
            <input className="input" placeholder="Bairro" value={bairro} onChange={e=>setBairro(e.target.value)} />
            <input className="input" placeholder="Cidade" value={cidade} onChange={e=>setCidade(e.target.value)} />
            <input className="input" placeholder="UF" value={uf} onChange={e=>setUf(e.target.value)} />
          </div>
          <div className="text-[11px] text-zinc-500 mt-2">*Preenchemos automaticamente pelo CEP.</div>
        </section>

        <section className="border rounded-2xl p-4">
          <h2 className="font-semibold mb-3">Pagamento</h2>
          <div className="flex gap-3">
            <button
              className={`btn ${pagamento === "PIX" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setPagamento("PIX")}
            >
              PIX (15% OFF)
            </button>
            <button
              className={`btn ${pagamento === "Cartão" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setPagamento("Cartão")}
            >
              Cartão (até 10x)
            </button>
          </div>
          <div className="text-xs text-zinc-600 mt-2">
            *Vamos abrir o WhatsApp com todas as informações para finalizar com um atendente.
          </div>
        </section>

        <div className="flex gap-3">
          <button className="btn-primary" onClick={toWhatsApp}>Enviar pedido no WhatsApp</button>
          <button className="btn-outline" onClick={limparCarrinho}>Limpar carrinho</button>
        </div>
      </div>

      <aside className="border rounded-2xl p-4 h-fit sticky top-6">
        <h2 className="font-semibold mb-3">Resumo</h2>
        {!cart.length ? (
          <div className="text-sm text-zinc-500">Seu carrinho está vazio.</div>
        ) : (
          <div className="space-y-3">
            {cart.map((it) => (
              <div key={it.id} className="flex gap-3 items-center border-b pb-3">
                <img src={it.image} alt={it.name} className="w-16 h-16 rounded object-contain bg-white" />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-zinc-500">
                    {it.color} {it.storage ? `• ${it.storage}GB` : ""} • {it.qty}x
                  </div>
                </div>
                <div className="text-sm">{br((it.price || 0) * it.qty)}</div>
              </div>
            ))}

            <div className="flex justify-between text-sm pt-2">
              <span>Subtotal</span>
              <b>{br(subtotal)}</b>
            </div>
            <div className="flex justify-between text-sm">
              <span>PIX (15% OFF)</span>
              <b>{br(totalPix)}</b>
            </div>
          </div>
        )}
        <div className="text-xs text-zinc-500 mt-4">
          *Pagamento finalizado no WhatsApp.
        </div>
      </aside>
    </div>
  );
}
