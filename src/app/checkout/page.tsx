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

type Frete = { tipo: "expresso" | "economico" | "retira"; prazo: string; valor: number };

type Order = {
  code: string;
  items: Array<{ id: string; name: string; qty: number; price: number; total: number }>;
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
  { id: "boleto", label: "Boleto parcelado", desc: "Parcele no boleto (pode ser para negativados) • 30% OFF à vista", icon: Receipt },
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
        <Link href={`/produto/${it.id}`} className="block text-sm font-medium hover:underline whitespace-nowrap overflow-hidden text-ellipsis">
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
function FreteForm({ open, onClose, onChoose }: { open: boolean; onClose: () => void; onChoose?: (f: Frete) => void }) {
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
          className="w-40 h-11 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
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
        <div className="mt-2 grid gap-2">
          {opcoes.map((o) => (
            <div key={o.tipo} role="button" tabIndex={0} onClick={() => { try { localStorage.setItem('prostore:frete', JSON.stringify(o)); } catch {} if (onChoose) onChoose(o); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); try { localStorage.setItem('prostore:frete', JSON.stringify(o)); } catch {} if (onChoose) onChoose(o); } }} className={"flex items-center justify-between rounded-xl border px-4 py-3 hover:bg-neutral-50 " + (((typeof window !== "undefined") && (() => { try { const s = localStorage.getItem('prostore:frete'); if (!s) return false; const f = JSON.parse(s); return f && f.tipo === o.tipo && Number(f.valor) === Number(o.valor); } catch { return false } })()) ? "bg-emerald-50 border-emerald-200" : "bg-white")}>
              <div className="flex items-start gap-3">
                <Truck className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-semibold capitalize">{o.tipo}</div>
                  <div className="text-xs text-neutral-600">Entrega estimada • {o.prazo}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-base font-semibold tabular-nums">{br(o.valor)}</div>
                <button
                  onClick={() => { try { localStorage.setItem('prostore:frete', JSON.stringify(o)); } catch {} }}
                  className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1.5 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-[0.99]"
                >
                  Escolher
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

/* ====================== Supabase (REST do navegador) ====================== */
async function supabaseInsert(order: Order) {
  try {
    const url = localStorage.getItem("prostore:supa:url") || "";
    const key = localStorage.getItem("prostore:supa:key") || "";
    const table = localStorage.getItem("prostore:supa:table") || "orders";
    if (!url || !key) return;

    const payload = {
      code: order.code,
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      created_at: order.createdAt,
      items: order.items, // jsonb na tabela
    };

    await fetch(`${url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // silencioso no cliente
  }
}

async function supabaseList(limit = 50) {
  const url = localStorage.getItem("prostore:supa:url") || "";
  const key = localStorage.getItem("prostore:supa:key") || "";
  const table = localStorage.getItem("prostore:supa:table") || "orders";
  if (!url || !key) return [];
  const res = await fetch(`${url}/rest/v1/${table}?select=*&order=created_at.desc&limit=${limit}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) return [];
  return res.json();
}

/* ====================== Página ====================== */
export default function CheckoutPage() {
  const { items, increase, decrease, remove, clear } = useCart();

  // ===== Admin oculto =====
  const [showAdmin, setShowAdmin] = useState(false);
  const [waNumber, setWaNumber] = useState<string>("");

  const [supaUrl, setSupaUrl] = useState("");
  const [supaKey, setSupaKey] = useState("");
  const [supaTable, setSupaTable] = useState("orders");
  const [remoteOrders, setRemoteOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const isLocal = window.location.hostname === "localhost";
      const isAdminParam = new URLSearchParams(window.location.search).has("admin");
      setShowAdmin(isLocal || isAdminParam);

      const savedWa = localStorage.getItem("prostore:wa");
      if (savedWa) setWaNumber(savedWa);

      const u = localStorage.getItem("prostore:supa:url") || "";
      const k = localStorage.getItem("prostore:supa:key") || "";
      const t = localStorage.getItem("prostore:supa:table") || "orders";
      setSupaUrl(u);
      setSupaKey(k);
      setSupaTable(t);
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
  const discount = useMemo(() => subtotal * 0.3, [subtotal]); // 30% OFF
  const allFreeShipping = useMemo(
    () => (items ?? []).length > 0 && (items ?? []).every((i) => !!i.freeShipping),
    [items]
  );

  
  
const [freteEscolhido, setFreteEscolhido] = useState<Frete | null>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('prostore:frete');
      if (saved) setFreteEscolhido(JSON.parse(saved));
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'prostore:frete' && e.newValue) {
        try { setFreteEscolhido(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

const total = useMemo(() => subtotal - discount + (allFreeShipping ? 0 : Number(freteEscolhido?.valor || 0)), [subtotal, discount, allFreeShipping, freteEscolhido]);
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

  function fmt(n: number) {
    return Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
  }

  function buildWhatsappUrl(order: Order): string {
    const lines: string[] = [];
    lines.push("📦 *Novo pedido*");
    lines.push(`Código: *${order.code}*`);
    lines.push("");
    lines.push("*Itens:*");
    order.items.forEach((it) => {
      lines.push(`• ${it.qty}x ${it.name} — ${fmt(it.price)} (subtotal ${fmt(it.total)})`);
    });
    lines.push("");
    lines.push(`Subtotal: ${fmt(order.subtotal)}`);
    lines.push(`Cupom (30% OFF): - ${fmt(order.discount)}`);
    lines.push(`*Total:* ${fmt(order.total)}`);
    const text = encodeURIComponent(lines.join("\n"));

    const raw = (waNumber || "").replace(/\D/g, "");
    if (raw) return `https://wa.me/${raw}?text=${text}`;
    return `https://wa.me/?text=${text}`;
  }

  async function finalizarPedido() {
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
      discount,
      total,
      createdAt: new Date().toISOString(),
    };

    // salva local + supabase (se configurado) + abre WhatsApp
    try { saveOrderLocal(order); } catch {}
    try { await supabaseInsert(order); } catch {}
    const url = buildWhatsappUrl(order);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // ===== Admin: salvar configs, listar e exportar pedidos do Supabase =====
  function saveWa() {
    const onlyDigits = (waNumber || "").replace(/\D/g, "");
    localStorage.setItem("prostore:wa", onlyDigits);
    setWaNumber(onlyDigits);
  }
  function saveSupa() {
    localStorage.setItem("prostore:supa:url", supaUrl.trim().replace(/\/+$/, ""));
    localStorage.setItem("prostore:supa:key", supaKey.trim());
    localStorage.setItem("prostore:supa:table", supaTable.trim() || "orders");
  }
  async function loadRemote() {
    const rows = await supabaseList(100);
    setRemoteOrders(Array.isArray(rows) ? rows : []);
  }
  function exportRemoteCsv() {
    const header = ["code","created_at","subtotal","discount","total","items"];
    const rows = remoteOrders.map((o:any)=>[
      o.code, o.created_at, String(o.subtotal).replace(".",","), String(o.discount).replace(".",","), String(o.total).replace(".",","), JSON.stringify(o.items)
    ]);
    const csv = [header,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `pedidos-remotos-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="container-safe pt-16 md:pt-20 pb-28 grid gap-6 lg:grid-cols-[1fr_380px]">
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
              <FreteForm open={true} onClose={() => {}} onChoose={(f) => setFreteEscolhido(f)} />
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
              <div className="space-y-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-neutral-700">WhatsApp (DDI+DDD+Número):</label>
                  <input value={waNumber} onChange={(e) => setWaNumber(e.target.value)} placeholder="55XXXXXXXXXXX" className="input w-56" />
                  <button onClick={saveWa} className="btn-primary">Salvar número</button>
                </div>

                <div className="grid gap-2">
                  <div className="font-medium text-neutral-800">Supabase (REST)</div>
                  <input value={supaUrl} onChange={(e)=>setSupaUrl(e.target.value)} className="input" placeholder="https://xxxx.supabase.co" />
                  <input value={supaKey} onChange={(e)=>setSupaKey(e.target.value)} className="input" placeholder="Anon/Public Key" />
                  <input value={supaTable} onChange={(e)=>setSupaTable(e.target.value)} className="input" placeholder="orders" />
                  <div className="flex flex-wrap gap-2">
                    <button onClick={saveSupa} className="btn-primary">Salvar config</button>
                    <button onClick={loadRemote} className="btn-secondary">Listar pedidos remotos</button>
                    <button onClick={exportRemoteCsv} className="rounded-lg border border-neutral-200 bg-white px-3 py-2 font-medium hover:bg-neutral-50">Exportar CSV</button>
                  </div>
                </div>

                <div className="mt-2 max-h-64 overflow-auto rounded border">
                  <table className="w-full text-xs">
                    <thead className="bg-neutral-50 text-neutral-700">
                      <tr>
                        <th className="p-2 text-left">Código</th>
                        <th className="p-2 text-left">Data</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {remoteOrders.map((o:any)=>(
                        <tr key={o.code} className="border-t">
                          <td className="p-2 font-medium">{o.code}</td>
                          <td className="p-2">{new Date(o.created_at).toLocaleString()}</td>
                          <td className="p-2 text-right font-semibold">{br(Number(o.total||0))}</td>
                        </tr>
                      ))}
                      {remoteOrders.length===0 && (
                        <tr><td className="p-2 text-neutral-500" colSpan={3}>Nenhum pedido remoto carregado.</td></tr>
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
                            <Image src={src} alt={it.name} width={40} height={40} className="h-full w-full object-contain" unoptimized={isJfif(src)} sizes="40px" />
                          ) : null}
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="truncate">{it.name}</div>
                          <div className="text-neutral-500">{it.qty}x • {fmt(Number(it.price || 0))}</div>
                        </div>
                        <div className="text-sm font-semibold">{br((it.price || 0) * (it.qty || 0))}</div>
                      </li>
                    );
                  })}
                </ul>
              ) : null}

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium text-neutral-900">{fmt(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Cupom (30% OFF)</span>
                <span className="font-medium text-emerald-700">− {fmt(discount)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Frete</span>
                <span className="font-medium">{allFreeShipping ? "Grátis" : fmt(Number(freteEscolhido?.valor || 0))}</span>
              </div>

              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>

              {allFreeShipping && <div className="text-xs font-medium text-emerald-700">Frete grátis</div>}

              <div className="pt-2 flex items-center justify-between">
                <button onClick={onClear} className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Limpar</button>

                <div className="flex items-center gap-2">
                  <Link href="/carrinho" className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 whitespace-nowrap">Ver carrinho</Link>
                  <button onClick={finalizarPedido} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 whitespace-nowrap">Finalizar</button>
                </div>
              </div>
            </div>
          </Section>

          <div className="note">
            <div className="trust">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Ambiente seguro</span>
            </div>
            <p className="mt-2 text-sm">Seus dados são protegidos e utilizados somente para processar seu pedido.</p>
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
