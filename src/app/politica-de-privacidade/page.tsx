// src/app/politica-de-privacidade/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | proStore",
  description:
    "Saiba como a proStore coleta, utiliza e protege seus dados pessoais. Direitos do titular, base legal, retenção e segurança.",
};

export default function PrivacyPage() {
  return (
    <main className="container px-5 sm:px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Institucional</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">Política de Privacidade</h1>
        <p className="mt-2 max-w-prose text-zinc-600">
          Esta Política explica de forma transparente como tratamos seus dados pessoais, em
          conformidade com a LGPD (Lei nº 13.709/2018).
        </p>
      </header>

      <article className="mx-auto max-w-2xl space-y-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <section>
          <h2 className="text-lg font-medium text-zinc-900">1) Dados coletados</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li><strong>Cadastro:</strong> nome, CPF/CNPJ, e‑mail, telefone;</li>
            <li><strong>Pedido e faturamento:</strong> endereço, forma de pagamento (tokens, nunca guardamos dados completos do cartão);</li>
            <li><strong>Navegação:</strong> cookies e identificadores para analytics e personalização.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">2) Finalidades e bases legais</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li><strong>Execução do contrato:</strong> processamento de pedidos, faturamento e entrega;</li>
            <li><strong>Legítimo interesse:</strong> prevenção a fraudes, melhoria de experiência e métricas;</li>
            <li><strong>Consentimento:</strong> comunicações de marketing e newsletters (opt‑in e opt‑out a qualquer momento).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">3) Compartilhamento</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            Compartilhamos seus dados apenas com <strong>operadores necessários</strong> (meios de pagamento,
            antifraude, logística/transportadoras, atendimento), sempre sob contrato e com
            obrigações de segurança e confidencialidade.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">4) Retenção e segurança</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Retemos os dados pelo tempo necessário às finalidades e por prazos legais (ex.: documentos fiscais).
            Adotamos <strong>criptografia TLS</strong>, controles de acesso e auditoria de eventos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">5) Direitos do titular</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>Acesso, correção, portabilidade e eliminação;</li>
            <li>Informação sobre uso e compartilhamento;</li>
            <li>Revogação de consentimento e oposição ao tratamento em hipóteses legais.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">6) Cookies e preferências</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Utilizamos cookies essenciais, de performance e de marketing. Você pode gerenciar
            preferências em <a className="underline underline-offset-2" href="/politica-de-cookies">Política de Cookies</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">7) Contato do Encarregado (DPO)</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Para exercer seus direitos, contate: <a className="underline underline-offset-2" href="mailto:privacidade@prostore.com.br">privacidade@prostore.com.br</a>.
          </p>
        </section>

        <p className="text-xs text-zinc-500">Última atualização: {new Date().toLocaleDateString()}</p>
      </article>
    </main>
  );
}
