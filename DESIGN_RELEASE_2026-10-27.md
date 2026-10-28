# Langlume — revisão de design e encaixe, 27/10/2026

Publicado em https://langlume.vercel.app.

Deployment: `dpl_HahKsUqoNEonDiQ1kmPcgUCsiDGQ`,
https://applanguage-bok59dfon-digirocket.vercel.app.
Build remoto Ready; promoção e domínio público conferidos.

## Design implementado

- Paleta comum com verde suave, azul profundo, areia e lavanda; superfícies
  sólidas, menos sombras e contraste legível nos temas claro e escuro.
- Landing ampliada: conversa de exemplo, cartão de vocabulário, recursos,
  demonstração da jornada de lições, destinos culturais, FAQ funcional e convite.
  Conteúdo localizado em português, inglês e espanhol, sem fotos externas pesadas
  ou animações contínuas da página.
- Home com sugestões selecionadas, atalhos compactos, destinos em duas colunas
  no celular e ação direta de continuar aprendendo. Cartões de lição e cidade
  agora são links nativos; cada cidade abre o destino correspondente.
- Jogos: quatro estatísticas compactas, espaço para atividades já na primeira
  tela e atalhos de especialidades conectados a atividades. Removida a precisão
  inventada a partir da quantidade de lições: o resumo apresenta lições, nível,
  ofensiva real e XP. Corrigida a ajuda que anunciava 18 modos quando a lista tem 6.
- Lições ocupam a altura disponível, com área interna rolável e rodapé de ação
  estável. Ajustes para telas baixas, orientação horizontal, textos longos e
  áreas seguras. Pressionar continuar não altera mais a espessura da borda.
- Conversa usa toda a altura da tela. Removida a reserva de 64 px para um
  cabeçalho ausente; composição compacta em telas baixas e com teclado.
- Campos de resposta com 16 px para evitar ampliação automática por foco.
  O zoom manual de acessibilidade permanece disponível.
- Os menus continuam em portais diretamente no body, fixos ao viewport durante
  rolagem e animações das páginas.

## Áudio

Seleção centralizada prioriza vozes naturais/neural/enhanced/premium e o idioma
correto, em vez de dar preferência absoluta à primeira voz local. Cadência 1×.
Configurações oferece amostra e escolha persistida por idioma neste navegador.
A lista atualiza quando o navegador termina de carregar as vozes. O áudio para
ao sair da rota. Não há chave ou chamada do aplicativo ao Google Cloud TTS.

A qualidade depende das vozes oferecidas pelo sistema e navegador. A mudança
não instala um sintetizador neural nem garante voz natural quando o aparelho
oferece apenas vozes básicas. Vozes do navegador podem depender de conexão.

## Verificação

- TypeScript e build de produção passaram; 21 testes automatizados de domínio
  passaram, incluindo seleção de vozes e término das 2.130 lições.
- 10 grupos de regressão no ambiente de desenvolvimento: lições completas em
  360/390/768/1440 px, retomada, resposta errada, próxima lição, link inválido,
  carteira/progresso e páginas do app.
- Varredura local de produção: 130 visitas a 65 destinos em 320/390 px, sem
  texto fora dos controles, exceções de JavaScript ou falhas do Supabase.
- Build final: 56 estados de telas em oito tamanhos, 320×740, 360×800, 390×844,
  430×932, 768×1024, 1024×768, 1440×900 e 844×390. Inclui FAQ, destino do atalho
  de gramática, foco sem ampliação, conversa preenchendo o viewport, campo de
  resposta visível com altura reduzida e botão da lição após redimensionamento.
- Menus verificados também em WebKit: 28 combinações, incluindo rolagem,
  transformação da página, mudança de altura e painel de idioma.
- Geometria de controles em EN/ES/PT: 18 combinações de telas, mais diálogos de
  ajuda de memória e tradução. A conta QA foi restaurada para interface PT.
- Jogos concluídos: seis pares de memória, flashcards, quiz de vocabulário e
  tradução com pausa de ajuda, expiração, recompensa única e reinício.
- Conversas guiadas em 320/390/1440 px: resposta, ajuda, correção, áudio simulado,
  microfone indisponível, encerramento e reinício; consulta opcional de dicionário
  e falha de rede recuperável. Sem requisições de modelo.
- Vozes simuladas: carregamento tardio, filtro de idioma, escolha automática,
  preferência manual, amostra, recarga e retorno ao modo automático.
- Tema claro/escuro: seis combinações de tamanho/tema, contraste do hero,
  troca pelo botão e persistência.
- PWA publicada: assets essenciais da versão nova, cache privado protegido;
  lição pública já visitada recarrega e inicia offline.
- Conta QA no domínio publicado: 17 verificações, incluindo login real,
  conclusão/salvamento de lição, próxima lição, 13 páginas autenticadas e sessão
  após recarga; zero exceções de JavaScript e zero falhas de API observadas.
- Varredura final no domínio publicado: 65 destinos em 390 px, zero textos
  fora dos controles, zero exceções de JavaScript e zero falhas do Supabase.
  WebKit publicado: 28/28 combinações de menu, rolagem e tamanho aprovadas.
- Gestos de toque reais via CDP no domínio publicado: home, lições e jogos
  rolam nos dois sentidos com menus fixos. Toast de boas-vindas acima do menu.

Screenshots e logs: `scratchpad/design-27/` (ignorado pelo Git e Vercel).
Testes de navegação mobile são emulação Chromium/WebKit, não medições em um
iPhone ou Android físico. Reprodução nativa não foi avaliada por escuta humana.

## Carregamento publicado

Uma execução Chromium, cache frio, rede 1,6 Mbps / 80 ms e CPU 4×:

| Página | LCP | Transferência | CLS |
| --- | ---: | ---: | ---: |
| Landing | 2,48 s | 337 KB | 0,000025 |
| Login | 1,40 s | 293 KB | 0,000356 |
| Entrada da lição | 1,89 s | 430 KB | 0,000304 |

São resultados de laboratório de uma execução, não percentis de usuários reais.
As medidas locais do preview sem compressão foram mantidas separadas e não são
usadas como comparação direta com a CDN pública.
