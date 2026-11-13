# الإشعارات (0008) — مخطط فقط

## المايغريشن
`supabase/migrations/0008_notifications.sql` (تطبيق يدوي بعد `0001-0007` في SQL Editor).

جدول `notifications` بملكية المستخدم فقط (`read/archived`) — لا UI/API بعد.

ملاحظة: `is_read` بدل `read` (الأخيرة محجوزة جزئيًا في SQL).
