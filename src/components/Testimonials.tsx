"use client";
import { useEffect, useState } from "react";

const DATA = [
  { n: "Ana Souza", t: "Processo simples. Chegou rápido e bem embalado.", s: 5 },
  { n: "Marcos Lima", t: "Aprovado no boleto. Atendimento atencioso.", s: 5 },
  { n: "Juliana Costa", t: "Preço excelente e suporte no WhatsApp.", s: 5 },
  { n: "Rafael Moura", t: "Tudo certo com nota e garantia.", s: 5 },
  { n: "Paula N.", t: "Parcelamento ok, recomendo!", s: 5 },
  { n: "Bruno S.", t: "Atendimento humano de verdade.", s: 5 },
  { n: "Marina Luz", t: "Condição no boleto me ajudou muito.", s: 5 },
  { n: "Diego Araújo", t: "Entrega no prazo e produto impecável.", s: 5 },
  { n: "Carlos Alberto", t: "Ganhei cupom e saiu mais barato.", s: 5 },
  { n: "Camila F.", t: "Site confiável e rápido.", s: 5 },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % DATA.length), 2800);
    return () => clearInterval(id);
  }, []);

  // Mostra 3 por “página”
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
            <p className="text-sm text-zinc-700 mt-2">{d.t}</p>
          </figure>
        ))}
      </div>
    </section>
  );
}
