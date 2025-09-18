// src/components/Footer.tsx
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Footer — v2 (clean & aligned)
 * - Alinhamento consistente com o restante do site (usa .container).
 * - Tipografia mais discreta; labels em uppercase pequenas.
 * - Ícones minimalistas, mesma espessura; espaçamento confortável.
 * - Social/WhatsApp só aparecem se tiver URL/número (sem botões mortos).
 * - Links institucionais como <Link>; e-mails em mailto:.
 */

export default function Footer() {
  const year = new Date().getFullYear();

  // WhatsApp comercial (mostra apenas se definido)
  const wa = (process.env.NEXT_PUBLIC_SELLER_NUMBER || "").replace(/\D/g, "");
  const waHref = wa ? `https://wa.me/${wa}?text=Ol%C3%A1%2C%20quero%20atendimento%20pelo%20boleto.` : "";

  // Redes sociais por ENV
  const SOCIAL = [
    { key: "INSTAGRAM", label: "Instagram", Icon: InstaIcon },
    { key: "FACEBOOK", label: "Facebook", Icon: FbIcon },
    { key: "X", label: "X", Icon: XIcon },
    { key: "TIKTOK", label: "TikTok", Icon: TiktokIcon },
  ].map((s) => ({
    ...s,
    href: String(process.env[`NEXT_PUBLIC_SOCIAL_${s.key}`] || ""),
  }));
  const hasSocial = SOCIAL.some((s) => s.href);

  const CNPJ = String(process.env.NEXT_PUBLIC_CNPJ || "");

  return (
    <footer className="mt-16 border-t border-zinc-200 bg-white">
      {/* Faixa superior */}
      <div className="bg-brand-gradient text-white">
        <div className="container flex flex-col gap-2 py-3 sm:grid sm:grid-cols-3">
          <Feature>Até <strong>10x sem juros</strong> no cartão</Feature>
          <Feature><strong>Frete Grátis</strong> em aparelhos selecionados</Feature>
          <Feature>Atendimento humano via <strong>WhatsApp</strong></Feature>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Coluna 1: Sobre */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-brand-black">proStore</h3>
          <p className="text-sm text-zinc-600">
            Especialista em celulares novos com garantia.
          </p>

          <div className="space-y-2">
            <Label>Formas de pagamento</Label>
            <div className="flex flex-wrap gap-2">
              <Badge>Pix</Badge>
              <Badge>Boleto</Badge>
              <Badge>Cartão</Badge>
            </div>
            <p className="text-xs text-zinc-600">Parcele em até 10x sem juros.</p>
          </div>
        </div>

        {/* Coluna 2: Institucional */}
        <nav aria-label="Institucional" className="space-y-4">
          <Label>Institucional</Label>
          <ul className="space-y-3 text-sm">
            <li><FooterLink href="/quem-somos">Quem somos</FooterLink></li>
            <li><FooterLink href="/politica-de-privacidade">Política de Privacidade</FooterLink></li>
            <li><FooterLink href="/termos">Termos de Uso</FooterLink></li>
            <li><FooterLink href="/trocas-e-devolucoes">Trocas e Devoluções</FooterLink></li>
          </ul>
        </nav>

        {/* Coluna 3: Atendimento */}
        <div className="space-y-4">
          <Label>Atendimento</Label>

          <ul className="space-y-3 text-sm">
            {waHref && (
              <li>
                <FooterA href={waHref} target="_blank" rel="noopener noreferrer">
                  <span className="inline-flex items-center gap-2">
                    <WaIcon className="h-4 w-4 text-zinc-700" />
                    WhatsApp comercial
                  </span>
                </FooterA>
              </li>
            )}

            <li>
              <FooterA href="mailto:contato@proStore.com">
                <span className="inline-flex items-center gap-2">
                  <MailIcon className="h-4 w-4 text-zinc-700" />
                  contato@proStore.com
                </span>
              </FooterA>
            </li>

            <li>
              <FooterA href="mailto:suporte@proStore.com">
                <span className="inline-flex items-center gap-2">
                  <MailIcon className="h-4 w-4 text-zinc-700" />
                  suporte@proStore.com
                </span>
              </FooterA>
            </li>
          </ul>

          <p className="text-sm text-zinc-600">Seg–Sex, 9h às 18h</p>

          {hasSocial && (
            <div className="pt-2">
              <p className="text-sm font-medium text-zinc-700">Siga a proStore</p>
              <div className="mt-3 flex gap-2">
                {SOCIAL.map(({ href, label, Icon }, i) =>
                  href ? (
                    <Social key={i} href={href} label={label}>
                      <Icon className="h-5 w-5" />
                    </Social>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>

        {/* Coluna 4: Selo & Legal */}
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200 p-3">
            <p className="text-[11px] text-zinc-600">
              Site seguro • Certificado SSL ativo
            </p>
          </div>

          <div className="text-[12px] text-zinc-600">
            <p>© {year} proStore — Todos os direitos reservados.</p>
            {CNPJ && <p>CNPJ {CNPJ} • Vendas para todo o Brasil</p>}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------- Pequenos componentes -------------------------- */

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
      {children}
    </p>
  );
}

function Feature({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Check />
      <span>{children}</span>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-zinc-800 underline-offset-2 hover:text-brand-black hover:underline">
      {children}
    </Link>
  );
}

function FooterA({
  href,
  children,
  ...rest
}: React.ComponentProps<"a"> & { children: ReactNode }) {
  return (
    <a href={href} {...rest} className="text-zinc-800 underline-offset-2 hover:text-brand-black hover:underline">
      {children}
    </a>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-700">
      {children}
    </span>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
    >
      {children}
    </a>
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 flex-none text-white ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function WaIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.5 3.5a11.5 11.5 0 0 0-17 15l-1.3 3.8a1 1 0 0 0 1.2 1.2l3.8-1.3a11.5 11.5 0 0 0 15-17Zm-8.5 18a9.5 9.5 0 1 1 0-19 9.5 9.5 0 0 1 0 19Zm4.6-6.9c-.2-.1-1.3-.6-1.5-.7s-.4-.1-.6.1-.7.8-.9 1c-.2.2-.3.2-.6.1a7.6 7.6 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5l.1-.3c0-.1 0-.3 0-.5s-.5-1.5-.7-2-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.5s1.1 2.9 1.2 3.1a14.7 14.7 0 0 0 4.3 4.3c.4.2 2.4.9 3.1 1 .7.2 1.3.1 1.8.1.6 0 1.8-.7 2-1.4.3-.8.3-1.5.2-1.6 0 0-.1-.1-.3-.2Z" />
    </svg>
  );
}

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.5l9 5.5 9-5.5V7H3Zm18 10V9.2l-8.4 5.1a2 2 0 0 1-2.2 0L2 9.2V17h19Z" />
    </svg>
  );
}

function InstaIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm11 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function FbIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M13 3h4a1 1 0 1 1 0 2h-3v3h3a1 1 0 1 1 0 2h-3v10a1 1 0 1 1-2 0V10H9a1 1 0 1 1 0-2h3V5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M4 3h5.7l3.4 5 3.8-5H20l-5.9 7.7L20 21h-5.7l-3.6-5.4L6.6 21H4l6.6-8.7L4 3Zm5 2H6.9l3.9 5.7L15 5.9 9 5Z" />
    </svg>
  );
}

function TiktokIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M14 3h3.1c.3 1.7 1.5 3 3.1 3.4V9c-1.7 0-3.3-.6-4.6-1.6v6.9c0 3.3-2.6 6-5.9 6S3.8 17.6 3.8 14.3c0-2 0-3.7 1.7-3.7 3.7S8.6 18 10.6 18s3.7-1.7 3.7-3.7V3z" />
    </svg>
  );
}
