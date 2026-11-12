(() => {
"use strict";
const page=document.body?.dataset.legalReferencePage;
const data=window.LegalContent;
if(!page||!data||!Array.isArray(data.texts))return;
const map={
criminal:["code-penal-1962","code-procedure-penale-2002"],
inheritance:["moudawana-2004"],
procedures:["code-procedure-civile-1974","code-procedure-penale-2002","code-travail-2003","moudawana-2004"],
realEstate:["code-droits-reels-2011","doc-1913"],
legalAid:["constitution-2011","code-procedure-civile-1974","code-procedure-penale-2002","moudawana-2004","code-travail-2003","loi-31-08"]
};
const ids=map[page];if(!ids)return;
const records=ids.map(id=>data.texts.find(x=>x.id===id)).filter(Boolean);
const container=document.querySelector("main .container, .section .container");
if(!container||!records.length)return;
const section=document.createElement("section");section.className="card mt-3";section.setAttribute("aria-labelledby","relatedLegalHeading");
const heading=document.createElement("h2");heading.id="relatedLegalHeading";heading.textContent="المراجع التشريعية ذات الصلة";section.append(heading);
const note=document.createElement("p");note.className="text-muted text-sm";note.textContent="هذه إحالات إلى سجلات موجودة في فهرس المشروع بحسب موضوع الصفحة، وليست تأكيداً على النفاذ الحالي أو تحديداً حصرياً للنصوص الواجبة التطبيق.";section.append(note);
const list=document.createElement("ul");list.style.listStyle="none";list.style.display="grid";list.style.gap=".65rem";list.style.padding="0";
records.forEach(item=>{
const li=document.createElement("li"),a=document.createElement("a");
a.className="btn btn-outline btn-sm";a.href="encyclopedia.html?q="+encodeURIComponent(item.title);
a.textContent=item.title+" — "+(item.number||"الرقم غير مكتمل");
li.append(a);list.append(li);
});
section.append(list);
const link=document.createElement("a");link.className="btn btn-ghost btn-sm";link.href="database.html";link.textContent="فتح قاعدة البيانات القانونية";section.append(link);
container.append(section);
})();