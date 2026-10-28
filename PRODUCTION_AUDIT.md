# Langlume — auditoria de produção e pendências

> Atualização em produção de 24/10/2026: [ativação e testes finais](PRODUCTION_ACTIVATION_2026-10-24.md).

> Histórico da versão estável de 21/10/2026. A implementação das pendências,
> os novos testes e os requisitos de ativação de 22/10/2026 estão em
> [ACTIVATION_STATUS.md](ACTIVATION_STATUS.md). A tabela abaixo descreve os problemas
> dessa versão publicada, não o estado atual do código em revisão.

## Publicação

Deploy de produção concluído em 21/10/2026 na equipe `digirocket`, projeto `applanguage`. A Vercel confirmou o estado **Ready** e o alias de produção foi inspecionado após a publicação.

- Produção: https://langlume.vercel.app
- Implantação atual: https://applanguage-baxnb3uf3-digirocket.vercel.app
- ID: `dpl_Am6rWAzDatqH69oxJZR7y3cvaQLe`
- Inspeção: https://vercel.com/digirocket/applanguage/Am6rWAzDatqH69oxJZR7y3cvaQLe
- Esta versão substitui a implantação `dpl_2nehR6ySQWeR5WF1w2JCVug4853Q` com melhorias de desempenho, navegação e tratamento de indisponibilidade.
- O vínculo original do projeto foi preservado. O bloqueio anterior de autenticação foi resolvido com a conta proprietária.

## Testes reais já executados

Os testes abaixo usaram o site publicado e o Supabase real, sem simular respostas de autenticação ou banco:

- Cadastro de uma conta exclusiva de QA, com nome `Test QA E2E`, e login real.
- Alteração do perfil dessa própria conta.
- Acesso autenticado às tabelas de perfis, lições, assinaturas, expressões e conversas.
- RPCs de ranking e estatísticas da comunidade.
- Gravação e leitura de um checkpoint de lição.
- Conclusão real da primeira lição pelo navegador autenticado, confirmação de salvamento e avanço para a segunda. Consulta posterior ao Supabase confirmou `status=completed`, progresso 100%, `xp_earned=41` e perfil com 41 XP.
- Repetição da lição em uma nova sessão de navegador: conclusão aprovada e consulta posterior manteve 41 XP, sem crédito duplicado nesse cenário.
- Player publicado: retomada após recarregar, conclusão e avanço para a próxima lição também no fluxo público.
- Login pelo navegador, sessão após recarregar e navegação em 13 páginas: início, lições, jogos, perfil, progresso, dicionário, comunidade, cultura, habilidades, coleções, loja, configurações e checkout anual.
- Nenhum erro de execução JavaScript nem resposta de erro do Supabase foi observado nessa navegação autenticada.
- Endpoint Cakto rejeitou um POST com segredo inválido com HTTP 401; GET retornou 405.
- Nove páginas públicas verificadas em viewports de 390 e 1440 pixels, sem erros JavaScript ou transbordamento horizontal indevido.
- Início, login, recuperação de senha e lição responderam HTTP 200; `/reset-password` deixou de retornar 404.
- Conversação publicada enviou o idioma alvo `en`, mantendo a interface em português. O fallback de falso sucesso foi removido na revisão atual: indisponibilidade tem mensagem explícita, tempo limitado e opção de retentativa. A integração real de IA ainda precisa ser liberada/validada.

Validação local adicional: typecheck, build e sete testes unitários aprovados; o conteúdo das 2.130 lições foi verificado quanto a estrutura, término e composição das respostas. Auditoria npm: zero vulnerabilidades. A suíte local verificou layouts em 320, 390, 768 e 1440 pixels.

A conta de QA e suas credenciais ficam apenas em `scratchpad/production-audit/qa-account.private.json`, ignorado pelo Git e pelo deploy. Os testes não alteram contas de alunos e não executam cobranças. Evidências em `scratchpad/production-audit/`.

## Problemas confirmados e trabalho necessário

