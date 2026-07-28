-- ═══════════════════════════════════════════════════════════════
-- Seeds the community feed with a handful of posts from the app's own
-- "Lume" persona (the same name already used for the in-app mascot/AI
-- companion), so the feed isn't empty on launch day.
--
-- This is NOT fake/simulated user content — it's real posts, honestly
-- attributed to "Lume" (not pretending to be a fictional student), with
-- zero likes/comments/shares (no fabricated engagement numbers). The
-- community_posts.user_id column requires a real profiles row to
-- satisfy its foreign key, so these are attached to the founder's own
-- account — author_name is what actually displays, set to "Lume"
-- regardless of whose account technically owns the row.
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
      'Bem-vindo(a) à comunidade do Lume! 🎉 Aqui é o lugar pra compartilhar conquistas, tirar dúvidas de gramática ou só comemorar aquele dia de sequência mantida. Bora começar?',
      'tip',
      ARRAY['bem-vindo']
    ),
    (
      'Dica de estudo: revisar uma palavra 3 vezes em dias diferentes gruda muito mais na memória do que repetir 10 vezes no mesmo dia. É por isso que as lições reaparecem espaçadas — confia no processo! 📚',
      'tip',
      ARRAY['dica', 'memoria']
    ),
    (
      'Qual idioma você está aprendendo e por quê? Conta pra gente nos comentários — viagem, trabalho, série favorita sem legenda? 👀',
      'question',
      ARRAY['pergunta']
    ),
    (
      'Curiosidade: em inglês, "how are you?" raramente espera uma resposta longa — "good, you?" já resolve. Detalhezinhos assim fazem MUITA diferença numa conversa real.',
      'tip',
      ARRAY['cultura', 'conversacao']
    )
) AS post(content, post_type, tags)
WHERE p.email = 'emailjg4@gmail.com'
  -- Guards against accidentally re-running this migration and duplicating
  -- posts (id is always a fresh UUID, so ON CONFLICT wouldn't catch it).
  AND NOT EXISTS (SELECT 1 FROM public.community_posts WHERE author_name = 'Lume');
