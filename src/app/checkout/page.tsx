"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { br, withCoupon } from "@/lib/format";
import {
  Truck,
  CreditCard,
  Receipt,
  QrCode,
  Plus,
  Minus,
  Trash2,
  X,
  Loader2,
  MapPin,
  Shield,
  FileText,
  CheckCircle2,
} from "lucide-react";

/** Ajuste se seu caminho de análise de boleto for outro */
const BOLETO_ANALISE_PATH = "/analise-boleto";

/* ========================= Frete / CEP ========================= */
type Regiao = "N" | "NE" | "CO" | "SE" | "S";
const UF_REGION: Record<string, Regiao> = {
  AC: "N", AM: "N", AP: "N", PA: "N", RO: "N", RR: "N", TO: "N",
  AL: "NE", BA: "NE", CE: "NE", MA: "NE", PB: "NE", PE: "NE", PI: "NE", RN: "NE", SE: "NE",
  DF: "CO", GO: "CO", MT: "CO", MS: "CO",
  ES: "SE", MG: "SE", RJ: "SE", SP: "SE",
  PR: "S", RS: "S", SC: "S",
};
const FRETE_TABELA = {
  SEDEX: { SE: 24.9, S: 29.9, CO: 34.9, NE: 39.9, N: 49.9 },
  ECONOMICO: { SE: 14.9, S: 19.9, CO: 24.9, NE: 29.9, N: 39.9 },
};
const PRAZO_TABELA = {
  SEDEX: { SE: "2–4 dias úteis", S: "3–5 dias úteis", CO: "3–6 dias úteis", NE: "4–7 dias úteis", N: "5–9 dias úteis" },
  ECONOMICO: { SE: "4–7 dias úteis", S: "5–8 dias úteis", CO: "6–10 dias úteis", NE: "7–12 dias úteis", N: "10–15 dias úteis" },
};
const normalizeCep = (v: string) => (v || "").replace(/\D/g, "").slice(0, 8);
const getRegiao = (uf?: string): Regiao => (uf && UF_REGION[uf]) || "SE";

type Frete = { tipo: "SEDEX" | "ECONOMICO"; valor: number; prazo: string };
type EnderecoViaCep = { logradouro?: string; bairro?: string; localidade?: string; uf?: string };

