// src/components/ProductGalleryMobile.tsx
"use client";

import Image from "next/image";

type Props = {
  images: string[];
  alt?: string;
};

function normalizeSrc(src: string) {
  if (!src) return "/";
  return src.startsWith("/") ? src : `/${src}`;
}

export default function ProductGalleryMobile({ images, alt }: Props) {
  // Garante lista válida e sem duplicados
  const list = Array.from(
    new Set((images || []).filter(Boolean).map(normalizeSrc))
  );

  if (list.length === 0) return null;

  // Usa a primeira imagem (o container nessa tela já controla altura via --prod-stage-h)
  const src = list[0];
  const unoptimized =
    /\.jpg\.jfif(\?|$)/i.test(src) || /\.jfif(\?|$)/i.test(src);

  return (
    <div className="lg:hidden">
      <div className="rounded-2xl border bg-white p-2">
        <div className="relative w-full" style={{ height: "var(--prod-stage-h, 420px)" }}>
          <Image
            src={src}
            alt={alt || "produto"}
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            className="rounded-xl object-contain"
            priority
            unoptimized={unoptimized}
          />
        </div>
      </div>
    </div>
  );
}
