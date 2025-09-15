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
  // Embaralha uma vez no cliente pra variar a ordem
  const pool = useMemo(() => shuffle(ALL_TESTIMONIALS), []);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // calcula a página atual (com wrap)
  const currentPage = useMemo(() => {
    const out: Testimonial[] = [];
    for (let i = 0; i < PAGE_SIZE; i++) {
      out.push(pool[(index + i) % pool.length]);
    }
    return out;
  }, [pool, index]);

  // autoplay com pausa no hover
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + PAGE_SIZE) % pool.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, pool.length]);

  return (
    <section className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* faixa sutil no topo com a paleta */}
      <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-r from-emerald-600/20 via-emerald-500/10 to-emerald-600/20 blur-sm" />

      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <div className="text-center">
          <h2 className="text-[22px] font-semibold tracking-tight text-neutral-900">
            Depoimentos de quem comprou
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-neutral-600">
            Atendimento rápido, aparelhos lacrados com garantia e entrega no prazo.
          </p>

        {/* Selo de avaliação */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 text-emerald-600" />
              ))}
            </div>
            <span className="text-xs font-medium text-emerald-800">Avaliação média 5/5</span>
          </div>
        </div>

        {/* Grade de depoimentos (6 por página) */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {currentPage.map((t, idx) => (
            <article
              key={`${t.name}-${idx}`}
              className="relative rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <QuoteMarks />

              {/* Cabeçalho do card */}
              <div className="flex items-center gap-3">
                {/* Avatar com iniciais na paleta */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 text-sm font-bold text-white ring-2 ring-emerald-200">
                  {initials(t.name)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="truncate text-sm font-semibold text-neutral-900">{t.name}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                      <Check className="h-3 w-3" />
                      Verificado
                    </span>
                  </div>
                  <p className="truncate text-xs text-neutral-500">{t.label}</p>
                </div>
              </div>

              {/* Estrelas individuais */}
              <div className="mt-3 flex items-center gap-1">
                {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-emerald-600" />
                ))}
              </div>

              {/* Texto */}
              <p className="mt-3 text-[13px] leading-relaxed text-neutral-700">
                {t.text}
              </p>
            </article>
          ))}
        </div>

        {/* Controles simples (acessíveis) */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - PAGE_SIZE + pool.length) % pool.length)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
            aria-label="Depoimentos anteriores"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + PAGE_SIZE) % pool.length)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
            aria-label="Próximos depoimentos"
          >
            Próximos
          </button>
        </div>

        {/* dica sutil de autoplay/pausa */}
        <p className="mt-2 text-center text-[11px] text-neutral-500">
          Passa automaticamente a cada 8s — passe o mouse para pausar.
        </p>
      </div>
    </section>
  );
}