/* ========================= Modal CEP ========================= */
function CepModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (payload: { cep: string; endereco: EnderecoViaCep; frete: Frete }) => void;
}) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [endereco, setEndereco] = useState<EnderecoViaCep | null>(null);
  const [opcoes, setOpcoes] = useState<Frete[] | null>(null);

  useEffect(() => {
    if (!open) return;
    const saved = localStorage.getItem("prostore:cep");
    if (saved) setCep(saved);
  }, [open]);

  async function consultar() {
    setErro(null);
    setEndereco(null);
    setOpcoes(null);
    const raw = normalizeCep(cep);
    if (raw.length !== 8) {
      setErro("Digite um CEP válido (8 dígitos).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const data = await res.json();
      if (data?.erro) {
        setErro("CEP não encontrado.");
        setLoading(false);
        return;
      }
      const uf = data.uf as string | undefined;
      const reg = getRegiao(uf);
      const op: Frete[] = [
        { tipo: "SEDEX", valor: FRETE_TABELA.SEDEX[reg], prazo: PRAZO_TABELA.SEDEX[reg] },
        { tipo: "ECONOMICO", valor: FRETE_TABELA.ECONOMICO[reg], prazo: PRAZO_TABELA.ECONOMICO[reg] },
      ];
      const end: EnderecoViaCep = {
        logradouro: data.logradouro,
        bairro: data.bairro,
        localidade: data.localidade,
        uf,
      };
      setEndereco(end);
      setOpcoes(op);
      localStorage.setItem("prostore:cep", raw);
      localStorage.setItem("prostore:endereco", JSON.stringify(end)); // ✅ salva endereço também
    } catch {
      setErro("Falha ao consultar CEP. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-emerald-100 p-2">
              <Truck className="h-5 w-5 text-emerald-700" />
            </div>
            <h3 className="text-lg font-semibold">Calcular entrega</h3>
            <button onClick={onClose} className="ml-auto rounded-md p-1 text-zinc-500 hover:bg-zinc-100" aria-label="Fechar">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && consultar()}
                placeholder="Digite seu CEP"
                inputMode="numeric"
                maxLength={9}
                className="w-full pl-9 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            <button
              onClick={consultar}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white px-4 py-2 font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calcular"}
            </button>
          </div>

          {erro && <div className="mt-3 text-sm text-red-600">{erro}</div>}

          {endereco && (
            <div className="mt-4 rounded-lg border bg-zinc-50 p-3 text-sm text-zinc-700">
              Entrega para: <b>{[endereco.logradouro, endereco.bairro].filter(Boolean).join(" - ")}</b> — {endereco.localidade}/{endereco.uf}
            </div>
          )}

          {opcoes && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {opcoes.map((o) => (
                <button
                  key={o.tipo}
                  onClick={() => {
                    const raw = normalizeCep(cep);
                    localStorage.setItem("prostore:frete_selected", JSON.stringify(o)); // ✅ persiste frete
                    onSelect({ cep: raw, endereco: endereco || {}, frete: o });
                    onClose();
                  }}
                  className="text-left rounded-xl border p-4 hover:shadow-sm transition"
                >
                  <div className="font-semibold">{o.tipo === "ECONOMICO" ? "Econômico" : "SEDEX"}</div>
                  <div className="text-sm text-zinc-600">{o.prazo}</div>
                  <div className="text-lg font-semibold text-emerald-700 mt-1">{br(o.valor)}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================= Página ========================= */
type Payment = "PIX" | "CARTAO" | "BOLETO";

export default function CheckoutPage() {
  const cart: any = useCart();
  const items = (cart?.items as any[]) || [];

  const [cepModal, setCepModal] = useState(false);

  // Estado de endereço (controlado)
  const [cep, setCep] = useState<string | undefined>(undefined);
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  const [frete, setFrete] = useState<Frete | undefined>(undefined);
  const [pay, setPay] = useState<Payment>("PIX");

  // Carrega do localStorage ao abrir (CEP, endereço e frete)
  useEffect(() => {
    const cepSaved = localStorage.getItem("prostore:cep") || undefined;
    const endSaved = localStorage.getItem("prostore:endereco");
    const freteSaved = localStorage.getItem("prostore:frete_selected");

    if (cepSaved) setCep(cepSaved);
    if (endSaved) {
      try {
        const e = JSON.parse(endSaved) as EnderecoViaCep;
        setLogradouro(e.logradouro || "");
        setBairro(e.bairro || "");
        setCidade(e.localidade || "");
        setUf(e.uf || "");
      } catch {}
    }
    if (freteSaved) {
      try {
        setFrete(JSON.parse(freteSaved) as Frete);
      } catch {}
    }
  }, []);

  // Se tem CEP, mas não tem endereço (ex. veio só da página de produto), busca ViaCEP
  useEffect(() => {
    async function hydrate() {
      if (!cep || (logradouro && cidade && uf)) return;
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data?.erro) {
          setLogradouro(data.logradouro || "");
          setBairro(data.bairro || "");
          setCidade(data.localidade || "");
          setUf(data.uf || "");
          localStorage.setItem(
            "prostore:endereco",
            JSON.stringify({
              logradouro: data.logradouro,
              bairro: data.bairro,
              localidade: data.localidade,
              uf: data.uf,
            })
          );
        }
      } catch {}
    }
    hydrate();
  }, [cep, logradouro, cidade, uf]);

  // Sincroniza alterações manuais do cliente com o localStorage
  useEffect(() => {
    const payload: EnderecoViaCep = {
      logradouro: logradouro || undefined,
      bairro: bairro || undefined,
      localidade: cidade || undefined,
      uf: uf || undefined,
    };
    localStorage.setItem("prostore:endereco", JSON.stringify(payload));
  }, [logradouro, bairro, cidade, uf]);

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + (it.price || 0) * (it.qty || it.quantity || 1), 0),
    [items]
  );
  const descontoPix = pay === "PIX" ? Math.round(subtotal * 0.30) : 0; // 30% OFF
  const total = Math.max(0, subtotal - descontoPix) + (frete?.valor || 0);

  function onFreteSelect(payload: { cep: string; endereco: EnderecoViaCep; frete: Frete }) {
    setCep(payload.cep);
    setFrete(payload.frete);
    // Hidrata campos com o retorno do ViaCEP
    setLogradouro(payload.endereco.logradouro || "");
    setBairro(payload.endereco.bairro || "");
    setCidade(payload.endereco.localidade || "");
    setUf(payload.endereco.uf || "");
  }

  return (
    <>
      <CepModal open={cepModal} onClose={() => setCepModal(false)} onSelect={onFreteSelect} />

      <div className="container py-6 md:py-8">
        <h1 className="text-xl md:text-2xl font-semibold">Finalizar pedido</h1>

        <div className="mt-4 grid lg:grid-cols-12 gap-6">
          {/* Coluna principal */}
          <div className="lg:col-span-8 space-y-6">
            {/* Itens */}
            <section className="rounded-2xl border bg-white">
              <header className="px-4 py-3 border-b font-medium">Seus itens</header>
              <div className="divide-y">
                {items.length === 0 && <div className="p-4 text-sm text-zinc-500">Seu carrinho está vazio.</div>}

                {items.map((it) => (
                  <div key={it.id} className="p-4 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg overflow-hidden border bg-white">
                      {it.image ? (
                        <Image src={it.image} alt={it.name} width={48} height={48} className="h-full w-full object-contain" />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-xs text-zinc-400">IMG</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium leading-tight">{it.name}</div>
                      <div className="text-xs text-zinc-500">
                        {it.color ? `Cor: ${it.color} • ` : ""}
                        {it.storage ? `${it.storage} GB • ` : ""}
                        {it.qty ?? it.quantity ?? 1}x
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => cart?.decrement?.(it.id)} className="h-7 w-7 grid place-items-center rounded-md border hover:bg-zinc-50" aria-label="Diminuir">
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="w-6 text-center text-sm">{it.qty ?? it.quantity ?? 1}</div>
                      <button onClick={() => cart?.increment?.(it.id)} className="h-7 w-7 grid place-items-center rounded-md border hover:bg-zinc-50" aria-label="Aumentar">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="w-28 text-right text-sm font-medium">
                      {br((it.price || 0) * (it.qty ?? it.quantity ?? 1))}
                    </div>

                    <button onClick={() => cart?.remove?.(it.id)} className="ml-2 text-zinc-400 hover:text-red-600" aria-label="Remover">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {items.length > 0 && (
                <div className="px-4 py-3 border-t flex items-center justify-between">
                  <button onClick={() => cart?.clear?.()} className="text-sm text-zinc-600 hover:text-zinc-800">
                    Limpar carrinho
                  </button>
                </div>
              )}
            </section>

            {/* Dados do comprador */}
            <section className="rounded-2xl border bg-white">
              <header className="px-4 py-3 border-b font-medium">Seus dados</header>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <input className="input" placeholder="Nome completo" />
                <input className="input" placeholder="CPF" inputMode="numeric" />
                <input className="input" placeholder="WhatsApp (DDD+Número)" inputMode="tel" />
                <input className="input" placeholder="E-mail" type="email" />
              </div>
            </section>

            {/* Endereço & frete */}
            <section className="rounded-2xl border bg-white">
              <header className="px-4 py-3 border-b font-medium">Endereço</header>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="col-span-full">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium">Entrega</span>
                    <button onClick={() => setCepModal(true)} className="text-emerald-700 underline ml-2">
                      {cep ? "Alterar" : "Calcular"}
                    </button>
                  </div>

                  {cep ? (
                    <div className="mt-2 rounded-lg border bg-zinc-50 p-3 flex items-center justify-between">
                      <div className="text-xs md:text-sm text-zinc-700">
                        CEP <b>{cep}</b>
                        {cidade && (
                          <> — {cidade}/{uf}</>
                        )}
                        {frete ? (
                          <div className="mt-1">
                            {frete.tipo === "ECONOMICO" ? "Econômico" : "SEDEX"} • {frete.prazo} •{" "}
                            <b className="text-emerald-700">{br(frete.valor)}</b>
                          </div>
                        ) : (
                          <div className="mt-1 text-amber-700">Selecione a opção de frete.</div>
                        )}
                      </div>
                      <button onClick={() => setCepModal(true)} className="text-sm rounded-md border px-3 py-1 hover:bg-zinc-50">
                        Alterar frete
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-zinc-600">Sem CEP calculado.</div>
                  )}
                </div>

                <input className="input" placeholder="Endereço" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} />
                <input className="input" placeholder="Número" inputMode="numeric" value={numero} onChange={(e) => setNumero(e.target.value)} />
                <input className="input" placeholder="Complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                <input className="input" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                <input className="input" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
                <input className="input" placeholder="UF" maxLength={2} value={uf} onChange={(e) => setUf(e.target.value.toUpperCase())} />
              </div>
            </section>

            {/* Pagamento */}
            <section className="rounded-2xl border bg-white">
              <header className="px-4 py-3 border-b font-medium">Pagamento</header>

              <div className="p-4">
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setPay("PIX")} className={`tab ${pay === "PIX" ? "tab-active" : ""}`}>
                    <QrCode className="h-4 w-4 mr-2" /> PIX
                  </button>
                  <button onClick={() => setPay("CARTAO")} className={`tab ${pay === "CARTAO" ? "tab-active" : ""}`}>
                    <CreditCard className="h-4 w-4 mr-2" /> Cartão (até 10x)
                  </button>
                  <button onClick={() => setPay("BOLETO")} className={`tab ${pay === "BOLETO" ? "tab-active" : ""}`}>
                    <Receipt className="h-4 w-4 mr-2" /> Boleto
                  </button>
                </div>

                {pay === "PIX" && (
                  <div className="note">
                    Cupom <b>PR030</b> (30% OFF) aplicado automaticamente no total do PIX.
                  </div>
                )}

                {pay === "CARTAO" && (
                  <div className="note">
                    Pague em até <b>10x sem juros</b> no cartão. Dados do cartão serão finalizados por WhatsApp com nosso atendente.
                  </div>
                )}

                {pay === "BOLETO" && (
                  <div className="note flex items-center justify-between gap-3">
                    <span>Emissão e análise de boleto realizados em ambiente seguro.</span>
                    <Link href={BOLETO_ANALISE_PATH} className="rounded-lg bg-zinc-900 text-white px-3 py-2 text-sm hover:bg-black">
                      Ir para análise de boleto
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* Ações finais */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={`https://wa.me/55?text=Olá! Quero finalizar meu pedido. Total ${br(total)}. CEP ${cep || ""} • ${frete ? (frete.tipo === "ECONOMICO" ? "Econômico" : "SEDEX") + " " + br(frete.valor) : "Frete a calcular"}.`}
                target="_blank"
                className="btn-primary"
              >
                Finalizar no WhatsApp
              </Link>
              <button onClick={() => cart?.clear?.()} className="btn-secondary">
                Limpar carrinho
              </button>
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
              <h3 className="font-semibold mb-3">Resumo</h3>

              <div className="space-y-3">
                {items.map((it) => (
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
                    <div className="text-sm font-medium">{br((it.price || 0) * (it.qty ?? it.quantity ?? 1))}</div>
                  </div>
                ))}
              </div>

              <hr className="my-3" />
              <div className="text-sm space-y-1">
                <div className="flex justify-between"><span>Subtotal</span><span>{br(subtotal)}</span></div>
                {pay === "PIX" && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Cupom PR030 (30% OFF)</span>
                    <span>- {br(descontoPix)}</span>
                  </div>
                )}
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
                * O pagamento e a entrega são finalizados pelo WhatsApp com nosso atendente.
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* utilitários */}
      <style jsx global>{`
        .input { border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; outline: none; }
        .input:focus { box-shadow: 0 0 0 2px rgba(16, 185, 129, .25); border-color: #10b981; }
        .tab { display:flex; align-items:center; padding:8px 12px; border-radius:10px; border:1px solid #e5e7eb; background:#fff; }
        .tab-active { border-color:#10b981; box-shadow:0 0 0 2px rgba(16,185,129,.12) inset; }
        .btn-primary { background:#10b981; color:#fff; padding:12px 16px; border-radius:10px; font-weight:600; }
        .btn-primary:hover { background:#0e9f6e; }
        .btn-secondary { background:#111827; color:#fff; padding:12px 16px; border-radius:10px; font-weight:500; }
        .btn-secondary:hover { background:#000; }
        .note { background:#f8fafc; border:1px solid #e5e7eb; border-radius:10px; padding:12px; font-size:13px; color:#374151; }
        .trust { display:flex; align-items:center; gap:8px; font-size:13px; border:1px solid #e5e7eb; border-radius:12px; padding:10px 12px; background:#fff; }
      `}</style>
    </>
  );
}
