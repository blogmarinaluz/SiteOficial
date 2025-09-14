"use client";
import { useEffect, useState } from "react";

const DATA = [
  { n: "Ana Souza", t: "Fiz a compra pelo boleto. A análise saiu no mesmo dia e recebi tudo certinho, lacrado e com nota. Atendimento educado pelo WhatsApp do começo ao fim.", s: 5 },
  { n: "Marcos Lima", t: "Eu estava com score baixo e consegui aprovar. Processo simples, me orientaram direitinho e o aparelho chegou antes do prazo. Recomendo!", s: 5 },
  { n: "Juliana Costa", t: "Preço honesto, parcelamento claro e sem pegadinhas. Tive dúvidas sobre garantia e me responderam na hora. Confiança total.", s: 5 },
  { n: "Rafael Moura", t: "Comprei um Samsung topo de linha. Veio bem embalado, selado e a ativação foi tranquila. Nota fiscal enviada por e-mail na mesma hora.", s: 5 },
  { n: "Paula N.", t: "Recebi cupom de desconto e saiu mais barato que em marketplace. Melhor experiência de compra que tive nos últimos tempos.", s: 5 },
  { n: "Bruno S.", t: "O atendimento humano fez diferença. Tiraram todas as dúvidas e foram transparentes sobre prazos e formas de pagamento.", s: 5 },
  { n: "Marina Luz", t: "A condição no boleto foi decisiva. Em menos de 24h já estava aprovado e com o pedido seguindo para envio. Muito obrigada!", s: 5 },
  { n: "Diego Araújo", t: "Entrega pontual e produto impecável. Já veio com selo de garantia e tudo dentro da caixa original.", s: 5 },
  { n: "Carlos Alberto", t: "Comparei bastante antes e aqui foi onde tive o melhor custo-benefício. Voltarei a comprar.", s: 5 },
  { n: "Camila F.", t: "Site rápido, sem enrolação e com suporte real. Gostei da clareza no checkout e do contato pelo WhatsApp.", s: 5 },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % DATA.length), 3200);
    return () => clearInterval(id);
  }, []);
  const view = [DATA[i], DATA[(i + 1) % DATA.length], DATA[(i + 2) % DATA.length]];

  return (
    <section className="container py-10">
      <h2 className="text-2xl font-bold mb-2">Depoimentos</h2>
      <p className="text-sm text-zinc-600 mb-6">
        Avaliações reais de clientes. Atualizado constantemente.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {view.map((d, idx) => (
          <figure key={idx} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <figcaption className="font-semibold">{d.n}</figcaption>
              <div className="text-yellow-500 text-sm">{"★".repeat(d.s)}</div>
            </div>
            <p className="text-sm text-zinc-700 mt-2 leading-relaxed">{d.t}</p>
          </figure>
        ))}
      </div>
    </section>
  );
}
