// src/app/minha-conta/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export const metadata = {
  title: "Minha conta",
};

export default async function MinhaContaPage() {
  const user = await currentUser();

  // Middleware já protege esta rota, mas garantimos robustez:
  if (!user) {
    return (
      <main className="container-safe py-10 min-h-[70vh]">
        <div className="mx-auto max-w-xl rounded-2xl border border-black/10 bg-white p-6 text-black">
          <h1 className="text-lg font-semibold">Sessão não encontrada</h1>
          <p className="mt-1 text-sm text-black/70">
            Sua sessão expirou. Acesse novamente sua conta.
          </p>
          <div className="mt-4">
            <Link href="/entrar" className="btn btn-primary rounded-2xl">
              Entrar
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const fullName = user.fullName || [user.firstName, user.lastName].filter(Boolean).join(" ") || "Usuário";
  const email = user.emailAddresses?.[0]?.emailAddress ?? "";

  return (
    <main className="container-safe py-10">
      <div className="mx-auto max-w-4xl">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Minha conta</h1>
          <p className="text-white/70 text-sm">Gerencie seus dados e acompanhe seus pedidos.</p>
        </div>

        {/* Cartão branco com dados do usuário */}
        <section className="rounded-2xl border border-black/10 bg-white p-6 text-black shadow-sm">
          <div className="flex items-start gap-4">
            <img
              src={user.imageUrl ?? ""}
              alt="Foto do usuário"
              className="h-16 w-16 rounded-2xl border border-black/10 object-cover"
            />
            <div className="grid gap-1">
              <h2 className="text-xl font-semibold">{fullName}</h2>
              {email && <p className="text-sm text-black/70">{email}</p>}
              <p className="text-xs text-black/50">ID: {user.id}</p>
            </div>
            <div className="ml-auto">
              {/* Preferimos que o usuário use o UserButton no Header para sair/editar.
                  Mantemos aqui links úteis (sem alterar a paleta). */}
              <Link
                href="/"
                className="inline-flex items-center rounded-2xl border border-black/10 px-3 py-2 text-sm hover:bg-black/5"
              >
                Voltar à loja
              </Link>
            </div>
          </div>

          {/* Ações */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/pedidos"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm hover:bg-black/5"
            >
              Meus pedidos
            </Link>
            <Link
              href="/enderecos"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm hover:bg-black/5"
            >
              Endereços
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
