# AADALA.MA — قائمة الخطوات اليدوية المتبقية

> 2026-11-16 — كل خطوة هنا تحتاج صلاحية Dashboard (Supabase / Cloudflare / Google)
> لا أملكها عبر MCP (قراءة فقط). الكود والـ migration **جاهزة ومُدقَّقة**؛
> التنفيذ بيدك فقط.

**قبل البدء:** غيّر `https://aadala-ma.cheraimmohamed20.workers.dev` إلى نطاقك
الإنتاجي في كل موضع مذكور أدناه.

---

## الخطوة 1 — Supabase: 2FA للمسؤول

### لماذا
المشروع في وضع "قراءة فقط" عبر MCP. تفعيل المصادقة الثنائية خارج نطاق صلاحياتي.

### أين
Supabase Dashboard → مشروعك → **Authentication → Sign In / Up → Providers**

### ماذا تفعل بالضبط

1. **فعّل Email**:
   - `Authentication → Sign In / Up → Providers → Email`
   - فعّل الخيار **Confirm email**
   - فعّل **Enable email confirmations**
   - تأكد أن القالب `Confirm signup` مفعّل (لا تلمسه إن كان سليمًا)

2. **أنشئ حساب المسؤول**:
   - `Authentication → Users → Add user → Create new user`
   - Email: بريدك الإداري (مثال: `admin@aadala.ma`)
   - Password: كلمة مرور قوية (مولّدة، لا مُخترقة)
   - ✅ فعّل **Auto Confirm User**
   - ⚠️ **لا ترسل رابط التأكيد بالبريد** — الإنشاء اليدوي أسرع وأضمن

3. **فعّل 2FA (TOTP)**:
   - من صفحة المستخدم: **⋮ → Enable Two-Factor Authentication**
   - سيظهر **TOTP Secret** و **QR Code**
   - **احفظ السر في مدير كلمات مرور فورًا** — لن يُعرض مرة أخرى
   - امسح الـ QR بتطبيق المصادقة (Google Authenticator / 1Password / Aegis)
   - أدخل رمز التحقق للتأكيد

4. **اختبر**:
   - سجّل خروجًا، سجّل دخولًا، سيطلب رمز TOTP
   - جرّب **Backup code** — احفظه في مكان آمن
   - جرّب حذف رمز التحقق: يجب أن يُطلب الرمز الاحتياطي

5. **وثّق** (لا تضع السر في Git):
   - ضعه في **1Password / Bitwarden** أو **Keepass**
   - سجّل في `docs/ops/` فقط: *أين* хранится، *من يملكه*، *تاريخ آخر اختبار*
   - ❌ **لا تكتب السر في `docs/` ولا في `.dev.vars` ولا في أي commit**

### تحقّق من الاكتمال
- [ ] تسجيل الدخول يطلب رمز TOTP
- [ ] رمز احتياطي يعمل
- [ ] السر مخزّن خارج المستودع
- [ ] `docs/ops/admin-2fa.md` ينص على **من** و**أين** (بدون سر)

---

## الخطوة 2 — Supabase: RLS + roles (لتشغيل لوحة الإدارة)

> **ملاحظة:** `app/[locale]/admin/page.tsx` يستدعي `getSupabaseClient()` الذي يفحص
> `profiles.role` عبر RLS. **هذه الطبقة تحتاج الجداول والصلاحيات التالية.**

### أين
Supabase Dashboard → مشروعك → **SQL Editor → New query**

### الـ migration (جاهز في `supabase/migrations/20261115_admin_rls.sql`)

```sql
-- 1. تأكد أن الجدول موجود (أو أنشئه)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

-- 2. فعّل RLS
alter table public.profiles enable row level security;

-- 3. سياسات القراءة
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 4. سياسات التعديل — المدير فقط
drop policy if exists "Admins can update own profile" on public.profiles;
create policy "Admins can update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- 5. سياسات الجداول القانونية (مهم!)
drop policy if exists "Public read legal sources" on public.legal_sources;
create policy "Public read legal sources" on public.legal_sources
  for select using (true);

drop policy if exists "Admins manage legal sources" on public.legal_sources;
create policy "Admins manage legal sources" on public.legal_sources
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 6. ارفع دور المسؤول
insert into public.profiles (id, email, role)
select id, email, 'admin' from auth.users where email = 'admin@aadala.ma'
on conflict (id) do update set role = 'admin';

-- 7. تحقق
select id, email, role from public.profiles;
```

