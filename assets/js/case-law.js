(() => {
"use strict";
const input=document.getElementById("caseSearch"), filter=document.getElementById("courtFilter"), body=document.getElementById("casesBody"), status=document.getElementById("caseStatus");
if(!input||!body)return;
function render(){
body.replaceChildren();const tr=document.createElement("tr"),td=document.createElement("td");td.colSpan=6;td.className="text-muted text-center";td.textContent="لا توجد حالياً قرارات قضائية موثقة ومفهرسة داخل قاعدة المشروع. لم يتم إنشاء نتائج افتراضية.";tr.append(td);body.append(tr);
if(status)status.textContent=(input.value.trim()||filter?.value)?"تم تسجيل معايير البحث، لكن قاعدة القرارات غير متاحة بعد.":"قاعدة الاجتهاد القضائي غير مفهرسة حالياً؛ وهذا لا يعني عدم وجود قرارات منشورة لدى المحاكم.";
}
input.addEventListener("input",render);filter?.addEventListener("change",render);document.getElementById("caseSearchButton")?.addEventListener("click",render);
input.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();render()}});
render();
})();