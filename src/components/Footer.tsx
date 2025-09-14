export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container py-8 text-sm text-zinc-600 grid md:grid-cols-3 gap-6">
        <div>
          <div className="text-xl font-extrabold text-accent">proStore</div>
          <p className="mt-2">Ofertas em smartphones com condições especiais no boleto e no cartão.</p>
        </div>
        <div>
          <div className="font-semibold">Atendimento</div>
          <ul className="mt-2 space-y-1">
            <li>Seg–Sex, 9h às 18h</li>
            <li>WhatsApp: (85) 99999-9999</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Institucional</div>
          <ul className="mt-2 space-y-1">
            <li>Política de Privacidade</li>
            <li>Trocas e Devoluções</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 text-xs text-zinc-500">
          © {new Date().getFullYear()} proStore — Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
