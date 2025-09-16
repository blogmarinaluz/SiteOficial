"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { br } from "@/lib/format";
import {
  Truck,
  CreditCard,
  Receipt,
  QrCode,
  Plus,
  Minus,
  Trash2,
  Check,
} from "lucide-react";

/* ====================== Helpers imagem ====================== */
function normalizeSrc(src?: string): string {
  if (!src) return "/";
  return src.startsWith("/") ? src : `/${src}`;
}
function isJfif(src: string): boolean {
  return /\.jfif($|\?|\#)/i.test(src);
}

/* ====================== Tipos ====================== */
type CartItem = {
  id: string;
  name: string;
  image?: string;
  price?: number;
  freeShipping?: boolean;
  qty: number;
  color?: string;
  storage?: string | number;
};

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
  prazo: string;
  valor: number;
};

type Order = {
  code: string;
  items: Array<{
    id: string;
    name: string;
    qty: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string; // ISO
};

/* ====================== UI util ====================== */
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

/* ====================== Pagamentos (mesmo conteúdo) ====================== */
const pagamentos = [
  { id: "pix", label: "Pix à vista (recomendado)", desc: "Confirmação imediata e 30% OFF", icon: QrCode },
  { id: "boleto", label: "Boleto à vista", desc: "Compensação em até 2 dias úteis e 30% OFF", icon: Receipt },
  { id: "cartao", label: "Cartão de crédito", desc: "Em até 10x sem juros", icon: CreditCard },
];

/* ====================== Item da lista (memo) ====================== */
const CartItemRow = memo(function CartItemRow({
  it,
  onDec,
  onInc,
  onRemove,
}: {
  it: CartItem;
  onDec: (id: string) => void;
  onInc: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const src = normalizeSrc(it.image);
  return (
    <li className="flex items-center gap-3 py-3">
      <div className="h-12 w-12 rounded-lg overflow-hidden border bg-white">
        {it.image ? (
          <Image
            src={src}
            alt={it.name}
            width={48}
            height={48}
            className="h-full w-full object-contain"
            unoptimized={isJfif(src)}
            sizes="48px"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-xs text-neutral-400">
            Sem imagem
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link href={`/produto/${it.id}`} className="block text-sm font-medium hover:underline">
          {it.name}
        </Link>
        <div className="mt-0.5 text-xs text-neutral-500 whitespace-nowrap overflow-hidden text-ellipsis">
          {it.color ? <>Cor: {it.color}</> : null}
          {it.color && it.storage ? " • " : null}
          {it.storage ? <> {String(it.storage)} GB</> : null}
          {" • "}
          {it.qty}x
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onDec(it.id)}
          className="inline-flex h-7 w-7 items-center justify-center rounded border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
          aria-label="Diminuir"
        >
          <Plus className="hidden" />
          <span className="sr-only">Diminuir</span>
          −
        </button>
        <span className="w-6 text-center text-sm font-medium">{it.qty}</span>
        <button
          onClick={() => onInc(it.id)}
          className="inline-flex h-7 w-7 items-center justify-center rounded border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
          aria-label="Aumentar"
        >
          +
        </button>

        <button
          onClick={() => onRemove(it.id)}
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
  );
});

/* ====================== CEP / Frete (fake) ====================== */
function FreteForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [cep, setCep] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [endereco, setEndereco] = useState<EnderecoViaCep | null>(null);
  const [opcoes, setOpcoes] = useState<Frete[] | null>(null);

  useEffect(() => {
    if (!open) return;
    const saved = localStorage.getItem("prostore:cep");
    if (saved) setCep(saved);
  }, [open]);

  function consultar() {
    setErro(null);
    const v = (cep || "").replace(/\D/g, "");
    if (v.length !== 8) {
      setErro("CEP inválido");
      setEndereco(null);
      setOpcoes(null);
      return;
    }
    const fake: EnderecoViaCep = {
      cep: v.replace(/(\d{5})(\d{3})/, "$1-$2"),
      logradouro: "Rua Exemplo",
      bairro: "Centro",
      localidade: "Cidade",
      uf: "SP",
    };
    setEndereco(fake);
    setOpcoes([
      { tipo: "economico", prazo: "5 a 8 dias úteis", valor: 29.9 },
      { tipo: "expresso", prazo: "2 a 4 dias úteis", valor: 49.9 },
      { tipo: "retira", prazo: "Retire amanhã", valor: 0 },
    ]);
    localStorage.setItem("prostore:cep", v);
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
          <div>
            <strong>Endereço:</strong> {endereco.logradouro}, {endereco.bairro} - {endereco.localidade}/{endereco.uf}
          </div>
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

/* ====================== Página ====================== */
export default function CheckoutPage() {
  const { items, increase, decrease, remove, clear } = useCart();

  // ===== Admin (oculto ao público) =====
  const [showAdmin, setShowAdmin] = useState(false);
  const [waNumber, setWaNumber] = useState<string>("");

  useEffect(() => {
    try {
      const isLocal = window.location.hostname === "localhost";
      const isAdminParam = new URLSearchParams(window.location.search).has("admin");
      setShowAdmin(isLocal || isAdminParam);

      const savedWa = localStorage.getItem("prostore:wa");
      if (savedWa) setWaNumber(savedWa);
    } catch {}
  }, []);

  // ===== callbacks estáveis =====
  const onDec = useCallback((id: string) => decrease(id), [decrease]);
  const onInc = useCallback((id: string) => increase(id), [increase]);
  const onRemove = useCallback((id: string) => remove(id), [remove]);
  const onClear = useCallback(() => clear(), [clear]);

  // ===== derivados =====
  const subtotal = useMemo(
    () => (items ?? []).reduce((acc, i) => acc + (Number(i.price || 0) * Number(i.qty || 0)), 0),
    [items]
  );
  const desconto = useMemo(() => subtotal * 0.3, [subtotal]); // 30% OFF
  const total = useMemo(() => subtotal - desconto, [subtotal, desconto]);
  const allFreeShipping = useMemo(
    () => (items ?? []).length > 0 && (items ?? []).every((i) => !!i.freeShipping),
    [items]
  );

  // ===== pedido via WhatsApp =====
  function generateOrderCode(): string {
    const dt = new Date();
    const pad2 = (n: number) => String(n).padStart(2, "0");
    const date = `${dt.getFullYear()}${pad2(dt.getMonth() + 1)}${pad2(dt.getDate())}`;
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `PS-${date}-${rand}`;
  }

  function saveOrderLocal(order: Order) {
    const key = "prostore:orders";
    let arr: Order[] = [];
    try {
      arr = JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      arr = [];
    }
    arr.push(order);
    localStorage.setItem(key, JSON.stringify(arr));
    localStorage.setItem("prostore:lastOrder", JSON.stringify(order));
  }

  function formatCurrency(n: number) {
    return Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
  }

  function buildWhatsappUrl(order: Order): string {
    const lines: string[] = [];
    lines.push("📦 *Novo pedido*");
    lines.push(`Código: *${order.code}*`);
    lines.push("");
    lines.push("*Itens:*");
    order.items.forEach((it) => {
      lines.push(`• ${it.qty}x ${it.name} — ${formatCurrency(it.price)} (subtotal ${formatCurrency(it.total)})`);
    });
    lines.push("");
    lines.push(`Subtotal: ${formatCurrency(order.subtotal)}`);
    lines.push(`Cupom (30% OFF): - ${formatCurrency(order.discount)}`);
    lines.push(`*Total:* ${formatCurrency(order.total)}`);
    const text = encodeURIComponent(lines.join("\n"));

    // número salvo (somente dígitos, com DDI, ex: 55DDDNUMERO)
    const raw = (waNumber || "").replace(/\D/g, "");
    if (raw) return `https://wa.me/${raw}?text=${text}`;
    return `https://wa.me/?text=${text}`;
  }

  function finalizarPedido() {
    if (!items || items.length === 0) return;

    const code = generateOrderCode();
    const order: Order = {
      code,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        qty: i.qty,
        price: Number(i.price || 0),
        total: Number(i.price || 0) * Number(i.qty || 0),
      })),
      subtotal,
      discount: desconto,
      total,
      createdAt: new Date().toISOString(),
    };

    // salva na base local
    try {
      saveOrderLocal(order);
    } catch {}

    // abre WhatsApp
    const url = buildWhatsappUrl(order);
    window.open(url, "_blank", "noopener,noreferrer");

    // opcional: manter itens no carrinho para conferência. Se quiser limpar, descomente:
    // clear();
  }

  // ===== Admin: ver pedidos / exportar / salvar número WA =====
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    if (!showAdmin) return;
    try {
      const arr = JSON.parse(localStorage.getItem("prostore:orders") || "[]");
      setOrders(Array.isArray(arr) ? arr : []);
    } catch {
      setOrders([]);
    }
  }, [showAdmin]);

  function exportOrdersCsv() {
    try {
      const header = ["code", "createdAt", "name", "qty", "price", "itemTotal", "subtotal", "discount", "total"];
      const rows: string[][] = [];
      orders.forEach((o) => {
        o.items.forEach((it) => {
          rows.push([
            o.code,
            o.createdAt,
            it.name,
            String(it.qty),
            String(it.price).replace(".", ","),
            String(it.total).replace(".", ","),
            String(o.subtotal).replace(".", ","),
            String(o.discount).replace(".", ","),
            String(o.total).replace(".", ","),
          ]);
        });
      });
      const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pedidos-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {}
  }

  function saveWaNumber() {
    const onlyDigits = (waNumber || "").replace(/\D/g, "");
    localStorage.setItem("prostore:wa", onlyDigits);
    setWaNumber(onlyDigits);
    alert("Número do WhatsApp salvo!");
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
                  <CartItemRow
                    key={it.id}
                    it={it as CartItem}
                    onDec={onDec}
                    onInc={onInc}
                    onRemove={onRemove}
                  />
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

          {/* Painel Admin local/privado */}
          {showAdmin && (
            <Section title="Admin (visível só em localhost ou ?admin=1)">
              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-neutral-700">WhatsApp (DDI+DDD+Número):</label>
                  <input
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    placeholder="5599984905715"
                    className="input w-56"
                  />
                  <button onClick={saveWaNumber} className="btn-primary">Salvar número</button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button onClick={exportOrdersCsv} className="btn-secondary">Exportar pedidos (CSV)</button>
                  <button
                    onClick={() => { localStorage.removeItem("prostore:orders"); setOrders([]); }}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-2 font-medium hover:bg-neutral-50"
                  >
                    Limpar base local
                  </button>
                </div>

                <div className="mt-2 max-h-64 overflow-auto rounded border">
                  <table className="w-full text-xs">
                    <thead className="bg-neutral-50 text-neutral-700">
                      <tr>
                        <th className="p-2 text-left">Código</th>
                        <th className="p-2 text-left">Data</th>
                        <th className="p-2 text-left">Itens</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice().reverse().map((o) => (
                        <tr key={o.code} className="border-t">
                          <td className="p-2 font-medium">{o.code}</td>
                          <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                          <td className="p-2">
                            {o.items.map((it) => `${it.qty}x ${it.name}`).join(" • ")}
                          </td>
                          <td className="p-2 text-right font-semibold">{br(o.total)}</td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td className="p-2 text-neutral-500" colSpan={4}>Sem pedidos salvos ainda.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>
          )}
        </div>

        {/* COLUNA DIREITA */}
        <div className="space-y-6">
          <Section title="Resumo">
            <div className="space-y-3">
              {items && items.length > 0 ? (
                <ul className="space-y-2">
                  {items.map((it) => {
                    const src = normalizeSrc(it.image);
                    return (
                      <li key={it.id} className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-md overflow-hidden border bg-white">
                          {it.image ? (
                            <Image
                              src={src}
                              alt={it.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-contain"
                              unoptimized={isJfif(src)}
                              sizes="40px"
                            />
                          ) : null}
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="truncate">{it.name}</div>
                          <div className="text-neutral-500">
                            {it.qty}x • {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((it.price || 0))}
                          </div>
                        </div>
                        <div className="text-sm font-semibold">
                          {br((it.price || 0) * (it.qty || 0))}
                        </div>
                      </li>
                    );
                  })}
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
                  − {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(desconto)}
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

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={onClear}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Limpar
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href="/carrinho"
                    className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 whitespace-nowrap"
                  >
                    Ver carrinho
                  </Link>
                  <button
                    onClick={finalizarPedido}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 whitespace-nowrap"
                  >
                    Finalizar
                  </button>
                </div>
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
