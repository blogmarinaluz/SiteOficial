// src/app/layout.tsx
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { Suspense } from "react";

// Util simples e local (sem criar novo arquivo) para obter a base URL
function getBaseUrl(): string {
  const env =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (env) {
    const url = env.startsWith("http") ? env : `https://${env}`;
    return url.replace(/\/+$/, "");
  }
  return "http://localhost:3000";
}

const SITE_NAME = "proStore";
const DEFAULT_TITLE = "proStore — Apple & Samsung";
const DEFAULT_DESCRIPTION =
  "Catálogo Apple e Samsung com 30% OFF. Boleto para negativados.";

export const metadata: Metadata = {
  // Base usada para compor URLs absolutas de OG/alternates quando necessário
  metadataBase: new URL(getBaseUrl()),

  // Título padrão e template para páginas que definirem title próprio
  title: {
    default: DEFAULT_TITLE,
    template: "%s | proStore",
  },

  description: DEFAULT_DESCRIPTION,

  // Melhora rastreabilidade
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Palavras-chave relevantes (não exagerar)
  keywords: [
    "iPhone",
    "Samsung",
    "Apple",
    "Galaxy",
    "smartphone",
    "parcelamento",
    "boleto",
    "negativado",
    "promoção",
    "desconto",
  ],

  // Open Graph básico (sem imagens para não depender de assets inexistentes)
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "pt_BR",
  },

  // Cart do Twitter
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },

  // Canonical base (nas dinâmicas podemos refinar depois, sem criar arquivos)
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      {/* ALTERAÇÃO 1: meta viewport para o mobile funcionar direito */}
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>

      <body>
        <Suspense fallback={<div className="h-16" />}>
          <Header />
        </Suspense>

        {/* ALTERAÇÃO 2: só adiciona respiro lateral no mobile; desktop fica igual */}
        <Suspense fallback={<main className="container py-8" />}>
          <main className="container px-3 sm:px-4 md:px-6 py-6 md:py-8">
            {children}
          </main>
        </Suspense>

        <Footer />
      </body>
    </html>
  );
}
