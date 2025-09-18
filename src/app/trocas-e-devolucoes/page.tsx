// src/app/trocas-e-devolucoes/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trocas e Devoluções | proStore",
  description:
    "Política de trocas, devoluções e reembolso da proStore. Prazos, condições, frete reverso e passo a passo.",
};

export default function ReturnsPage() {
  return (
    <main className="container px-5 sm:px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Ajuda
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
          Trocas e Devoluções
        </h1>
        <p className="mt-2 max-w-prose text-zinc-600">
          Política transparente para sua segurança. Siga o passo a passo abaixo e, se
          precisar, fale com a gente pelo WhatsApp no rodapé.
        </p>
      </header>

      <article className="mx-auto max-w-2xl space-y-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <section>
          <h2 className="text-lg font-medium text-zinc-900">1) Direito de arrependimento</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            Você pode desistir da compra em até <strong>7 dias corridos</strong> após o recebimento
            (art. 49 do CDC). O produto deve estar com <strong>lacre intacto</strong>, sem sinais de uso
            e com todos os acessórios/itens da embalagem.
          </p>
          <p className="mt-2 text-sm text-zinc-700">
            Após a conferência, realizaremos <strong>reembolso integral</strong> pelo mesmo meio de pagamento.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">2) Troca por defeito (vício)</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Constatado vício de fabricação dentro de <strong>7 dias corridos</strong>, efetuamos
            <strong> troca imediata</strong>. Após esse prazo, o produto segue para diagnóstico em
            assistência autorizada dentro da <strong>garantia legal de 90 dias</strong> e/ou garantia do fabricante.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">3) Como solicitar</h2>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-zinc-700">
            <li>Abra um chamado via WhatsApp (rodapé) informando número do pedido e CPF/CNPJ;</li>
            <li>Anexe fotos/vídeo do produto e dos acessórios (e do IMEI/serial quando houver);</li>
            <li>Receba a <strong>autorização de postagem</strong> (frete reverso) e leve à unidade indicada;</li>
            <li>Acompanhamos o processo e te mantemos atualizado até a troca ou reembolso.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">4) Condições de elegibilidade</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>Produto sem indícios de mau uso, quedas ou oxidação;</li>
            <li>Todos os itens da embalagem, manuais e brindes;</li>
            <li>NF‑e (XML ou PDF) enviada junto ao chamado.</li>
          </ul>
          <p className="mt-2 text-sm text-zinc-700">
            Itens personalizados, danificados por uso indevido ou com <strong>lacre violado</strong>
            fora do prazo de arrependimento não são elegíveis a devolução.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">5) Prazos de estorno</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li><strong>Pix/Boleto:</strong> até 2 dias úteis após aprovação da conferência;</li>
            <li><strong>Cartão de crédito:</strong> solicitação em até 2 dias úteis; crédito conforme a operadora (1–2 faturas).</li>
          </ul>
        </section>

        <section className="rounded-xl bg-zinc-50 p-4">
          <h3 className="text-sm font-medium text-zinc-900">Dicas para agilizar</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>Guarde a embalagem por 7 dias — facilita trocas por arrependimento;</li>
            <li>Envie vídeos nítidos do defeito e do número de série;</li>
            <li>Mantenha conversas pelo mesmo protocolo para histórico completo.</li>
          </ul>
        </section>
      </article>
    </main>
  );
}
