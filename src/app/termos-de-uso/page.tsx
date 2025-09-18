// src/app/termos-de-uso/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | proStore",
  description:
    "Condições de uso do site, responsabilidades, compras, pagamentos, entregas e limitações de responsabilidade.",
};

export default function TermsPage() {
  return (
    <main className="container px-5 sm:px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Institucional</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">Termos de Uso</h1>
        <p className="mt-2 max-w-prose text-zinc-600">
          Ao acessar e utilizar este site, você concorda com os termos abaixo. Leia com atenção.
        </p>
      </header>

      <article className="mx-auto max-w-2xl space-y-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <section>
          <h2 className="text-lg font-medium text-zinc-900">1) Conta e cadastro</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Você é responsável por manter a confidencialidade de suas credenciais. Informações
            fornecidas devem ser verdadeiras, completas e atualizadas.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">2) Compras e pagamentos</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>Preços, promoções e condições podem ser alterados sem aviso;</li>
            <li>Pedidos estão sujeitos à aprovação de pagamento e antifraude;</li>
            <li>Em caso de divergência, prevalece a NF‑e emitida.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">3) Entregas</h2>
          <p className="mt-2 text-sm text-zinc-700">
            O prazo exibido no checkout é uma estimativa. Acompanhamos o transporte com rastreio
            e notificações. Em caso de atraso significativo, você pode optar por
            <strong> reembolso integral</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">4) Propriedade intelectual</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Marcas, nomes, layout e conteúdos deste site não podem ser utilizados sem autorização.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">5) Limitação de responsabilidade</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Em nenhuma hipótese seremos responsáveis por danos indiretos decorrentes do uso deste
            site, na máxima extensão permitida pela legislação aplicável.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">6) Contato e foro</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Dúvidas? Fale com <a className="underline underline-offset-2" href="mailto:contato@prostore.com.br">contato@prostore.com.br</a>.
            Fica eleito o foro do domicílio do consumidor para dirimir controvérsias.
          </p>
        </section>

        <p className="text-xs text-zinc-500">Última atualização: {new Date().toLocaleDateString()}</p>
      </article>
    </main>
  );
}
