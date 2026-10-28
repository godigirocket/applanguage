# Langlume — revisão e ativação em 22/10/2026

> Histórico anterior à ativação. Em 24/10/2026, o acesso foi liberado, as migrações
> foram aplicadas e a versão foi promovida ao domínio principal. Estado atual e
> testes publicados em [PRODUCTION_ACTIVATION_2026-10-24.md](PRODUCTION_ACTIVATION_2026-10-24.md).

## Estado da publicação

O domínio https://langlume.vercel.app continua na implantação estável
`dpl_Am6rWAzDatqH69oxJZR7y3cvaQLe`, confirmada por inspeção na Vercel.
As mudanças abaixo foram implementadas e compiladas, mas exigem migrações
antes de substituir essa versão. Publicá-las sem as funções SQL interromperia
o salvamento remoto de conclusões, a verificação de cotas e o webhook de pagamentos.

Implantação adicional pronta na Vercel, sem promoção ao domínio Langlume:
https://applanguage-5kgx3yfei-digirocket.vercel.app
(`dpl_GgGEXrfJfMcC6kkDcx9LMGuECJFG`). A Vercel confirmou o estado Ready.
O acesso pode exigir autenticação Vercel. Os testes HTTP autorizados da lição e
de recuperação de senha retornaram 200; o webhook retornou 405 para GET e 401
para POST com segredo inválido. A inspeção posterior confirmou que o domínio
Langlume segue na implantação estável.

## Implementado nesta revisão

- Armazenamento por conta: carteira, XP, inventário, lições, nível e palavras
  deixam de compartilhar o mesmo estado no navegador. Migração de dados antigos
  limitada à sessão já existente; troca de usuário limpa a memória antes de hidratar.
- Persistência síncrona do estado local, com leitura compatível com snapshots
  antigos criptografados. Alterações sobrevivem ao recarregamento imediato.
- RPC transacional e idempotente de conclusão, catálogo de 2.130 lições no banco,
  XP definido pelo servidor e fila offline por usuário/lição. A fila usa o token
  da conta de origem e não considera um sinalizador local como confirmação remota.
- Reconciliação no login/reconexão e calendário com eventos reais de atividade.
- Assinatura baseada em um contrato canônico em `profiles`, webhook transacional,
  validação de produto/oferta/preço, deduplicação de aprovação/renovação e tratamento
  de reembolso, cancelamento e compras anteriores ao cadastro.
- Ofertas verificadas pela API Cakto: mensal `t3z3hhs` (R$ 9,90), trimestral
  `g3hm6pm` (R$ 25,90), anual `wf6iugo` (R$ 65,90), vitalícia `33vgk53`
  (R$ 110,00). Cada opção abre sua própria oferta. Nenhuma cobrança foi executada.
- Autenticação e cotas diárias duráveis por usuário para chat e TTS; limites de
  tempo e erros recuperáveis, sem respostas falsas de sucesso.
- Habilidades e coleções derivadas do conteúdo real; dicionário por coleção com
  paginação; ranking sem participantes inventados.
- Dados de lição preparados no carregamento da rota, modais carregados sob demanda
  e consultas de perfil compartilhadas. Bundle principal local: 744,13 kB sem
  compressão / 226,58 kB gzip; isso não equivale ao total transferido por página.
- Cache PWA para reabrir lições públicas já visitadas sem internet. O cache não
  inclui páginas privadas, checkout ou respostas de autenticação.

## Validação desta revisão

- TypeScript, build de produção e 16 testes automatizados de lógica/integração SQL
  e carregamento do webhook compilado.
- PostgreSQL local via PGlite: repetição concorrente sem XP duplicado, rollback,
  isolamento entre usuários, cotas, eventos Cakto, claim por e-mail verificado,
  reembolso, cancelamento e bloqueio de alterações de assinatura pelo cliente.
- Navegador: contas A → B → A → visitante → B preservam e isolam os dados;
  conclusão pendente sobrevive ao reload, não é enviada pela outra conta e pode
  ser reenviada mesmo com conclusão local.
