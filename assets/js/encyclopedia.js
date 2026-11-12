/* AADALA.MA — Interactive legal encyclopedia
 * Safe DOM rendering: all catalogue values are inserted with textContent.
 * This interface presents the existing metadata only; it does not certify legal validity.
 */
(() => {
  "use strict";

  const data = window.LegalContent;
  const catalogue = window.LegalEncyclopedia;
  const categoriesRoot = document.getElementById("encCategories");
  const resultsRoot = document.getElementById("encResults");
  const searchInput = document.getElementById("encSearch");
  const countNode = document.getElementById("encCount");
  const statusNode = document.getElementById("encStatus");
  const clearButton = document.getElementById("encClear");

  if (!categoriesRoot || !resultsRoot || !searchInput || !data || !catalogue) {
    console.error("[AADALA] Encyclopedia could not initialize: required data or elements are missing.");
    if (statusNode) statusNode.textContent = "تعذر تحميل بيانات الموسوعة. يرجى تحديث الصفحة.";
    return;
  }

  let activeCategory = null;
  const texts = Array.isArray(data.texts) ? data.texts : [];
  const categories = Array.isArray(catalogue.categories) ? catalogue.categories : [];

  const normalize = (value) => String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase("ar")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ")
    .trim();

  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };

  const categoryFor = (id) => categories.find((item) => item.id === id);
  const safeSourceUrl = (raw) => {
    try {
      const url = new URL(String(raw));
      return url.protocol === "https:" ? url.href : null;
    } catch {
      return null;
    }
  };

  function renderCategories() {
    categoriesRoot.replaceChildren();
    categories.forEach((category) => {
      const count = texts.filter((item) => item.category === category.id).length;
      const button = make("button", "category-item encyclopedia-category");
      button.type = "button";
      button.dataset.category = category.id;
      button.setAttribute("aria-pressed", String(activeCategory === category.id));
      const icon = make("span", "category-icon", category.icon || "§");
      icon.setAttribute("aria-hidden", "true");
      const copy = make("span", "encyclopedia-category-copy");
      copy.append(make("strong", "", category.name));
      copy.append(make("span", "text-muted text-sm", category.desc || ""));
      copy.append(make("small", "encyclopedia-category-count", count + " مرجع"));
      button.append(icon, copy);
      categoriesRoot.append(button);
    });
  }

  function addMetadataRow(table, label, value) {
    const row = document.createElement("tr");
    row.append(make("th", "", label), make("td", "", value || "غير متوفر في البيانات"));
    table.append(row);
  }

  function renderDocument(item) {
    const category = categoryFor(item.category);
    const article = make("article", "card encyclopedia-document");
    const header = make("div", "encyclopedia-document-head");
    const titleGroup = make("div", "");
    titleGroup.append(make("h3", "", item.title || "مرجع دون عنوان"));
    if (item.titleFr) titleGroup.append(make("p", "text-muted text-sm", item.titleFr));
    const badge = make("span", "badge badge-primary", item.status || "الحالة غير محددة");
    header.append(titleGroup, badge);
    article.append(header);

    const table = make("table", "data-table encyclopedia-metadata");
    const body = document.createElement("tbody");
    addMetadataRow(body, "المجال", category ? category.name : item.category);
    addMetadataRow(body, "نوع النص", item.type);
    addMetadataRow(body, "رقم النص", item.number);
    addMetadataRow(body, "التاريخ المسجل", item.date);
    addMetadataRow(body, "المرجع المذكور", item.source);
    table.append(body);
    article.append(table);

    if (item.summary) article.append(make("p", "encyclopedia-summary", item.summary));

    const footer = make("div", "encyclopedia-document-footer");
    const sourceUrl = safeSourceUrl(item.url);
    if (sourceUrl) {
      const link = make("a", "btn btn-outline btn-sm", "فتح بوابة المصدر");
      link.href = sourceUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      footer.append(link);
    } else {
      footer.append(make("span", "text-muted text-sm", "لا يوجد رابط مصدر صالح ضمن البيانات."));
    }
    footer.append(make("span", "text-muted text-sm", "بيانات وصفية — ليست نسخة النص الرسمي"));
    article.append(footer);

    const incomplete = [item.number, item.date].some((value) => String(value || "").includes("?"));
    if (incomplete) {
      const warning = make("p", "alert alert-warning encyclopedia-warning",
        "توجد حقول تعريفية غير مكتملة في سجل هذا المرجع؛ لا تعتمد هذه البيانات قبل مراجعتها.");
      article.append(warning);
    }
    return article;
  }

  function renderResults(items, heading) {
    resultsRoot.replaceChildren();
    resultsRoot.append(make("h2", "encyclopedia-results-title", heading));
    countNode.textContent = String(items.length);
    if (!items.length) {
      resultsRoot.append(make("div", "alert alert-info", "لا توجد نتائج مطابقة. جرّب كلمة أخرى أو ألغِ تصفية المجال."));
      return;
    }
    const grid = make("div", "encyclopedia-results-grid");
    items.forEach((item) => grid.append(renderDocument(item)));
    resultsRoot.append(grid);
  }

  function applySearch() {
    const query = normalize(searchInput.value);
    const matching = texts.filter((item) => {
      if (activeCategory && item.category !== activeCategory) return false;
      const category = categoryFor(item.category);
      const searchable = [
        item.title, item.titleFr, item.type, item.number, item.date,
        item.status, item.source, item.summary, item.category,
        category?.name, category?.desc
      ].join(" ");
      return !query || normalize(searchable).includes(query);
    });
    const active = activeCategory ? categoryFor(activeCategory) : null;
    const heading = query
      ? "نتائج البحث"
      : active
        ? "المراجع ضمن: " + active.name
        : "جميع المراجع المسجلة";
    renderResults(matching, heading);
    statusNode.textContent = matching.length
      ? "تم العثور على " + matching.length + " مرجع."
      : "لا توجد نتائج مطابقة.";
    renderCategories();
  }

  categoriesRoot.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    const id = button.dataset.category;
    activeCategory = activeCategory === id ? null : id;
    applySearch();
    resultsRoot.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  searchInput.addEventListener("input", applySearch);
  clearButton?.addEventListener("click", () => {
    searchInput.value = "";
    activeCategory = null;
    applySearch();
    searchInput.focus();
  });

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q");
  const initialCategory = params.get("cat");
  if (initialQuery) searchInput.value = initialQuery.slice(0, 160);
  if (initialCategory && categories.some((item) => item.id === initialCategory)) {
    activeCategory = initialCategory;
  }

  renderCategories();
  applySearch();
})();