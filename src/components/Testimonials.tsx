"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Depoimentos — v4 (visual claro e elegante)
 * - Card branco com borda sutil e sombra leve (look enterprise).
 * - Mantém swipe-only, autoplay sem "pulo" de página (usa scrollLeft).
 * - Dots discretos; tipografia mais leve.
 * - TS fix: slideRefs é HTMLElement[] (pois o card é <article>).
 */

type Testimonial = {
  name: string;
  label: string;
  text: string;
  rating?: number;
};

const ALL_TESTIMONIALS: Testimonial[] = [
  { name: "Sabrina Alencar", label: "Fortaleza • CE", text: "Atendimento excelente no WhatsApp e entrega antes do prazo. Recomendo!", rating: 5 },
  { name: "Carlos Andrade", label: "São Paulo • SP", text: "Preço no Pix imbatível e produto lacrado. Estou muito satisfeito com o iPhone.", rating: 5 },
  { name: "João Pereira", label: "Goiânia • GO", text: "Chegou bem embalado, com nota e garantia. Suporte respondeu rápido.", rating: 5 },
  { name: "Ana Paula", label: "Salvador • BA", text: "Pedi no domingo e chegou na terça. Experiência de compra 10/10!", rating: 5 },
  { name: "Marcos Vinícius", label: "Rio de Janeiro • RJ", text: "Site fácil de usar no celular e opções claras de pagamento.", rating: 5 },
  { name: "Letícia Souza", label: "Belo Horizonte • MG", text: "Equipe atenciosa, tirou todas as dúvidas. Voltarei a comprar.", rating: 5 },
];

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-1 text-accent" aria-label={`${n} de 5 estrelas`}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const items = useMemo(() => ALL_TESTIMONIALS, []);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<HTMLElement[]>([]);
  const [index, setIndex] = useState(0);
  const count = items.length;
  const autoplayMs = 6000;

  // Índice ativo via IntersectionObserver no viewport horizontal
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new IntersectionObserver(
      (entries) => {
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

    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Autoplay que não desloca a página
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    let paused = false;

    const setPaused = (v: boolean) => (paused = v);
    const onPointerDown = () => setPaused(true);
    const onPointerUp = () => setPaused(false);
    const onVisibility = () => setPaused(document.visibilityState !== "visible");

    viewport.addEventListener("pointerdown", onPointerDown, { passive: true });
    viewport.addEventListener("touchstart", onPointerDown, { passive: true });
    viewport.addEventListener("pointerup", onPointerUp, { passive: true });
    viewport.addEventListener("mouseleave", onPointerUp, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    const rootObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setPaused(!(entry?.intersectionRatio >= 0.4));
      },
      { root: null, threshold: [0, 0.4, 1] }
    );
    rootObserver.observe(viewport);

    const id = window.setInterval(() => {
      if (paused) return;
      goTo(index + 1, { smooth: true });
    }, autoplayMs);

    return () => {
      window.clearInterval(id);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("touchstart", onPointerDown);
      viewport.removeEventListener("pointerup", onPointerUp);
      viewport.removeEventListener("mouseleave", onPointerUp);
      document.removeEventListener("visibilitychange", onVisibility);
      rootObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function goTo(i: number, opts: { smooth?: boolean } = {}) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const next = ((i % count) + count) % count;
    const slide = slideRefs.current[next];
    if (!slide) return;

    const left = (slide as HTMLElement).offsetLeft - (viewport.clientWidth - (slide as HTMLElement).clientWidth) / 2;
    viewport.scrollTo({
      left,
      behavior: opts.smooth ? "smooth" : "auto",
    });
  }

  return (
    <section aria-labelledby="depoimentos_heading" className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">Confiança</p>
        <h2 id="depoimentos_heading" className="text-2xl font-bold text-brand-black sm:text-3xl">
          O que nossos clientes dizem
        </h2>
      </div>

      <div className="relative">
        <div
          ref={viewportRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]"
          role="list"
          aria-label="Depoimentos"
        >
          {items.map((t, i) => (
            <article
              key={i}
              data-index={i}
              ref={(el) => {
                if (el) slideRefs.current[i] = el;
              }}
              role="listitem"
              className="relative min-w-[88%] snap-center rounded-2xl bg-white px-4 py-4 text-brand-black shadow-sm ring-1 ring-neutral-200 sm:min-w-[520px]"
              style={{ contain: "content" }}
            >
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold">{t.name}</h3>
                  <p className="text-xs text-neutral-500">{t.label}</p>
                </div>
                <Stars n={t.rating ?? 5} />
              </div>
              <p className="relative mt-2 text-[13px] leading-relaxed text-neutral-700">
                {t.text}
              </p>
            </article>
          ))}
        </div>

        {/* Dots discretos */}
        <div className="mt-3 flex w-full items-center justify-center gap-2" aria-label="Navegação dos depoimentos">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, { smooth: true })}
              aria-label={`Ir para depoimento ${i + 1}`}
              aria-current={index === i ? "true" : "false"}
              className={`h-1.5 w-1.5 rounded-full transition-opacity ${index === i ? "bg-accent" : "bg-neutral-300"}`}
            />
          ))}
        </div>

        <p className="mt-2 text-center text-[11px] text-neutral-500">Deslize para ver mais • troca automática a cada 6s</p>
      </div>
    </section>
  );
}
