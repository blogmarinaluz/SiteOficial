import ProductGrid from "@/components/ProductGrid";
import data from "@/data/products.json";
export default function Home(){
  const destaques = data.slice(0, 6);
  return (
    <div className="space-y-12">
      <section className="card">
        <h1 className="text-3xl md:text-4xl font-extrabold">Apple & Samsung com 30% OFF</h1>
        <p className="text-zinc-600 mt-2">Produtos novos e lacrados com NF e garantia. Boleto para negativados (mediante análise de cadastro).</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Destaques</h2>
        <ProductGrid items={destaques} />
      </section>
      <section className="card">
        <h3 className="text-xl font-semibold">Formas de Pagamento</h3>
        <p className="text-sm text-zinc-600">Pix · Cartão em até 12x · Boleto (inclusive para negativados, mediante análise)</p>
      </section>
      <section className="card">
        <h3 className="text-xl font-semibold">O que os clientes dizem</h3>
        <ul className="mt-2 space-y-2 text-sm text-zinc-700">
          <li>“Comprei o iPhone 15 Pro. Chegou lacrado e antes do prazo. Excelente!” — <b>Amanda S.</b></li>
          <li>“Fiz a análise e consegui comprar no boleto mesmo negativado.” — <b>Lucas R.</b></li>
          <li>“Suporte respondeu rápido, processo simples.” — <b>Carla M.</b></li>
        </ul>
      </section>
    </div>
  )
}
