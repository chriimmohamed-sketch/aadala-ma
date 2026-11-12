(() => {
"use strict";
const data=window.LegalContent, input=document.getElementById("dbSearch"), select=document.getElementById("dbCategory"), body=document.getElementById("dbResults");
const count=document.getElementById("dbCount"), total=document.getElementById("dbTotal"), incomplete=document.getElementById("dbIncomplete"), status=document.getElementById("dbStatus");
if(!data||!Array.isArray(data.texts)||!input||!select||!body){if(status)status.textContent="تعذر تحميل قاعدة البيانات القانونية.";return;}
const records=data.texts;
const categories=typeof LegalEncyclopedia!=="undefined"&&Array.isArray(LegalEncyclopedia.categories)?LegalEncyclopedia.categories:[];
const norm=v=>String(v??"").normalize("NFKC").toLocaleLowerCase("ar").replace(/[\u064B-\u065F\u0670\u0640]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/\s+/g," ").trim();
const incompleteRecord=x=>[x.number,x.date].some(v=>!v||/[?]|غير محدد|غير متوفر/i.test(String(v)));
const make=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=String(text);return e;};
categories.forEach(c=>{const o=make("option",c.name);o.value=c.id;select.append(o);});
function render(){
const q=norm(input.value),cat=select.value;
const hits=records.filter(x=>(!cat||x.category===cat)&&(!q||norm([x.title,x.titleFr,x.type,x.number,x.date,x.status,x.source,x.summary].join(" ")).includes(q)));
body.replaceChildren();
if(!hits.length){const tr=make("tr"),td=make("td",q?"لا توجد نتائج مطابقة.":"لا توجد سجلات في قاعدة البيانات.");td.colSpan=7;tr.append(td);body.append(tr);}
hits.forEach(x=>{
const tr=make("tr"),title=make("td"),strong=make("span",x.title||"مرجع دون عنوان");strong.className="db-title";title.append(strong);
if(x.titleFr)title.append(make("small",x.titleFr));
tr.append(title,make("td",x.type),make("td",x.number),make("td",x.date),make("td",x.status?("مسجلة: "+x.status):"غير محددة"));
const source=make("td");
try{const u=new URL(x.url);if(u.protocol==="https:"){const a=make("a","فتح المصدر");a.href=u.href;a.target="_blank";a.rel="noopener noreferrer";source.append(a)}else source.textContent="غير متوفر"}catch{source.textContent="غير متوفر"}
tr.append(source);
const warning=make("td",incompleteRecord(x)?"حقول تحتاج إلى مراجعة":"لم يُجرِ هذا الفهرس تحققاً مستقلاً من النفاذ");
warning.className="db-warning";tr.append(warning);body.append(tr);
});
if(count)count.textContent=String(hits.length);
if(total)total.textContent=String(records.length);
if(incomplete)incomplete.textContent=String(records.filter(incompleteRecord).length);
if(status)status.textContent="تُعرض "+hits.length+" من أصل "+records.length+" سجلاً وصفياً. لا تعتبر النتائج شهادة رسمية على الوضع القانوني للنص.";
}
input.addEventListener("input",render);select.addEventListener("change",render);
const params=new URLSearchParams(location.search);if(params.get("q"))input.value=params.get("q").slice(0,160);
render();
})();