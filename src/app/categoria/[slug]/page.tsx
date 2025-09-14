import ProductCard from "@/components/ProductCard";
import products from "@/data/products.json";

// normaliza e cria alguns apelidos de slug -> marca
const BRAND_ALIAS: Record<string, string> = {
  apple: "apple",
  iphone: "apple",
  ios: "apple",
  samsung: "samsung",
  galaxy: "samsung",
};

function titleize(s: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default function CategoriaPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (params.slug || "").toLowerCase();
  const brandKey = BRAND_ALIAS[slug] || slug;

  // filtro case-insensitive
  const list = (products as any[]).filter(
    (p) => (p.brand || "").toString().toLowerCase() === brandKey
  );

  const pageTitle =
    brandKey === "apple"
      ? "Linha Apple"
      : brandKey === "samsung"
      ? "Linha Samsung"
      : `Linha ${titleize(brandKey)}`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">{pageTitle}</h1>

      {list.length === 0 ? (
        <div className="rounded-2xl border p-8 text-zinc-600">
          Nenhum produto encontrado para <b>{titleize(brandKey)}</b>.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p: any) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
