-- ============================================================
-- AADALA.MA — 0003 Smart Document Templates (FEATURE 2)
-- Tables: document_templates, generated_documents
-- Run in Supabase SQL Editor (project pvoenvxinkipgpnddumt)
-- Requires: 0002_auth_rls.sql applied first.
-- NOTE: legal_basis is "مقترح" — تحقق من النص الرسمي قبل الاعتماد.
--       Templates are editable drafts, NOT official documents.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  CREATE TYPE public.doc_category AS ENUM (
    'real_estate', 'employment', 'family', 'commercial', 'civil', 'criminal'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category public.doc_category NOT NULL,
  description TEXT,
  legal_basis TEXT,
  template_html TEXT NOT NULL,
  required_fields JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.document_templates(id) ON DELETE SET NULL,
  title TEXT,
  filled_data JSONB,
  final_html TEXT,
  ai_additions TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','final','archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_active ON public.document_templates(category, is_active);
CREATE INDEX IF NOT EXISTS idx_docs_user ON public.generated_documents(user_id, created_at DESC);

-- RLS
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "templates_public_read" ON public.document_templates;
CREATE POLICY "templates_public_read" ON public.document_templates FOR SELECT USING (is_active = true);

ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "docs_owner_only" ON public.generated_documents;
CREATE POLICY "docs_owner_only" ON public.generated_documents FOR ALL USING (user_id::text = auth.uid()::text);

-- updated_at
CREATE OR REPLACE FUNCTION public.touch_doc_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_docs_touch ON public.generated_documents;
CREATE TRIGGER trg_docs_touch BEFORE UPDATE ON public.generated_documents
  FOR EACH ROW EXECUTE FUNCTION public.touch_doc_updated_at();

-- Seed (idempotent by title — drafts, expert review required)
INSERT INTO public.document_templates (title, category, description, legal_basis, required_fields, template_html)
SELECT 'الوعد بالبيع العقاري', 'real_estate',
  'وعد بالبيع لعقار محفظ أو في طور التحفيظ. ينظم العلاقة قبل العقد النهائي. (مسودة تجريبية — تحقق من النص الرسمي.)',
  'المادة 4 من القانون رقم 39.08 المتعلق بمدونة الحقوق العينية (مقترح — تحقق من النص الرسمي)',
  '[
    {"name":"seller_name","label":"اسم البائع","type":"text","required":true},
    {"name":"buyer_name","label":"اسم المشتري","type":"text","required":true},
    {"name":"property_desc","label":"وصف العقار","type":"textarea","required":true},
    {"name":"price","label":"الثمن الإجمالي (درهم)","type":"number","required":true},
    {"name":"advance","label":"مبلغ التسبيق (درهم)","type":"number","required":true},
    {"name":"date","label":"تاريخ التوقيع","type":"date","required":true}
  ]'::jsonb,
  '<div class="doc-content"><h1 style="text-align:center;">وعد بالبيع العقاري</h1><p><strong>الطرف الأول (البائع):</strong> السيد(ة) {{seller_name}}</p><p><strong>الطرف الثاني (المشتري):</strong> السيد(ة) {{buyer_name}}</p><p>بموجب هذا العقد، يلتزم الطرف الأول ببيع العقار الموصوف كالتالي: {{property_desc}} إلى الطرف الثاني، بثمن إجمالي قدره <strong>{{price}} درهم</strong>، مع أداء تسبيق قدره <strong>{{advance}} درهم</strong>.</p><div style="background:#fff3cd; padding:10px; border-right:4px solid #ffc107; margin:20px 0;"><strong>ملاحظة قانونية هامة:</strong> طبقاً للمادة 4 من القانون 39.08، يجب أن يتم هذا الوعد في محرر رسمي أو محرر ثابت التاريخ يحرره محام مقبول للترافع أمام محكمة النقض، تحت طائلة البطلان. (تحقق من النص الرسمي.)</div><p>حُرر بـ ............... بتاريخ {{date}}.</p><div style="display:flex; justify-content:space-between; margin-top:50px;"><span>توقيع البائع</span><span>توقيع المشتري</span></div></div>'
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE title = 'الوعد بالبيع العقاري');

INSERT INTO public.document_templates (title, category, description, legal_basis, required_fields, template_html)
SELECT 'إنذار بالإخلاء', 'real_estate',
  'إنذار قانوني للمكتري بالإخلاء بسبب عدم الأداء أو الإخلال بالالتزامات. (مسودة تجريبية — تحقق من النص الرسمي.)',
  'قانون الالتزامات والعقود (الفصل 692) (مقترح — تحقق من النص الرسمي)',
  '[
    {"name":"landlord_name","label":"اسم المكري","type":"text","required":true},
    {"name":"tenant_name","label":"اسم المكتري","type":"text","required":true},
    {"name":"address","label":"عنوان العقار المكترى","type":"text","required":true},
    {"name":"reason","label":"سبب الإخلاء (عدم الأداء، إلخ)","type":"textarea","required":true},
    {"name":"deadline","label":"أجل الإخلاء (أيام)","type":"number","required":true},
    {"name":"date","label":"تاريخ الإنذار","type":"date","required":true}
  ]'::jsonb,
  '<div class="doc-content"><h1 style="text-align:center;">إنذار بالإخلاء</h1><p><strong>من:</strong> السيد(ة) {{landlord_name}} (المكري)</p><p><strong>إلى:</strong> السيد(ة) {{tenant_name}} (المكتري)</p><p>أوجه إليكم هذا الإنذار القانوني للإخلاء من العقار الكائن بـ: {{address}}، وذلك للسبب التالي: {{reason}}.</p><p>وعليه، يرجى منكم إخلاء العقار وتسليمه خالياً من الشواغل داخل أجل <strong>{{deadline}} يوماً</strong> من تاريخ التوصل بهذا الإنذار، وإلا سأضطر آسفاً لاتخاذ كافة الإجراءات القانونية اللازمة.</p><p>حُرر بتاريخ {{date}}.</p><p style="margin-top:50px;">توقيع المكري</p></div>'
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE title = 'إنذار بالإخلاء');
