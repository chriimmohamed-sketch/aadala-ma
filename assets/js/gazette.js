(() => {
"use strict";
const data=window.LegalContent, input=document.getElementById("gazetteSearch"), body=document.getElementById("gazetteBody"), status=document.getElementById("gazetteStatus");
if(!data||!input||!body)return;
const records=Array.isArray(data.texts)?data.texts:[];
const norm=v=>String(v??"").normalize("NFKC").toLocaleLowerCase("ar").replace(/[\u064B-\u065F\u0670\u0640]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/\s+/g," ").trim();
const add=(row,value)=>{const td=document.createElement("td");td.textContent=value||"غير مسجل";row.append(td)};
function render(){
const q=norm(input.value), hits=records.filter(x=>norm([x.title,x.titleFr,x.type,x.number,x.date,x.status,x.source,x.summary].join(" ")).includes(q));
body.replaceChildren();
if(!hits.length){const tr=document.createElement("tr"),td=document.createElement("td");td.colSpan=6;td.className="text-muted text-center";td.textContent=q?"لا توجد مراجع تشريعية مطابقة.":"لا توجد أعداد رسمية مفهرسة حالياً.";tr.append(td);body.append(tr)}
hits.forEach(x=>{const tr=document.createElement("tr");add(tr,x.date);add(tr,x.number);add(tr,x.title);add(tr,x.type);add(tr,"بيانات وصفية فقط — ليست نسخة رسمية");const td=document.createElement("td");try{const u=new URL(x.url);if(u.protocol==="https:"){const a=document.createElement("a");a.href=u.href;a.target="_blank";a.rel="noopener noreferrer";a.textContent="بوابة المصدر";td.append(a)}else td.textContent="غير متوفر"}catch{td.textContent="غير متوفر"}tr.append(td);body.append(tr)});
["gTotal","gProcessed","gOCR","gPending"].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent="0"});
if(status)status.textContent=hits.length?"نتائج من فهرس المراجع التشريعية ("+hits.length+"). لا تمثل أعداداً مفهرسة من الجريدة الرسمية.":"لا تتوفر أعداد رسمية مفهرسة في قاعدة المشروع.";
}
input.addEventListener("input",render);
document.getElementById("gazetteSearchButton")?.addEventListener("click",render);
input.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();render()}});
render();
})();