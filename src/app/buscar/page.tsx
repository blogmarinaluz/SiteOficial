import data from "@/data/products.json";
import ProductGrid from "@/components/ProductGrid";
export default function Buscar({ searchParams }:{ searchParams:{ q?:string }}){
  const term = (searchParams.q||'').toLowerCase();
  const items = data.filter(p => [p.name,p.brand,p.storage,p.color].join(' ').toLowerCase().includes(term));
  return (<div><h1 className="text-2xl font-bold mb-4">Resultados para: "{term}"</h1><ProductGrid items={items}/></div>)
}
