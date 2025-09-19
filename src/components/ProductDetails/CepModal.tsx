// src/components/ProductDetails/CepModal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

type Frete = {
  tipo: 'expresso' | 'economico' | 'retira';
  prazo: string;
  valor: number;
};
type EnderecoViaCep = {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  localidade: string;
  uf: string;
  ddd?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (payload: { cep: string; endereco: EnderecoViaCep; frete: Frete }) => void;
};

function onlyDigits(s: string) {
  return (s || '').replace(/\D/g, '');
}

export default function CepModal({ open, onClose, onSelect }: Props) {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [address, setAddress] = useState<EnderecoViaCep | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', onEsc);
      return () => document.removeEventListener('keydown', onEsc);
    }
  }, [open, onClose]);

  const queryCep = async () => {
    const clean = onlyDigits(cep);
    if (clean.length !== 8) {
      setErr('Informe um CEP válido (8 dígitos).');
      return;
    }
    try {
      setErr(null);
      setLoading(true);
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = (await res.json()) as any;
      if (!data || data.erro) {
        throw new Error('CEP não encontrado');
      }
      const payload: EnderecoViaCep = {
        cep: data.cep,
        logradouro: data.logradouro ?? '',
        complemento: data.complemento ?? '',
        bairro: data.bairro ?? '',
        localidade: data.localidade ?? '',
        uf: data.uf ?? '',
        ddd: data.ddd ?? undefined,
      };
      setAddress(payload);
    } catch (e: any) {
      setErr(e?.message || 'Não foi possível consultar o CEP.');
      setAddress(null);
    } finally {
      setLoading(false);
    }
  };

  const choose = (frete: Frete) => {
    if (!address) return;
    onSelect({ cep: address.cep, endereco: address, frete });
    onClose();
  };

  // precificação simples; você pode substituir por cálculo real depois
  const base = 19.9;
  const options: Frete[] = [
    { tipo: 'economico', prazo: '7–10 dias úteis', valor: base },
    { tipo: 'expresso', prazo: '1–3 dias úteis', valor: base + 20 },
    { tipo: 'retira', prazo: 'Retirar hoje', valor: 0 },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000]" aria-modal="true" role="dialog" aria-label="Calcular frete">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Bottom sheet no mobile; modal central no desktop */}
      <div className="absolute inset-x-0 bottom-0 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2
                      bg-white rounded-t-2xl lg:rounded-2xl shadow-xl border border-zinc-200
                      w-full lg:w-[640px] max-h-[85vh] overflow-hidden">
        {/* drag handle */}
        <div className="lg:hidden mx-auto mt-2 mb-1 h-1.5 w-12 rounded-full bg-zinc-300" aria-hidden />

        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Calcular frete</h2>
            <button onClick={onClose} className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100" aria-label="Fechar">✕</button>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              ref={inputRef}
              inputMode="numeric"
              pattern="\d*"
              placeholder="Digite seu CEP"
              maxLength={9}
              value={cep}
              onChange={(e) => {
                const v = e.target.value;
                const digits = onlyDigits(v).slice(0, 8);
                setCep(digits.replace(/(\d{5})(\d{0,3})/, (_, a, b) => (b ? `${a}-${b}` : a)));
              }}
              className="flex-1 h-11 rounded-xl border border-zinc-300 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
             data-cep-input="true"  type="text"  style={{ all: "unset", boxSizing: "border-box", width: "100%", height: "44px", padding: "0 12px", borderRadius: "12px", border: "1px solid #d4d4d8", backgroundColor: "#ffffff", color: "#111827", WebkitTextFillColor: "#111827", caretColor: "#059669", outline: "none" }} />
            <button
              onClick={queryCep}
              disabled={loading}
              className="h-11 px-4 rounded-xl bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </div>

          {err && <p className="mt-2 text-sm text-red-600">{err}</p>}

          {address && (
            <div className="mt-4">
              <div className="rounded-xl border bg-zinc-50 p-3 text-sm text-zinc-700">
                {address.logradouro ? <div><strong>{address.logradouro}</strong></div> : null}
                <div>{address.bairro ? `${address.bairro} — ` : ''}{address.localidade} / {address.uf}</div>
                <div className="text-zinc-500">CEP {address.cep}</div>
              </div>

              <div className="mt-3 grid gap-2">
                {options.map((o) => (
                  <button
                    key={o.tipo}
                    onClick={() => choose(o)}
                    className="flex items-center justify-between rounded-xl border px-4 py-3 text-left hover:bg-zinc-50 active:scale-[0.99]"
                  >
                    <div>
                      <div className="font-medium capitalize">{o.tipo}</div>
                      <div className="text-sm text-zinc-500">{o.prazo}</div>
                    </div>
                    <div className="text-base font-semibold">
                      {o.valor === 0 ? 'Grátis' : o.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  </button>
                ))}
              </div>

              <p className="mt-3 text-xs text-zinc-500">
                Valores estimados. O valor final pode variar conforme sua região.
              </p>
            </div>
          )}
        </div>
      </div>
    
      <style jsx>{`
        :global(input[data-cep-input="true"])::placeholder {
          color: #9ca3af !important;
          opacity: 1;
        }
        :global(input[data-cep-input="true"]:focus) {
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5);
          border-color: rgba(16, 185, 129, 0.6);
        }
        :global(input[data-cep-input="true"]:-webkit-autofill) {
          -webkit-text-fill-color: #111827 !important;
          -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
          background-clip: content-box !important;
        }
      `}</style>
</div>
  );
}
