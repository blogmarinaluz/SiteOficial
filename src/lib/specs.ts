// src/lib/specs.ts
export type BasicProduct = {
  name: string;
  brand?: string;
  storage?: number | string;
  color?: string;
};

export type SpecItem = { label: string; value: string };
export type ProductCopy = {
  headline: string;
  paragraphs: string[];
  specs: SpecItem[];
};

/** helpers */
const norm = (v?: string) => (v || "").toLowerCase();
const has = (s: string, token: string) => norm(s).includes(token);

/** detectores simples por família/modelo */
function isIphone(n: string) { return has(n,"iphone"); }
function isIphone14(n: string) { return isIphone(n) && has(n,"14") && !has(n,"15"); }
function isIphone14Plus(n: string) { return isIphone14(n) && has(n,"plus"); }
function isIphone15(n: string) { return isIphone(n) && has(n,"15") && !has(n,"pro"); }
function isIphone15Plus(n: string) { return isIphone15(n) && has(n,"plus"); }
function isIphone15Pro(n: string) { return isIphone(n) && has(n,"15") && has(n,"pro") && !has(n,"max"); }
function isIphone15ProMax(n: string) { return isIphone(n) && has(n,"15") && has(n,"pro") && has(n,"max"); }

function isGalaxy(n: string) { return has(n,"galaxy") || has(n,"samsung"); }
function isGalaxyA(n: string) { return isGalaxy(n) && has(n," a"); }
function isGalaxyS(n: string) { return isGalaxy(n) && / s\d{2}/.test(" "+n.toLowerCase()+" "); }

/** texto padrão sempre presente (novos, lacrados etc.) */
function baseGuarantees(p: BasicProduct): SpecItem[] {
  const storage = p.storage ? `${p.storage} GB` : "—";
  return [
    { label: "Condição", value: "Produto **novo e lacrado** de fábrica" },
    { label: "Nota Fiscal", value: "Emitida em nome do comprador" },
    { label: "Homologação", value: "Aparelho **homologado pela Anatel**" },
    { label: "Garantia", value: "180 dias com a proStore" },
    { label: "Armazenamento", value: storage },
    ...(p.color ? [{ label: "Cor", value: p.color }] : []),
  ];
}

