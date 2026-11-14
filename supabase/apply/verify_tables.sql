-- ============================================================
-- AADALA.MA — VERIFY DATABASE STATE
-- Run in Supabase Dashboard → SQL Editor (project pvoenvxinkipgpnddumt)
-- Expected after applying 2026-11-11_pending_bundle.sql: 33 tables.
-- ============================================================

-- 1) كل الجداول الموجودة فعليًا
select tablename
from pg_tables
where schemaname = 'public'
order by tablename;

-- 2) ملخص: عدد الجداول الموجودة والمفقودة من القائمة المتوقعة
with expected(name) as (
  values
    ('articles'),('audit_logs'),('case_events'),('case_law'),('contract_audits'),
    ('document_templates'),('document_versions'),('entities'),('entity_article_mapping'),
    ('error_reports'),('generated_documents'),('gov_services'),('ingestion_jobs'),
    ('issue_article_mapping'),('laws'),('learning_courses'),('learning_lessons'),
    ('legal_documents'),('legal_issues'),('mandatory_clauses'),('notifications'),
    ('profiles'),('raw_documents'),('reference_answers'),('review_queue'),('sections'),
    ('sources'),('student_progress'),('tracked_cases'),('user_service_requests'),
    ('workspace_documents'),('workspace_members'),('workspaces')
),
present as (
  select tablename::text as name from pg_tables where schemaname = 'public'
)
select
  (select count(*) from expected where name in (select name from present)) as present_count,
  (select count(*) from expected where name not in (select name from present)) as missing_count,
  (select count(*) from expected) as expected_count,
  (select string_agg(name, ', ' order by name) from expected where name not in (select name from present)) as missing_tables;

-- 3) التحقق من سياسات RLS على جدول البلاغات (بعد 0014)
select schemaname, tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename = 'error_reports'
order by policyname;
