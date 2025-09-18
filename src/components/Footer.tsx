// src/components/Footer.tsx
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Footer — v4 (padrão grande e‑commerce BR/Global)
 * - Mobile: seções em <details> (accordions) para não virar "listão".
 * - Desktop: 4 colunas sempre visíveis.
 * - Linha de pagamentos + selos de segurança.
 * - Social e WhatsApp condicionais por ENV; CNPJ opcional.
 * - Totalmente alinhado à `.container`, sem faixas escuras.
 */

export default function Footer() {
  const year = new Date().getFullYear();

  // WhatsApp comercial (apenas se definido)
  const wa = (process.env.NEXT_PUBLIC_SELLER_NUMBER || "").replace(/\D/g, "");
  const waHref = wa ? `https://wa.me/${wa}?text=Ol%C3%A1%2C%20quero%20atendimento%20pelo%20boleto.` : "";

  // Redes sociais via ENV
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
      {/* Grid principal */}
      <div className="container py-10">
        {/* Desktop: 4 colunas; Mobile: accordions */}
        <div className="hidden gap-10 md:grid md:grid-cols-4">
          <BrandCol />
          <LinksCol
            title="Ajuda"
            items={[
              { href: "/como-comprar", label: "Como comprar" },
              { href: "/rastrear-pedido", label: "Rastrear pedido" },
              { href: "/trocas-e-devolucoes", label: "Trocas e Devoluções" },
              { href: "/garantia", label: "Garantia e Assistência" },
              { href: "/faq", label: "Perguntas frequentes (FAQ)" },
            ]}
          />
          <LinksCol
            title="Institucional"
            items={[
              { href: "/quem-somos", label: "Quem somos" },
              { href: "/politica-de-privacidade", label: "Política de Privacidade" },
              { href: "/termos", label: "Termos de Uso" },
              { href: "/politica-de-cookies", label: "Política de Cookies" },
            ]}
          />
          <ContactCol waHref={waHref} social={hasSocial ? SOCIAL : []} />
        </div>

        {/* Mobile accordions */}
        <div className="md:hidden">
          <BrandCol />

          <Accordion title="Ajuda">
            <List>
              <Item href="/como-comprar">Como comprar</Item>
              <Item href="/rastrear-pedido">Rastrear pedido</Item>
              <Item href="/trocas-e-devolucoes">Trocas e Devoluções</Item>
              <Item href="/garantia">Garantia e Assistência</Item>
              <Item href="/faq">Perguntas frequentes (FAQ)</Item>
            </List>
          </Accordion>

          <Accordion title="Institucional">
            <List>
              <Item href="/quem-somos">Quem somos</Item>
              <Item href="/politica-de-privacidade">Política de Privacidade</Item>
              <Item href="/termos">Termos de Uso</Item>
              <Item href="/politica-de-cookies">Política de Cookies</Item>
            </List>
          </Accordion>

          <Accordion title="Atendimento">
            <ContactInner waHref={waHref} social={hasSocial ? SOCIAL : []} />
          </Accordion>
        </div>

        {/* Pagamentos + Selos */}
        <div className="mt-10 grid grid-cols-1 items-center gap-6 border-t border-zinc-200 pt-6 sm:grid-cols-2">
          <div>
            <Label>Formas de pagamento</Label>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <PayPix />
              <PayBoleto />
              <PayCard />
              <PayVisa />
              <PayMaster />
              <PayElo />
            </div>
            <p className="mt-2 text-xs text-zinc-600">Parcele em até 10x sem juros.</p>
          </div>

          <div className="justify-self-start sm:justify-self-end">
            <Label>Segurança</Label>
            <div className="mt-3 flex items-center gap-3">
              <SealSSL />
              <SealShield />
            </div>
          </div>
        </div>
      </div>

      {/* Linha legal */}
      <div className="border-t border-zinc-200">
        <div className="container flex flex-col items-start justify-between gap-3 py-4 sm:flex-row sm:items-center">
          <p className="text-[12px] text-zinc-600">
            © {year} proStore — Todos os direitos reservados.
            {CNPJ ? ` CNPJ ${CNPJ} • Vendas para todo o Brasil` : ""}
          </p>
          <p className="text-[11px] text-zinc-500">Site seguro • Certificado SSL ativo</p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------- Colunas -------------------------- */

function BrandCol() {
  return (
    <div className="space-y-3">
      <Brand />
      <p className="text-sm text-zinc-600">
        Especialista em celulares novos com garantia.
      </p>
    </div>
  );
}

function LinksCol({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div className="space-y-4">
      <Label>{title}</Label>
      <ul className="grid grid-cols-1 gap-3 text-sm">
        {items.map((it) => (
          <li key={it.href}>
            <FooterLink href={it.href}>{it.label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactCol({ waHref, social }: { waHref: string; social: any[] }) {
  return (
    <div className="space-y-4">
      <Label>Atendimento</Label>
      <ContactInner waHref={waHref} social={social} />
    </div>
  );
}

function ContactInner({ waHref, social }: { waHref: string; social: any[] }) {
  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-1 gap-3 text-sm">
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

      {social.length > 0 && (
        <div>
          <Label>Redes sociais</Label>
          <div className="mt-2 flex gap-2">
            {social.map(({ href, label, Icon }, i) =>
              href ? (
                <Social key={i} href={href} label={label}>
                  <Icon className="h-5 w-5" />
                </Social>
              ) : null
            )}
          </div>
        </div>
      )}
      <p className="text-sm text-zinc-600">Seg–Sex, 9h às 18h</p>
    </div>
  );
}

/* -------------------------- Accordions (mobile) -------------------------- */

function Accordion({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="border-b border-zinc-200 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-800">
        {title}
        <span className="inline-block select-none text-zinc-500">＋</span>
      </summary>
      <div className="pt-3">{children}</div>
    </details>
  );
}

function List({ children }: { children: ReactNode }) {
  return <ul className="grid grid-cols-1 gap-3 text-sm">{children}</ul>;
}
function Item({ href, children }: { href: string; children: ReactNode }) {
  return <li><FooterLink href={href}>{children}</FooterLink></li>;
}

/* -------------------------- UI atoms -------------------------- */

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-brand-black">
        pro<span className="text-accent">Store</span>
      </span>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{children}</p>;
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

/* -------------------------- Payment & Trust Badges (SVGs neutros) -------------------------- */

function PayPix() {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-700">
      <PixIcon className="h-4 w-4" /> Pix
    </span>
  );
}
function PayBoleto() {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-700">
      <BoletoIcon className="h-4 w-4" /> Boleto
    </span>
  );
}
function PayCard() {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-700">
      <CardIcon className="h-4 w-4" /> Cartão
    </span>
  );
}
function PayVisa() { return <BrandMono label="Visa" />; }
function PayMaster() { return <BrandMono label="Mastercard" />; }
function PayElo() { return <BrandMono label="Elo" />; }

function BrandMono({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-600">
      {label}
    </span>
  );
}

function SealSSL() {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-700">
      <ShieldIcon className="h-4 w-4" /> Certificado SSL
    </span>
  );
}
function SealShield() {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-700">
      <ShieldCheckIcon className="h-4 w-4" /> Site seguro
    </span>
  );
}

/* -------------------------- Ícones -------------------------- */

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

function PixIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2 2 12l10 10 10-10L12 2Zm0 3.4L18.6 12 12 18.6 5.4 12 12 5.4Z" />
    </svg>
  );
}
function BoletoIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M3 4h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm1 2v12h2V6H4Zm4 0v12h1V6H8Zm3 0v12h2V6h-2Zm4 0v12h1V6h-1Zm3 0v12h2V6h-2Z" />
    </svg>
  );
}
function CardIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2H2V6Zm0 4h20v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6Zm3 5h6v1H5v-1Z" />
    </svg>
  );
}
function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2 3 5v7c0 5 4 8.3 9 10 5-1.7 9-5 9-10V5l-9-3Z" />
    </svg>
  );
}
function ShieldCheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2 3 5v7c0 5 4 8.3 9 10 5-1.7 9-5 9-10V5l-9-3Zm-2 13-3-3 1.4-1.4L10 12.2l5.6-5.6L17 8l-7 7Z" />
    </svg>
  );
}
