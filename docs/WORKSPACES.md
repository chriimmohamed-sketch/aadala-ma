# مساحات العمل (0009) — مخطط فقط

## المايغريشن
`supabase/migrations/0009_workspaces.sql` (تطبيق يدوي بعد `0001-0008` في SQL Editor).

جداول: `workspaces` (مالك/عضو) + `workspace_members` (دور `owner/admin/member/viewer`) + `workspace_documents` (أعضاء فقط).

## ما لم يُبنَ (متعمَّد)
لا واجهة ولا API ولا تعيين أدوار بعد — المخطط وحده لا ينشئ مساحات ولا يشارك وثائق.
