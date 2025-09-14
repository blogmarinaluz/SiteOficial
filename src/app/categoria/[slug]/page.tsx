import data from "@/data/products.json";
import ProductGrid from "@/components/ProductGrid";
export default function Category({ params }:{ params:{ slug:string }}){
  const slug = params.slug.toLowerCase();
  const items = data.filter(p => p.brand && p.brand.toLowerCase() === (slug==='apple'?'apple':'samsung'));
  return (<div><h1 className="text-2xl font-bold mb-4">Linha {slug==='apple'?'Apple':'Samsung'}</h1><ProductGrid items={items} /></div>)
}
