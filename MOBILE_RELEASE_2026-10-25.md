# Responsividade, navegação e desempenho — 25/10/2026

Publicado em https://langlume.vercel.app, deployment `dpl_96hqPM9zrTrrKYKCRK6bPXFikrD7` (https://applanguage-6lsil1w80-digirocket.vercel.app). Vercel confirmou `Ready`, promoção e alias principal.

## Problemas tratados

- Uma regra global aplicava `content-visibility: auto` e uma altura estimada de 500 px a praticamente toda seção fora da tela. Foi removida: as seções agora participam do layout normal, evitando espaços provisórios e saltos de altura ao rolar. A contenção genérica de pintura dos cartões também foi removida para não cortar conteúdo e elementos sobrepostos.
- O cabeçalho comparava apenas o deslocamento de um frame ao limiar de 12 px; na rolagem lenta ele não reagia. Agora acumula o movimento por direção, cancela o frame pendente ao desmontar e volta a aparecer ao trocar de rota.
- Foi retirada uma regra de celular pequeno que forçava qualquer linha com `flex-wrap` a virar uma coluna, independentemente do componente.
- Cabeçalho e cartões deixam de usar desfoque de fundo em dispositivos de toque/telas estreitas; animações ambientais grandes ficam estáticas. Feedback de jogos, transições de interação e a mascote continuam disponíveis.

## Acabamento e acesso ao conteúdo

- Página inicial refeita com CSS responsivo, exemplo de conversa em fluxo normal, cartões de recursos e links reais. Eliminadas dezenas de animações contínuas, elementos flutuantes, demonstrações repetidas e a imagem externa de aproximadamente 195 KB. Sem trabalho decorativo permanente em segundo plano nessa página.
- No início autenticado, “Continuar aprendendo” abre a próxima lição pendente e fica acessível na primeira tela de celular. Mascote e estatísticas ocupam menos altura.
- No catálogo, seletor de idioma e estatísticas se ajustam à largura; busca e trilha aparecem mais cedo.
- Cabeçalhos de lições, comunidade e perfil usam fundo escuro com contraste adequado para texto branco. Ações principais usam cores e profundidade consistentes, com alvos de pelo menos 48 px e foreground próprio para o tema escuro.

## Verificação

As contas e dados usados são exclusivos de QA; não houve compra, cobrança ou publicação na comunidade.

**Resultado final em produção:** 223/223 verificações da auditoria aprovadas; 18/18 verificações de páginas com interação em Chromium e 18/18 em WebKit. As duas execuções finais de interação encerraram sem exceções inesperadas ou requisições canceladas classificadas pelo teste. Temas, autenticação real, gameplay, PWA e lição offline passaram; build e TypeScript sem erros, 18/18 testes unitários e 10/10 grupos de regressão local.

- Auditoria de rotas: 35 rotas em 320×740, 390×844, 768×1024, 844×390, 1024×768 e 1440×900; verifica conteúdo, overflow, redirecionamento, erros JavaScript, falhas HTTP do Supabase, logout e persistência/restauração do idioma.
- Testes de interação: rolagem lenta nos dois sentidos, cabeçalho após navegação, toque na barra inferior, abertura da lição pela ação principal e retorno, busca, rolagem de seis páginas internas e corte de texto. Chromium e WebKit em telas emuladas.
- Temas claro/escuro: 320/390/1440 px, contraste medido do título/descrição, controle de tema e preferência após recarregar. Capturas verificadas visualmente.
- Login real, conclusão de lição com confirmação remota, próxima lição e sessão após reload.
- Memória completa, virar/avaliar/avançar flashcards e quiz de seis respostas até o resultado.
- Service worker, ícones, política de cache e início offline de lição previamente visitada.
- TypeScript, build, 18 testes unitários e 10 grupos de regressão local.

## Medição de laboratório

Cache frio, service worker bloqueado, 1,6 Mbps, latência de 80 ms e CPU 4× mais lenta. Uma medição por rota; não são percentis de usuários reais.

| Métrica da página inicial | Antes | Depois |
| --- | ---: | ---: |
| Dados transferidos | 545.919 bytes | 323.544 bytes |
| JavaScript transferido | 299.454 bytes | 248.626 bytes |
| LCP | 5,07 s | 1,67 s |
| Tempo de resposta inicial do servidor | 2,47 s | 0,12 s |

A transferência da inicial caiu aproximadamente **41%**; o JavaScript transferido caiu aproximadamente **17%**. A variação de resposta do servidor contribuiu para o LCP, portanto não se deve atribuir toda a diferença de tempo às mudanças no frontend. Depois da publicação, login mediu LCP de 1,67 s e a lição, 2,08 s no mesmo perfil de laboratório.

## Limites

WebKit automatizado no Windows não substitui teste em iPhone físico; Chromium com toque emulado não substitui um Android físico. Não foram validados microfone real, instalação em aparelho, pagamento real ou entrega de email. O pacote principal ainda transfere aproximadamente 233 KB de JavaScript comprimido e pode receber otimização adicional; não há garantia de ausência absoluta de travamentos em qualquer aparelho/rede.

Evidências ignoradas pelo Git: `scratchpad/keyless/mobile-release-*`, `mobile-webkit-live.log`, `mobile-perf-{before,after}.log`, `scratchpad/mobile-audit/results.json`, `scratchpad/mobile-interactions-{chromium,webkit}-live/` e `scratchpad/performance/mobile-{before,after}-2026-10-25.json`. Credenciais ficam fora deste relatório.
