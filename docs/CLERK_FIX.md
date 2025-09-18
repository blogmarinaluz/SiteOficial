# Clerk — Setup e correção (Next.js App Router)

> Objetivo: acabar com a **tela branca** ao clicar no ícone de usuário ou no botão **Entrar / Cadastrar** e deixar o login/cadastro 100% funcional no Vercel.

## 1) Variáveis no Vercel
No **Vercel → Project → Settings → Environment Variables**, crie/atualize **em Production e Preview**:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → *pk_* da sua instância Clerk  
- `CLERK_SECRET_KEY` → *sk_* da sua instância Clerk  
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/entrar`  
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = `/cadastrar`  
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` = `/minha-conta`  
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` = `/minha-conta`

> Dica: se você conectou o **Clerk pela Vercel Marketplace**, as duas chaves (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` e `CLERK_SECRET_KEY`) já são sincronizadas automaticamente. Garanta mesmo assim que existem em **Production**. Depois, faça um **redeploy**. 

## 2) Domínios no Clerk
No **Clerk Dashboard → Instance → Domains**:
- Adicione o seu domínio de produção do Vercel (ex.: `seusite.vercel.app` e/ou o domínio custom).
- Em **Paths**, como você usa rotas personalizadas, mantenha as páginas:
  - **Sign in**: `/entrar/[[...sign-in]]`
  - **Sign up**: `/cadastrar/[[...sign-up]]`

## 3) Código (já pronto neste patch)
- `src/app/layout.tsx` agora injeta os **URLs do Clerk a partir das variáveis de ambiente**, garantindo que o widget renderize corretamente.
- `.env.example` atualizado para você usar como referência no Vercel.

## 4) Checklist rápido de verificação
- [ ] Accessar `/entrar` mostra o widget de **SignIn** do Clerk.  
- [ ] Criar conta e entrar redireciona para **/minha-conta**.  
- [ ] Ao fazer logout, a rota **/minha-conta** redireciona para **/entrar** (via `middleware.ts`).  
- [ ] O ícone de usuário no cabeçalho abre o **UserButton** quando logado.  
- [ ] O menu **Entrar / Cadastrar** abre a tela sem tela branca.

## 5) Referências
- Next.js Quickstart (App Router) — Clerk Docs  
- Deploying a Clerk app to Vercel — Clerk Docs  
- Vercel Marketplace: Clerk — integra e sincroniza as variáveis automaticamente  