### تحقّق من الاكتمال
- [ ] `select role from profiles` يُرجع `admin` لحسابك
- [ ] نافذة SQL Editor تُرجع خطأ عند `insert into profiles` بحساب anon
- [ ] `/ar/admin` يعرض لوحة التحكم بعد تسجيل الدخول
- [ ] `/ar/admin` يعرض "لا تملك صلاحية الوصول" بدون تسجيل دخول

---

## الخطوة 3 — Cloudflare: ربط النطاق `aadala.ma`

### أين
Cloudflare Dashboard → حسابك → **Workers & Pages → aadala-ma → Settings → Domains & Routes**

### ماذا تفعل بالضبط

1. **أضف النطاق المخصص**:
   - `Triggers → Custom Domains → Add a domain`
   - Domain: `aadala.ma`
   - Cloudflare يطلب إضافة سجل CNAME
   - إذا كان النطاق على Cloudflare أصلاً: **سجل CNAME يُضاف تلقائياً**

2. **أضف `www`** (اختياري لكن مستحسن):
   - `www.aadala.ma` → نفس الـ worker
   - أضف إعادة توجيه `aadala.ma` → `www.aadala.ma` أو العكس (اختر واحدًا)

3. **حدّث `lib/site/config.ts`**:
   ```ts
   export const siteUrl = "https://aadala.ma";   // ← غيّر من workers.dev
   ```

4. **حدّث CSP في `next.config.ts`** (سطر `connect-src`):
   ```ts
   "connect-src 'self' https://pvoenvxinkipgpnddumt.supabase.co wss://pvoenvxinkipgpnddumt.supabase.co https://aadala.ma",
   ```
   وأضف النطاق الجديد إلى `img-src` إن استخدمته.

5. **حدّث `app/sitemap.ts`** — يعتمد على `siteUrl` تلقائيًا ✅ (تحقّق).

6. **حدّث robots.txt** — يعتمد على `siteUrl` تلقائيًا ✅ (تحقّق).

### تحقّق من الاكتمال
- [ ] `https://aadala.ma` يعرض الموقع
- [ ] الشهادة SSL صالحة ومُصدَرة تلقائيًا
- [ ] `curl -I https://aadala.ma` يعيد 200
- [ ] `siteUrl` في `lib/site/config.ts` = النطاق النهائي
- [ ] CSP يسمح بـ `aadala.ma`
- [ ] `sitemap.xml` يشير إلى `https://aadala.ma/...`
- [ ] `robots.txt` يشير إلى `https://aadala.ma/sitemap.xml`

---

## الخطوة 4 — Cloudflare: متغيرات البيئة

### أين
Cloudflare Dashboard → **aadala-ma → Settings → Variables and Secrets**

### ماذا تفعل

