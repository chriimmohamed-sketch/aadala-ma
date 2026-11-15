# AADALA.MA — OMEGA REMAINING BACKLOG (formal open work register)

> Status: **NOT STARTED.** Listed for visibility only — nothing below is claimed as done.
> Owner review required before each batch lands in the live corpus.

## Priority 2 — القضاء والمؤسسات القضائية
- cspj.ma (المجلس الأعلى للسلطة القضائية) — اكتشاف شامل: اجتهاد، تقارير، التنظيم القضائي.
- cour-constitutionnelle.ma — الاجتهاد الدستوري النافذ (قبلية وبعدية) — يجب أن يُعرِض النظام التام.
- courdecassation.ma — محكمة النقض.
- pmp.ma — رئاسة النيابة العامة.
- mahakim.ma + juriscassation.cspj.ma — استعلام المنشورات العامة (JDK public corpus).

## Priority 3 — الأمن والحماية
- dgsn.gov.ma · gr.ma · interieur.gov.ma · protectioncivile.ma · dgapr.gov.ma
- NOT SCOPE: any non-public operational data — public bulletins only.

## Priority 4 — حقوق الإنسان والرقابة
- cndh.ma · mediateur.ma · courdescomptes.ma · inpplc.ma · conseil-concurrence.ma · cese.ma · cndp.ma · haca.ma

## Priority 5 — المهن والقطاعات
- marjii.justice.gov.ma (المهن القانونية والقضائية) · المفوضون القضائيون · الموثقون · العدول · الخبراء · التراجمة
- ancfcc.gov.ma (التحفيظ) · ompic.ma (الملكية الفكرية) · cnss.ma · finances.gov.ma · ministers sectoriels

## Cross-cutting engineering
- PDF ingestion → Article-aware chunker (law number + article number + source preservation)
- RAG index rebuild on verified corpus with verification levels (A/B/C/D/X)
- AADALA KNOWLEDGE CORE schema in Postgres via migration 0019+ (requires owner SQL-Editor — MCP is read-only)
- OCR for scanned BO PDFs (Tesseract/managed service decision pending)
- Monitoring Dashboard (discover/verified/failed counters → /ar/admin or internal page)
