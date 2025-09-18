// src/app/categorias/casa-inteligente/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Casa Inteligente | proStore",
  description: "Categoria temporariamente sem estoque; entre na lista de espera.",
};

export default function StockOutPage() {
  return (
    <main className="container px-5 sm:px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Categorias</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">Casa Inteligente</h1>
        <p className="mt-2 max-w-prose text-zinc-600">
          No momento nosso estoque para esta categoria está <strong>temporariamente esgotado</strong>.
          Podemos te avisar assim que os itens retornarem.
        </p>
      </header>

      <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6">
        <p className="text-sm text-zinc-700">
          Deixe seu e‑mail na Newsletter (rodapé) ou fale com o atendimento para entrar na lista de espera.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/contato" className="inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:brightness-95">
            Falar com atendimento
          </Link>
          <a href="#newsletter" className="inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:border-zinc-400">
            Cadastrar na Newsletter
          </a>
        </div>
      </div>
    </main>
  );
}
