// src/app/categorias/iphone/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "iPhone | proStore",
  description: "Linha iPhone com garantia e Nota Fiscal. Fale com a gente para disponibilidade.",
};

export default function IphoneCatPage() {
  return (
    <main className="container px-5 sm:px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Categorias</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">iPhone</h1>
        <p className="mt-2 max-w-prose text-zinc-600">
          Trabalhamos com as linhas mais procuradas, todas com NF‑e e garantia. Consulte disponibilidade
          pelo WhatsApp no rodapé ou pelo botão abaixo.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <p className="text-sm text-zinc-700">
          Viu algo no nosso Instagram e quer reservar? Envie o print do modelo/cor/capacidade.
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
