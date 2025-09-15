// src/components/Testimonials.tsx
// Sessão de Depoimentos com paleta da marca (verde/emerald), layout premium e responsivo.
// Não depende de imagens externas; avatares são iniciais estilizadas.

type Testimonial = {
  name: string;
  label: string; // cidade/estado ou contexto
  text: string;
  rating?: number; // 1..5
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Marina L.",
    label: "Fortaleza - CE",
    text:
      "Chegou tudo certinho, lacrado e com nota. Atendimento rápido no WhatsApp e entrega antes do prazo. Recomendo!",
    rating: 5,
  },
  {
    name: "Carlos A.",
    label: "São Paulo - SP",
    text:
      "Preço muito abaixo do mercado, ainda mais com 30% OFF no pix. Estou muito satisfeito com o iPhone.",
    rating: 5,
  },
  {
    name: "João P.",
    label: "Recife - PE",
    text:
      "Tive suporte em cada etapa. Transparência total e aparelho impecável. Voltarei a comprar.",
    rating: 5,
  },
  {
    name: "Aline R.",
    label: "Rio de Janeiro - RJ",
    text:
      "Comprei um Galaxy e o parcelamento sem juros ajudou demais. Experiência excelente!",
    rating: 5,
  },
  {
    name: "Thiago S.",
    label: "Belo Horizonte - MG",
    text:
      "Entrega rápida e embalagem segura. O frete grátis em vários modelos foi um diferencial.",
    rating: 5,
  },
  {
    name: "Beatriz C.",
    label: "Curitiba - PR",
    text:
      "Produto original, garantia e ótima comunicação. Já indiquei para amigos e família.",
    rating: 5,
  },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const Star = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
    <path
      d="M10 2.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 15.9l-4.94 2.6.94-5.49-4-3.9 5.53-.8L10 2.5z"
      fill="currentColor"
    />
  </svg>
);

const Check = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
    <path d="M7.7 13.3 4.4 10l-1.4 1.4 4.7 4.7 9.3-9.3-1.4-1.4-7.9 7.9z" fill="currentColor" />
  </svg>
);

export default function Testimonials() {
  return (
    <section className="relative">
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

        {/* Grade de depoimentos */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <article
              key={idx}
              className="relative rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              {/* “aspas” decorativas */}
              <div className="absolute right-4 top-4 text-emerald-200">
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                  <path
                    d="M7 11c-1.1 0-2 .9-2 2v3h3v-3h-1v-2zm9 0c-1.1 0-2 .9-2 2v3h3v-3h-1v-2z"
                    fill="currentColor"
                  />
                </svg>
              </div>

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
      </div>
    </section>
  );
}
