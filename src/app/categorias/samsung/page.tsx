// src/app/categorias/samsung/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Samsung | proStore",
  description: "Linha Samsung Galaxy com garantia e Nota Fiscal. Consulte disponibilidade e ofertas.",
};

export default function SamsungCatPage() {
  return (
    <main className="container px-5 sm:px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Categorias</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">Samsung</h1>
        <p className="mt-2 max-w-prose text-zinc-600">
          Ofertas em Galaxy S, A e FE com garantia. Verifique disponibilidade via WhatsApp ou pelo botão abaixo.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <p className="text-sm text-zinc-700">
          Procurando um modelo específico? Envie a referência (ex.: S23 256GB) que retornamos com preço e prazo.
        </p>
        <div className="mt-4">
          <Link href="/contato" className="inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:brightness-95">
            Falar com atendimento
          </Link>
        </div>
      </div>
    </main>
  );
}
