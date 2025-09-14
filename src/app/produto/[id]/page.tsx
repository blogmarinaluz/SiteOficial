"use client";

import { useMemo, useState } from "react";
import products from "@/data/products.json";
import { useCart } from "@/hooks/useCart";

/** Helpers locais para não depender de outros módulos */
function br(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function withCoupon(n: number) {
  // 30% OFF de cupom
  return Math.round(n * 0.7);
}

/** Tipos bem soltos para não travar o build se faltar algum campo */
type AnyRecord = Record<string, any>;

export default function ProdutoPage({ params }: { params: { id: string } }) {
  // Busca produto por id (string ex.: "apple_iphone-14_128_preto")
  const product: AnyRecord | undefined = useMemo(
    () =>
      (products as AnyRecord[]).find((p) => String(p.id) === String(params.id)),
    [params.id]
  );

  const { add } = useCart();

  if (!product) {
    return (
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-2">Produto não encontrado</h1>
        <p className="text-zinc-600">
          O item solicitado não foi localizado no catálogo.
        </p>
      </div>
    );
  }

  /** Normaliza listas de cores e GB */
  const colorList: string[] =
    product.colors ||
    product.options?.colors ||
    product.variants?.colors ||
    [];

  const storageList: (string | number)[] =
    product.storages ||
    product.options?.storages ||
    product.variants?.storages ||
    (product.storage ? [product.storage] : []);

  /** Estados selecionados */
  const [color, setColor] = useState<string>(
    colorList.length ? String(colorList[0]) : String(product.color ?? "")
  );
  const [storage, setStorage] = useState<string | number>(
    storageList.length ? storageList[0] : product.storage ?? ""
  );

  /** Pega imagem pela cor, se existir, senão usa a principal */
  const image: string =
    product.imagesByColor?.[color] ||
    product.images?.[color] ||
    product.image ||
    product.thumbnail ||
    "/placeholder.png";

  /** Calcula preço por GB, se houver tabela; senão usa price base */
  const priceFromTable =
    product.priceByStorage?.[String(storage)] ??
    product.priceTiers?.find((t: AnyRecord) => String(t.storage) === String(storage))
      ?.price;

  const price: number = Number(
    priceFromTable ?? product.price ?? product.basePrice ?? 0
  );

  const name: string =
    product.displayName ||
    product.name ||
    (product.brand && product.model
      ? `${product.brand} ${product.model}`
      : String(product.id));

  const freeShipping: boolean = Boolean(product.freeShipping === true);

  /** Objeto final que representa a seleção ativa */
  const ativo = {
    id: `${product.id}__${color || "std"}__${storage || "std"}`,
    name: `${name}${storage ? ` ${storage}GB` : ""}${color ? ` ${color}` : ""}`,
    image,
    color,
    storage,
    price,
    freeShipping,
  };

  function handleAdd() {
    add({
      ...ativo,
      qty: 1,
    });
    alert("Adicionado ao carrinho!");
  }

  return (
    <div className="grid md:grid-cols-[1fr,1fr] gap-8 p-6">
      {/* Coluna da imagem */}
      <div>
        <img
          src={image}
          alt={name}
          className="rounded-2xl w-full object-cover border"
        />

        {/* Se existir mais imagens por cor, mostra miniaturas */}
        {colorList.length > 1 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {colorList.map((c) => {
              const thumb =
                product.imagesByColor?.[c] ||
                product.images?.[c] ||
                product.image;
              return (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`border rounded-xl p-1 ${
                    c === color ? "border-accent" : "border-zinc-200"
                  }`}
                  title={c}
                >
                  <img
                    src={thumb}
                    alt={c}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Coluna de informações */}
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          {product.brand && (
            <div className="text-sm text-zinc-500 mt-1">
              Marca: {String(product.brand).charAt(0).toUpperCase() + String(product.brand).slice(1)}
            </div>
          )}
        </div>

        {/* Preços */}
        <div className="space-y-1">
          <div className="text-3xl font-extrabold text-accent">{br(price)}</div>
          <div className="text-sm text-zinc-600">
            Com cupom <b>30% OFF</b>:{" "}
            <b className="text-green-600">{br(withCoupon(price))}</b>
          </div>
          <div className="text-sm text-zinc-600">
            ou em até <b>10x</b> de{" "}
            <b>{br(Math.ceil(price / 10))}</b> <span className="italic">sem juros</span>
          </div>
          {freeShipping && (
            <div className="inline-flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1 mt-2">
              🚚 Frete: <b>Grátis</b>
            </div>
          )}
        </div>

        {/* Seletor de Cor */}
        {!!colorList.length && (
          <div>
            <div className="font-medium mb-2">Cor</div>
            <div className="flex flex-wrap gap-2">
              {colorList.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-3 py-2 rounded-2xl border ${
                    c === color
                      ? "border-accent bg-accent/10"
                      : "border-zinc-300 hover:border-accent"
                  }`}
                >
                  {String(c)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Seletor de Armazenamento */}
        {!!storageList.length && (
          <div>
            <div className="font-medium mb-2">Armazenamento</div>
            <div className="flex flex-wrap gap-2">
              {storageList.map((gb) => (
                <button
                  key={String(gb)}
                  onClick={() => setStorage(gb)}
                  className={`px-3 py-2 rounded-2xl border ${
                    String(gb) === String(storage)
                      ? "border-accent bg-accent/10"
                      : "border-zinc-300 hover:border-accent"
                  }`}
                >
                  {gb}GB
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-3">
          <button className="btn-primary" onClick={handleAdd}>
            Adicionar ao carrinho
          </button>
          <a
            href="/carrinho"
            className="btn-outline"
            onClick={(e) => {
              // adiciona e já vai pro carrinho
              e.preventDefault();
              handleAdd();
              setTimeout(() => {
                window.location.href = "/carrinho";
              }, 100);
            }}
          >
            Comprar agora
          </a>
        </div>

        {/* Descrição e Características — placeholders se faltarem */}
        <section className="prose max-w-none">
          <h2 className="text-xl font-semibold mt-6 mb-2">
            Descrição do produto
          </h2>
          <p className="text-zinc-700">
            {product.description ||
              "Smartphone original, lacrado, com garantia e nota fiscal. Alto desempenho, câmeras de qualidade e bateria duradoura — perfeito para o dia a dia."}
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            Características técnicas
          </h3>
          <ul className="list-disc pl-5 text-zinc-700 space-y-1">
            <li>Armazenamento: {storage || product.storage || "—"} GB</li>
            <li>Cor: {color || product.color || "—"}</li>
            <li>Garantia: {product.warranty || "12 meses"}</li>
            <li>Tela: {product.display || "Alta resolução"}</li>
            <li>Câmera: {product.camera || "Câmeras avançadas"}</li>
            <li>Bateria: {product.battery || "Longa duração"}</li>
            <li>Conectividade: {product.connectivity || "5G / Wi-Fi / Bluetooth"}</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
