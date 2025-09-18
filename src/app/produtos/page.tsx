// src/app/produtos/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Produtos | proStore",
  description: "Veja todos os produtos e categorias disponíveis na proStore.",
};

export default function ProductsPage() {
  return (
    <main className="container px-5 sm:px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Catálogo</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">Produtos</h1>
        <p className="mt-2 max-w-prose text-zinc-600">
          Navegue por categoria ou fale com nosso atendimento pelo WhatsApp no rodapé.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-zinc-900">{c.title}</h2>
              <span className="text-zinc-400 transition group-hover:translate-x-0.5">→</span>
            </div>
            <p className="mt-1 text-sm text-zinc-600">{c.desc}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}

const CATEGORIES = [
  { title: "iPhone", href: "/categorias/iphone", desc: "Modelos novos com garantia e NF-e." },
  { title: "Samsung", href: "/categorias/samsung", desc: "Linha Galaxy com performance e câmera premium." },
  { title: "Xiaomi", href: "/categorias/xiaomi", desc: "Aviso de estoque e lista de espera." },
  { title: "Acessórios", href: "/categorias/acessorios", desc: "Capinhas, películas, cabos e carregadores." },
  { title: "Wearables", href: "/categorias/wearables", desc: "Relógios, fones e pulseiras inteligentes." },
  { title: "Casa Inteligente", href: "/categorias/casa-inteligente", desc: "Automação e dispositivos conectados." },
];