- Login real da conta exclusiva de QA: retorno a lições e checkout, rejeição de
  redirect externo, página inicial utilizável com perfil atrasado e uma consulta
  compartilhada; conversação inicia uma vez e termina em resposta ou erro recuperável.
- PWA compilada: lição visitada recarrega e inicia offline, sem erro JavaScript.
- Carteira, missões, desbloqueios e persistência após reload; conclusão de lições
  em 360/390/768/1440 px; retomada, resposta incorreta, próxima lição e link inválido;
  páginas do aplicativo em 320/390/768/1440 px. Páginas públicas e fluxo de concluir,
  revisar, retomar e avançar também passaram no build de produção local.
- `npm audit --audit-level=high --fetch-timeout=15000 --fetch-retries=0`:
  zero vulnerabilidades em 22/10/2026.

As evidências privadas ficam em `scratchpad/production-audit/activation-*.log`,
ignoradas pelo Git e pelo deploy. Os testes SQL usam banco local, não comprovam
que as migrações já foram aplicadas no Supabase real. Os testes de navegação real
não executam uma compra e não confirmam disponibilidade dos provedores de IA.

O teste HTTP da primeira implantação isolada revelou `ERR_MODULE_NOT_FOUND` no
webhook: os imports relativos `.ts` não eram convertidos para os arquivos `.js`
emitidos. Foi habilitado `rewriteRelativeImportExtensions` e adicionado um teste
que compila a função e carrega seu resultado no Node. A opção segue a
[documentação oficial do TypeScript](https://www.typescriptlang.org/tsconfig/rewriteRelativeImportExtensions.html).
A nova implantação passou nos testes HTTP desse endpoint.

## Ativação ainda necessária

1. Disponibilizar acesso proprietário ao Supabase **gbmukycjxjsfbiwwdlda**.
   A CLI autenticada nesta máquina só lista `trackfy` (`kmpitmrenyoowpglbuva`).
   A verificação no navegador também terminou na tela de login do Supabase;
   o painel do projeto correto foi deixado aberto para o proprietário entrar.
   `supabase/config.toml` contém uma referência antiga e não deve ser usada como
   destino sem conferir a URL de produção. A Cakto gerencia os pagamentos; o
   progresso e as contas continuam no Supabase.
2. No projeto correto, revisar/aplicar, nesta ordem, somente estas migrações:
   - `supabase/migrations/20261021010000_atomic_learning.sql`
   - `supabase/migrations/20261021020000_cakto_entitlements.sql`
   Cada arquivo é transacional. Não executar indiscriminadamente todos os SQLs
   legados da pasta. Repetir os testes autenticados com a conta exclusiva de QA,
   incluindo conclusão simultânea em duas sessões e confirmação de XP no servidor.
3. Corrigir permissões/configuração Google em ambiente seguro. Logs da produção
   mostram Gemini HTTP 403. A chave local de TTS retorna HTTP 403 com
   `API_KEY_SERVICE_BLOCKED`. Conferir APIs habilitadas, restrições, faturamento,
   acesso ao modelo e as variáveis `GEMINI_API_KEY`/`GOOGLE_CLOUD_API_KEY` na Vercel.
   Não colocar chaves no relatório, no Git ou no chat.
4. Confirmar o webhook Cakto no painel e testar uma compra controlada/sandbox,
   renovação e reembolso com a configuração efetiva. Os testes transacionais
   locais e a leitura do catálogo não substituem a entrega real do provedor.
5. Promover a versão compatível ao domínio principal após as migrações e repetir
   os testes publicados. Validar recebimento e uso de recuperação de senha em
   caixa controlada; microfone, síntese e instalação PWA em iOS/Android físicos.

Não há confirmação de funcionamento integral desses serviços externos ou de
aparelhos físicos. As medições da versão estável estão em
[PERFORMANCE_VALIDATION.md](PERFORMANCE_VALIDATION.md); o histórico anterior está
em [PRODUCTION_AUDIT.md](PRODUCTION_AUDIT.md).
