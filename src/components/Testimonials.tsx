"use client";

// Sessão de Depoimentos com paleta da marca (emerald), layout premium,
// e rotação automática de depoimentos (6 por página, troca a cada 8s).
import { useEffect, useMemo, useState } from "react";

type Testimonial = {
  name: string;
  label: string;   // cidade/estado ou contexto
  text: string;
  rating?: number; // 1..5
};

const ALL_TESTIMONIALS: Testimonial[] = [
  { name: "Sabrina Alencar",      label: "Fortaleza - CE",     text: "Chegou tudo certinho, lacrado e com nota. Atendimento rápido no WhatsApp e entrega antes do prazo. Recomendo!", rating: 5 },
  { name: "Carlos Andrade",  label: "São Paulo - SP",     text: "Preço muito abaixo do mercado, ainda mais com 30% OFF no pix. Estou muito satisfeito com o iPhone.",           rating: 5 },
  { name: "João Pereira",    label: "Recife - PE",        text: "Suporte em cada etapa. Transparência total e aparelho impecável. Voltarei a comprar.",                     rating: 5 },
  { name: "Aline Rodrigues", label: "Rio de Janeiro - RJ",text: "Comprei um Galaxy e o parcelamento sem juros ajudou demais. Experiência excelente!",                        rating: 5 },
  { name: "Thiago Souza",    label: "Belo Horizonte - MG",text: "Entrega rápida e embalagem segura. O frete grátis em vários modelos foi um diferencial.",                  rating: 5 },
  { name: "Beatriz Costa",   label: "Curitiba - PR",      text: "Produto original, garantia e ótima comunicação. Já indiquei para amigos e família.",                      rating: 5 },
  { name: "Rafael Lima",     label: "Campinas - SP",      text: "Atendimento atencioso e preço imbatível. Tudo conforme o combinado.",                                    rating: 5 },
  { name: "Fernanda Alves",  label: "Salvador - BA",      text: "Processo de compra simples e rápido. Chegou antes do esperado e muito bem embalado.",                     rating: 5 },
  { name: "Gabriel Moreira", label: "Porto Alegre - RS",  text: "Já é minha segunda compra. Qualidade e confiança definem.",                                             rating: 5 },
  { name: "Larissa Martins", label: "Goiânia - GO",       text: "Adorei a comunicação e a transparência. O aparelho veio zerado!",                                        rating: 5 },
  { name: "Paulo Henrique",  label: "Natal - RN",         text: "Usei o cupom e economizei muito. Recomendo sem medo.",                                                  rating: 5 },
  { name: "Camila Duarte",   label: "Florianópolis - SC", text: "Site fácil de navegar e checkout tranquilo. Voltarei a comprar.",                                        rating: 5 },
  { name: "Diego Nascimento",label: "Belém - PA",         text: "Entrega no prazo e produto lacrado. Nota fiscal enviada certinho.",                                     rating: 5 },
  { name: "Priscila Menezes",label: "Manaus - AM",        text: "Equipe super atenciosa. Tive dúvidas e me responderam na hora.",                                        rating: 5 },
  { name: "Renato Carvalho", label: "Santos - SP",        text: "Custo-benefício excelente, principalmente com o desconto no pix.",                                       rating: 5 },
  { name: "Tatiane Oliveira",label: "João Pessoa - PB",   text: "Experiência positiva do início ao fim. Recomendo para amigos!",                                          rating: 5 },
  { name: "Eduardo Gomes",   label: "Vitória - ES",       text: "Produto autêntico, zero, tudo conforme anunciado. 5 estrelas!",                                          rating: 5 },
  { name: "Luana Freitas",   label: "Maceió - AL",        text: "Acompanhamento por Whats e facilidade no pagamento. Muito bom!",                                        rating: 5 },
];

// util: embaralha de forma estável (mas sem depender do servidor)
function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(((i * 9301 + 49297) % 233280) / 233280 * (i + 1)); // pseudo
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const Star = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
    <path d="M10 2.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 15.9l-4.94 2.6.94-5.49-4-3.9 5.53-.8L10 2.5z" fill="currentColor" />
  </svg>
);

const Check = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
    <path d="M7.7 13.3 4.4 10l-1.4 1.4 4.7 4.7 9.3-9.3-1.4-1.4-7.9 7.9z" fill="currentColor" />
  </svg>
);

const QuoteMarks = () => (
  <div className="absolute right-4 top-4 text-emerald-200">
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path d="M7 11c-1.1 0-2 .9-2 2v3h3v-3h-1v-2zm9 0c-1.1 0-2 .9-2 2v3h3v-3h-1v-2z" fill="currentColor" />
    </svg>
  </div>
);

const PAGE_SIZE = 6;       // 6 cards por página
const INTERVAL_MS = 8000;  // troca automática a cada 8s

export default function Testimonials() {
  // Mantém a mesma base de depoimentos já declarada acima
  const [index, setIndex] = useState(0);
  const total = ALL_TESTIMONIALS.length;

  // autoplay a cada 6s, pausa em hover
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 6000);
    return () => clearInterval(id);
  }, [paused, total]);

  // acessibilidade: rols e labels
  return (
    <section
      id="depoimentos"
      aria-label="Depoimentos de clientes"
      className="mx-auto mt-14 max-w-[1100px] px-4"
    >
      <header className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-emerald-400">Confiança</p>
          <h2 className="text-xl font-extrabold">O que nossos clientes dizem</h2>
        </div>
        <div className="hidden gap-2 lg:flex">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + total) % total)}
            className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-800"
            aria-label="Slide anterior"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % total)}
            className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-800"
            aria-label="Próximo slide"
          >
            Próximo
          </button>
        </div>
      </header>

      {/* CARROSSEL */}
      <div
        role="region"
        aria-roledescription="carrossel"
        aria-label="Carrossel de depoimentos"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative"
      >
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-black">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)`, width: `${total * 100}%` }}
          >
            {ALL_TESTIMONIALS.map((t, idx) => (
              <article
                key={idx}
                className="w-full flex-shrink-0 px-6 py-8 lg:px-10"
                style={{ width: `${100 / total}%` }}
                aria-roledescription="slide"
                aria-label={`${idx + 1} de ${total}`}
              >
                <div className="mx-auto max-w-[820px]">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/40" />
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-neutral-400">{t.label}</p>
                    </div>
                  </div>

                  <blockquote className="mt-4 text-[15px] leading-relaxed text-neutral-200">
                    “{t.text}”
                  </blockquote>

                  {typeof t.rating === "number" && (
                    <div className="mt-3 flex items-center gap-1" aria-label={`Avaliação ${t.rating} de 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className={`h-4 w-4 ${i < (t.rating ?? 0) ? "fill-emerald-400" : "fill-neutral-700"}`}
                          aria-hidden="true"
                        >
                          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Dots + controles mobile */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            {ALL_TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 w-6 rounded-full transition-all ${
                  i === index ? "bg-emerald-400" : "bg-neutral-700"
                }`}
                aria-label={`Ir para depoimento ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + total) % total)}
              className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-white"
              aria-label="Anterior"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % total)}
              className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-white"
              aria-label="Próximo"
            >
              Próximo
            </button>
          </div>
        </div>

        {/* instrução sutil */}
        <p className="mt-2 text-center text-[11px] text-neutral-500">
          Deslize para ver mais depoimentos • troca automática a cada 6s.
        </p>
      </div>
    </section>
  );
}
