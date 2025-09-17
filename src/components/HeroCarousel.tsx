// src/components/HeroCarousel.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Full‑bleed hero carousel
 * - Edge‑to‑edge (w-screen), breaks out of page container
 * - Autoplay + swipe (scroll-snap)
 * - No page jump: horizontal scroll via `scrollTo`, nunca `scrollIntoView`
 * - Pausa autoplay quando fora de viewport
 * - Sem imagens quebradas (fallback em gradiente)
 */

type Slide = {
  id: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  ctaText?: string;
  ctaHref?: string;
  image?: string;
  imageAlt?: string;
};

const DEFAULT_SLIDES: Slide[] = [
  {
    id: "s1",
    title: "Linha Galaxy com ofertas especiais",
    subtitle: "Seu celular favorito com entrega rápida",
    bullets: ["90 dias de garantia", "Desconto no Pix"],
    ctaText: "Garanta o seu",
    ctaHref: "/produtos?marca=Samsung",
  },
  {
    id: "s2",
    title: "iPhone com 30% OFF no boleto e Pix",
    subtitle: "Estoque limitado — aproveite agora",
    bullets: ["Frete grátis*", "Nota fiscal e garantia"],
    ctaText: "Ver iPhones",
    ctaHref: "/produtos?marca=Apple",
  },
  {
    id: "s3",
    title: "Compramos seu celular",
    subtitle: "Receba com segurança em até 5 dias*",
    bullets: ["Avaliação ágil", "Pagamento rápido"],
    ctaText: "Vender agora",
    ctaHref: "/contato",
  },
];

export default function HeroCarousel({ slides = DEFAULT_SLIDES }: { slides?: Slide[] }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Intercepta visibilidade do carrossel (pausa autoplay quando fora da tela)
  useEffect(() => {
    const target = rootRef.current;
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  // Autoplay (somente quando visível)
  useEffect(() => {
    if (!visible) return stop();
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, visible]);

  const start = () => {
    stop();
    timerRef.current = setTimeout(() => goTo(active + 1), 4500);
  };
  const stop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const count = slides.length;
    const idx = ((i % count) + count) % count;
    const left = idx * el.clientWidth;
    el.scrollTo({ left, behavior: "smooth" }); // não mexe no scroll vertical da página
  };

  // Atualiza ativo ao rolar
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const x = el.scrollLeft;
      const w = el.clientWidth;
      const idx = Math.round(x / w);
      setActive(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true } as any);
    return () => el.removeEventListener("scroll", onScroll as any);
  }, []);

  return (
    <section
      ref={(n) => (rootRef.current = n as any)}
      className="relative left-1/2 right-1/2 w-screen -mx-[50vw] mt-0"
      aria-roledescription="carousel"
      aria-label="Ofertas em destaque"
      style={{ marginTop: 0 }}
    >
      <div className="relative">
        {/* trilho */}
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
          onMouseEnter={stop}
          onMouseLeave={start}
          onTouchStart={stop}
          onTouchEnd={start}
        >
          {slides.map((s, i) => (
            <div key={s.id} className="snap-start shrink-0 w-screen">
              <article
                className="relative h-[360px] sm:h-[420px] lg:h-[520px] overflow-hidden"
                aria-roledescription="slide"
                aria-label={`${i + 1} de ${slides.length}`}
              >
                {/* Fundo gradiente */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-800 to-neutral-900" />

                {/* Imagem opcional */}
                {Boolean(s.image) && (
                  <Image
                    src={s.image as string}
                    alt={s.imageAlt || s.title}
                    fill
                    className="object-cover opacity-70"
                    sizes="100vw"
                    priority={i === 0}
                    onError={(e) => {
                      const el = (e.target as HTMLImageElement).parentElement;
                      if (el) (el as HTMLElement).style.display = "none";
                    }}
                  />
                )}

                {/* Conteúdo */}
                <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:py-14">
                  <div className="max-w-xl text-white">
                    <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
                      {s.title}
                    </h2>
                    {s.subtitle && (
                      <p className="mt-2 text-white/90 sm:text-lg">{s.subtitle}</p>
                    )}
                    {!!s.bullets?.length && (
                      <ul className="mt-4 space-y-1.5 text-white/90">
                        {s.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {s.ctaHref && s.ctaText && (
                      <Link
                        href={s.ctaHref}
                        className="mt-5 inline-flex rounded-2xl bg-emerald-500 px-5 py-2.5 font-semibold text-emerald-950 hover:bg-emerald-400"
                      >
                        {s.ctaText}
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* pontos */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-2 bg-white/60"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
