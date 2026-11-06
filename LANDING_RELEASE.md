# Langlume — nova landing e validação

Em produção em [langlume.vercel.app](https://langlume.vercel.app), deployment `dpl_44KpQJKdC3MwHtGYQBjt3fpaexdc`.

- Landing com demonstração jogável, áudio por clique, três idiomas, resposta verificável, CTA para cadastro, acesso aos planos, FAQ e links de suporte. A identidade usa o mascote do Langlume, botões com relevo, verde floresta, creme e detalhes de passaporte. O painel inicial do app põe progresso e próxima ação lado a lado em desktop e preserva a leitura em coluna no celular.
- 20 gravações humanas sob demanda: 12 novas, com vocabulário de viagem e cumprimentos. Arquivos e licenças estão em [créditos públicos](https://langlume.vercel.app/audio/credits.html). O restante usa as vozes disponíveis no aparelho.
- Vercel Analytics instrumentado com cliques para cadastro e planos, respostas da demo, início e conclusão de lição e LCP em navegação direta. Os novos parâmetros se limitam a posição, idioma da demo, resultado, faixa de tela e duração. O teste confirmou o evento na fila do navegador; o script do provedor exclui tráfego headless. A ingestão e o histórico dependem do plano com [eventos personalizados](https://vercel.com/docs/analytics/custom-events) e de tráfego real. Não houve alteração de plano.
- O workflow de CI agora inclui o navegador, testes do app com conta simulada, verificação da landing compilada e regressão offline. Os comandos foram validados localmente; a execução hospedada do workflow depende de publicar o código no GitHub.

## Testes executados

- TypeScript, build e 30 testes de domínio passaram.
- 10 fluxos com fixtures, incluindo lição completa em 360, 390, 768 e 1440 px, retomada, resposta incorreta, destino da próxima lição e 13 rotas autenticadas em quatro larguras.
- Landing: Chromium e WebKit, quatro larguras e temas claro/escuro, 16 combinações. Contraste de texto principal, limites dos controles, erro/acerto, troca de idioma, FAQ, navegação para planos e cadastro e persistência do tema. A suíte também passou no domínio público com Chromium.
- App: 56 combinações de rota/tela de 320 a 1440 px. Teste de toque no WebKit em retrato e paisagem verificou menus fixos, rolagem e botão de retomar. Em produção, uma conta de teste completou e salvou uma lição, abriu a seguinte e acessou 13 páginas autenticadas sem erros de JavaScript ou da API Supabase.
- Áudio: todos os arquivos e créditos respondem, MP3 tocado a partir da lição, fallback único e cancelamento ao avançar. Lição visitada abriu e iniciou offline no domínio público. Lembrete foi exibido pelo worker do Chromium com evento injetado sem janela do app; nenhuma mensagem foi enviada a assinantes.
- LCP de laboratório: landing **1,43 s**, login **1,37 s**, primeira lição **1,74 s**, em Chromium a 390 px, cache frio, 1,6 Mbps, latência de 80 ms e CPU 4× mais lenta. Não são métricas coletadas de usuários.

Logs e capturas: `scratchpad/landing-release/`. Ainda falta homologar microfone, teclado e entrega de lembretes com a tela bloqueada em Android e iPhone físicos; nenhum aparelho estava acessível. O teste de planos e checkout foi de navegação, sem cobrança.
