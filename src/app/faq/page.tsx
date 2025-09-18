// src/app/faq/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perguntas frequentes | proStore",
  description:
    "Tire suas dúvidas sobre preços, boleto para negativados, prazos de entrega e emissão de Nota Fiscal na proStore.",
};

export default function FAQPage() {
  return (
    <main className="container px-5 sm:px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Ajuda
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
          Perguntas frequentes
        </h1>
        <p className="mt-2 max-w-prose text-zinc-600">
          Reunimos as respostas para as dúvidas mais comuns. Se precisar de suporte
          humano, fale com a gente pelo WhatsApp no rodapé do site.
        </p>
      </header>

      <section className="mx-auto max-w-2xl divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
        <details className="group p-5 [&_summary]:marker:content-none">
          <summary className="flex cursor-pointer items-start justify-between gap-6 text-left">
            <div>
              <h2 className="text-base font-medium text-zinc-900">
                Por que nossos preços são mais baixos?
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Transparência total sobre a nossa formação de preço.
              </p>
            </div>
            <span className="select-none text-zinc-400 group-open:rotate-45 transition">＋</span>
          </summary>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-700">
            <p>
              Trabalhamos com <strong>parcerias diretas com distribuidores</strong> e operação
              enxuta de e‑commerce (sem lojas físicas), o que reduz custos fixos e nos permite
              repassar economia ao cliente.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Negociação de volume com fornecedores homologados;</li>
              <li>Logística otimizada e centros de distribuição regionais;</li>
              <li>Campanhas sazonais com subsídio no Pix e Boleto.</li>
            </ul>
            <p>
              Resultado: preço competitivo <em>sem abrir mão</em> de garantia, Nota Fiscal e canais
              de atendimento. Se encontrar o mesmo produto mais barato com as mesmas condições,
              chame a gente: tentamos <strong>cobrir a oferta</strong> sempre que possível.
            </p>
          </div>
        </details>

        <details className="group p-5 [&_summary]:marker:content-none">
          <summary className="flex cursor-pointer items-start justify-between gap-6 text-left">
            <div>
              <h2 className="text-base font-medium text-zinc-900">
                Boleto para negativados: como funciona?
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Opção pensada para quem precisa comprar mesmo com restrição.
              </p>
            </div>
            <span className="select-none text-zinc-400 group-open:rotate-45 transition">＋</span>
          </summary>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-700">
            <p>
              Oferecemos <strong>boleto à vista</strong> com desconto e <strong>boleto parcelado</strong> via
              parceiro financeiro, sujeito à análise instantânea. Não exigimos cartão de crédito.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Boleto à vista: confirmação automática em até 1 dia útil após o pagamento;</li>
              <li>Boleto parcelado: aprovação em minutos conforme política do parceiro;</li>
              <li>Nenhuma parcela é antecipada sem sua autorização.</li>
            </ul>
            <p>
              Seus dados são protegidos conforme nossa <a className="underline underline-offset-2" href="/politica-de-privacidade">Política de Privacidade</a>.
              Em caso de dúvida, fale com nosso time de atendimento pelo WhatsApp.
            </p>
          </div>
        </details>

        <details className="group p-5 [&_summary]:marker:content-none">
          <summary className="flex cursor-pointer items-start justify-between gap-6 text-left">
            <div>
              <h2 className="text-base font-medium text-zinc-900">
                Entrega e Nota Fiscal: o que esperar?
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Prazos, rastreio e emissão fiscal em todos os pedidos.
              </p>
            </div>
            <span className="select-none text-zinc-400 group-open:rotate-45 transition">＋</span>
          </summary>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-700">
            <p>
              Todos os pedidos acompanham <strong>Nota Fiscal eletrônica (NF‑e)</strong> emitida no
              momento da expedição. Você recebe o XML/PDF por e‑mail e pode baixar na área do cliente.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Prazo de postagem:</strong> em até 1 dia útil após a confirmação do pagamento;</li>
              <li><strong>Rastreio:</strong> código enviado por e‑mail/SMS assim que a transportadora coleta;</li>
              <li><strong>Seguro:</strong> todas as remessas são seguradas contra extravio e avaria.</li>
            </ul>
            <p>
              Se o prazo estimado for ultrapassado, nossa equipe aciona a transportadora e mantém você
              informado até a entrega ou <strong>reembolso integral</strong>, conforme a sua escolha.
            </p>
          </div>
        </details>
      </section>
    </main>
  );
}
