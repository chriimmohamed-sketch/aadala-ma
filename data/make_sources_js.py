import json

d = json.load(open('data/legal-sources/index.json', encoding='utf-8'))
js = '// Generated sources database (uploaded PDFs)\n'
js += 'const SourcesDB = ' + json.dumps(d, ensure_ascii=False, indent=2) + ';\n'
js += 'if (typeof window !== "undefined") window.SourcesDB = SourcesDB;\n'
open('assets/js/sources-db.js', 'w', encoding='utf-8').write(js)
print('wrote assets/js/sources-db.js')
