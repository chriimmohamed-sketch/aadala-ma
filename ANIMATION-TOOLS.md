# خلّي موقعك يطلع كأنه عامله designer

Claude بيعرف يبني موقع، بس لحاله بيطلع صفحة عادية. هاي التلات أدوات (وبونص رابعة) كلها مجانية.

## الأدوات

### GSAP — مكتبة الـ animation
بتحرّك كل إشي بالموقع

- GitHub: https://github.com/greensock/GSAP
- الموقع: https://gsap.com
- التركيب: `npm install gsap`

### Lenis — الـ smooth scroll
بتخلّي الـ scroll ناعم

- GitHub: https://github.com/darkroomengineering/lenis
- الموقع: https://lenis.darkroom.engineering
- التركيب: `npm install lenis`

### React Bits — مكتبة animations جاهزة
أكتر من 200 component متحرك

- GitHub: https://github.com/DavidHDev/react-bits
- الموقع: https://reactbits.dev

### 21st.dev (بونص) — نفس الفكرة، مكتبة أكبر
آلاف الـ components والقوالب

- الموقع: https://21st.dev

## حطهم بـ Claude Code
```text
بدي أخلّي تصميم موقعي يطلع كأنه عامله designer. استعمل هدول التلات أدوات:
- GSAP مع ScrollTrigger للحركة
- Lenis للـ smooth scroll
- React Bits للـ components الجاهزة

ركّبهم بالمشروع، واربط Lenis مع الـ ticker تبع GSAP عشان يمشوا مع بعض.
1. عنوان الصفحة الرئيسية يظهر بـ [Blur Text] من React Bits
2. خلفية متحركة للـ hero من React Bits، مثلاً [Light Rays] بألوان موقعي
3. كل section يظهر بحركة ناعمة وقت الـ scroll
4. الأرقام تعدّ لحالها، والزر الأساسي بـ [Star Border]

خلّي الحركة هادية ومش مبالغ فيها، وما تغيّر النصوص ولا الألوان، واحترم prefers-reduced-motion.
```

## شغلات لازم تعرفها
- حركة وحدة بكل section بتكفي.
- GSAP و Lenis بيشتغلوا مع أي موقع. React Bits معمولة لـ React.
- GSAP و Lenis ببلاش حتى للشغل التجاري.

---
المصدر: دليل Loai Khalidi — 3 أدوات لموقعك
