# Coolify — منصة استضافة مفتوحة المصدر (PaaS)

بديل مجاني وقوي لـ Vercel/Heroku/Netlify. تمتلك VPS خاصاً وتستضيف عليه تطبيقاتك وقواعد بياناتك
عبر لوحة تحكم أنيقة، مع سيطرة كاملة على البنية التحتية.

## متطلبات
- سيرفر Linux (Ubuntu/Debian/CentOS)
- RAM ≥ 2 GB
- اتصال SSH

## تثبيت Coolify
```bash
ssh root@your_server_ip
sudo apt update && sudo apt upgrade -y
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```
لوحة التحكم: http://<IP>:8000 (أنشئ حساب Admin فوراً).

## نشر AADALA-MA على Coolify
1. في Coolify: اختر Localhost أو أضف سيرفراً.
2. اربط حساب GitHub.
3. اختر المستودع `aadala-ma` (فرع main).
4. Coolify يكتشف `Dockerfile` تلقائياً (multi-stage, Node 24, standalone).
5. أضف متغيرات البيئة (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, AI_PROVIDER_API_KEY إن وُجد).
6. اربط النطاق + Let's Encrypt (HTTPS تلقائي).
7. Deploy.

## التحقق
```bash
docker ps   # خدمات Coolify
```

## ملاحظة
AADALA-MA now ships a `Dockerfile` + `.dockerignore` (output: standalone) for Coolify/Docker deployment.
For Cloudflare Workers (current production), use `scripts/deploy.ps1` instead.
