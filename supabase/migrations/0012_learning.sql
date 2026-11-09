-- ============================================================
-- AADALA.MA — 0012 Learning (schema only, no UI/API yet)
-- Tables: learning_courses, learning_lessons, student_progress
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt), after 0001-0011.
-- NOTE: No authored lessons here — live review today is ReviewMode (flashcards/quiz from excerpts).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.learning_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  level TEXT CHECK (level IN ('beginner','intermediate','advanced')),
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.learning_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.learning_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_mdx TEXT,
  order_index INT,
  quiz JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.learning_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  score INT,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lessons_course ON public.learning_lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.student_progress(user_id);

ALTER TABLE public.learning_courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "courses_public_read" ON public.learning_courses;
CREATE POLICY "courses_public_read" ON public.learning_courses FOR SELECT USING (true);

ALTER TABLE public.learning_lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lessons_public_read" ON public.learning_lessons;
CREATE POLICY "lessons_public_read" ON public.learning_lessons FOR SELECT USING (true);

ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "progress_owner_only" ON public.student_progress;
CREATE POLICY "progress_owner_only" ON public.student_progress FOR ALL
  USING (user_id::text = auth.uid()::text);
