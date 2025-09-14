import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata: Metadata = { title: "prostore — Apple & Samsung", description: "Catálogo Apple e Samsung com 30% OFF. Boleto para negativados." };
export default function RootLayout({ children }:{ children: React.ReactNode }){
  return (<html lang="pt-BR"><body><Header/><main className="container py-8">{children}</main><Footer/>
    <a className="whatsapp-fab" href="https://wa.me/5599984905715" target="_blank"><img src="/whatsapp.png" width="56" height="56"/></a>
  </body></html>)
}
