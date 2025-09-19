"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { br } from "@/lib/format";
import {
  FileText,
  Truck,
  Shield,
  CheckCircle2,
  MapPin,
  QrCode,
  Receipt,
  ArrowLeft,
} from "lucide-react";

/** Se quiser apontar para outro número, troque aqui */
const WHATSAPP_LINK_BASE = "https://wa.me/55";

type Frete = { tipo: "SEDEX" | "ECONOMICO"; valor: number; prazo: string };
type EnderecoViaCep = { logradouro?: string; bairro?: string; localidade?: string; uf?: string };

export default function AnaliseBoletoPage() {
  const cart: any = useCart();
  const items = (cart?.items as any[]) || [];

  // endereço / frete vindos do localStorage
  const [cep, setCep] = useState<string>("");
  const [endereco, setEndereco] = useState<EnderecoViaCep>({});
  const [frete, setFrete] = useState<Frete | undefined>(undefined);

  // dados do cliente (formulário)
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [whats, setWhats] = useState("");

  useEffect(() => {
    const lcCep = localStorage.getItem("prostore:cep");
    const lcEnd = localStorage.getItem("prostore:endereco");
    const lcFrete = localStorage.getItem("prostore:frete_selected");
    if (lcCep) setCep(lcCep);
    if (lcEnd) {
      try { setEndereco(JSON.parse(lcEnd) as EnderecoViaCep); } catch {}
    }
    if (lcFrete) {
      try { setFrete(JSON.parse(lcFrete) as Frete); } catch {}
    }
  }, []);

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + (it.price || 0) * (it.qty ?? it.quantity ?? 1), 0),
    [items]
  );
  // Boleto NÃO tem desconto
  const total = subtotal + (frete?.valor || 0);

  function toWA() {
    const linhasItens = items
      .map(
        (it) =>
          `• ${it.name}${it.color ? ` (${it.color})` : ""}${it.storage ? ` ${it.storage}GB` : ""} — ${it.qty ?? it.quantity ?? 1}x — ${br(
            (it.price || 0) * (it.qty ?? it.quantity ?? 1)
          )}`
      )
      .join("%0A");

    const endStr = [
      endereco.logradouro,
      endereco.bairro,
      endereco.localidade && endereco.uf ? `${endereco.localidade}/${endereco.uf}` : undefined,
      cep ? `CEP ${cep}` : undefined,
    ]
      .filter(Boolean)
      .join(" — ");

    const msg = [
      "*Solicitação de análise de boleto*",
      "",
      "*Cliente*",
      `Nome: ${nome || "-"}`,
      `CPF/CNPJ: ${cpf || "-"}`,
      `E-mail: ${email || "-"}`,
      `WhatsApp: ${whats || "-"}`,
      "",
      "*Itens*",
      linhasItens || "-",
      "",
      "*Entrega*",
      endStr || "-",
      frete ? `${frete.tipo === "ECONOMICO" ? "Econômico" : "SEDEX"} • ${frete.prazo} • ${br(frete.valor)}` : "Frete a calcular",
      "",
      `*Total*: ${br(total)}`,
    ].join("%0A");

    window.open(`${WHATSAPP_LINK_BASE}?text=${msg}`, "_blank");
  }

  return (
    <div className="container py-6 md:py-8">
      <div className="mb-4">
        <Link href="/checkout" className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" /> Voltar ao checkout
        </Link>
      </div>

      <h1 className="text-xl md:text-2xl font-semibold">Análise de boleto</h1>
      <p className="text-sm text-zinc-600 mt-1">
        Emissão e análise de boleto realizadas em ambiente seguro. Preencha seus dados e enviaremos ao atendimento.
      </p>

      <div className="mt-6 grid lg:grid-cols-12 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-8 space-y-6">
          {/* Dados do cliente */}
          <section className="rounded-2xl border bg-white">
            <header className="px-4 py-3 border-b font-medium">Seus dados</header>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <input className="input" placeholder="Nome completo" value={nome} onChange={e=>setNome(e.target.value)} />
              <input className="input" placeholder="CPF/CNPJ" inputMode="numeric" value={cpf} onChange={e=>setCpf(e.target.value)} />
              <input className="input" placeholder="E-mail" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
              <input className="input" placeholder="WhatsApp (DDD+Número)" inputMode="tel" value={whats} onChange={e=>setWhats(e.target.value)} />
            </div>
          </section>

          {/* Endereço (só leitura mas editável) */}
          <section className="rounded-2xl border bg-white">
            <header className="px-4 py-3 border-b font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Endereço para faturamento/entrega
            </header>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="col-span-full rounded-lg border bg-zinc-50 p-3">
                <div className="text-xs md:text-sm text-zinc-700">
                  CEP <b>{cep || "-"}</b>{" "}
                  {endereco.localidade && endereco.uf ? (
                    <>— {endereco.localidade}/{endereco.uf}</>
                  ) : null}
                  <div className="mt-1">
                    {frete ? (
                      <>
                        {frete.tipo === "ECONOMICO" ? "Econômico" : "SEDEX"} • {frete.prazo} •{" "}
                        <b className="text-emerald-700">{br(frete.valor)}</b>
                      </>
                    ) : (
                      <span className="text-amber-700">Frete a calcular (pode calcular pelo checkout).</span>
                    )}
                  </div>
                </div>
              </div>

              <input className="input" placeholder="Endereço" value={endereco.logradouro || ""} onChange={(e)=>setEndereco(prev=>({...prev, logradouro: e.target.value}))}/>
              <input className="input" placeholder="Número" />
              <input className="input" placeholder="Complemento" />
              <input className="input" placeholder="Bairro" value={endereco.bairro || ""} onChange={(e)=>setEndereco(prev=>({...prev, bairro: e.target.value}))}/>
              <input className="input" placeholder="Cidade" value={endereco.localidade || ""} onChange={(e)=>setEndereco(prev=>({...prev, localidade: e.target.value}))}/>
              <input className="input" placeholder="UF" maxLength={2} value={endereco.uf || ""} onChange={(e)=>setEndereco(prev=>({...prev, uf: e.target.value.toUpperCase()}))}/>
            </div>
          </section>

          {/* Ação */}
          <div className="flex flex-wrap gap-3">
            <button onClick={toWA} className="btn-primary">
              Enviar para análise de boleto
            </button>
            <Link href="/checkout" className="btn-secondary">Voltar ao checkout</Link>
          </div>

          {/* Selos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="trust"><Shield className="h-4 w-4 text-emerald-600" /> 180 dias de garantia</div>
            <div className="trust"><FileText className="h-4 w-4 text-emerald-600" /> Nota Fiscal</div>
            <div className="trust"><Truck className="h-4 w-4 text-emerald-600" /> Entrega para todo o Brasil</div>
            <div className="trust"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Produto novo e original</div>
          </div>
        </div>

        {/* Resumo */}
        <aside className="lg:col-span-4">
          <div className="sticky top-20 rounded-2xl border bg-white p-4">
            <h3 className="font-semibold mb-3">Resumo do pedido</h3>

            <div className="space-y-3">
              {items.length === 0 && <div className="text-sm text-zinc-500">Seu carrinho está vazio.</div>}
              {items.map((it:any) => (
                <div key={it.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md overflow-hidden border bg-white">
                    {it.image ? <Image src={it.image} alt={it.name} width={40} height={40} className="h-full w-full object-contain" /> : null}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="font-medium line-clamp-1">{it.name}</div>
                    <div className="text-zinc-500">
                      {it.color ? `${it.color} • ` : ""}
                      {it.storage ? `${it.storage} GB • ` : ""}
                      {it.qty ?? it.quantity ?? 1}x
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {br((it.price || 0) * (it.qty ?? it.quantity ?? 1))}
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-3" />
            <div className="text-sm space-y-1">
              <div className="flex justify-between"><span>Subtotal</span><span>{br(subtotal)}</span></div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>{frete ? `${br(frete.valor)} • ${frete.tipo === "ECONOMICO" ? "Econômico" : "SEDEX"}` : "A calcular"}</span>
              </div>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between items-center">
              <div className="font-semibold">Total</div>
              <div className="text-lg font-semibold text-emerald-700">{br(total)}</div>
            </div>

            <div className="mt-3 text-[11px] text-zinc-500">
              * A emissão e o envio do boleto são feitos pelo WhatsApp com nosso atendente.
            </div>
          </div>
        </aside>
      </div>

      {/* estilos locais */}
      <style jsx global>{`
        .input { border:1px solid #e5e7eb; border-radius:10px; padding:10px 12px; outline:none; }
        .input:focus { box-shadow:0 0 0 2px rgba(16,185,129,.25); border-color:#10b981; }
        .btn-primary { background:#10b981; color:#fff; padding:12px 16px; border-radius:10px; font-weight:600; }
        .btn-primary:hover { background:#0e9f6e; }
        .btn-secondary { background:#111827; color:#fff; padding:12px 16px; border-radius:10px; font-weight:500; }
        .btn-secondary:hover { background:#000; }
        .trust { display:flex; align-items:center; gap:8px; font-size:13px; border:1px solid #e5e7eb; border-radius:12px; padding:10px 12px; background:#fff; }
      `}</style>
    </div>
  );
}
