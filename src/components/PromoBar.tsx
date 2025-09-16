// src/components/PromoBar.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  /** título à esquerda */
  label?: string;
  /** timestamp final da campanha (ISO, Date, ou epoch ms) */
  endsAt?: string | number | Date;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function PromoBar({
  label = "SEMANA DE PREÇOS BAIXOS",
  endsAt,
}: Props) {
  // padrão: 7 dias a partir de agora, se nada for passado
  const end = useMemo<Date>(() => {
    if (endsAt) return new Date(endsAt);
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }, [endsAt]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, end.getTime() - now);
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff / (60 * 60 * 1000)) % 24);
  const mins = Math.floor((diff / (60 * 1000)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return (
    <div className="w-full bg-zinc-900 text-white">
      <div className="container flex items-center gap-3 py-2 text-[12px]">
        {/* “led” verde */}
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,.8)]" />
        <span className="tracking-wide">{label}</span>

        {/* contador */}
        <div className="ml-auto flex items-center gap-1">
          <Badge value={days} unit="dias" />
          <Separator />
          <Badge value={hours} unit="horas" />
          <Separator />
          <Badge value={mins} unit="min" />
          <Separator />
          <Badge value={secs} unit="seg" />
        </div>
      </div>
    </div>
  );
}

function Badge({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="min-w-[50px] rounded-md bg-zinc-800 px-2 py-1 text-center">
      <div className="text-[13px] font-semibold leading-none">{pad(value)}</div>
      <div className="mt-0.5 text-[10px] text-zinc-400 leading-none">{unit}</div>
    </div>
  );
}

function Separator() {
  return <span className="mx-0.5 text-zinc-600">:</span>;
}