| الاسم | النوع | القيمة |
|-------|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Secret | `https://pvoenvxinkipgpnddumt.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Secret | anon/public key من Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | service role key — **لا تُستخدم في المتصفح** |

⚠️ **لا تضع `SUPABASE_SERVICE_ROLE_KEY` في `NEXT_PUBLIC_*`** — هذه بادئة تجعلها
تُحزَم في حزمة المتصفح. **خطأ أمني.**

- [ ] تحقّق أن `NEXT_PUBLIC_SUPABASE_ANON_KEY` هو المفتاح العام فعلًا
- [ ] `SUPABASE_SERVICE_ROLE_KEY` سريّ
- [ ] أعد تشغيل الـ worker بعد الإضافة (Deployments → Redeploy)

---

## الخطوة 5 — Google Search Console

### أين
[search.google.com/search-console](https://search.google.com/search-console)

### ماذا تفعل

1. **أضف نوع الموقع**: `Domain` → `aadala.ma` (شامل كل النطاقات الفرعية)

2. **تحقّق من الملكية** — اختر تبويب **DNS**:
   - يعرض Cloudflare سجل **TXT** باسم `@`
   - **أضفه في Cloudflare**: DNS → Records → Add record → Type `TXT` → Name `@`
   - ارجع واضغط **Verify**

   أو تبويب **File**: أنشئ `aadala-ma-verification.html` في `public/`
   (بالمحتوى الذي يعرضه Google)، ثم ارفعه.

3. **أرسل sitemap**:
   - `Sitemaps` → `aadala.ma/sitemap.xml`
   - يجب أن يظهر بحالة **Success**
   - عدد الروابط المتوقع: **390** (10 لغات × 39 صفحة)

4. **راجع تقرير تغطية الفهرسة**:
   - بعد 3-7 أيام: `Pages → Indexing`
   - الهدف: كل الصفحات `/ar/*` مفهرسة
   - أي صفحة "Discovered but not indexed" → راجع السبب

### تحقّق من الاكتمال
- [ ] الملكية موثّقة
- [ ] sitemap حالته Success
- [ ] عدد الروابط > 380
- [ ] `/ar` و `/ar/knowledge` و `/ar/legal` في تقرير الصفحات المفهرسة

---

## الخطوة 6 — Bing Webmaster Tools

### أين
[bing.com/webmasters](https://www.bing.com/webmasters)

### ماذا تفعل

1. **أضف الموقع** → `aadala.ma`
2. **تحقّق** بنفس طريقة DNS (سجل TXT باسم `@`) — أو **ارفع الملف**
   `BingSiteAuth.xml` إلى `public/`
3. **أرسل sitemap**: `Sitemaps → Add sitemap` → `https://aadala.ma/sitemap.xml`
4. **اربطه بـ Google Search Console** (إعداد واحد بدل اثنين):
   - في Google Search Console → `Settings → Users and permissions → Users`
   - أو استخدم `bing.com/webmasters` → `Import from GSC`

### تحقّق من الاكتمال
- [ ] الموقع موثّق
- [ ] sitemap مقبول
- [ ] لا أخطاء في الفهرسة

---

## الخطوة 7 — Supabase: جداول pgvector (الطبقة الدلالية)

### لماذا
Currently البحث = BM25 (مطابقة حرفية). يظهر `الشركات التجارية` → 0 نتيجة في 39.08
(وهذا صحيح)، لكن سؤالًا طبيعيًا مثل « كيف أشتري عقارًا بالمشاركة » لن يُطابق.
**pgvector يضيف التشابه الدلالي.**

### أين
Supabase Dashboard → **SQL Editor**

### الـ migration (جاهز في `supabase/migrations/20261116_pgvector.sql`)

```sql
-- 1. فعّل الامتداد
create extension if not exists vector with schema extensions;

-- 2. جدول التضمينات
create table if not exists public.legal_chunks (
  id bigserial primary key,
  law text not null,                 -- '39.08' | '31.08' | ...
  article_label text,                -- '298'
  section text,
  body text not null,
  embedding extensions.vector(1024), -- dims = 1024 (multilingual-e5-large)
  source_url text,
  sha256 text,
  created_at timestamptz not null default now()
);

-- 3. الفهرس (HNSW — الأسرع للاستعلام الشبيه)
create index if not exists legal_chunks_embedding_idx
  on public.legal_chunks
  using hnsw (embedding extensions.vector_cosine_ops);

-- 4. البحث الدلالي
create or replace function public.match_legal_chunks(
  query_embedding extensions.vector(1024),
  match_threshold float default 0.5,
  match_count int default 10,
  filter_law text default null
)
returns table (
  id bigint,
  law text,
  article_label text,
  section text,
  body text,
  source_url text,
  similarity float
)
language sql stable as $$
  select
    c.id, c.law, c.article_label, c.section, c.body, c.source_url,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.legal_chunks c
  where 1 - (c.embedding <=> query_embedding) > match_threshold
    and (filter_law is null or c.law = filter_law)
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

-- 5. RLS — القراءة عامة، الكتابة للمدير فقط
alter table public.legal_chunks enable row level security;

drop policy if exists "Public read legal chunks" on public.legal_chunks;
create policy "Public read legal chunks" on public.legal_chunks
  for select using (true);

drop policy if exists "Admins manage legal chunks" on public.legal_chunks;
create policy "Admins manage legal chunks" on public.legal_chunks
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
```

### ملاحظة على الأبعاد
`1024` يفترض `intfloat/multilingual-e5-large` أو `multilingual-e5-base`.
إن اخترت نموذجًا بأبعاد أخرى، غيّر **كل** المواضع:
`vector(1024)` في الجدول، في الفهرس، وفي الدالة.

### التحقق
- [ ] `create extension vector` نجح
- [ ] الجدول أُنشئ
- [ ] الفهرس HNSW أُنشئ
- [ ] الدالة `match_legal_chunks` أُنشئت
- [ ] RLS مفعّل (استعلام anon يُرجع 0 صف، بعد INSERT)

### بعد ذلك — تعبئة التضمينات
هذا **ليس** ضمن الـ migration (يحتاج مفتاح API خارجي):
```bash
# يُنفّذ محليًا، المفتاح في .dev.vars ولا يُرفع
python scripts/legal-pipeline/embed_chunks.py \
  --input docs/legal-intelligence/extracted/MDE_39-08_droits_reels_articles.json \
  --model intfloat/multilingual-e5-large \
  --batch-size 8
```
**540 مادة فقط** — المدة Expectée: ~20 دقيقة على CPU، ~3 دقائق على GPU.

---

## الخطوة 8 — Cloudflare: النشر إلى الإنتاج (بعد المراجعة)

> ⛔ **لا تنفّذ قبل موافقتي الصريحة على المراجعة.**

### بوابة المراجعة المطلوبة

| البوابة | الحالة |
|---------|--------|
| `npm run lint` | 0 أخطاء ✅ |
| `npm run typecheck` | نظيف ✅ |
| `npm run test` | 124/124 ✅ |
| `npm run design:contrast` | 0 إخفاقات ✅ |
| `npm run cf:build` | 488 صفحة ✅ |
| مراجعة قانونية للـ540 مادة | 30/30 عينة مطابقة ✅ |
| مراجعة فقهية لمحرك MIYAR | ⏳ **مطلوبة من مختص** |
| مراجعة الـ migration (RLS + pgvector) | ⏳ **مطلوبة منك** |

### الأمر (لا تُنفّذه الآن)

```bash
npm run cf:build
npx wrangler deploy
```

⚠️ **انتبه:** `open-next.config.ts` يجب أن يكون في وضع الإنتاج. راجع
`git diff` قبل النشر — المشروع يستخدم تجاوزًا مؤقتًا للملف أثناء النشر.

### بعد النشر
- [ ] `https://aadala.ma` يعمل
- [ ] `https://aadala-ma.cheraimmohamed20.workers.dev` ما زال يعمل (النسخة القديمة)
- [ ] سجّل الـ Version ID الجديد
- [ ] تحقق من `/ar/knowledge` و `/ar/miyar` و `/ar/search`

---

## ترتيب الأولوية الموصى به

| الترتيب | الخطوة | لماذا أولًا |
|---------|--------|-------------|
| **1** | الخطوة 2 (RLS) | **حجب حماية** — لوحة الإدارة تُعرض بلا حماية الآن |
| **2** | الخطوة 1 (2FA) | حماية حساب المدير |
| **3** | الخطوة 3 (النطاق) | SEO + الهوية |
| **4** | الخطوة 4 (متغيرات البيئة) | يلزم لـ Supabase في الإنتاج |
| **5** | الخطوة 5+6 (Search Console / Bing) | بعد استقرار النطاق |
| **6** | الخطوة 7 (pgvector) | تحسين الجودة — لا يعطّل شيئًا |
| **7** | الخطوة 8 (النشر) | **الأخير** — بعد كل المراجعات |

---

## سجل التنفيذ

| الخطوة | من | التاريخ | النتيجة |
|--------|-----|---------|---------|
| | | | |

---

**تنبيه:** لا يوجد في هذه الوثيقة أي سر. كل القيم الحساسة تُطلب في الـ Dashboard
وتُخزَّن في مدير كلمات مرور. لا تُرفع أي `.dev.vars` إلى Git — `.gitignore` يغطيها.
