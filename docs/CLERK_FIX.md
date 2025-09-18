# Ajuste Clerk — SiteOficial-main

## O que foi alterado
1. **Rotas de autenticação com catch-all**
   - `src/app/entrar/[[...sign-in]]/page.tsx`
   - `src/app/cadastrar/[[...sign-up]]/page.tsx`
   > Evita tela branca ao voltar de OAuth (ex.: `/entrar/sso-callback/...`).

2. **middleware.ts**
   - Mantém proteção de `/minha-conta` e `/checkout`.
   - *matcher* ignora `api/webhooks` e `api/cron` para evitar conflitos.

3. **.env.example**
   - Adiciona variáveis que você deve configurar no Vercel.

## Onde colocar
- Substitua `middleware.ts` na **raiz do projeto**.
- Adicione as pastas/arquivos exatamente nos caminhos acima.
- Opcional: use `.env.example` como referência no Vercel.

## Variáveis no Vercel
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/entrar`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/cadastrar`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/minha-conta`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/minha-conta`

## Testes após deploy
- Botão **Entrar** do cabeçalho → renderiza widget do Clerk.
- **Criar conta** (cadastrar) → redireciona para `/minha-conta` após sucesso.
- Acessar `/minha-conta` deslogado → redireciona para `/entrar`.