/** Gerador de cópia e specs por modelo */
export function buildCopy(p: BasicProduct): ProductCopy {
  const n = p.name;

  // iPhone 15 Pro / Pro Max
  if (isIphone15ProMax(n) || isIphone15Pro(n)) {
    return {
      headline: "Poder de sobra, acabamento premium e câmera de cinema.",
      paragraphs: [
        "O iPhone 15 Pro eleva o padrão com construção em **titânio**, bordas finas e desempenho impressionante para quem exige o melhor. A nova geração entrega abertura de apps instantânea, jogos com gráficos de console e um fluxo de trabalho profissional fluido.",
        "O conjunto de câmeras traz **sensor avançado de alta resolução** com qualidade de cinema, fotos nítidas em qualquer luz e vídeos estáveis em 4K. O modo Retrato ganhou foco automático aprimorado para destacar pessoas e objetos.",
        "Agora com **USB-C**, você transfere arquivos com agilidade e carrega seus acessórios com o próprio iPhone. A bateria acompanha o seu ritmo, e o iOS garante anos de atualizações e segurança.",
        "E claro: **novo, lacrado, com Nota Fiscal e homologado pela Anatel**.",
      ],
      specs: [
        ...baseGuarantees(p),
        { label: "Processador", value: "Chip de última geração com desempenho para apps profissionais e jogos" },
        { label: "Tela", value: "Painel de altíssima definição com taxa de atualização suave" },
        { label: "Conexão", value: "5G, Wi-Fi rápido, NFC e GPS" },
        { label: "Porta", value: "USB-C" },
        { label: "Segurança", value: "Face ID" },
      ],
    };
  }

  // iPhone 15 e 15 Plus
  if (isIphone15Plus(n) || isIphone15(n)) {
    return {
      headline: "Dynamic Island, câmera de 48 MP e USB-C no iPhone que todo mundo quer.",
      paragraphs: [
        "O iPhone 15 chegou com **Dynamic Island** para alertas ao vivo, câmera principal **de alta resolução** para fotos detalhadas e vídeos nítidos, além de desempenho rápido e eficiente para o dia a dia.",
        "A bateria foi otimizada para durar o dia inteiro e o novo **USB-C** simplifica sua vida: um cabo para carregar tudo.",
        "Experiência Apple completa, com iOS atualizado, privacidade, integração com AirPods, Apple Watch e muito mais.",
        "**Novo e lacrado**, com **Nota Fiscal** e **homologado pela Anatel**.",
      ],
      specs: [
        ...baseGuarantees(p),
        { label: "Processador", value: "Chip Apple de última geração, rápido e eficiente" },
        { label: "Tela", value: "Super Retina de alta definição com cores vibrantes" },
        { label: "Câmeras", value: "Conjunto com sensor de alta resolução, fotos excelentes em pouca luz" },
        { label: "Conectividade", value: "5G, Wi-Fi, NFC, Bluetooth" },
        { label: "Porta", value: "USB-C" },
        { label: "Segurança", value: "Face ID" },
      ],
    };
  }

  // iPhone 14 / 14 Plus
  if (isIphone14Plus(n) || isIphone14(n)) {
    return {
      headline: "Desempenho confiável, fotos incríveis e a experiência iOS que você ama.",
      paragraphs: [
        "O iPhone 14 oferece o equilíbrio perfeito entre **velocidade**, **câmeras de alta qualidade** e autonomia para acompanhar o seu dia. As fotos têm cores naturais e excelente nitidez, mesmo à noite.",
        "A tela Super Retina entrega brilho e contraste impecáveis para streaming, redes sociais e jogos.",
        "Com iOS, você tem privacidade, atualizações por anos e integração com todo o ecossistema Apple.",
        "A unidade é **nova e lacrada**, com **Nota Fiscal** e **homologação Anatel**.",
      ],
      specs: [
        ...baseGuarantees(p),
        { label: "Processador", value: "Chip Apple rápido para multitarefa e jogos" },
        { label: "Tela", value: "Super Retina com alto brilho e cores fiéis" },
        { label: "Câmeras", value: "Dupla traseira com estabilização e vídeo em 4K" },
        { label: "Conectividade", value: "5G, Wi-Fi, NFC, Bluetooth" },
        { label: "Porta", value: "Lightning" },
        { label: "Segurança", value: "Face ID" },
      ],
    };
  }

  // Galaxy A (A14, A24, A34, A54 etc.)
  if (isGalaxyA(n)) {
    return {
      headline: "Tela grande, bateria de longa duração e câmeras versáteis.",
      paragraphs: [
        "A família Galaxy A entrega excelente custo-benefício para quem quer desempenho equilibrado e visual moderno. A tela grande é perfeita para vídeos e redes sociais; a bateria foi pensada para durar o dia inteiro.",
        "O conjunto de câmeras é versátil para fotos do dia a dia, com modo noturno e registros nítidos em ambientes internos.",
        "Interface Samsung One UI fluida e recursos úteis do ecossistema Galaxy.",
        "**Produto novo e lacrado**, com **Nota Fiscal** e **Anatel**.",
      ],
      specs: [
        ...baseGuarantees(p),
        { label: "Tela", value: "Ampla, com boa definição e conforto para leitura e vídeos" },
        { label: "Câmeras", value: "Conjunto traseiro múltiplo + frontal para selfies" },
        { label: "Bateria", value: "Alta capacidade com boa autonomia no dia a dia" },
        { label: "Conectividade", value: "4G/5G conforme variante, Wi-Fi, Bluetooth, NFC em modelos compatíveis" },
        { label: "Sistema", value: "Android (Samsung One UI)" },
      ],
    };
  }

  // Galaxy S (S21, S22, S23, S24...)
  if (isGalaxyS(n)) {
    return {
      headline: "Linha premium Galaxy: performance, câmeras poderosas e design sofisticado.",
      paragraphs: [
        "A série Galaxy S é sinônimo de acabamento de alto nível, **desempenho rápido** e um conjunto de câmeras que impressiona em foto e vídeo. Ideal para quem busca fluidez, recursos avançados e visual elegante.",
        "Tela com altíssima qualidade para conteúdos HDR, jogos e produtividade — tudo com a interface One UI refinada.",
        "Unidade **nova, lacrada**, **com NF** e **homologação Anatel**.",
      ],
      specs: [
        ...baseGuarantees(p),
        { label: "Processador", value: "Chip topo de linha com folga para multitarefa e games" },
        { label: "Tela", value: "Painel de alta definição e suavidade" },
        { label: "Câmeras", value: "Conjunto avançado com estabilização e recursos noturnos" },
        { label: "Conectividade", value: "5G completo, Wi-Fi de alta velocidade, NFC" },
        { label: "Sistema", value: "Android (Samsung One UI)" },
      ],
    };
  }

  // Fallback genérico — ainda premium, sem cair no “conforme fabricante”
  return {
    headline: "Desempenho, qualidade e garantia para usar por muitos anos.",
    paragraphs: [
      `O ${p.name} entrega experiência fluida para apps, fotos e vídeos, com tela de ótima definição e bateria otimizada para o seu ritmo.`,
      "Acabamento de primeira, sistema atualizado e todos os recursos essenciais para o dia a dia.",
      "**Novo, lacrado, com Nota Fiscal e homologado pela Anatel** — segurança total na sua compra.",
    ],
    specs: [
      ...baseGuarantees(p),
      { label: "Tela", value: "Alto brilho e excelente definição" },
      { label: "Câmeras", value: "Conjunto versátil para fotos nítidas e vídeos estáveis" },
      { label: "Conectividade", value: "4G/5G (quando disponível), Wi-Fi, Bluetooth" },
    ],
  };
}
