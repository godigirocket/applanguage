# Prática sem chaves de IA — 24/10/2026

## Implementação

A conversação agora usa um currículo local de prática guiada. Foram removidas
as funções que chamavam Gemini e Google Cloud TTS, a autenticação/cota desses
serviços no caminho de conversação e as variáveis Google de `.env.example`.
Nenhuma chave de IA é necessária para conversar ou reproduzir as frases.

- Oito temas, em português, inglês e espanhol: 48 etapas por idioma, 144 no total.
- Cenários com exemplos, sugestões clicáveis, ajuda, ajustes de escrita para
  erros específicos, conclusão e reinício explícitos. Não é um modelo generativo
  nem uma conversa aberta sobre qualquer assunto; o produto identifica o modo
  como **prática guiada**. O modo de confiança não aplica as correções de escrita.
- O nível avançado acrescenta desafios de justificativa e perguntas relacionadas.
- Respostas, ajuda e progressão são calculadas no navegador, sem requisições de
  modelo e sem downloads de pesos. A prática já carregada continua sem conexão.
- Leitura pelo `speechSynthesis` do navegador, com preferência por vozes naturais/aprimoradas disponíveis
  do idioma correto, cancelamento ao sair/silenciar e erro recuperável quando a
  plataforma não consegue falar. Reconhecimento de voz é opcional; digitação e
  sugestões permanecem disponíveis em navegadores sem suporte.
- A disponibilidade e a execução offline da voz dependem do aparelho/navegador.
  Alguns navegadores usam serviços remotos próprios para reconhecimento ou vozes;
  o aplicativo não utiliza uma chave nem chama Google Cloud TTS.
- Revisão de 27/10: lições, flashcards, memória, forca, associação, tradução e
  pronúncia usam a mesma seleção de voz. A cadência padrão é normal (1×).
  Configurações permite ouvir uma amostra e salvar uma voz por idioma neste
  navegador; o modo automático prioriza vozes naturais/aprimoradas disponíveis.
- O vocabulário lateral respeita o idioma de estudo, incluindo espanhol.
- Ajuda, respostas curtas e repetição da mesma resposta não rendem XP adicional
  na sessão. Salvar a mesma expressão e encerrar a mesma sessão não duplicam XP.
- Os textos de marketing, metadados, planos e ajuda foram ajustados para não
  prometer uma IA generativa ou avaliação automática de sotaque.

Login, sincronização de progresso e pagamentos continuam nas integrações
existentes Supabase/Cakto. Esta mudança elimina as chaves de IA/voz; ela não
transforma contas e pagamentos em operações locais.

## Recursos públicos e referências

O dicionário conserva o conteúdo local e ganhou uma consulta **opcional** de
definições em inglês pela [Free Dictionary API](https://dictionaryapi.dev/),
com [código público no GitHub](https://github.com/meetDeveloper/freeDictionaryAPI).
A consulta não exige chave, só envia a palavra pesquisada quando o aluno pede,
usa cache/timeout e informa quando a definição não está disponível. Não envia
o histórico de conversa. Uma consulta real de `hello` retornou 200 e definição.
As entradas que informam origem/licença exibem links para Wiktionary e Creative
Commons junto da definição. O conteúdo remoto não é necessário para praticar.

A referência [Lingo / duolingo-clone](https://github.com/sanidhyy/duolingo-clone)
continua creditada em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Foram
mantidos os padrões já adaptados de progressão finita, prática, retomada e feedback.
O novo currículo local é código/conteúdo do Langlume; não foi apresentado como
um serviço de IA fornecido pelo repositório de referência.

Referência técnica de voz: [Web Speech / SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
e [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

## Validação

- Typecheck e build de produção aprovados.
- 18 testes de lógica/SQL/empacotamento aprovados, incluindo os oito cenários nos
  três idiomas sem rede, término sem repetição, reinício, ajuda e correções.
- Build de produção no navegador em 320, 390 e 1440 px: saudação única, resposta,
  ajuda e sugestões offline; zero chamadas a modelos; áudio testado com uma
  implementação controlada de Web Speech e fallback para microfone não suportado.
  Esses testes não afirmam que houve áudio audível em um celular físico.
- Navegador também confirmou estudo em inglês/espanhol/português com interface
  em outro idioma, sem chamadas a modelos.
- Dicionário: resposta simulada determinística e falha offline recuperável, além
  da consulta real ao endpoint público. O servidor público pode impor limites.
- Navegação/login preservam destino, bloqueiam redirect externo e compartilham
  uma consulta de perfil; início utilizável enquanto o perfil demora.
- Busca nos bundles atuais do cliente e servidor não encontrou endpoints Google
  nem referências a `GEMINI_API_KEY`/`GOOGLE_CLOUD_API_KEY`.
- ESLint dos arquivos centrais: zero erros e quatro avisos de hooks.
- Uma sessão longa com múltiplos pedidos de ajuda concluiu e reiniciou o cenário:
  foi removido o corte do histórico herdado do antigo cliente de modelo.
- Corrigido o encolhimento do grid da página inicial após detectar texto cortado
  no mobile. A nova checagem local confirmou o hero em 320/390 px e as páginas
  públicas em 390/1440 px sem transbordamento indevido.

Evidências ignoradas pelo Git/deploy em `scratchpad/keyless/`. A implantação
final é `dpl_5uZhbJ1Pf4BmJeMiEe89kQ4bzNtF`,
https://applanguage-mgqb0v8vq-digirocket.vercel.app.
Ela foi promovida para https://langlume.vercel.app e confirmada Ready pela inspeção
do domínio principal. Após a promoção final, passaram novamente a prática guiada
em 320/390/1440 px, a sessão longa com ajuda e reinício, o dicionário com falha
offline e as páginas públicas/fluxo de conclusão de lição. Nesta revisão também
passaram login real, salvamento remoto, próxima lição e 13 páginas autenticadas,
sem erros JavaScript nem respostas de erro do Supabase observadas.

As chaves antigas que eventualmente ainda existam nas configurações privadas
não são utilizadas pelo código. Não foram copiadas para este relatório, para o
Git ou para os bundles.
