"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Depoimentos — carrossel mobile-first com scroll-snap
 * - Sem dependências externas.
 * - Autoplay suave (pausa ao interagir / reduzido se prefers-reduced-motion).
 * - Dots acessíveis e botões compactos.
 * - Paleta preto + verde do projeto (brand.black / accent).
 */

type Testimonial = {
  name: string;
  label: string;   // cidade/estado ou contexto
  text: string;
  rating?: number; // 1..5
};

const ALL_TESTIMONIALS: Testimonial[] = [
  {
    name: "Sabrina Alencar",
    label: "Fortaleza • CE",
    text:
      "Atendimento excelente no WhatsApp e entrega antes do prazo. Recomendo!",
    rating: 5,
  },
  {
    name: "Carlos Andrade",
    label: "São Paulo • SP",
    text:
      "Preço no Pix imbatível e produto lacrado. Estou muito satisfeito com o iPhone.",
    rating: 5,
  },
  {
    name: "João Pereira",
    label: "Goiânia • GO",
    text:
      "Chegou bem embalado, com nota e garantia. Suporte respondeu rápido.",
    rating: 5,
  },
  {
    name: "Ana Paula",
    label: "Salvador • BA",
    text:
      "Pedi no domingo e chegou na terça. Experiência de compra 10/10!",
    rating: 5,
  },
  {
    name: "Marcos Vinícius",
    label: "Rio de Janeiro • RJ",
    text:
      "Site fácil de usar no celular e opções claras de pagamento.",
    rating: 5,
  },
  {
    name: "Letícia Souza",
    label: "Belo Horizonte • MG",
    text:
      "Equipe atenciosa, tirou todas as dúvidas. Voltarei a comprar.",
    rating: 5,
  },
];

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-1" aria-label={`${n} de 5 estrelas`}>
      {Array.from({ length: n }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4 fill-current"
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const items = useMemo(() => ALL_TESTIMONIALS, []);

  // ===== Scroll-snap refs & state =====
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const count = items.length;
  const autoplayMs = 6000;

  // Detecta slide ativo pelo scroll (mais robusto que computation pura)
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const slides = Array.from(viewport.querySelectorAll<HTMLElement>("[data-slide]"));
    const io = new IntersectionObserver(
      (entries) => {
        // o que está mais visível vira o ativo
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const i = Number((visible.target as HTMLElement).dataset.index || 0);
          setIndex(i);
        }
      },
      { root: viewport, threshold: [0.5, 0.75, 0.9] }
    );
    slides.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Autoplay com respeito a prefers-reduced-motion
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    let paused = false;
    const pause = () => (paused = true);
    const resume = () => (paused = false);

    viewport.addEventListener("pointerdown", pause, { passive: true });
    viewport.addEventListener("touchstart", pause, { passive: true });
    viewport.addEventListener("focusin", pause);
    viewport.addEventListener("pointerup", resume);
    viewport.addEventListener("mouseleave", resume);

    const id = window.setInterval(() => {
      if (paused) return;
      goTo(index + 1);
    }, autoplayMs);

    return () => {
      window.clearInterval(id);
      viewport.removeEventListener("pointerdown", pause);
      viewport.removeEventListener("touchstart", pause);
      viewport.removeEventListener("focusin", pause);
      viewport.removeEventListener("pointerup", resume);
      viewport.removeEventListener("mouseleave", resume);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function goTo(i: number) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const slides = viewport.querySelectorAll<HTMLElement>("[data-slide]");
    const next = ((i % count) + count) % count; // wrap
    const el = slides[next];
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  function prev() {
    goTo(index - 1);
  }

  function next() {
    goTo(index + 1);
  }

  return (
    <section
      aria-labelledby="depoimentos_heading"
      className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8"
    >
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">
          Confiança
        </p>
        <h2
          id="depoimentos_heading"
          className="text-2xl font-bold text-brand-black sm:text-3xl"
        >
          O que nossos clientes dizem
        </h2>
      </div>

      <div className="relative">
        {/* Viewport com scroll-snap horizontal */}
        <div
          ref={viewportRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch]"
          role="list"
          aria-label="Depoimentos"
        >
          {items.map((t, i) => (
            <article
              key={i}
              data-slide
              data-index={i}
              role="listitem"
              className="min-w-[88%] snap-center rounded-2xl bg-brand-black px-4 py-5 text-white shadow-md sm:min-w-[520px]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">{t.name}</h3>
                  <p className="text-xs text-neutral-300">{t.label}</p>
                </div>
                <div className="text-accent" aria-hidden="true">
                  <Stars n={t.rating ?? 5} />
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-neutral-100">
                {t.text}
              </p>
            </article>
          ))}
        </div>

        {/* Controles */}
        <div className="mt-2 flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-2" aria-label="Navegação dos depoimentos">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir para depoimento ${i + 1}`}
                aria-current={index === i ? "true" : "false"}
                className={`h-2 w-2 rounded-full transition-transform ${
                  index === i ? "scale-125 bg-accent" : "bg-neutral-400"
                }`}
              />
            ))}
          </div>

          {/* Botões prev/next compactos */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="rounded-full bg-brand-black px-3 py-2 text-xs font-medium text-white shadow-sm active:scale-[.98]"
              aria-label="Anterior"
            >
              <span className="sr-only">Anterior</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M15.5 19 8.5 12l7-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              onClick={next}
              className="rounded-full bg-brand-black px-3 py-2 text-xs font-medium text-white shadow-sm active:scale-[.98]"
              aria-label="Próximo"
            >
              <span className="sr-only">Próximo</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M8.5 5 15.5 12l-7 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Dica de interação */}
        <p className="mt-2 text-center text-[11px] text-neutral-500">
          Deslize para ver mais • troca automática a cada 6s
        </p>
      </div>
    </section>
  );
}
