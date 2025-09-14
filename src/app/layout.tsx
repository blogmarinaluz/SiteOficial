// src/app/layout.tsx
import "./globals.css";
import Header from "@/components/Header";   // <- default import
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "proStore — Apple & Samsung",
  description: "Catálogo Apple e Samsung com 30% OFF. Boleto para negativados.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main className="container py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
