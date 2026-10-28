# Validação de desempenho e navegação — 21/10/2026

> Medição histórica. A versão ativada em 24/10/2026 tem nova medição e resultados
> em [PRODUCTION_ACTIVATION_2026-10-24.md](PRODUCTION_ACTIVATION_2026-10-24.md).

Produção: https://langlume.vercel.app

Implantação: `dpl_Am6rWAzDatqH69oxJZR7y3cvaQLe`, confirmada Ready e vinculada ao domínio final.

## Medição antes e depois

Chromium, viewport 390×844, cache do navegador vazio, service worker bloqueado para comparar apenas o carregamento da página, rede limitada a 1,6 Mbps, latência de 80 ms e CPU 4× mais lenta. Uma amostra por rota em cada versão; não representa percentis de usuários reais. O tempo do primeiro documento também depende do início da função na Vercel e do cache da infraestrutura.

| Rota | Bytes antes | Bytes depois | Redução | LCP antes | LCP depois |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 1.657.190 | 544.163 | 67,2% | 7,24 s | 2,60 s |
| `/login` | 842.835 | 324.625 | 61,5% | 4,82 s | 1,60 s |
| `/lesson/lesson-en-1` | 1.234.213 | 433.943 | 64,8% | 6,85 s | 3,86 s |

As imagens explicam a maior parte da redução. O JavaScript inicial ainda representa cerca de 298 KB transferidos na página inicial. O tempo de bloqueio medido nessa amostra variou de 547 para 596 ms; não há evidência para afirmar melhora de CPU ou de INP. O TTFB inicial foi de 2,59 s antes e 0,10 s depois, portanto parte da diferença de LCP pode vir do estado da função/CDN. A redução em bytes é uma comparação mais direta desta revisão.

Evidências ignoradas pelo Git: `scratchpad/performance/before.json` e `after.json`.

## Melhorias publicadas

- Logo: 524.841 → 5.982 bytes. Mascote: 827.731 → 26.836 bytes. Dimensões declaradas para reservar espaço antes das imagens.
- Removido preload de `/logo.png`, que baixava mais 594 KB sem ser a imagem utilizada pelo cabeçalho.
- SDK de monitoramento sob demanda e seleção específica de estado na estrutura da aplicação, evitando atualizações por mudanças irrelevantes do chat.
- Perfil com uma consulta compartilhada entre estrutura, cabeçalho e página inicial, cache por usuário de 30 s e cancelamento em 6 s. Conteúdo aparece sem esperar pela resposta.
- Pré-carregamento de rotas por intenção de navegação.
- Destino do login preservado, inclusive `premium_annual`; rejeição de redirecionamentos externos e ciclos para páginas de autenticação.
- Estrutura acompanha a localização resolvida do roteador, evitando montar a página anterior fora da proteção de acesso enquanto a próxima carrega.
- Eventos de autenticação recentes prevalecem sobre a consulta inicial da sessão.
- Conversação com uma chamada de saudação, vocabulário curado disponível imediatamente, limites de espera, proteção contra envios duplicados e limpeza do áudio/microfone ao sair. Erro do provedor não gera fala simulada nem XP.
- Modelo de IA configurável por `GEMINI_MODEL`; padrão documentado na [lista oficial do Gemini](https://ai.google.dev/gemini-api/docs/models). Acesso e cota da conta ainda precisam ser validados.
- Service worker agora gerado explicitamente após o build do TanStack; o hook de fechamento do plugin não produzia `/sw.js` nesse build. Registro após o carregamento e cache de JavaScript apenas conforme o uso, com limites de tamanho/idade. Atualização não força recarga de lição aberta.

## Testes aprovados

- Typecheck, sete testes unitários (incluindo estrutura e término das 2.130 lições), build e auditoria npm com zero vulnerabilidades. ESLint dos arquivos centrais: zero erros, oito avisos de hooks/fast refresh.
- Local: player em 360/390/768/1440 px; retomada, resposta incorreta, próxima lição, link inválido, carteira e missões. Páginas do aplicativo em 320/390/768/1440 px. Durante o desenvolvimento, recargas do Vite interromperam varreduras; a varredura final, com código estável, passou nas quatro larguras.
- Produção: nove páginas públicas em 390 e 1440 px; login real, sessão após recarga, 13 páginas autenticadas, conclusão e avanço de lição. Nenhum erro JavaScript ou resposta de erro do Supabase nos testes autenticados.
- Produção: retorno do login para lições e checkout anual; rejeição de destino externo; início utilizável com consulta de perfil atrasada artificialmente em 10 s, uma consulta de perfil compartilhada; uma chamada inicial de conversação com espera limitada.
- Produção: progresso concluído 100%, `xp_earned=41` e perfil com 41 XP. Nova conclusão manteve 41 XP.
- Produção: `/sw.js` ativo, três entradas de ícones do manifesto acessíveis, seis requisições JavaScript na primeira visita. Cache inicial contém somente CSS, logo, mascote, favicon e ícones; nenhum HTML de sessão ou resposta de função foi armazenado.

## Pendências

Ainda há espaço para reduzir JavaScript e tarefas longas na carga inicial e antecipar a renderização dos dados da lição. É necessário medir percentis de usuários reais antes de afirmar que o site é rápido em todos os dispositivos e redes.

A integração real de IA segue indisponível; áudio Google, envio de e-mail, cobranças e microfone em aparelhos físicos não foram aprovados. Persistência global da carteira/inventário, reconciliação de progresso entre contas/dispositivos e divergência entre as fontes de assinatura continuam descritas em [PRODUCTION_AUDIT.md](PRODUCTION_AUDIT.md).

Comandos: `npm run typecheck`, `npm test`, `npm run build`, `npm audit --audit-level=high`, `node tests/live.e2e.mjs`, `LIVE_LESSON=1 node tests/live-auth.e2e.mjs`, `PRODUCTION_BASE_URL=https://langlume.vercel.app node tests/navigation.e2e.mjs`, `node tests/pwa.e2e.mjs`, `PERF_STAGE=after node tests/performance.e2e.mjs`. Prefixos de variáveis usam sintaxe POSIX; no PowerShell, utilizar `$env:NOME='valor'` antes do comando.
