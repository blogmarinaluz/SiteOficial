"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import products from "@/data/products.json";
import specs from "@/data/specs.json";
import { useCart } from "@/hooks/useCart";
import { br, withCoupon } from "@/lib/format";

type Product = {
  id: string;
  brand: string;
  model?: string;
  model_key?: string;
  name: string;
  image?: string;
  price: number;
  color?: string;
  storage?: string | number;
  tag?: string;
  freeShipping?: boolean;
};

type SpecEntry = {
  name: string;
  descricao: string;
  caracteristicas: Record<string, string>;
};

// --- utils ---
function normalize(str: string) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD") // remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function candidatesFromParam(raw: string) {
  const dec = decodeURIComponent(raw);
  const noExt = dec.replace(/\.[a-z0-9]+$/i, "");
  return Array.from(
    new Set([dec, noExt, dec.replace(/-/g, "_"), dec.replace(/_/g, "-")])
  );
}

// mapeamento simples UF -> região (para preço de frete)
const UF_REGION: Record<string, "N" | "NE" | "CO" | "SE" | "S"> = {
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

export default function ProductPage({ params }: { params: { id: string } }) {
  const { add } = useCart();

  // encontra produto base a partir do slug/ID que chegou pela rota
  const base = useMemo<Product | undefined>(() => {
    const list = products as Product[];
    const cands = candidatesFromParam(params.id);

    // 1) tenta por id direto (várias variações)
    for (const cand of cands) {
      const hit = list.find((i) => i.id === cand);
      if (hit) return hit;
    }
    // 2) tenta sem extensão e por slug do nome
    const bySlug = list.find((i) => {
      const idNoExt = i.id.replace(/\.[a-z0-9]+$/i, "");
      return (
        cands.includes(idNoExt) ||
        cands.includes(normalize(i.name)) ||
        cands.includes(normalize(idNoExt))
      );
    });
    return bySlug;
  }, [params.id]);

  // variantes por model_key (cores/armazenamento)
  const variantes = useMemo<Product[]>(() => {
    if (!base?.model_key) return base ? [base] : [];
    return (products as Product[]).filter((p) => p.model_key === base.model_key);
  }, [base]);

  const cores = useMemo(
    () =>
      Array.from(
        new Set(
          variantes
            .map((v) => (v.color || "").trim())
            .filter(Boolean)
        )
      ),
    [variantes]
  );

  const storages = useMemo(
    () =>
      Array.from(
        new Set(
          variantes
            .map((v) => String(v.storage || "").trim())
            .filter(Boolean)
        )
      ).sort((a, b) => Number(a) - Number(b)),
    [variantes]
  );

  const [cor, setCor] = useState<string | undefined>(base?.color);
  const [gb, setGb] = useState<string | undefined>(base?.storage ? String(base.storage) : undefined);

  // produto selecionado pela combinação cor + storage
  const selected = useMemo<Product | undefined>(() => {
    if (variantes.length === 0) return undefined;
    let cand = variantes.find(
      (v) => (!cor || v.color === cor) && (!gb || String(v.storage) === gb)
    );
    if (!cand) {
      // fallback por cor
      cand = variantes.find((v) => v.color === cor) || variantes[0];
    }
    return cand;
  }, [variantes, cor, gb]);

  // preço/parcelamento referentes ao selecionado
  const price = selected?.price || base?.price || 0;
  const parcela = useMemo(() => Math.ceil(price / 10), [price]);

  // --- CEP & frete ---
  const [cep, setCep] = useState("");
  const [end, setEnd] = useState<{ logradouro?: string; bairro?: string; localidade?: string; uf?: keyof typeof UF_REGION } | null>(null);
  const [frete, setFrete] = useState<{ tipo: "SEDEX" | "ECONOMICO"; valor: number; prazo: string }[] | null>(null);
  const [cepStatus, setCepStatus] = useState<"idle" | "buscando" | "erro">("idle");

  useEffect(() => {
    const raw = (cep || "").replace(/\D/g, "");
    if (raw.length !== 8) return;

    let abort = false;
    (async () => {
      try {
        setCepStatus("buscando");
        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        const json = await res.json();
        if (abort || json.erro) {
          setCepStatus("erro");
          setEnd(null);
          setFrete(null);
          return;
        }
        const uf: any = json.uf;
        const reg = UF_REGION[uf] || "SE";
        const tabela = [
          { tipo: "SEDEX" as const, valor: FRETE_TABELA.SEDEX[reg], prazo: PRAZO_TABELA.SEDEX[reg] },
          { tipo: "ECONOMICO" as const, valor: FRETE_TABELA.ECONOMICO[reg], prazo: PRAZO_TABELA.ECONOMICO[reg] },
        ];
        setEnd({ logradouro: json.logradouro, bairro: json.bairro, localidade: json.localidade, uf });
        setFrete(tabela);
        setCepStatus("idle");
      } catch {
        setCepStatus("erro");
      }
    })();

    return () => { abort = true; };
  }, [cep]);

  if (!base) {
    return (
      <div className="container py-8">
        <div className="rounded-2xl border p-6">
          <h1 className="text-xl font-bold mb-2">Produto não encontrado</h1>
          <Link href="/" className="btn-primary inline-block">Voltar para a Home</Link>
        </div>
      </div>
    );
  }

  function handleAdd() {
    if (!selected) return;
    // adiciona a variante escolhida
    add({
      ...selected,
      id: selected.id,
      name: selected.name,
      image: selected.image,
      price: selected.price,
      color: selected.color,
      storage: selected.storage,
      quantity: 1,
    });
    alert("Produto adicionado ao carrinho!");
  }

  const spec: SpecEntry | undefined = (specs as any)[base.model_key || ""];

  return (
    <div className="container py-6 grid gap-8 md:grid-cols-2">
      {/* imagem */}
      <div className="rounded-2xl border p-4 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selected?.image || base.image || "/placeholder.svg"}
          alt={base.name}
          className="max-h-[420px] w-auto object-contain"
        />
      </div>

      {/* infos */}
      <div>
        {base.tag ? (
          <div className="inline-flex items-center gap-2 font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
            {base.tag}
          </div>
        ) : null}

        <h1 className="text-2xl md:text-3xl font-extrabold mt-2">{base.name}</h1>

        {/* seletores */}
        <div className="mt-4 space-y-4">
          {cores.length > 0 && (
            <div>
              <div className="text-sm text-zinc-600 mb-1">Cor</div>
              <div className="flex flex-wrap gap-2">
                {cores.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCor(c)}
                    className={`px-3 py-1 rounded-full border text-sm ${cor === c ? "border-emerald-600 bg-emerald-50" : "border-zinc-300 hover:bg-zinc-50"}`}
                    aria-pressed={cor === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {storages.length > 0 && (
            <div>
              <div className="text-sm text-zinc-600 mb-1">Armazenamento</div>
              <div className="flex flex-wrap gap-2">
                {storages.map((s) => (
                  <button
                    key={s}
                    onClick={() => setGb(s)}
                    className={`px-3 py-1 rounded-full border text-sm ${gb === s ? "border-emerald-600 bg-emerald-50" : "border-zinc-300 hover:bg-zinc-50"}`}
                    aria-pressed={gb === s}
                  >
                    {s} GB
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* preços */}
        <div className="space-y-1 pt-4">
          <div className="text-3xl font-extrabold">{br(withCoupon(price))} no PIX</div>
          <div className="text-zinc-500">
            Ou <b>{br(price)}</b> em até <b>10x de {br(parcela)} <span className="text-emerald-600">sem juros</span></b>
          </div>
          {selected?.freeShipping ? (
            <div className="text-emerald-600 text-sm font-medium">Frete: Grátis</div>
          ) : null}
        </div>

        {/* ações */}
        <div className="flex gap-3 pt-3">
          <button className="btn-primary" onClick={handleAdd}>Adicionar ao carrinho</button>
          <Link href="/carrinho" className="btn-outline">Ver carrinho</Link>
        </div>

        {/* CEP & frete */}
        <div className="mt-6 rounded-2xl border p-4">
          <div className="font-semibold mb-2">Receba em seu endereço</div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              inputMode="numeric"
              placeholder="Digite seu CEP"
              className="flex-1 rounded-lg border px-3 py-2"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              maxLength={9}
            />
            <button className="btn-outline" onClick={() => setCep(cep)}>Consultar entrega</button>
          </div>
          {cepStatus === "buscando" && <div className="text-sm text-zinc-500 mt-2">Consultando CEP...</div>}
          {cepStatus === "erro" && <div className="text-sm text-red-600 mt-2">Não foi possível consultar o CEP.</div>}
          {end && (
            <div className="text-sm text-zinc-700 mt-3">
              Entrega para: <b>{[end.logradouro, end.bairro].filter(Boolean).join(" - ")}</b> — {end.localidade}/{end.uf}
            </div>
          )}
          {frete && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {frete.map((f) => (
                <div key={f.tipo} className="rounded-lg border p-3">
                  <div className="font-semibold">{f.tipo === "ECONOMICO" ? "Econômico" : "SEDEX"}</div>
                  <div className="text-sm text-zinc-600">{f.prazo}</div>
                  <div className="text-lg font-bold mt-1">{br(f.valor)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* descrição / especificações */}
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border p-4">
            <div className="font-semibold mb-1">Descrição do produto</div>
            <p className="text-sm text-zinc-700">
              {spec?.descricao || "Informações detalhadas em breve."}
            </p>
          </div>

          <div className="rounded-2xl border p-4">
            <div className="font-semibold mb-2">Características técnicas</div>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {spec?.caracteristicas
                ? Object.entries(spec.caracteristicas).map(([k, v]) => (
                    <div key={k} className="flex">
                      <dt className="w-40 text-zinc-500">{k}</dt>
                      <dd className="flex-1 font-medium">{v}</dd>
                    </div>
                  ))
                : <div className="text-zinc-500">Especificações conforme o fabricante.</div>}
            </dl>
          </div>
        </div>

        {/* informações importantes */}
        <div className="mt-6 rounded-2xl border p-4 space-y-2 text-sm">
          <div><b>Produto vendido e entregue por proStore</b></div>
          <div>180 dias de garantia</div>
          <div>Homologado pela Anatel</div>
          <div>Produto novo e original com Nota Fiscal</div>
        </div>

        <div className="text-xs text-zinc-500 pt-4">
          * Desconto de 30% aplicado no carrinho automaticamente. Pagamento finalizado no WhatsApp.
        </div>
      </div>
    </div>
  );
}
