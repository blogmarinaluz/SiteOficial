"use client";

import { buildCopy, BasicProduct, SpecItem } from "@/lib/specs";
import { Info, CheckCircle2, Shield, FileText, Truck } from "lucide-react";
import React from "react";

export default function DescriptionAndSpecs({
  product,
}: {
  product: BasicProduct;
}) {
  const copy = buildCopy(product);

  return (
    <section className="mt-8 grid gap-6">
      {/* Descrição */}
      <div className="rounded-2xl border bg-white p-5">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-emerald-700" />
          <h3 className="text-base md:text-lg font-semibold">Descrição do produto</h3>
        </div>
        <h4 className="mt-3 text-[15px] md:text-base font-semibold">
          {copy.headline}
        </h4>
        <div className="prose prose-zinc max-w-none text-sm md:text-[15px] leading-relaxed">
          {copy.paragraphs.map((p, i) => (
            <p key={i} className="mt-2" dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }} />
          ))}
        </div>

        {/* Selos de confiança */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[12px]">
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            <span>Novo e lacrado</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
            <FileText className="h-4 w-4 text-emerald-700" />
            <span>Nota Fiscal</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
            <Shield className="h-4 w-4 text-emerald-700" />
            <span>180 dias de garantia</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
            <Truck className="h-4 w-4 text-emerald-700" />
            <span>Homologado Anatel</span>
          </div>
        </div>
      </div>

      {/* Características técnicas */}
      <div className="rounded-2xl border bg-white p-5">
        <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold">
          <CheckCircle2 className="h-5 w-5 text-emerald-700" />
          Características técnicas
        </h3>

        <dl className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {copy.specs.map((s: SpecItem, i: number) => (
            <div key={i} className="grid grid-cols-3 sm:grid-cols-5">
              <dt className="col-span-1 sm:col-span-2 text-zinc-500">{s.label}</dt>
              <dd className="col-span-2 sm:col-span-3 font-medium"
                  dangerouslySetInnerHTML={{ __html: s.value.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }} />
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
