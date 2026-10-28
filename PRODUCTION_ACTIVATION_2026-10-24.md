# Langlume — ativação em produção, 24/10/2026

> Revisão posterior: a dependência de Gemini/Google TTS foi substituída por
> prática guiada local e áudio do navegador. Veja [KEYLESS_PRACTICE.md](KEYLESS_PRACTICE.md).
> O diagnóstico Google abaixo é histórico e deixou de ser um requisito do produto.

## Publicação concluída

- Domínio: https://langlume.vercel.app
- Implantação promovida: `dpl_GgGEXrfJfMcC6kkDcx9LMGuECJFG`
- URL da implantação: https://applanguage-5kgx3yfei-digirocket.vercel.app
- A Vercel confirmou a promoção; a inspeção do domínio principal passou a retornar
  essa implantação. Ela substitui `dpl_Am6rWAzDatqH69oxJZR7y3cvaQLe`.

O login proprietário do Supabase foi concluído, e o projeto **Lume**,
`gbmukycjxjsfbiwwdlda`, foi confirmado. O acesso deixou de ser um bloqueio.
`supabase/config.toml` foi corrigido para esse identificador.

## Banco ativado

Aplicadas por SQL direcionado, sem executar os arquivos legados indiscriminadamente:

1. `20261021010000_atomic_learning.sql`: catálogo de 2.130 lições, conclusão
   transacional/idempotente, XP definido no servidor, atividade diária e cotas de IA.
2. `20261021020000_cakto_entitlements.sql`: contrato canônico de assinatura,
   oito ofertas atuais/legadas verificadas e processamento transacional dos eventos.
3. `20261024010000_protect_billing_identifiers.sql`: proteção adicional contra
   alterações de identificadores de pedido/assinatura pelo cliente. Esses campos
   também precisam ser confiáveis para reconhecer reembolsos e cancelamentos.

As duas primeiras foram aplicadas pela CLI. Depois, a conexão direta da CLI
passou a falhar por IPv6; a terceira e os testes de pagamento com rollback foram
executados no editor SQL autenticado do projeto correto. O aplicativo continuou
acessando o banco normalmente via API HTTPS.

Não foi criado um baseline de todas as migrações legadas: o banco não possuía
`supabase_migrations.schema_migrations`. O histórico deste documento e os arquivos
SQL devem ser considerados antes de introduzir um `db push` automatizado.

## Testes reais aprovados

- Duas sessões reais da conta exclusiva de QA enviaram oito conclusões simultâneas
  da segunda lição: somente uma concedeu 42 XP; o progresso ficou em 100% e a
  atividade foi persistida. Repetição posterior não acrescentou XP.
- Chamadas anônimas de conclusão, alteração direta de plano e identificadores de
  pagamento, execução do processador pelo cliente e claim com e-mail diferente
  foram rejeitadas. Claim da própria conta e consumo da cota durável funcionaram.
- Aprovação, entrega duplicada e reembolso foram verificados no banco real dentro
  de uma transação com **ROLLBACK**. Nenhum pagamento foi cobrado; as alterações
  de assinatura e os eventos de teste dessa transação foram desfeitos. O teste
  foi repetido após a proteção adicional.
- Navegador no domínio publicado: login, conclusão de lição com **Progresso salvo**,
  avanço à próxima lição pendente, sessão após recarregar e 13 páginas autenticadas.
  Resultado: zero erros JavaScript e zero respostas de erro do Supabase observadas.
- Páginas públicas em 390 e 1440 px; conclusão, revisão, retomada e avanço de lição.
- Retorno do login a lições e checkout anual; rejeição de redirect externo; página
  inicial utilizável com perfil atrasado e uma consulta compartilhada; uma única
  inicialização da conversação com espera limitada.
- 16 testes de lógica, SQL e carregamento do webhook compilado aprovados após a
  proteção adicional. Os testes locais anteriores de conta, fila offline, PWA
  e responsividade estão descritos em [ACTIVATION_STATUS.md](ACTIVATION_STATUS.md).

O teste de avanço autenticado foi ajustado para aceitar a próxima lição pendente:
a conta de QA já tinha concluído a segunda no teste concorrente. O aplicativo
avançou corretamente para a terceira; não estava preso em loop.

Evidências privadas ignoradas pelo Git/deploy:
`scratchpad/production-audit/activated-*-oct24.log`,
`activation-real-database-final.log`, `auth-browser/results.json` e
`billing-rollback-final.png`. Credenciais e chaves não constam deste documento.

## Desempenho publicado

Uma amostra por rota em Chromium 390×844, rede 1,6 Mbps/80 ms, CPU 4× mais lenta,
cache do navegador vazio e service worker bloqueado. Os números não representam
percentis de usuários reais; CDN, função e rede influenciam os tempos.

| Rota | Transferência observada | LCP | CLS |
| --- | ---: | ---: | ---: |
| `/` | 545.794 bytes | 2,21 s | 0 |
| `/login` | 284.595 bytes | 1,22 s | 0,039 |
| `/lesson/lesson-en-1` | 420.421 bytes | 3,20 s | 0,0003 |

Evidência: `scratchpad/performance/activated-oct24.json`. O carregamento frio da
lição ainda pode melhorar; não há base para prometer velocidade perfeita em
qualquer aparelho/rede. Comparações históricas em
[PERFORMANCE_VALIDATION.md](PERFORMANCE_VALIDATION.md).

## Pendências externas

- **Gemini:** o teste após a promoção ainda produziu HTTP 403 nos logs da Vercel.
  Conferir a chave, as permissões/restrições, o faturamento e o acesso ao modelo
  no projeto Google. O erro é apresentado com possibilidade de retentativa.
- **Google TTS:** o diagnóstico anterior da chave local retornou
  `API_KEY_SERVICE_BLOCKED`; a liberação e a resposta real de áudio ainda precisam
  ser confirmadas. Não foi alterada uma chave sem acesso autorizado ao projeto Google.
- **Cakto:** as ofertas e o processador SQL foram verificados. A entrega de uma
  compra/renovação/reembolso real ou de sandbox pelo provedor ainda não foi validada.
  Os testes SQL não representam uma compra efetuada nem confirmam a configuração
  do webhook no painel Cakto.
- Recebimento/uso do e-mail de recuperação e microfone/síntese/instalação PWA em
  aparelhos físicos iOS/Android continuam pendentes de validação específica.

O deploy e a ativação do banco estão concluídos. Essas pendências impedem afirmar
que todas as integrações externas estão funcionando integralmente.
