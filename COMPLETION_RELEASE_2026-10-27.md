# Langlume — conclusão e validação, 27/10/2026

Publicado em https://langlume.vercel.app. Deployment Vercel confirmado como Ready: `dpl_88D1S47Nn1tctzUrFdqVpbKtTUQq` (`applanguage-ly8h7vhlx-digirocket.vercel.app`).

## Entregas

- Histórico de quizzes, palavras salvas e agendamentos de revisão sincronizam por conta. Alterações offline são preservadas e mescladas ao reconectar. Uma palavra recém-carregada em outro navegador não apaga uma revisão existente.
- As telas imersivas aguardam a inicialização da conta antes de montar. Isso corrige flashcards salvos acidentalmente no espaço do visitante durante a abertura da sessão.
- A prática de fala compara a transcrição com a frase esperada, considerando ordem, omissões, repetições e palavras extras. A interface explica que esse resultado não avalia sotaque nem qualidade fonética.
- Oito gravações humanas licenciadas para vocabulário frequente, carregadas sob demanda, com [créditos públicos](https://langlume.vercel.app/audio/credits.html). Outras frases usam as vozes disponíveis no aparelho; a escolha manual continua disponível. Áudio anterior é interrompido ao trocar atividade, e falha de gravação usa a voz do aparelho uma única vez.
- Interface em espanhol ampliada: 346 textos de fallback, páginas de vocabulário/habilidades/dicionário, configurações, ajuda e fluxos públicos. Índices de prática não são apresentados como avaliação de fluência. Comunidade exibe publicações reais, sem exemplos apresentados como pessoas ativas.
- Lembretes push com adesão explícita nas configurações, cancelamento, mensagens de erro e orientação para instalação no iPhone. Worker recebe notificações com o app fechado; cron diário às 18h UTC consulta somente assinaturas habilitadas e inativas há pelo menos 24 horas. Entrega depende de suporte, conexão e permissão do dispositivo.
- CSS de conforto incorporado à folha principal: uma solicitação de CSS a menos e 39 declarações redundantes removidas. Áudios entram no cache somente quando usados. Dependências atualizadas; auditoria encontrou zero vulnerabilidades moderadas, altas ou críticas e cinco baixas.

## Banco e segurança

As migrações `20261027010000_learning_state.sql` e `20261027020000_push_reminders.sql` foram aplicadas ao projeto Supabase `gbmukycjxjsfbiwwdlda`. A correção de precedência de palavras revisadas também está aplicada.

`learning_state` mantém RLS por usuário e escrita por função autenticada. Assinaturas push e a fila são acessíveis somente pelo servidor. Endpoints de entrega aceitam somente provedores HTTPS conhecidos; o servidor verifica o usuário do token. O cron exige segredo próprio e reserva a fila atomicamente para evitar envios duplicados. Nenhuma credencial é incluída neste documento.

## Evidências de validação

- Build e TypeScript passaram. ESLint passou nos novos módulos de sincronização, fala e push e nos endpoints.
- 29 testes de domínio passaram, incluindo SQL/RLS, mesclagem de progresso, fala, autenticação de push e worker.
- Duas sessões reais: quiz concluído, palavra salva e revisão restaurados em outro navegador; alterações offline mescladas após reconexão.
- Espanhol: 11 páginas autenticadas e seis páginas públicas verificadas a 320 px, incluindo encaixe dos controles.
- Jogos no celular simulado: seis pares de memória, flashcards e quiz de seis perguntas concluídos. Conversa guiada verificada a 320, 390 e 1440 px, incluindo falhas recuperáveis e conclusão/reinício.
- Áudio: oito arquivos disponíveis, reprodução de MP3, fallback único e cancelamento sem áudio atrasado. Fala: repetição de resultados não duplica feedback.
- Lembretes: interface testada com permissão simulada, adesão, cancelamento, falha de cadastro e permissão negada. Na Vercel, configuração e chave pública válidas; autenticação, adesão, consulta, atividade e desativação verificadas contra o banco real usando apenas a conta QA. Cron autenticado retornou fila vazia: zero notificações enviadas.
- Layout local: 56 combinações de tela/rota, de 320 a 1440 px, incluindo horizontal. Navegação fixa verificada em WebKit, inclusive após transições, rolagem e abertura de menus.
- No domínio publicado: login real, conclusão/gravação de lição, próxima lição, 13 páginas autenticadas e persistência após recarregar passaram; nenhum erro JavaScript ou erro de API Supabase nesse fluxo.
- Varredura do domínio publicado: 130 combinações de rota/largura (320 e 390 px), sem texto fora dos controles, erros JavaScript ou falhas de API Supabase. Barras verificadas durante a rolagem. Eventos de toque simulados em início/lições/jogos confirmaram rolagem nas duas direções e menus fixos; o aviso inicial permanece acima da navegação.
- Configurações no domínio publicado: sincronização concluída e lembretes disponíveis, sem solicitação automática de permissão.

Logs e capturas ficam em `scratchpad/completion-27/`, `scratchpad/design-27/` e `scratchpad/control-sweep-completion-27-public/`. São evidências locais, não material público.

## Limites verificados

Chromium e WebKit foram executados com tamanhos móveis e eventos de toque simulados. Não houve acesso a um Android ou iPhone físico, nem teste de entrega push em um telefone bloqueado ou de gravação com microfone físico. Esses testes continuam sendo a etapa de homologação em aparelhos reais. Oito gravações não cobrem todo o currículo; a naturalidade das demais vozes depende do aparelho. Conversação guiada funciona sem API de modelo; não equivale a um tutor de IA livre.

Não foi feita cobrança real, troca de senha ou publicação de mensagens na comunidade. Checkout foi verificado como destino autenticado; os cenários do webhook de cobrança foram verificados pelos testes de domínio.

Esta validação cobre os fluxos e estados descritos. Não constitui garantia de ausência de bugs em todos os aparelhos e condições de rede.
