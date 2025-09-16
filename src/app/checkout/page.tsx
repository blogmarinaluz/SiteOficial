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
  Check,
  ChevronRight,
} from "lucide-react";

// ---- helpers para caminho de imagem (não alteram layout/tamanho) ----
function normalizeSrc(src?: string): string {
  if (!src) return "/";
  return src.startsWith("/") ? src : `/${src}`;
}
function isJfif(src: string): boolean {
  return /\.jfif($|\?|\#)/i.test(src);
}

type EnderecoViaCep = {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  localidade: string;
  uf: string;
  ddd?: string;
};

type Frete = {
  tipo: "expresso" | "economico" | "retira";
  prazo: string; // ex: "3 a 5 dias úteis"
  valor: number; // em reais
};

// Simulação de opções de pagamento
const pagamentos = [
  {
    id: "pix",
    label: "Pix à vista (recomendado)",
    desc: "Confirmação imediata e 30% OFF",
    icon: QrCode,
  },
  {
    id: "boleto",
    label: "Boleto à vista",
    desc: "Compensação em até 2 dias úteis e 30% OFF",
    icon: Receipt,
  },
  {
    id: "cartao",
    label: "Cartão de crédito",
    desc: "Em até 10x sem juros",
    icon: CreditCard,
  },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export default function CheckoutPage() {
  const {
    items,
    increase,
    decrease,
    remove,
    clear,
  } = useCart();

  const [tab, setTab] = useState<"entrega" | "pagamento">("entrega");

  const count = useMemo(
    () => (items ?? []).reduce((acc, i) => acc + (i.qty || 0), 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      (items ?? []).reduce((acc, i) => {
        const p = Number(i.price || 0);
        const q = Number(i.qty || 0);
        return acc + p * q;
      }, 0),
    [items]
  );

  const desconto = subtotal * 0.3;
  const total = subtotal - desconto;

  const allFreeShipping = useMemo(
    () => (items ?? []).length > 0 && (items ?? []).every((i) => !!i.freeShipping),
    [items]
  );

  // --- CEP / frete simulado (mantido igual ao seu) ---
  type EnderecoViaCep = {
    cep: string;
    logradouro: string;
    complemento?: string;
    bairro: string;
    localidade: string;
    uf: string;
    ddd?: string;
  };

  function FreteForm({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
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
      try {
        setLoading(true);
        setErro(null);

        const v = cep.replace(/\D/g, "");
        if (v.length !== 8) {
          setErro("CEP inválido");
          setEndereco(null);
          setOpcoes(null);
          return;
        }

        // simulação offline
        const fake: EnderecoViaCep = {
          cep: v.replace(/(\d{5})(\d{3})/, "$1-$2"),
          logradouro: "Rua Exemplo",
          bairro: "Centro",
          localidade: "Cidade",
          uf: "SP",
        };
        setEndereco(fake);

        const opts: Frete[] = [
          { tipo: "economico", prazo: "5 a 8 dias úteis", valor: 29.9 },
          { tipo: "expresso", prazo: "2 a 4 dias úteis", valor: 49.9 },
          { tipo: "retira", prazo: "Retire amanhã", valor: 0 },
        ];
        setOpcoes(opts);

        localStorage.setItem("prostore:cep", v);
      } catch (e) {
        setErro("Não foi possível calcular o frete agora.");
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            placeholder="Digite seu CEP"
            className="input w-40"
            maxLength={9}
          />
          <button onClick={consultar} className="btn-secondary">Calcular</button>
          <button onClick={onClose} className="btn-primary">Aplicar</button>
        </div>
        {erro && <div className="note">{erro}</div>}
        {endereco && (
          <div className="note">
            <div><strong>Endereço:</strong> {endereco.logradouro}, {endereco.bairro} - {endereco.localidade}/{endereco.uf}</div>
          </div>
        )}
        {opcoes && (
          <ul className="space-y-2">
            {opcoes.map((o) => (
              <li key={o.tipo} className="trust">
                <Truck className="h-4 w-4 text-emerald-600" />
                <span className="font-medium capitalize">{o.tipo}</span>
                <span className="text-neutral-500">•</span>
                <span>{o.prazo}</span>
                <span className="ml-auto font-semibold">{br(o.valor)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* COLUNA ESQUERDA */}
        <div className="space-y-6">
          <Section title="Seus itens">
            {items && items.length > 0 ? (
              <ul className="divide-y divide-neutral-200">
                {items.map((it) => (
                  <li key={it.id} className="flex items-center gap-3 py-3">
                    <div className="h-12 w-12 rounded-lg overflow-hidden border bg-white">
                      {it.image ? (
                        <Image
                          src={normalizeSrc(it.image)}
                          alt={it.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-contain"
                          unoptimized={isJfif(normalizeSrc(it.image))}
                          sizes="48px"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-xs text-neutral-400">
                          Sem imagem
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <Link href={`/produto/${it.id}`} className="block text-sm font-medium hover:underline">
                        {it.name}
                      </Link>
                      <div className="mt-0.5 text-xs text-neutral-500">
                        {it.color ? <>Cor: {it.color}</> : null}
                        {it.color && (it as any).storage ? " • " : null}
                        {(it as any).storage ? <> {String((it as any).storage)} GB</> : null}
                        {" • "}
                        {it.qty}x
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrease(it.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                        aria-label="Diminuir"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{it.qty}</span>
                      <button
                        onClick={() => increase(it.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                        aria-label="Aumentar"
                      >
                        <Plus className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => remove(it.id)}
                        className="ml-2 rounded p-1.5 text-neutral-500 hover:bg-neutral-100"
                        aria-label="Remover item"
                        title="Remover item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="ml-3 w-[120px] text-right text-sm font-semibold">
                      {br((it.price || 0) * (it.qty || 0))}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-neutral-600">Seu carrinho está vazio.</div>
            )}
          </Section>

          <Section title="Endereço e frete">
            <div className="grid gap-4">
              <FreteForm open={true} onClose={() => {}} />
            </div>
          </Section>

          <Section title="Pagamento">
            <div className="grid gap-3">
              {pagamentos.map((p) => (
                <label key={p.id} className="tab">
                  <input type="radio" name="pag" className="sr-only" />
                  <p.icon className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">{p.label}</span>
                  <span className="text-neutral-500">{p.desc}</span>
                </label>
              ))}
            </div>
          </Section>
        </div>

        {/* COLUNA DIREITA */}
        <div className="space-y-6">
          <Section title="Resumo">
            <div className="space-y-3">
              {items && items.length > 0 ? (
                <ul className="space-y-2">
                  {items.map((it) => (
                    <li key={it.id} className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-md overflow-hidden border bg-white">
                        {it.image ? (
                          <Image
                            src={normalizeSrc(it.image)}
                            alt={it.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-contain"
                            unoptimized={isJfif(normalizeSrc(it.image))}
                            sizes="40px"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="truncate">{it.name}</div>
                        <div className="text-neutral-500">
                          {it.qty}x •{" "}
                          {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                            (it.price || 0)
                          )}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        {br((it.price || 0) * (it.qty || 0))}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium text-neutral-900">
                  {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Cupom (30% OFF)</span>
                <span className="font-medium text-emerald-700">
                  −{" "}
                  {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                    desconto
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>
                  {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}
                </span>
              </div>

              {allFreeShipping && (
                <div className="text-xs font-medium text-emerald-700">Frete grátis</div>
              )}

              <div className="pt-2">
                <Link href="/analise-boleto" className="btn-primary w-full inline-flex items-center justify-center gap-2">
                  Finalizar pedido
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Section>

          <div className="note">
            <div className="trust">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Ambiente seguro</span>
            </div>
            <p className="mt-2 text-sm">
              Seus dados são protegidos e utilizados somente para processar seu pedido.
            </p>
          </div>
        </div>
      </div>

      {/* estilos locais do checkout (mantidos) */}
      <style jsx global>{`
        .input { border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; outline: none; }
        .input:focus { box-shadow: 0 0 0 2px rgba(16, 185, 129, .25); border-color: #10b981; }
        .tab { display:flex; align-items:center; padding:8px 12px; gap:10px; border-radius:10px; border:1px solid #e5e7eb; background:#fff; }
        .tab-active { border-color:#10b981; box-shadow:0 0 0 2px rgba(16,185,129,.12) inset; }
        .btn-primary { background:#10b981; color:#fff; padding:12px 16px; border-radius:10px; font-weight:600; }
        .btn-primary:hover { background:#0e9f6e; }
        .btn-secondary { background:#111827; color:#fff; padding:12px 16px; border-radius:10px; font-weight:500; }
        .btn-secondary:hover { background:#000; }
        .note { background:#f8fafc; border:1px solid #e5e7eb; border-radius:10px; padding:12px; font-size:13px; color:#374151; }
        .trust { display:flex; align-items:center; gap:8px; font-weight:500; color:#111827; border:1px solid #e5e7eb; border-radius:12px; padding:10px 12px; background:#fff; }
      `}</style>
    </>
  );
}