| Prioridade | Problema | Evidência e próxima implementação |
| --- | --- | --- |
| P1 | Entrega de recuperação de senha ainda não validada | `/reset-password` está publicada e responde 200. Validar o recebimento e uso de um link real em uma caixa de e-mail controlada. |
| P1 | Progresso, moedas e inventário não isolados por conta no navegador | `src/hooks/useStore.ts` persiste tudo em `lume-storage`; o logout não limpa nem seleciona outro armazenamento. Implementar armazenamento por usuário, migração e teste de troca entre duas contas no mesmo navegador. |
| P1 | Sincronização e XP entre dispositivos não são transacionais | `src/lib/lesson-progress.ts` consulta a conclusão, salva a lição e atualiza XP em operações separadas. Implementar RPC autenticada e idempotente no banco, reconciliação no login e fila de retentativas offline. Validar conclusão simultânea em duas sessões. |
| P1 | Fontes divergentes de assinatura | O webhook Cakto atualiza `profiles.plan/premium_until`; `getUserSubscription` lê `subscriptions`. Unificar o contrato de assinatura e testar compra, renovação, expiração, reembolso e cancelamento em sandbox. |
| P1 | Checkout não distingue os planos por oferta | `src/routes/checkout.tsx` mapeia todos os planos para a mesma URL fixa. Configurar ofertas mensais/anuais/vitalícias por identificador e conferir o produto e preço antes da liberação premium. |
| P1 | Integração real da IA ainda indisponível | Removidos os textos de falso sucesso. A revisão atual usa `GEMINI_MODEL` configurável, tempo máximo de 12 s no provedor e 15 s no cliente, erro recuperável e nenhum XP por resposta indisponível. O teste publicado confirmou uma única chamada inicial e tratamento da falha; ainda é necessário validar credenciais, acesso ao modelo e cota no provedor. O HTTP 403 da chave local não identifica a causa da falha em produção. |
| P1 | Áudio Google requer diagnóstico | O teste publicado não confirmou conteúdo de áudio na resposta do TTS. Verificar a integração, permissões e formato da resposta; a síntese do navegador é um fallback e exige teste em aparelhos físicos. |
| P1 | Endpoints de IA precisam de autenticação e cotas duráveis | As funções de chat/TTS usam limite em memória por IP e não exigem sessão na função. Validar usuário e plano no servidor; limitar por usuário e orçamento em armazenamento compartilhado. |
| P2 | Mapa de habilidades contém progresso fixo | `src/routes/skills.tsx`: níveis, bloqueios e conclusões vêm de `SKILLS`. Derivar esses estados das lições e avaliações reais. |
| P2 | Coleções de vocabulário são demonstrativas | `src/routes/vocabulary-lists.tsx`: contagens e percentuais de `LISTS` são fixos, e todas as coleções liberadas abrem o mesmo dicionário. Implementar conjuntos reais, filtro por coleção e progresso por palavra. |
| P2 | Ranking mistura dados reais com participantes fictícios | `src/components/lume/Leaderboard.tsx` adiciona `SEED_PLAYERS` ao ranking. Remover da produção ou disponibilizar um modo de demonstração claramente identificado. |
| P2 | Histórico de atividade incompleto | O perfil contém um bloco de atividade ainda marcado como placeholder. Persistir eventos diários e gerar o calendário com dados reais. |
| P2 | E-mail, áudio e instalação móvel exigem validação específica | Testar recebimento de recuperação de senha, microfone/síntese em iOS e Android físicos, instalação PWA e comportamento sem conexão. Testes de viewport não substituem esses testes. |

## Correções adicionais publicadas nesta auditoria

- Conversação passou a usar o idioma alvo. Teste com login real confirmou chamadas em inglês mantendo a interface em português, inclusive após o deploy.
- Login, cadastro e recuperação aguardam a montagem do cliente antes de permitir edição/envio. Isso evita submissão nativa acidental do formulário SSR durante o carregamento do JavaScript.
- Vite atualizado para 7.3.7 após uma nova auditoria apontar falhas na versão 7.3.6. `npm audit` voltou a reportar zero vulnerabilidades.

## Revisão de desempenho e navegação

Publicada e validada em 21/10/2026. Detalhes e limites das medições em [PERFORMANCE_VALIDATION.md](PERFORMANCE_VALIDATION.md).

- Página inicial: 1.657.190 para 544.163 bytes transferidos no teste móvel, redução de 67,2%.
- Logo e mascote em WebP; removido preload de imagem não utilizada.
- Perfil compartilhado entre estrutura, cabeçalho e início; tela inicial não espera a consulta para exibir conteúdo.
- Login preserva destino e plano do checkout; destinos externos e ciclos de autenticação são rejeitados.
- Corrigida a renderização transitória da página anterior fora da proteção durante navegação.
- Leitura inicial de sessão não sobrescreve eventos de autenticação mais recentes.
- Conversação inicia uma chamada em vez de chamadas duplicadas e libera áudio/microfone ao sair.
- Worker PWA gerado explicitamente no pós-build, registrado após o carregamento, ícones válidos e cache de recursos sob demanda. Não armazena HTML de sessão nem respostas de funções de servidor.
- Regressão local das páginas em 320/390/768/1440 px aprovada. Suítes públicas, autenticadas, navegação e PWA aprovadas no domínio de produção. Conclusão repetida manteve 41 XP no banco.

## Como repetir os testes publicados

```sh
node scripts/production-audit.mjs
node scripts/test-live-auth.mjs
node tests/live-auth.e2e.mjs
node tests/live.e2e.mjs
node tests/live-services.e2e.mjs
```

`scripts/test-live-auth.mjs` reutiliza a conta de QA privada quando ela já existe. `LIVE_STAGE=baseline` executa apenas a varredura pública do site anterior ao deploy; o modo normal também exige o novo player publicado. `PRODUCTION_BASE_URL` permite validar a URL de uma implantação antes de promover o domínio principal.

Para incluir a conclusão autenticada no teste de navegador, definir `LIVE_LESSON=1`. Para consultar o progresso salvo sem alterá-lo, executar `scripts/test-live-auth.mjs` com `LIVE_VERIFY_ONLY=1`.

## Limites da validação

Publicação e fluxos descritos acima foram confirmados na URL final. Isso não equivale a validar todas as integrações: cobranças reais, entrega de e-mail, microfone em aparelhos físicos, instalação PWA e uso offline não foram aprovados por esta auditoria. As pendências da tabela continuam abertas; o produto não deve ser descrito como 100% funcional.
