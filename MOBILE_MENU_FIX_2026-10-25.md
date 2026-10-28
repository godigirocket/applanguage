# Barras fixas e texto dentro dos controles — 25/10/2026

Publicado em https://langlume.vercel.app.

- Deployment: `dpl_3ADCAC1YXibmkUkevo8gWrKEqyeS`.
- URL imutável: https://applanguage-nhbr804fs-digirocket.vercel.app.
- Vercel confirmou a promoção e o alias principal com estado `Ready`.

## Correções

1. **Cabeçalho:** removido o recolhimento automático durante a rolagem. O menu superior permanece fixo.
2. **Barras superior e inferior:** renderizadas em uma camada do viewport, fora dos contêineres animados das páginas. Removidas transformações próprias e contenção de layout desnecessária; mantidas as áreas seguras do dispositivo e o espaço reservado para o cabeçalho.
3. **Menu de idioma:** removidos handlers duplicados de toque; o menu tem altura máxima com rolagem interna para caber na horizontal. Os controles aguardam a conexão dos handlers antes de aceitar interação após o HTML inicial.
4. **Celulares de 320 px:** o cabeçalho foi ajustado para comportar também “Sign In”, sem empurrar o botão para fora da tela. Os rótulos da barra inferior cabem em suas áreas de toque e não mudam de escala ao selecionar um item.
5. **Perfil:** abas adaptadas para que “Conquistas” e “Achievements” não ultrapassem os botões.
6. **Configurações:** opções de idioma usam colunas adaptáveis; “Português” não ultrapassa o botão em 320 px.
7. **Memória:** cartas maiores em duas colunas no celular, dando espaço para as traduções completas. O teste verifica o texto das cartas após encontrar os seis pares.
8. **Avisos:** notificações visuais ficam acima da barra inferior quando ela está presente, evitando que o aviso de boas-vindas cubra os itens do menu.
9. **Ações compartilhadas:** texto pode quebrar linha dentro dos botões principais, respeitando a largura disponível.

O comportamento de esconder o cabeçalho descrito na revisão anterior foi substituído pelo comportamento fixo solicitado nesta rodada.

## Critérios de verificação

Esta varredura compara os retângulos reais dos trechos de texto com os limites dos respectivos botões e links. Não se limita à largura total da página — um texto pode ultrapassar o próprio botão e ainda continuar dentro da tela.

**Resultado:** 130/130 visitas da varredura final aprovadas no site publicado, sem texto fora dos controles, exceções JavaScript ou falhas HTTP do Supabase. Barras/menu: 28/28 cenários em Chromium e 28/28 em WebKit aprovados. Gestos de toque, aviso acima da barra, temas e service worker passaram. Build e TypeScript sem erros; 18/18 testes unitários aprovados.

- `tests/control-sweep.e2e.mjs`: 65 destinos em 320 e 390 px, incluindo telas principais, autenticação, planos/pagamento, suporte/termos, oito conversas e oito cidades. Verifica texto, barras em três posições de rolagem, exceções do navegador e falhas HTTP do Supabase. Telas com redirecionamento são verificadas no estado efetivamente apresentado; não foram feitas novas contas ou cobranças.
- `tests/fixed-navigation.e2e.mjs`: Chromium e WebKit; 320×740, 360×800, 390×844 e 844×390. Início, lições, jogos, comunidade, perfil, configurações e dicionário; menu aberto, rolagem, mudança de altura do viewport e transformação de página simulando transição. Inclui cabeçalho público em PT/EN/ES e aba de conquistas.
- `tests/touch-scroll.e2e.mjs`: eventos de toque confiáveis enviados pelo protocolo do Chromium, com arrastos nos dois sentidos em início, lições e jogos; verifica que o conteúdo realmente rola e as barras ficam ancoradas. Verifica também que o aviso de boas-vindas fica acima da navegação.
- `tests/control-states.e2e.mjs`: 18 combinações de tela/idioma em PT/EN/ES e os diálogos de ajuda de memória/tradução. As preferências da conta QA são restauradas para PT ao terminar.
- `tests/mobile-gameplay.e2e.mjs`: memória completa, flashcards e quiz completo em 320 px, incluindo limites do texto nas cartas.
- Temas claro/escuro, service worker, build, TypeScript e 18 testes unitários. ESLint dos componentes alterados sem erros; permanece um aviso preexistente de dependência de effect no jogo de memória.

## Evidências

Logs ignorados pelo Git: `scratchpad/keyless/controls-final.log`, `pinned-{chromium,webkit}-release.log`, `menus-touch-final.log`, `menus-final-*` e `control-states-local.log`. Resultados estruturados: `scratchpad/control-sweep-final/results.json` e `scratchpad/fixed-navigation-{chromium,webkit}/results.json`. Captura: `scratchpad/keyless/menus-touch-final.png`.

As verificações usam contas QA dedicadas. Chromium/WebKit com viewport móvel não substituem validação em aparelhos físicos Android/iPhone. Pagamento real, entrega de email e microfone físico não fazem parte desta correção visual. Não há garantia de ausência absoluta de bugs em todos os estados possíveis do aplicativo.
