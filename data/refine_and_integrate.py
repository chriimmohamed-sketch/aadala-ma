import json, os

base = 'data/legal-sources'
idx_path = os.path.join(base, 'index.json')
d = json.load(open(idx_path, encoding='utf-8'))

refinements = {
    'constitution-marocaine-2011-ar': {
        'title': 'دستور المملكة المغربية 2011',
        'number': '1-11-91',
        'date': '2011-07-29',
        'category': 'constitution',
        'status': 'نافذ (مرجع دستوري) — تحقق من النص المنشور',
        'note': 'نسخة PDF مرفوعة. المرجع الرسمي: الجريدة الرسمية عدد 5964 مكرر.'
    },
    'bo-7437-ar': {
        'title': 'الجريدة الرسمية — عدد 7437 (نسخة عربية)',
        'type': 'bulletin_officiel',
        'number': '7437',
        'category': 'gazette',
        'status': 'مرفوع — يتطلب تحديد تاريخ النشر والمحتويات',
        'note': 'عدد من الجريدة الرسمية. يلزم استخراج البيانات (التاريخ، النصوص الواردة) والتحقق.'
    },
    'loi-onc-ar': {
        'title': 'قانون الالتزامات والعقود (DOC) — صيغة محينة 2019',
        'type': 'loi',
        'number': None,
        'date': '1913-08-12',
        'category': 'civil',
        'status': 'مرفوع — تحقق مطلوب من التعديلات',
        'note': 'الملف المرفوع 4_ONC_Law_ar-MA.pdf هو قانون الالتزامات والعقود (صيغة محينة بتاريخ 26 أغسطس 2019) وليس وثيقة ONC.'
    },
    'code-penal-maroc': {
        'title': 'مجموعة القانون الجنائي',
        'number': '1-59-413',
        'date': '1962-11-26',
        'category': 'penal',
        'status': 'مرفوع — تحقق من آخر التعديلات والنص الموحد',
        'note': 'نسخة PDF مرفوعة (وزارة العدل — مديرية التشريع). يجب التحقق من تاريخ النسخة والتعديلات اللاحقة.'
    },
    'dahir-immatriculation-fonciere': {
        'title': 'ظهير التحفيظ العقاري',
        'category': 'droits_reels',
        'status': 'مرفوع — تحقق من المرجع/التاريخ والصيغ المعدلة',
        'note': 'نسخة PDF مرفوعة لظهير التحفيظ العقاري. يلزم تدقيق المرجع الكامل والتعديلات.'
    },
    '39-08-code-droits-reels': {
        'title': 'مدونة الحقوق العينية (القانون رقم 39.08)',
        'number': '39.08',
        'date': '2011-11-22',
        'category': 'droits_reels',
        'status': 'مرفوع — تحقق من التطابق مع النص المنشور'
    },
    '39-08-code-droits-reels-1': {
        'title': 'مدونة الحقوق العينية (39.08) — نسخة مكررة',
        'number': '39.08',
        'category': 'droits_reels',
        'status': 'مرفوع (مكرر)'
    },
    'code-droits-reels': {
        'title': 'مدونة الحقوق العينية — نسخة',
        'number': '39.08',
        'category': 'droits_reels',
        'status': 'مرفوع — تحقق'
    },
    'code-droits-reels-2': {
        'title': 'مدونة الحقوق العينية — نسخة',
        'number': '39.08',
        'category': 'droits_reels',
        'status': 'مرفوع — تحقق'
    },
}

for doc in d['documents']:
    if doc['id'] in refinements:
        doc.update(refinements[doc['id']])

with open(idx_path, 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

js = '// Generated sources database (uploaded PDFs)\n'
js += 'const SourcesDB = ' + json.dumps(d, ensure_ascii=False, indent=2) + ';\n'
js += 'if (typeof window !== "undefined") window.SourcesDB = SourcesDB;\n'
open('assets/js/sources-db.js', 'w', encoding='utf-8').write(js)
print('refined and regenerated')
