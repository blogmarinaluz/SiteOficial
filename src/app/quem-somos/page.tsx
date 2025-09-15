export const revalidate = 86400;

export default function Page() {
  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Quem somos</h1>
      <p className="mt-2 text-zinc-600">
        A <strong>proStore</strong> é especializada na venda de celulares novos, com garantia e
        atendimento humanizado. Unimos preço competitivo, curadoria de modelos e uma experiência
        simples para que você compre com tranquilidade.
      </p>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="card">
          <h2 className="text-lg font-semibold">Missão</h2>
          <p className="mt-2 text-zinc-600">
            Tornar a compra de smartphones mais transparente, segura e acessível, do primeiro acesso
            até a entrega.
          </p>
        </article>

        <article className="card">
          <h2 className="text-lg font-semibold">Valores</h2>
          <ul className="mt-2 bullets text-zinc-600 space-y-1">
            <li>Transparência e respeito ao cliente</li>
            <li>Cumprimento de prazos e promessas</li>
            <li>Garantia real e suporte após a compra</li>
            <li>Melhoria contínua de produtos e processos</li>
          </ul>
        </article>

        <article className="card">
          <h2 className="text-lg font-semibold">Diferenciais</h2>
          <ul className="mt-2 bullets text-zinc-600 space-y-1">
            <li>Parcelamento em até 10x sem juros</li>
            <li>Seleção de modelos com estoque imediato</li>
            <li>Equipe de análise para pagamento via boleto</li>
            <li>Atendimento via WhatsApp com status do pedido</li>
          </ul>
        </article>

        <article className="card">
          <h2 className="text-lg font-semibold">Fale conosco</h2>
          <p className="mt-2 text-zinc-600">
            E-mail comercial: <a className="underline" href="mailto:contato@proStore.com">contato@proStore.com</a><br />
            Suporte: <a className="underline" href="mailto:suporte@proStore.com">suporte@proStore.com</a><br />
            WhatsApp: <a className="underline" href="https://wa.me/5599984905715" target="_blank">+55 (99) 98490-5715</a>
          </p>
        </article>
      </section>
    </main>
  );
}
