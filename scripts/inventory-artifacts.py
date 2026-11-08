#!/usr/bin/env python3
"""
scripts/inventory-artifacts.py
جرد آلي لكل مرفقات AADALA في Downloads مقابل القانوني الحالي aadala-ma/
ينتج docs/INVENTORY.md (لا يغيّر أي كود إنتاجي)
"""
import hashlib
import os
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import date

DOWNLOADS = Path(r"C:\Users\Mohamed Chraim\Downloads")
CANON = Path(r"C:\Users\Mohamed Chraim\Downloads\CHRVVIM_Campus_CREATIVE_UPGRADE_CLOUDFLARE\aadala-ma")
OUT = CANON / "docs" / "INVENTORY.md"
SKIP_DIRS = {"node_modules", ".next", ".git", ".open-next", "out"}

def sha256_bytes(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()[:12]

def canonical_files() -> dict[str, int]:
    out = {}
    for root, dirs, files in os.walk(CANON):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            p = Path(root) / f
            rel = p.relative_to(CANON).as_posix()
            try:
                out[rel] = p.stat().st_size
            except OSError:
                out[rel] = 0
    return out

def norm_entry(name: str) -> str:
    n = name.replace("\\", "/").strip()
    while n.startswith("./"):
        n = n[2:]
    parts = n.split("/")
    # إسقاط مجلد علوي وحيد شائع (aadala-ma/, aadala-ma-main/, ...)
    if len(parts) > 1 and parts[0].lower().startswith("aadala"):
        return "/".join(parts[1:])
    return n

def read_title(html_path: Path) -> str:
    try:
        with open(html_path, encoding="utf-8", errors="ignore") as fh:
            head = fh.read(8192)
    except OSError as e:
        return f"غير قابل للقراءة ({e})"
    import re
    m = re.search(r"<title[^>]*>(.*?)</title>", head, re.I | re.S)
    if m:
        return re.sub(r"\s+", " ", m.group(1)).strip()[:120]
    return "(بدون title)"

def parse_docx(path: Path) -> list[str]:
    paras: list[str] = []
    try:
        with zipfile.ZipFile(path) as z:
            xml = z.read("word/document.xml")
        ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
        root = ET.fromstring(xml)
        for p in root.findall(".//w:p", ns):
            text = "".join(t.text or "" for t in p.findall(".//w:t", ns)).strip()
            if text:
                paras.append(text)
    except Exception as e:
        return [f"تعذّر تحليل docx: {e}"]
    return paras

def classify_zip(name: str, entries: list[str], size: int) -> tuple[str, str]:
    low = name.lower()
    if "design-unifier" in low:
        return ("بقع تصميم", "مدمج أصلًا — `scripts/unify-design.mjs + design/tokens.json`؛ تحقق عبر `npm run design:check`. لا تُعيد استيراده.")
    if "repair" in low:
        return ("حزمة إصلاح", "مرجع للتحقق من `script-close/burglary/founder` فقط؛ لا تُشغّل `apply-all-fixes` المدمّرة.")
    if "patch" in low or "changes" in low:
        return ("بقعة ترقيع", "قارن `diff` ملفًا ملفًا؛ خذ ما نجح في `apply-safe-fixes.mjs` وارفض حذف المصادقة.")
    if "miyar" in low or "search-ai" in low or "new-home" in low or "hardened" in low or "master" in low:
        return ("فرع ميزة/لقطة", "فروع تاريخية — استخرج الفرق الفريد فقط إن وُجد، ولا تستبدل القانوني الحالي.")
    if "main" in low or "ultimate" in low or "backup" in low:
        return ("لقطة كاملة", "مرجع للاسترداد/المقارنة — لا تُنشر؛ القانوني الحالي أحدث وأصح.")
    if size < 50_000:
        return ("بقعة صغيرة", "راجع `diff` قبل أي دمج.")
    return ("لقطة/فرع", "قارن بصمت — درجات التشابه العالية تعني لا قيمة مضافة.")

def main():
    canon = canonical_files()
    # تعريف المرفقات المطلوبة في المهمة + ما رُصد في Downloads
    artifacts = []
    for pat in ["aadala*.zip", "AADALA*.zip"]:
        artifacts.extend(sorted(DOWNLOADS.glob(pat)))
    # إزالة تكرار حساسية الحالة
    seen = set()
    uniq = []
    for p in artifacts:
        k = p.name.lower()
        if k not in seen:
            seen.add(k)
            uniq.append(p)
    artifacts = uniq

    others = [
        DOWNLOADS / "AADALA.MA — عرض إبداعي.html",
        DOWNLOADS / "AADALA.MA — الصفحة الرئيسية.html",
        DOWNLOADS / "AADALA.MA — الصفحات.html",
        DOWNLOADS / "Nour — استوديو رقمي _ محمد شرايم.html",
        DOWNLOADS / "أفكار ميزات جديدة لمنصة عدالة (AADALA.MA).docx",
        DOWNLOADS / "chriimmohamed-sketch-aadala-ma-8a5edab282632443.txt",
        DOWNLOADS / "diagram.png",
    ]

    lines: list[str] = []
    lines.append("# جرد مرفقات AADALA — INVENTORY")
    lines.append("")
    lines.append(f"التاريخ: {date.today().isoformat()}  ")
    lines.append("القانوني الحالي: `aadala-ma/` (فرع `fix/comprehensive-cleanup`). هذا الجرد قراءة فقط — لا يعدّل أي كود إنتاجي.")
    lines.append("")
    lines.append("## ملخص تنفيذي")
    lines.append("")
    lines.append("- **مصدر الحقيقة الوحيد:** `aadala-ma/` الحالي — لا يُستبدل بأي zip.")
    lines.append("- **مخطط `diagram.png`:** مواصفة معمارية صالحة — أبقه `ADR`، يطابق الوحدات الحالية.")
    lines.append("- **تصميم:** `AADALA.MA — *.html` نماذج فقط — قيمتها عبر `design/tokens.json` لا نشرها.")
    lines.append("- **`Nour — استوديو رقمي`:** خارج النطاق القانوني — اعزل تمامًا.")
    lines.append("")

    lines.append("## 1) أرشيفات ZIP في Downloads")
    lines.append("")
    lines.append("| الأرشيف | الحجم | الملفات | فريدة عن القانوني* | التصنيف | الحكم |")
    lines.append("|---|---|---|---|---|---|")
    for zp in artifacts:
        try:
            with zipfile.ZipFile(zp) as z:
                names = [i.filename for i in z.infolist() if not i.is_dir()]
                infos = z.infolist()
                tot = sum(i.file_size for i in infos)
        except Exception as e:
            lines.append(f"| `{zp.name}` | غير قابل للقراءة | — | — | — | خطأ: {e} |")
            continue
        size = zp.stat().st_size
        normed = [norm_entry(n) for n in names]
        unique = sorted({n for n in normed if n and n not in canon})
        # عينة فريدة (حتى 12)
        sample = ", ".join(unique[:12]) + (" …" if len(unique) > 12 else "")
        cat, verdict = classify_zip(zp.name, normed, size)
        lines.append(f"| `{zp.name}` | {size/1024:.1f} KB<br>({tot/1024:.0f} KB مفكوكة) | {len(names)} | {len(unique)}<br>{sample} | {cat} | {verdict} |")

    lines.append("")
    lines.append("*الفريدة = مسار نسبي لا يوجد في `aadala-ma/` اليوم (باستثناء `node_modules/.next`). نسبة عالية لا تعني قيمة — غالبًا لقطة قديمة قبل إضافات `showcase/student/legal-db`.*")
    lines.append("")

    lines.append("## 2) ملفات HTML المفردة")
    lines.append("")
    lines.append("| الملف | الحجم | `<title>` | المقابل الحالي | الحكم |")
    lines.append("|---|---|---|---|---|")
    canon_html = sorted(k for k in canon if k.endswith(".html"))
    canon_html_str = ", ".join(canon_html[:15]) + (" …" if len(canon_html) > 15 else "")
    for h in others[:4]:
        if not h.exists():
            lines.append(f"| `{h.name}` | مفقود | — | — | لا شيء |")
            continue
        title = read_title(h)
        size = h.stat().st_size
        if "Nour" in h.name:
            verdict = "خارج نطاق العدالة — اعزل؛ لا تدمج في المنصة القانونية."
        elif "عرض إبداعي" in h.name or "الصفحة الرئيسية" in h.name or "الصفحات" in h.name:
            verdict = "نموذج تصميم — استخرج الألوان/الإحساس عبر `tokens.json` فقط."
        else:
            verdict = "راجع قبل الاستخدام."
        lines.append(f"| `{h.name}` | {size/1024:.1f} KB | {title} | الحالي فيه ({len(canon_html)} HTML): {canon_html_str} | {verdict} |")
    lines.append("")

    lines.append("## 3) أفكار الميزات (docx)")
    lines.append("")
    docx = others[4]
    # بحث بديل باسم قريب إن لم يوجد بالاسم الحرفي
    if not docx.exists():
        cands = list(DOWNLOADS.glob("أفكار*.docx"))
        docx = cands[0] if cands else docx
    if docx.exists():
        paras = parse_docx(docx)
        lines.append(f"الملف: `{docx.name}` — {docx.stat().st_size/1024:.1f} KB — {len(paras)} فقرة مستخرجة.")
        lines.append("")
        for i, p in enumerate(paras[:60], 1):
            lines.append(f"{i}. {p[:240]}")
        if len(paras) > 60:
            lines.append(f"… (+{len(paras)-60} فقرة)")
        lines.append("")
        lines.append("**تصنيف مقترح:** صنّف كل فكرة `P0/P1/P2` تحت قيود (بلا اختلاق، مصادر موثقة، RBAC) — نفّذ واحدة `P0` فقط لكل دورة مع بوابة الجودة.")
    else:
        lines.append("ملف docx غير موجود بالاسم المتوقع — راجع أسماء Downloads العربية.")
    lines.append("")

    lines.append("## 4) ملف النص (txt)")
    lines.append("")
    txt = others[5]
    if txt.exists():
        try:
            prev = txt.read_text(encoding="utf-8", errors="ignore")[:3000]
        except OSError as e:
            prev = f"غير قابل للقراءة: {e}"
        lines.append(f"الملف: `{txt.name}` — {txt.stat().st_size/1024:.1f} KB.")
        lines.append("")
        lines.append("```text")
        lines.append(prev.strip()[:2000])
        lines.append("```")
        lines.append("")
        lines.append("**الحكم:** فهرس/مجلد على الأرجح — استعمله للتحقق من التكرار (checksum) لا كمصدر محتوى قانوني.")
    else:
        lines.append("ملف txt غير موجود.")
    lines.append("")

    lines.append("## 5) المخطط (diagram.png)")
    lines.append("")
    lines.append("| الوحدة | المكونات | الحكم |")
    lines.append("|---|---|---|")
    lines.append("| Legal Tools | `miyar/engine+family-code+fraction`، `criminal/real-estate analyzer` | مطابقة للحالي — أبقه |")
    lines.append("| Legal AI | `ai/page → api/route → rate-limit + retrieval + provider` | مطابقة — أبقه (RAG + مصادر) |")
    lines.append("| Guidance & Learning | `procedures/legal-services/drafts`، `academic`، `sharia` | مطابقة — أبقه |")
    lines.append("| Legal Knowledge | `case-law/search`، `legal`، `search/page` | مطابقة — أبقه (الاجتهاد فارغ موثّق) |")
    lines.append("| Shared Interface | `home/Zellige/Footer/Header/Theme/Locale` | مطابقة — أبقه |")
    lines.append("")

    lines.append("## 6) التوصية النهائية — كيف تحصل على أفضل نسخة")
    lines.append("")
    lines.append("1. **جمّد الحالي:** `git tag aadala-0.2.1` على `fix/comprehensive-cleanup` وادفعه.")
    lines.append("2. **وحّد التصميم:** `npm run design:audit → design:fix → design:check` — كل لون جديد عبر `tokens.json`.")
    lines.append("3. **ميزة واحدة `P0`** من docx في المرة (مع مصدر/اختبار) — الباقي backlog.")
    lines.append("4. **بوابة ثابتة قبل أي نشر:** `npm run lint && npm run typecheck && npm run test && npm run build && npm run design:check && npm run legal:ingest`.")
    lines.append("5. **لا تستورد** أي zip جملةً؛ لا تحذف المصادقة/الحِزم؛ لا تنشر نماذج `AADALA.MA — *.html` بنفسها.")
    lines.append("")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
    print(f"Canonical files: {len(canon)} | Zips: {len(artifacts)}")

if __name__ == "__main__":
    main()
