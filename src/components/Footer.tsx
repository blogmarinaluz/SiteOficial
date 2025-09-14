import Link from "next/link";
export function Footer(){
  return (<footer className="border-t border-zinc-200 mt-16">
    <div className="container py-10 grid md:grid-cols-4 gap-8">
      <div>
        <div className="text-2xl font-bold text-accent">prostore</div>
        <p className="text-sm text-zinc-600 mt-2">WhatsApp: <a className="underline" href="https://wa.me/5599984905715" target="_blank">+55 99 98490-5715</a></p>
        <p className="text-sm text-zinc-600">Suporte: <a className="underline" href="mailto:suporte@prostore.com">suporte@prostore.com</a></p>
        <p className="text-sm text-zinc-600 mt-1">Endereço: Edifício Itália — Av. Ipiranga, 344, República, São Paulo - SP, 01046-010</p>
      </div>
      <div>
        <div className="font-semibold mb-2">Institucional</div>
        <ul className="space-y-1 text-sm bullets">
          <li><Link href="/politica-de-privacidade">Política de Privacidade</Link></li>
          <li><Link href="/trocas-e-devolucoes">Trocas & Devoluções</Link></li>
          <li><Link href="/garantia">Garantia do Fabricante</Link></li>
          <li><Link href="/analise-de-cadastro">Análise de Cadastro</Link></li>
        </ul>
      </div>
      <div>
        <div className="font-semibold mb-2">Atendimento e Prazos</div>
        <ul className="space-y-1 text-sm bullets">
          <li>Atendimento: Seg–Sex, 9h–18h (horário Brasília)</li>
          <li>Prazo de envio: até 48h após confirmação do pagamento</li>
          <li>Frete com seguro e rastreio</li>
          <li>Emissão de NF-e para todas as compras</li>
        </ul>
      </div>
      <div>
        <div className="font-semibold mb-2">Pagamento</div>
        <p className="text-sm">Pix · Cartão em até 12x · Boleto (inclusive para negativados, mediante análise)</p>
      </div>
    </div>
    <div className="bg-zinc-100"><div className="container py-4 text-sm text-zinc-600">© {new Date().getFullYear()} prostore. Todos os direitos reservados.</div></div>
  </footer>);
}
