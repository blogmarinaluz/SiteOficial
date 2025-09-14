import productsRaw from "@/data/products.json";
import flagsMap from "@/data/flags.json";

type RawProduct = {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  [k: string]: any;
};

type FlagPatch = {
  freeShipping?: boolean;
  tag?: string;
  featured?: boolean;
  bbb?: boolean;
  popular?: boolean;
};

const flags = flagsMap as Record<string, FlagPatch>;

function applyFlags(p: RawProduct): RawProduct & FlagPatch {
  let merged: RawProduct & FlagPatch = { ...p };

  // 1) match exato por ID
  if (flags[p.id]) {
    merged = { ...merged, ...flags[p.id] };
  }

  // 2) fallback por nome de arquivo da imagem (ex.: .../apple_iphone-14_128_preto_.jpg)
  const img = p.image || "";
  const base = img.split("/").pop() || img;

  for (const [key, patch] of Object.entries(flags)) {
    if (key === p.id) continue;
    const isFile =
      key.endsWith(".jpg") ||
      key.endsWith(".jpeg") ||
      key.endsWith(".png") ||
      key.endsWith(".webp");

    if (isFile && (img.endsWith(key) || base === key)) {
      merged = { ...merged, ...patch };
    }
  }

  return merged;
}

export const catalog = (productsRaw as RawProduct[]).map(applyFlags);
export type Product = (typeof catalog)[number];
