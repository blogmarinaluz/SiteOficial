# Localização PT-BR da Clerk (sem instalar pacotes)

Para deixar a tela de login/cadastro **em Português (Brasil)** sem adicionar dependências:

1. Abra o painel da **Clerk** (instância usada em Produção).
2. Vá em **Customize → Localization**.
3. Em **Default language**, selecione **Português (Brasil)**.
4. Clique **Save**.

> Isso aplica a tradução à UI da Clerk mesmo sem usar `@clerk/localizations` no código.

### Textos adicionais
Se quiser editar títulos/labels, vá em **Customize → Pages → Sign in / Sign up** e ajuste os campos de texto.

### Observação
Se no futuro quiser controlar a tradução via código, aí sim você acrescenta a dependência `@clerk/localizations` e passa `localization={ptBR}` no `ClerkProvider`. Aqui não é necessário.
