"use client";

import { useEffect } from "react";

const STEPS = [
  ["أدخل الورثة والتركة والديون", "تُوزَّع الأنصبة خطوة بخطوة", "راجع النتيجة مع مختص قبل أي اعتماد"],
  ["حدّد: محفّظ أم غير محفّظ", "تعرّف على الوثائق الناقصة", "اطّلع على الدعاوى الممكنة"],
  ["اختر واقعة للتمرين", "كيّفها قانونيًا وحدّد الأركان", "قارن إجابتك بالمسطرة"],
  ["اختر الإجراء المطلوب", "عدّل المسودة الجاهزة", "صدّرها بصيغة PDF"],
];

export default function HomeInteractions({ locale }: { locale: string }) {
  useEffect(() => {
    const d = document;
    const root = d.documentElement;
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Signature micro-interaction: a single, lightweight pointer aura.
    // It never runs on touch devices and respects reduced-motion.
    const hero = d.querySelector(".hero") as HTMLElement | null;
    const moveAura = (e: PointerEvent) => {
      if (!hero || e.pointerType === "touch") return;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
      hero.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    if (hero && !rm) hero.addEventListener("pointermove", moveAura, { passive: true });
    root.classList.add("js");

    // Progress bar
    const bar = d.getElementById("bar") as HTMLElement | null;
    const prog = () => {
      if (!bar) return;
      const h = d.documentElement.scrollHeight - innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
    };
    addEventListener("scroll", prog, { passive: true });
    prog();

    // Reveal
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    d.querySelectorAll(".rv").forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = ((i % 3) * 90) + "ms";
      io.observe(el);
    });

    // Parts highlight (sample always visible; clicking a step highlights it)
    const blks = Array.from(d.querySelectorAll(".blk")) as HTMLElement[];
    const btns = Array.from(d.querySelectorAll(".part")) as HTMLElement[];
    const show = (k: number) => {
      blks.forEach((b, i) => b.classList.toggle("on", i === k));
      btns.forEach((b, i) => b.setAttribute("aria-pressed", String(i === k)));
    };
    btns.forEach((b) => b.addEventListener("click", () => show(Number(b.dataset.k))));

    // Tool steps
    d.querySelectorAll(".tool").forEach((t, i) => {
      if (t.querySelector(".more")) return;
      const b = d.createElement("button");
      b.type = "button";
      b.className = "more";
      b.setAttribute("aria-expanded", "false");
      b.innerHTML = 'كيف تعمل؟ <span aria-hidden="true">+</span>';
      const ol = d.createElement("ol");
      ol.className = "steps";
      const steps = STEPS[i % STEPS.length];
      ol.innerHTML = "<li>" + steps.join("</li><li>") + "</li>";
      t.appendChild(b);
      t.appendChild(ol);
      b.addEventListener("click", () => {
        const o = t.classList.toggle("open");
        b.setAttribute("aria-expanded", String(o));
        const s = b.lastElementChild;
        if (s) s.textContent = o ? "−" : "+";
      });
    });

    // 3D tilt on cards
    if (!rm) {
      d.querySelectorAll(".book,.tool").forEach((el) => {
        const card = el as HTMLElement;
        card.addEventListener("pointermove", (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transition = "transform .12s";
          card.style.transform = "perspective(800px) rotateX(" + (-y * 8) + "deg) rotateY(" + (x * 10) + "deg) translateY(-6px)";
        });
        card.addEventListener("pointerleave", () => {
          card.style.transition = "";
          card.style.transform = "";
        });
      });
    }

    // Command palette (Ctrl+K / /)
    const items: [string, string, string][] = [
      ["المساعد القانوني", `/${locale}/ai`, "قسم"],
      ["المكتبة القانونية", `/${locale}/legal`, "قسم"],
      ["البحث في النصوص", `/${locale}/search`, "قسم"],
      ["حاسبة الميراث (MIYAR)", `/${locale}/miyar`, "أداة"],
      ["النزاعات العقارية", `/${locale}/property`, "أداة"],
      ["الاجتهاد القضائي", `/${locale}/case-law`, "قسم"],
      ["المختبر الجنائي", `/${locale}/criminal`, "أداة"],
      ["المساطر والنماذج", `/${locale}/procedures`, "أداة"],
      ["لوحة AADALA", `/${locale}/dashboard`, "قسم"],
      ["تبديل الوضع الداكن", "theme", "إجراء"],
    ];
    const dlg = d.createElement("dialog");
    dlg.className = "pal";
    dlg.setAttribute("aria-label", "انتقال سريع");
    dlg.innerHTML = '<input type="text" placeholder="إلى أين تريد الذهاب؟" aria-label="بحث" autocomplete="off"><ul role="listbox"></ul>';
    d.body.appendChild(dlg);
    const inp = dlg.querySelector("input") as HTMLInputElement;
    const ul = dlg.querySelector("ul") as HTMLUListElement;
    let cur = 0;
    let list = items;
    const paint = () => {
      ul.innerHTML = list.map((it, i) =>
        '<li role="option" aria-selected="' + (i === cur) + '" data-i="' + i + '">' + it[0] + "<small>" + it[2] + "</small></li>"
      ).join("") || "<li>لا نتيجة</li>";
    };
    const go = (it: [string, string, string] | undefined) => {
      if (!it) return;
      dlg.close();
      if (it[1] === "theme") {
        const dark = root.getAttribute("data-theme") === "dark";
        root.setAttribute("data-theme", dark ? "light" : "dark");
        try { localStorage.setItem("aadala-theme", dark ? "light" : "dark"); } catch { /* ignore */ }
      } else {
        location.href = it[1];
      }
    };
    const open = () => { list = items; cur = 0; inp.value = ""; paint(); dlg.showModal(); inp.focus(); };
    inp.addEventListener("input", () => {
      const v = inp.value.trim();
      list = items.filter((it) => it[0].indexOf(v) > -1);
      cur = 0;
      paint();
    });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); cur = Math.min(cur + 1, list.length - 1); paint(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); cur = Math.max(cur - 1, 0); paint(); }
      else if (e.key === "Enter") { e.preventDefault(); go(list[cur]); }
    });
    ul.addEventListener("click", (e) => {
      const li = (e.target as HTMLElement).closest("li");
      if (li && li.dataset.i) go(list[Number(li.dataset.i)]);
    });
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

    const kbd = d.getElementById("kbd");
    if (kbd) kbd.addEventListener("click", open);
    // Keep the sample answer meaningful on first paint.
    if (btns.length) show(0);

    const onKey = (e: KeyboardEvent) => {
      const t = (e.target as HTMLElement).tagName || "";
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (dlg.open) dlg.close(); else open();
      } else if (e.key === "/" && t !== "INPUT" && t !== "TEXTAREA" && !dlg.open) {
        e.preventDefault();
        open();
      }
    };
    addEventListener("keydown", onKey);

    return () => {
      removeEventListener("scroll", prog);
      removeEventListener("keydown", onKey);
      io.disconnect();
      dlg.remove();
      if (hero && !rm) hero.removeEventListener("pointermove", moveAura);
    };
  }, [locale]);

  return null;
}
