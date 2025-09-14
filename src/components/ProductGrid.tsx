import ProductCard from "./ProductCard";

export type Product = {
  id: string;
  brand: string;
  name: string;
  image?: string;
  price: number;
  freeShipping?: boolean;
  [k: string]: any;
};

type Props = { products?: Product[]; items?: Product[] };

export default function ProductGrid({ products, items }: Props) {
  const list = (products ?? items ?? []) as Product[];
  if (!list.length) return null;

  // Compat: qualquer assinatura de ProductCard
  const Card: any = ProductCard;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
      {list.map((p) => (
        <Card key={p.id} product={p} p={p} />
      ))}
    </div>
  );
}
