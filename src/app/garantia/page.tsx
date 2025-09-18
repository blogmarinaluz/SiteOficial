// src/app/garantia/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Garantia e Assistência | proStore",
  description:
    "Política de garantia oficial, prazos, cobertura, assistência técnica e como acionar o suporte da proStore.",
};

export default function WarrantyPage() {
  return (
    <main className="container px-5 sm:px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Ajuda
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
          Garantia e Assistência
        </h1>
        <p className="mt-2 max-w-prose text-zinc-600">
          Transparência total sobre cobertura, prazos e o passo a passo para acionar a garantia sem burocracia.
        </p>
      </header>

      <article className="mx-auto max-w-2xl space-y-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <section>
          <h2 className="text-lg font-medium text-zinc-900">1) Cobertura da garantia</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            Todos os produtos vendidos na proStore são novos, com <strong>NF‑e</strong> e possuem
            <strong> garantia legal de 90 dias</strong> contra defeitos de fabricação, além da
            <strong> garantia do fabricante</strong> quando aplicável. A garantia cobre vícios de fabricação
            e falhas funcionais que não sejam decorrentes de mau uso.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>Defeitos elétricos/eletrônicos não causados por agente externo;</li>
            <li>Falhas de bateria/placa dentro dos parâmetros do fabricante;</li>
            <li>Problemas de firmware/soft­ware de origem.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">2) O que não está coberto</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>Quedas, oxidação por líquidos, violação do lacre ou uso de acessórios não homologados;</li>
            <li>Danos cosméticos (riscos/arranhões) sem impacto funcional;</li>
            <li>Instalações/alterações não autorizadas de software (root/jailbreak).</li>
          </ul>
          <p className="mt-2 text-sm text-zinc-700">
            Em caso de dúvida, nosso time avalia tecnicamente e orienta o caminho mais rápido.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">3) Prazo e como acionar</h2>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-zinc-700">
            <li>
              <strong>Solicite o chamado</strong> via WhatsApp no rodapé informando número do pedido,
              CPF/CNPJ e descrição do problema (fotos/vídeos ajudam).
            </li>
            <li>
              <strong>Triagem</strong> em até 1 dia útil: confirmamos cobertura, orientamos teste rápido e,
              se necessário, enviamos autorização de postagem sem custo.
            </li>
            <li>
              <strong>Diagnóstico</strong> em assistência autorizada: laudo em até 7 dias corridos.
              Se houver defeito coberto, realizamos conserto ou substituição.
            </li>
          </ol>
          <p className="mt-2 text-sm text-zinc-700">
            Se o reparo ultrapassar o prazo legal, você pode escolher entre
            <strong> produto novo</strong> equivalente ou <strong>reembolso integral</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">4) Garantia do fabricante</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            Muitos fabricantes disponibilizam <strong>atendimento direto</strong> em sua rede
            autorizada. Quando for mais rápido, indicamos o posto mais próximo para você acionar
            sem intermediação — mantendo seu direito preservado.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-900">5) Prazos de troca imediata</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Se houver <strong>vício aparente até 7 dias corridos</strong> do recebimento,
            efetuamos <strong>troca imediata</strong> após análise simples do produto e acessórios.
          </p>
        </section>

        <section className="rounded-xl bg-zinc-50 p-4">
          <h3 className="text-sm font-medium text-zinc-900">Documentos necessários</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>NF‑e (XML ou PDF) — enviada por e‑mail;</li>
            <li>Fotos/vídeo do defeito e do IMEI/serial;</li>
            <li>Endereço para coleta/devolução.</li>
          </ul>
        </section>
      </article>
    </main>
  );
}
