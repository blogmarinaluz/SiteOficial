// src/components/Footer.tsx
import Link from "next/link";
import type { ReactNode } from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  // WhatsApp: usa ENV se tiver; senão usa o que você me passou
  const waEnv = (process.env.NEXT_PUBLIC_SELLER_NUMBER || "").replace(/\D/g, "");
  const waFallback = "5599984905715";
  const wa = waEnv || waFallback;
  const waHref = `https://wa.me/${wa}?text=Ol%C3%A1%2C%20quero%20atendimento%20pelo%20boleto.`;

  return (
    <footer className="mt-16 border-t border-zinc-200 bg-white">
      {/* faixa de features */}
      <div className="bg-brand-gradient text-white">
        <div className="container grid grid-cols-1 gap-3 py-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-sm">
            <Check />
            <span>Até <strong>10x sem juros</strong> no cartão</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check />
            <span><strong>Frete Grátis</strong> em aparelhos selecionados</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check />
            <span>Atendimento humano via <strong>WhatsApp</strong></span>
          </div>
        </div>
      </div>

      {/* conteúdo principal */}
      <div className="container grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* marca + pagamento */}
        <div>
          <div className="text-2xl font-extrabold leading-none">
            <span className="text-zinc-900">pro</span>
            <span style={{ color: "var(--brand-700)" }}>Store</span>
          </div>
          <p className="mt-2 text-sm text-zinc-600">
            Especialista em celulares novos com garantia.
          </p>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Formas de pagamento
            </p>
            <div className="mt-2 flex items-center gap-2 text-[12px] text-zinc-700">
              <Badge>Pix</Badge>
              <Badge>Boleto</Badge>
              <Badge>
                <CardIcon className="mr-1 h-3 w-3" />
                Cartão
              </Badge>
            </div>
            <p className="mt-2 text-xs text-zinc-500">Parcele em até 10x sem juros.</p>
          </div>
        </div>

        {/* institucional */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-zinc-900">Institucional</h4>
          <ul className="space-y-2 text-sm text-zinc-700">
            <li><Link href="/quem-somos" className="hover:text-black">Quem somos</Link></li>
            <li><Link href="/politica-de-privacidade" className="hover:text-black">Política de Privacidade</Link></li>
            <li><Link href="/termos-de-uso" className="hover:text-black">Termos de Uso</Link></li>
            <li><Link href="/trocas-e-devolucoes" className="hover:text-black">Trocas e Devoluções</Link></li>
          </ul>
        </div>

        {/* atendimento */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-zinc-900">Atendimento</h4>
          <ul className="space-y-2 text-sm text-zinc-700">
            <li className="flex items-center gap-2">
              <WhatsIcon className="h-4 w-4" />
              <a href={waHref} target="_blank" rel="noopener" className="hover:text-black">
                WhatsApp comercial
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="h-4 w-4" />
              <a href="mailto:contato@proStore.com" className="hover:text-black">
                contato@proStore.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="h-4 w-4" />
              <a href="mailto:suporte@proStore.com" className="hover:text-black">
                suporte@proStore.com
              </a>
            </li>
            <li className="text-zinc-500">Seg–Sex, 9h às 18h</li>
          </ul>
        </div>

        {/* redes sociais */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-zinc-900">Siga a proStore</h4>
          <ul className="space-y-2 text-sm text-zinc-700">
            <li><Link href="/quem-somos" className="hover:text-black">Quem somos</Link></li>
            <li><Link href="/politica-de-privacidade" className="hover:text-black">Política de Privacidade</Link></li>
            <li><Link href="/termos-de-uso" className="hover:text-black">Termos de Uso</Link></li>
            <li><Link href="/trocas-e-devolucoes" className="hover:text-black">Trocas e Devoluções</Link></li>
          </ul>

          <div className="mt-6 rounded-lg border border-zinc-200 p-3">
            <p className="text-[11px] text-zinc-600">Site seguro • Certificado SSL ativo</p>
          </div>
        </div>
      </div>

      {/* barra final */}
      <div className="border-t border-zinc-200">
        <div className="container flex flex-col gap-2 py-4 text-xs text-zinc-600 md:flex-row md:items-center md:justify-between">
          <p>© {year} proStore — Todos os direitos reservados.</p>
          <p className="text-zinc-500">CNPJ 00.000.000/0000-00 • Vendas para todo o Brasil</p>
        </div>
      </div>
    </footer>
  );
}

/* ===== helpers (SVGs & mini components) ===== */
function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-2 py-0.5">
      {children}
    </span>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener"
      className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white p-2 text-zinc-700 transition hover:text-black hover:shadow-sm"
      title={label}
    >
      {children}
    </a>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-white" aria-hidden="true" fill="currentColor">
      <path d="M7.5 13.5 3.5 9.5l1.2-1.2 2.8 2.8 7.8-7.8 1.2 1.2z" />
    </svg>
  );
}

function CardIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <rect x="4" y="9" width="16" height="2" fill="#fff" />
    </svg>
  );
}

function WhatsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.7 15l-1 3.7 3.8-1A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 6.8 12.3l.3.9-1 .3A8 8 0 1 1 12 4zm-3 3h.8c.2 0 .4.1.5.3l.7 1.6c.1.2 0 .5-.2.7l-.6.6a6.6 6.6 0 0 0 3.3 3.3l.6-.6c.2-.2.5-.3.7-.2l1.6.7c.2.1.3.3.3.5V15c0 .6-.5 1-1.1 1a9.2 9.2 0 0 1-4-1.4 9.1 9.1 0 0 1-3-3 9.2 9.2 0 0 1-1.4-4c0-.6.4-1.1 1-1.1z" />
    </svg>
  );
}

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2v.3l8 5 8-5V8H4zm16 8V10l-8 5-8-5v6h16z" />
    </svg>
  );
}

function InstaIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.8a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z" />
    </svg>
  );
}

function FbIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M13 9h3V6h-3c-2 0-3.5 1.5-3.5 3.5V12H7v3h2.5v6H13v-6h2.6l.4-3H13v-1.5c0-.3.2-.5.5-.5z" />
    </svg>
  );
}

function YtIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2c-.2-.8-.8-1.4-1.6-1.6C18.6 5.3 12 5.3 12 5.3s-6.6 0-8 .3c-.8.2-1.4.8-1.6 1.6C2 8.6 2 12 2 12s0 3.4.4 4.8c.2.8.8 1.4 1.6 1.6 1.4.3 8 .3 8 .3s6.6 0 8-.3c.8-.2 1.4-.8 1.6-1.6.4-1.4.4-4.8.4-4.8s0-3.4-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}
