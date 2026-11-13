# خدمات الحكومة (0010) — مخطط فقط

## المايغريشن
`supabase/migrations/0010_gov_services.sql` (تطبيق يدوي بعد `0001-0009` في SQL Editor).

جداول: `gov_services` (قراءة عامة) + `user_service_requests` (مالك فقط).

## لم تُزرع أي خدمة
عناوين/مزودون حكوميون (**لا تُختلَق أبدًا**) — أضف فقط `https` من نطاقات رسمية مُتحقق منها، وكل عنصر يحمل مصدره وتاريخ تحققه. لا واجهة ولا API بعد.

## بذور مُتحقق منها (`lib/gov/gov-gateway.ts`, 2026-11-09)
- `birth-certificate` — رسم ولادة — `https://www.watiqa.ma` (منصة وثيقة) — مُتحقق (قيد صيانة يوم التحقق لكن النطاق رسمي)
- `criminal-record` — بطاقة السجل العدلي — `https://casierjudiciaire.justice.gov.ma` (وزارة العدل)
