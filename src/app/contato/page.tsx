// src/app/contato/page.tsx
import type { Metadata } from "next";

const PHONE = (process.env.NEXT_PUBLIC_SELLER_NUMBER || "99984905715").replace(/\D/g, "");

export const metadata: Metadata = {
  title: "Contato | proStore",
  description: "Fale com a proStore por WhatsApp ou e-mail. Atendimento humano e rápido.",
};

export default function ContactPage() {
  return (
    <main className="container px-5 sm:px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Atendimento</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">Contato</h1>
        <p className="mt-2 max-w-prose text-zinc-600">
          Preferimos resolver tudo pelo WhatsApp, mas você também pode enviar um e-mail.
        </p>
      </header>

      <section className="mx-auto max-w-2xl grid gap-4 sm:grid-cols-2">
        <a
          href={`https://wa.me/55${PHONE}?text=Ol%C3%A1%2C%20quero%20atendimento%20pelo%20boleto.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 hover:border-zinc-300 hover:shadow-sm"
        >
          <div>
            <h2 className="text-base font-medium text-zinc-900">WhatsApp</h2>
            <p className="mt-1 text-sm text-zinc-600">Atendimento humano • Seg–Sex, 9h–18h</p>
          </div>
          <span className="text-zinc-400">→</span>
        </a>

        <a
          href="mailto:contato@prostore.com.br"
          className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 hover:border-zinc-300 hover:shadow-sm"
        >
          <div>
            <h2 className="text-base font-medium text-zinc-900">E‑mail</h2>
            <p className="mt-1 text-sm text-zinc-600">contato@prostore.com.br</p>
          </div>
          <span className="text-zinc-400">→</span>
        </a>
      </section>
    </main>
  );
}
