// src/app/politica-de-cookies/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | proStore",
  description:
    "Entenda o que são cookies, como os usamos e como você pode gerenciar suas preferências no site da proStore.",
};

export default function CookiesPage() {
  return (
    <main className="container px-5 sm:px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Institucional</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">Política de Cookies</h1>
        <p className="mt-2 max-w-prose text-zinc-600">
          Explicamos abaixo os tipos de cookies utilizados e como ajustar suas preferências.
        </p>
      </header>

      <article className="mx-auto max-w-2xl space-y-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <section>
          <h2 className="text-lg font-medium text-zinc-900">1) O que são cookies?</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Cookies são pequenos arquivos armazenados no seu navegador que ajudam a lembrar suas
            preferências e a entender como você usa o site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">2) Tipos de cookies que usamos</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li><strong>Essenciais:</strong> necessários para funcionamento do site;</li>
            <li><strong>Performance:</strong> medem uso e melhoram a experiência;</li>
            <li><strong>Marketing:</strong> personalizam ofertas e anúncios.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">3) Como gerenciar preferências</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Você pode configurar seu navegador para bloquear ou excluir cookies. Também
            disponibilizamos controles em nossa <a className="underline underline-offset-2" href="/politica-de-privacidade">Política de Privacidade</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">4) Atualizações</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Esta Política pode ser atualizada para refletir melhorias ou mudanças regulatórias.
            Recomendamos revisão periódica.
          </p>
        </section>

        <p className="text-xs text-zinc-500">Última atualização: {new Date().toLocaleDateString()}</p>
      </article>
    </main>
  );
}
