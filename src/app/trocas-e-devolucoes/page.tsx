export const metadata = {
  title: "Trocas e Devoluções | proStore",
  description:
    "Política de trocas, devoluções e arrependimento para compras realizadas na proStore.",
};

export default function Page() {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
        Trocas e Devoluções
      </h1>
      <p className="mt-2 max-w-3xl text-zinc-600">
        Abaixo você encontra as regras e o passo a passo para solicitar
        devolução por arrependimento, troca ou análise de garantia.
      </p>

      <Section title="1) Arrependimento (até 7 dias)">
        Para compras on-line, você pode desistir em até{" "}
        <strong>7 dias corridos</strong> após o recebimento (CDC, art. 49). O
        produto deve estar sem uso, sem marcas, com todos os acessórios,
        manuais e embalagem original. Após conferência, efetuamos o reembolso
        conforme o meio de pagamento.
      </Section>

      <Section title="2) Produto com defeito (garantia)">
        Caso o produto apresente defeito de fabricação dentro do prazo de
        garantia do fabricante, entre em contato com nosso suporte para
        orientação de análise/técnica. Itens danificados por mau uso, queda ou
        oxidação não se enquadram.
      </Section>

      <Section title="3) Trocas por avaria no transporte">
        Recuse a entrega se a embalagem estiver violada ou danificada. Se
        identificar avaria após o recebimento, comunique em até 48h com fotos
        do estado da embalagem e do produto.
      </Section>

      <Section title="4) Como solicitar">
        • Envie e-mail para{" "}
        <a className="underline" href="mailto:suporte@proStore.com">
          suporte@proStore.com
        </a>{" "}
        com número do pedido, motivo e fotos (quando aplicável). <br />
        • Nosso time responde com as instruções de postagem/ coleta e prazos.{" "}
        <br />• Em devoluções por arrependimento, poderá haver abatimento de
        custos logísticos quando previsto em lei.
      </Section>

      <div className="mt-8 rounded-2xl bg-zinc-50 p-5 text-sm text-zinc-700">
        Dúvidas? Consulte nossos{" "}
        <a className="underline" href="/termos-de-uso">
          Termos de Uso
        </a>{" "}
        ou fale com o suporte.
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
      <p className="mt-2 leading-relaxed text-zinc-700">{children}</p>
    </section>
  );
}
