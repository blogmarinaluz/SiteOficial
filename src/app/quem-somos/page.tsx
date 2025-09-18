// src/app/quem-somos/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quem somos | proStore",
  description:
    "Conheça a proStore: missão, valores, diferenciais, operação logística, segurança e dados da empresa.",
};

export default function AboutPage() {
  const CNPJ = process.env.NEXT_PUBLIC_CNPJ || "00.000.000/0000-00";

  return (
    <main className="container px-5 sm:px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Institucional</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">Quem somos</h1>
        <p className="mt-2 max-w-prose text-zinc-600">
          Somos especialistas em celulares novos com garantia, combinando preço competitivo
          com uma experiência de compra segura e atendimento humano.
        </p>
      </header>

      <article className="mx-auto max-w-2xl space-y-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <section>
          <h2 className="text-lg font-medium text-zinc-900">Propósito</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            Democratizar o acesso a tecnologia de ponta, com transparência, responsabilidade e
            respeito ao consumidor. Acreditamos que um bom atendimento é tão importante quanto um bom preço.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">Como garantimos preços melhores</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>Parcerias diretas com distribuidores homologados;</li>
            <li>Operação enxuta de e‑commerce (sem lojas físicas);</li>
            <li>Logística com centros regionais e fretes otimizados.</li>
          </ul>
          <p className="mt-2 text-sm text-zinc-700">
            Tudo isso sem abrir mão de <strong>NF‑e</strong>, garantia oficial e canais de suporte.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">Diferenciais</h2>
          <ul className="mt-2 grid list-none grid-cols-1 gap-3 text-sm text-zinc-700 sm:grid-cols-2">
            <li className="rounded-lg border border-zinc-200 p-3">Atendimento humano via WhatsApp</li>
            <li className="rounded-lg border border-zinc-200 p-3">Nota Fiscal e garantia em todos os pedidos</li>
            <li className="rounded-lg border border-zinc-200 p-3">Pagamento no Pix, Boleto (à vista e parcelado) e Cartão</li>
            <li className="rounded-lg border border-zinc-200 p-3">Rastreio em tempo real e seguro de transporte</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">Segurança e privacidade</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Utilizamos criptografia TLS e práticas rígidas de proteção de dados. Suas informações
            são tratadas conforme nossa <a className="underline underline-offset-2" href="/politica-de-privacidade">Política de Privacidade</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">Dados da empresa</h2>
          <p className="mt-2 text-sm text-zinc-700">
            CNPJ: <span className="font-medium">{CNPJ}</span> — vendas para todo o Brasil.
          </p>
        </section>
      </article>
    </main>
  );
}
