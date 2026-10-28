# Langlume — correções e validação

## O que mudou

- Player com uma sequência finita para todos os exercícios disponíveis: vocabulário, alternativas, áudio, fala, escrita e montagem de frases.
- Retomada por atividade, separada por conta e lição, com pontuação local preservada; restauração de checkpoints compatíveis do Supabase.
- Verificação explícita antes de continuar, feedback de respostas, proteção contra cliques repetidos, confirmação de saída e conclusão com animação.
- Revisões não recompensam a mesma lição novamente no dispositivo.
- Links de lições resolvem o idioma da própria URL, mesmo quando outro curso está selecionado.
- Desbloqueio respeita o nível inicial. O modo infantil usa uma sequência de lições apropriadas, evitando bloqueios causados por lições ocultas.
- Página inicial mostra próximas lições pendentes; o caminho acompanha a atividade atual.
- Salvamento remoto preserva conclusões; leituras conciliam o cache local com os registros remotos.
- Autenticação não chama operações do Supabase enquanto segura o callback de autenticação; carregamento tem limite de espera.
- Gravação funciona por toque e teclado, com cancelamento ao desmontar o componente.
- Missões usam o saldo real, têm reinício diário e resgate único; a compra de itens persiste os efeitos. XP duplo dura 30 minutos, congelamento protege um dia perdido, coroa aparece no avatar e tema altera a interface.
- Escritas criptografadas são ordenadas para evitar que uma atualização antiga sobrescreva progresso recente.
- Correções de largura no dicionário, safe area da navegação e ampliação pelo navegador. Movimento reduzido respeitado nas transições.

## Referência

Analisado: [sanidhyy/duolingo-clone](https://github.com/sanidhyy/duolingo-clone), licença MIT. As interações de seleção/verificação, progresso, revisão, saída e resultados foram adaptadas ao Langlume. Autenticação, pagamentos e conteúdo continuam na arquitetura existente. Veja `THIRD_PARTY_NOTICES.md`.

## Como reproduzir

Use Node 22.18+ (ou Node 24+).

```sh
npm ci
npm run typecheck
npm test
npm run build
npm audit --audit-level=high
npx playwright install chromium
npm run dev -- --host 127.0.0.1 --port 5173
```

Em outro terminal:

```sh
npm run test:e2e
```

A suíte de navegador usa um usuário e respostas do Supabase simulados, sem criar contas ou escrever no banco de produção. `E2E_BASE_URL` altera o endereço local; `E2E_FILTER` seleciona um cenário. Resultados e capturas ficam em `scratchpad/langlume-regression/`.

## Alcance dos testes

- Integridade e término das 2.130 lições, incluindo palavras repetidas nos bancos de montagem de frases.
- Checkpoints inválidos, normalização de escrita e precisão sem contabilizar atividades opcionais como acertos.
- Conclusão em 360, 390, 768 e 1440 pixels; três cursos; revisão sem XP extra.
- Retomada após recarregar, saída/cancelamento e link inexistente.
- Compra/resgate repetidos, XP duplo, ofensiva diária, persistência e desbloqueio avançado/infantil.
- Páginas principais em 320, 390, 768 e 1440 pixels, verificando conteúdo fora da largura da tela e erros de execução.

## Resultado

Build de produção, TypeScript, cinco testes de integridade/regressão e auditoria npm passaram. O servidor compilado respondeu HTTP 200 na página inicial, no login e nos links de lição dos três cursos. ESLint nos arquivos centrais alterados passou sem erros, com avisos de hooks/fast refresh.

Os dez cenários de navegador passaram em rodadas de lições/economia e responsividade: 13 páginas principais em quatro larguras, conclusão nos três cursos, revisão, retomada, compras e resgates. Um teste adicional com animações ativas confirmou que um toque duplo avança exatamente uma atividade. A instalação `npm ci --dry-run --ignore-scripts` também passou. Evidências: `scratchpad/langlume-regression/validation-summary.json` e capturas na mesma pasta.

## Limites

Os testes de navegador validam o comportamento com serviços simulados. Cobranças reais, microfone em aparelhos físicos, entrega de e-mail e concorrência entre dispositivos dependem de validação com os serviços de produção. As mudanças não foram publicadas por este trabalho. Isso não constitui garantia de ausência de todos os bugs.
