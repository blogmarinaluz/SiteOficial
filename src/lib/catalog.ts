import raw from "@/data/products.json";
import flags from "@/data/flags.json";

type RawProduct = (typeof raw)[number];

export type Product = RawProduct & {
  freeShipping?: boolean;
  tag?: string;
  featured?: boolean;
  bbb?: boolean;
  popular?: boolean;
};

const map: Record<string, Partial<Product>> = flags as any;

export const catalog: Product[] = (raw as RawProduct[]).map((p) => ({
  ...p,
  ...(map[p.id] || {})
}));
