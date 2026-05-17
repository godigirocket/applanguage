-- SEED DATA FOR DEMO
-- This simulates ~3 hours of active usage for the first user it finds

DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get the first profile
    SELECT id INTO target_user_id FROM public.profiles LIMIT 1;
    
    IF target_user_id IS NOT NULL THEN
        -- 1. Update Profile Stats
        UPDATE public.profiles 
        SET 
            xp = 1250,
            streak = 5,
            last_session_date = current_date,
            level = 'intermediate',
            onboarding_done = true
        WHERE id = target_user_id;

        -- 2. Add fake conversations (simulating multiple days)
        INSERT INTO public.conversations (student_id, topic_slug, title, language, mood, duration_seconds, xp_earned, created_at)
        VALUES 
            (target_user_id, 'daily-life', 'Morning Coffee Routine', 'en', 'calm', 600, 45, now() - interval '4 days'),
            (target_user_id, 'professional', 'Project Update Meeting', 'en', 'intensive', 900, 120, now() - interval '3 days'),
            (target_user_id, 'travel', 'Airport Check-in', 'en', 'calm', 450, 30, now() - interval '2 days'),
            (target_user_id, 'art-culture', 'Modern Art Discussion', 'en', 'cultural', 1200, 150, now() - interval '1 day'),
            (target_user_id, 'free-talk', 'Random Thoughts', 'en', 'confidence', 1800, 200, now() - interval '5 hours');

        -- 3. Add fake saved expressions
        INSERT INTO public.saved_expressions (student_id, expression, context, topic_slug, created_at)
        VALUES 
            (target_user_id, 'I was wondering if you could...', 'Making polite requests', 'daily-life', now() - interval '4 days'),
            (target_user_id, 'Let''s circle back to this later', 'Business meetings', 'professional', now() - interval '3 days'),
            (target_user_id, 'Could you point me towards the baggage claim?', 'At the airport', 'travel', now() - interval '2 days'),
            (target_user_id, 'This piece really speaks to me', 'Art gallery', 'art-culture', now() - interval '1 day'),
            (target_user_id, 'To be honest, I haven''t thought about it much', 'Free conversation', 'free-talk', now() - interval '4 hours');

        -- 4. Add fake progress snapshots
        INSERT INTO public.progress_snapshots (student_id, date, speaking_confidence, conversational_flow, cultural_fluency, pronunciation_clarity)
        VALUES 
            (target_user_id, current_date - interval '4 days', 30, 25, 20, 35),
            (target_user_id, current_date - interval '3 days', 35, 30, 25, 40),
            (target_user_id, current_date - interval '2 days', 42, 35, 30, 42),
            (target_user_id, current_date - interval '1 day', 48, 40, 35, 45),
            (target_user_id, current_date, 55, 45, 40, 50);

    END IF;
END $$;
