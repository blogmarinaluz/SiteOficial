export const metadata = {
  title: "Termos de Uso | proStore",
  description:
    "Termos de uso e condições gerais de compra e navegação do site proStore.",
};

export default function Page() {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
        Termos de Uso
      </h1>
      <p className="mt-2 max-w-3xl text-zinc-600">
        Ao acessar e comprar na <strong>proStore</strong>, você concorda com os
        termos abaixo. Recomendamos a leitura atenta antes de finalizar a compra.
      </p>

      <Section title="1. Cadastro e conta">
        As informações cadastrais devem ser verdadeiras e atualizadas. A
        confidencialidade de login e senha é de responsabilidade do usuário.
      </Section>

      <Section title="2. Preços, promoções e cupons">
        Preços e condições podem mudar sem aviso. Cupons e campanhas têm regras
        próprias informadas nas respectivas páginas. Erros de precificação podem
        ser cancelados com reembolso integral.
      </Section>

      <Section title="3. Pagamentos">
        Aceitamos Pix, Boleto e Cartão (em até 10x sem juros). Processamento e
        segurança de transações são realizados por parceiros certificados.
      </Section>

      <Section title="4. Entrega">
        Envio mediante confirmação de pagamento. O prazo e o código de rastreio
        são informados após a postagem. Em caso de atraso logístico, nossa
        equipe acompanha com a transportadora.
      </Section>

      <Section title="5. Direito de arrependimento">
        Compras on-line podem ser canceladas em até <strong>7 dias corridos</strong>{" "}
        após o recebimento (CDC, art. 49), com reembolso conforme meio de
        pagamento, desde que o produto esteja sem uso e com acessórios originais.
      </Section>

      <Section title="6. Garantia">
        Garantia de fábrica conforme o fabricante. Para defeitos de fabricação
        dentro do prazo legal, entre em contato com nosso suporte para
        orientação sobre acionamento.
      </Section>

      <Section title="7. Responsabilidades">
        Não nos responsabilizamos por mau uso, danos acidentais, modificações
        não autorizadas ou perda de dados do usuário.
      </Section>

      <Section title="8. Propriedade intelectual">
        Marcas e conteúdos exibidos pertencem aos respectivos titulares.
        Reprodução não autorizada é proibida.
      </Section>

      <Section title="9. Suporte e contato">
        Dúvidas? Fale com{" "}
        <a className="underline" href="mailto:suporte@proStore.com">
          suporte@proStore.com
        </a>{" "}
        ou WhatsApp comercial informado no site.
      </Section>

      <div className="mt-8 rounded-2xl bg-zinc-50 p-5 text-sm text-zinc-700">
        Última atualização: {new Date().toLocaleDateString("pt-BR")}
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
