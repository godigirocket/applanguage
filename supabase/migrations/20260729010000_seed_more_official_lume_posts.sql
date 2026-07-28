-- ═══════════════════════════════════════════════════════════════
-- More seed posts from the official "Lume" account (same approach as
-- 20260729000000_seed_official_lume_posts.sql — real posts honestly
-- attributed to "Lume", zero fabricated engagement). Kept as a separate
-- migration (not an edit to the earlier one) since that one may have
-- already been run, and edited migrations don't get re-applied.
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.community_posts (user_id, author_name, content, post_type, tags, likes, comments, shares)
SELECT
  p.id,
  'Lume',
  post.content,
  post.post_type,
  post.tags,
  0,
  0,
  0
FROM public.profiles p
CROSS JOIN (
  VALUES
    (
      'Desafio da semana: hoje, tente pensar em português e "traduzir na hora" pelo menos uma frase pro idioma que você está aprendendo. Só isso já treina o cérebro de um jeito diferente. Bora! 💪',
      'challenge',
      ARRAY['desafio']
    ),
    (
      'Errar a pronúncia não é falha, é parte do processo. Nem native speaker acerta 100% na primeira tentativa de um idioma novo — o segredo é tentar de novo sem se cobrar. 🎙️',
      'tip',
      ARRAY['pronuncia', 'dica']
    ),
    (
      'Curiosidade: em espanhol, "embarazada" não significa "embaraçada" — significa grávida! Um dos falsos cognatos que mais confundem brasileiros aprendendo espanhol. Conhece outro? Comenta aqui. 👇',
      'cultural',
      ARRAY['curiosidade', 'espanhol']
    ),
    (
      'Se você trava na hora de falar, tenta os jogos antes das lições de conversação — LumeMatch e o Tradutor Relâmpago ajudam a criar reflexo de vocabulário sem a pressão de "ter que acertar".',
      'resource',
      ARRAY['jogos', 'dica']
    ),
    (
      'Pergunta pra comunidade: qual foi a lição mais difícil que você já fez aqui no Lume até agora? E como você superou? 🤔',
      'question',
      ARRAY['pergunta']
    ),
    (
      'Toda sequência (streak) começa no dia 1. Se hoje é seu dia 1, seja bem-vindo(a) — e se você já tá em dia 30, 100 ou mais, a gente tá na torcida. Continue! 🔥',
      'streak',
      ARRAY['motivacao', 'streak']
    ),
    (
      'POV: você aprende uma gíria nova no app e sai procurando desculpa pra usar ela numa conversa real ainda hoje 😂 Se já aconteceu com você, deixa um "🔥" aqui embaixo.',
      'meme',
      ARRAY['relatable']
    ),
    (
      'Dica rápida: ouvir música ou podcast no idioma que você estuda, mesmo sem entender tudo, treina o ouvido pro ritmo real da língua — que é bem diferente do ritmo "devagar" dos áudios de aula.',
      'tip',
      ARRAY['listening', 'dica']
    )
) AS post(content, post_type, tags)
WHERE p.email = 'emailjg4@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.community_posts
    WHERE author_name = 'Lume' AND content = post.content
  );
