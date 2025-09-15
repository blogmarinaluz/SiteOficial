export const metadata = {
  title: "Política de Privacidade | proStore",
  description:
    "Política de Privacidade da proStore em conformidade com a LGPD. Veja como tratamos seus dados pessoais.",
};

export default function Page() {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
        Política de Privacidade
      </h1>
      <p className="mt-2 max-w-3xl text-zinc-600">
        Esta Política descreve como a <strong>proStore</strong> coleta, usa,
        armazena e compartilha dados pessoais, em conformidade com a{" "}
        <strong>Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018)</strong>.
      </p>

      <Section title="1. Dados que coletamos">
        • Dados cadastrais (nome, CPF/CNPJ, e-mail, telefone, endereço). <br />
        • Dados de pagamento (processados por parceiros de pagamento). <br />
        • Dados de navegação e cookies para análise de uso e personalização. <br />
        • Registros de atendimento (WhatsApp, e-mail e formulários).
      </Section>

      <Section title="2. Finalidades e bases legais">
        • Processamento de pedidos e faturamento. <br />
        • Entrega e logística do produto. <br />
        • Atendimento e suporte ao cliente. <br />
        • Prevenção à fraude e segurança. <br />
        • Marketing com consentimento e opção de opt-out a qualquer momento.
      </Section>

      <Section title="3. Compartilhamento">
        Compartilhamos dados estritamente necessários com parceiros de
        pagamento, antifraude, logística e suporte — sempre mediante contratos
        e medidas de proteção.
      </Section>

      <Section title="4. Segurança e retenção">
        Adotamos controles técnicos e organizacionais para proteger os dados.
        Mantemos informações somente pelo tempo necessário para cumprir
        obrigações legais, contratuais ou legítimo interesse.
      </Section>

      <Section title="5. Direitos do titular">
        Você pode solicitar acesso, correção, exclusão, portabilidade ou
        revisão de decisões automatizadas. Atendemos solicitações através do
        e-mail{" "}
        <a className="underline" href="mailto:suporte@proStore.com">
          suporte@proStore.com
        </a>
        .
      </Section>

      <Section title="6. Cookies">
        Usamos cookies essenciais para funcionamento do site e cookies de
        analytics para entender performance. Você pode gerenciar cookies no seu
        navegador.
      </Section>

      <Section title="7. Atualizações">
        Esta Política pode ser atualizada. A versão vigente é sempre a
        publicada nesta página.
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
