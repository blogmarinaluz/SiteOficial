import type { MetadataRoute } from "next";
import products from "@/data/products.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.prostore.com.br";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/produtos`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/ofertas`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/bbb-do-dia`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/categoria/iphone`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/categoria/samsung`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/categorias/acessorios`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/categorias/wearables`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/categorias/casa-inteligente`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/quem-somos`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/garantia`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/trocas-e-devolucoes`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/politica-de-privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
    { url: `${base}/politica-de-cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
    { url: `${base}/termos-de-uso`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
  ];

  // Build product URLs from your products.json
  const productRoutes: MetadataRoute.Sitemap = (products as any[])
    .filter(Boolean)
    .map((p: any) => {
      const id = String(p?.id || "");
      const slug = id.replace(/\.[a-z0-9]+$/i, "");
      return {
        url: `${base}/produto/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });

  return [...staticRoutes, ...productRoutes];
}
