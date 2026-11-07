# AADALA.MA — Quality Gate

لا يُعتبر المشروع جاهزاً للإطلاق إلا إذا اجتاز كل البنود التالية.

## Checklist

1. ✅ نجاح البناء (npm run build).
2. ✅ نجاح الاختبارات الوحدوية (npm run test).
3. ⚠️ اختبارات التكامل (API/DB) — قيد التطوير.
4. ⚠️ فحص واجهات API (contract tests) — قيد التطوير.
5. ⚠️ اختبار الواجهة على الهاتف — يدوي/Playwright (قيد).
6. ⚠️ اختبار RTL/LTR — يدوي (قيد).
7. ⚠️ إمكانية الوصول (a11y) — قيد.
8. ⚠️ اختبار الصلاحيات (RBAC) — قيد (auth غير منفذ).
9. ✅ اختبارات MIYAR المرجعية (4 pass).
10. ⚠️ التحقق من الإحالات (AADALA AI) — retrieval only; requires source verification.
11. ⚠️ اختبار النسخ الاحتياطي/الاستعادة — قيد.
12. ✅ تقرير final (QUALITY_GATE.md + SECURITY_AUDIT.md).

## Commands
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run quality:gate` (runs all above)

## Rule
- لا إخفاء للاختبارات الفاشلة.
- لا نتائج افتراضية.