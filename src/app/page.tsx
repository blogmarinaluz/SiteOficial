// src/components/HeroCarousel.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Slide = {
  id: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  ctaText?: string;
  ctaHref?: string;
  image?: string;      // opcional: /public/banners/xxx.jpg
  imageAlt?: string;
  bg?: string;         // fallback: gradient CSS
};

const DEFAULT_SLIDES: Slide[] = [
  {
    id: "galaxy-a",
    title: "Linha Galaxy com ofertas especiais",
    subtitle: "Seu celular favorito com entrega rápida",
    bullets: ["90 dias de garantia", "Desconto no Pix"],
    ctaText: "Garanta o seu",
    ctaHref: "/samsung",
    image: "/banners/galaxy.jpg",
    imageAlt: "Samsung Galaxy promo",
    bg: "linear-gradient(135deg,#111827 0%,#0b3b2e 40%,#06291e 100%)",
  },
  {
    id: "troca-facil",
    title: "Vendemos e compramos seu celular",
    subtitle: "Receba com segurança em até 5 dias*",
    ctaText: "Vender agora",
    ctaHref: "/vender",
    image: "/banners/iphone.jpg",
    imageAlt: "iPhone promo",
    bg: "linear-gradient(135deg,#0f172a 0%,#111827 50%,#0a0a0a 100%)",
  },
  {
    id: "novos",
    title: "Smartphones Novos",
    subtitle: "Aparelhos com exclusividade comprovada",
    bullets: ["Acompanha acessórios", "Garantia de 12 meses", "Até 10x sem juros"],
    ctaText: "Comprar",
    ctaHref: "/novos",
    image: "/banners/new.jpg",
    imageAlt: "Novos smartphones",
    bg: "linear-gradient(135deg,#1f2937 0%,#111827 50%,#0a0a0a 100%)",
  },
];

export default function HeroCarousel({ slides = DEFAULT_SLIDES }: { slides?: Slide[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const GAP = 12;

  // auto play
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let stop = false;
    const tick = () => {
      if (stop) return;
      const { clientWidth, scrollLeft, scrollWidth } = el;
      const step = clientWidth + GAP;
      const maxLeft = scrollWidth - clientWidth;
      let nextLeft = scrollLeft + step;
      if (nextLeft > maxLeft - 4) nextLeft = 0;
      el.scrollTo({ left: nextLeft, behavior: "smooth" });
    };
    const id = setInterval(tick, 4500);
    const onUser = () => { clearInterval(id); stop = true; };
    el.addEventListener("touchstart", onUser, { passive: true });
    el.addEventListener("wheel", onUser, { passive: true });
    return () => { clearInterval(id); el.removeEventListener("touchstart", onUser); el.removeEventListener("wheel", onUser); };
  }, []);

  // update active dot on scroll/resize
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      const { scrollLeft, clientWidth } = el;
      const step = clientWidth + GAP;
      const idx = Math.round(scrollLeft / step);
      setActive(Math.max(0, Math.min(idx, Math.max(0, slides.length - 1))));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, [slides.length]);

  const go = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const { clientWidth, scrollLeft } = el;
    const step = clientWidth + GAP;
    const next = dir === 1 ? scrollLeft + step : scrollLeft - step;
    el.scrollTo({ left: next, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-[1100px] px-4">
      <div className="relative">
        {/* track */}
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-3 overflow-x-auto snap-x snap-mandatory [-webkit-overflow-scrolling:touch] [scroll-snap-stop:always] rounded-3xl"
        >
          {slides.map((s, i) => (
            <div key={s.id} className="snap-start shrink-0 w-full">
              <article
                className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 text-white"
                style={{ background: s.bg }}
              >
                <div className="grid md:grid-cols-[1.25fr,1fr] md:items-center">
                  <div className="px-6 py-8 md:py-10">
                    <h2 className="text-2xl md:text-[30px] font-extrabold leading-tight tracking-tight">
                      {s.title}
                    </h2>
                    {s.subtitle && (
                      <p className="mt-2 text-white/80">{s.subtitle}</p>
                    )}

                    {s.bullets && s.bullets.length > 0 && (
                      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-white/90">
                        {s.bullets.map((b, j) => (
                          <li key={j} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}

                    {s.ctaHref && s.ctaText && (
                      <Link href={s.ctaHref} className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 font-medium shadow-soft">
                        {s.ctaText}
                      </Link>
                    )}
                  </div>

                  <div className="relative h-[220px] md:h-[280px]">
                    {s.image ? (
                      <Image
                        src={s.image}
                        alt={s.imageAlt || s.title}
                        fill
                        sizes="(max-width: 1023px) 100vw, 50vw"
                        className="object-cover md:object-contain"
                        priority={i === 0}
                      />
                    ) : (
                      <div className="absolute inset-0" aria-hidden />
                    )}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* arrows (md+) */}
        <button
          onClick={() => go(-1)}
          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-zinc-900 shadow-soft border"
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          onClick={() => go(1)}
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-zinc-900 shadow-soft border"
          aria-label="Próximo"
        >
          ›
        </button>

        {/* dots */}
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {slides.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? "w-4 bg-zinc-800" : "w-2 bg-zinc-300"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
