# Langlume — verificação antes de publicar

O CI instala a partir do `package-lock.json`, compila, testa os módulos e roda Chromium com Supabase simulado. O teste da demo segue para cadastro, confirmação simulada e primeira lição; as rotas de cadastro nunca recebem dados reais no CI. O teste de cobrança chama o webhook real e aplica as migrações em PostgreSQL local, com duas contas de teste: a aprovação libera o comprador, a duplicata não estende o plano e o reembolso revoga o acesso. Nenhum pagamento é criado.

1. Abra um PR para `main` e espere `build-and-check` e `security-scan` passarem. Não use a opção de ignorar as checagens.
2. Após integrar, confira o CI do commit de `main`. Em uma publicação manual pela Vercel, use esse commit sem alterações locais. Verifique a prévia antes de promover e teste a landing e uma lição no domínio público.
3. Compare no Analytics as respostas da demo, cliques de cadastro, cadastros aceitos, onboarding e primeiras lições. São contagens agregadas, não um rastreamento de pessoas. Eventos personalizados dependem da configuração da conta Vercel e dados de visitantes reais.

## Homologação que precisa de aparelhos físicos

- Android: Chrome em retrato e paisagem. Jogue a demo, crie uma conta de teste, confirme o e-mail, conclua a primeira lição e reabra o app. Confira o encaixe com teclado, menu e microfone. Repita com a permissão do microfone negada.
- iPhone: Safari e app adicionado à tela inicial. Repita o fluxo de lição. Ative lembretes nas configurações, feche o app e confirme a entrega e a abertura após o próximo agendamento elegível com a tela bloqueada.
- Para confirmar o lado do provedor de pagamentos, use o [envio de teste da Cakto](https://ajuda.cakto.com.br/pt-br/articles/1-como-funcionam-os-webhooks-na-cakto-guia-completo) em um webhook separado que aponte para ambiente e banco de teste. A suíte local valida o que o Langlume faz ao receber os eventos, mas não substitui o envio pelo provedor.
