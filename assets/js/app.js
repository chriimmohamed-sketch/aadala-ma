// AADALA.MA — Shared Application Logic
// Moroccan Legal Intelligence Platform

const AADALA = {
  // App state
  state: {
    theme: localStorage.getItem('aadala_theme') || 'light',
    lang: localStorage.getItem('aadala_lang') || 'ar',
    user: null,
    conversations: [],
  },

  // Initialize
  init() {
    this.applyTheme(this.state.theme);
    this.loadUser();
    this.bindGlobalEvents();
  },

  // Theme
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.state.theme = theme;
    localStorage.setItem('aadala_theme', theme);
  },
  toggleTheme() {
    this.applyTheme(this.state.theme === 'light' ? 'dark' : 'light');
  },

  // Language
  setLang(lang) {
    this.state.lang = lang;
    localStorage.setItem('aadala_lang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  },

  // Auth (localStorage-based demo, replace with real backend)
  loadUser() {
    try {
      const u = localStorage.getItem('aadala_user');
      this.state.user = u ? JSON.parse(u) : null;
    } catch { this.state.user = null; }
  },
  login(email, password) {
    // Demo: accept any non-empty credentials
    if (!email || !password) return { ok: false, error: 'يرجى إدخال البريد وكلمة المرور' };
    const user = { id: 'u_' + Date.now(), email, name: email.split('@')[0], role: 'user', createdAt: new Date().toISOString() };
    localStorage.setItem('aadala_user', JSON.stringify(user));
    this.state.user = user;
    return { ok: true, user };
  },
  register(name, email, password) {
    if (!name || !email || !password) return { ok: false, error: 'يرجى ملء جميع الحقول' };
    if (password.length < 6) return { ok: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
    const user = { id: 'u_' + Date.now(), email, name, role: 'user', createdAt: new Date().toISOString() };
    localStorage.setItem('aadala_user', JSON.stringify(user));
    this.state.user = user;
    return { ok: true, user };
  },
  logout() {
    localStorage.removeItem('aadala_user');
    this.state.user = null;
    window.location.href = '/index.html';
  },
  isLoggedIn() { return !!this.state.user; },
  isAdmin() { return this.state.user && ['admin','superadmin','legal_editor','legal_reviewer'].includes(this.state.user.role); },

  // Toast notifications
  toast(message, type = 'info', duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, duration);
  },

  // Modal
  openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('active');
  },
  closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('active');
  },

  // Bind global events
  bindGlobalEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      }
    });
  },

  // Format date
  formatDate(d) {
    try { return new Date(d).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return d; }
  },

  // Safe HTML
  escape(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  },

  // Local storage helpers
  storage: {
    get(key) { try { return JSON.parse(localStorage.getItem('aadala_' + key)); } catch { return null; } },
    set(key, val) { localStorage.setItem('aadala_' + key, JSON.stringify(val)); },
    remove(key) { localStorage.removeItem('aadala_' + key); },
  }
};

// Legal AI — Mock RAG engine with structured responses
const LegalAI = {
  // Knowledge base of Moroccan legal references (verified, non-invented)
  sources: {
    constitution: { name: 'الدستور المغربي 2011', ref: 'الجريدة الرسمية' },
    code_civil: { name: 'قانون الالتزامات والعقود (DOC)', ref: 'dahir 1913' },
    code_penal: { name: 'القانون الجنائي', ref: 'dahir 1962' },
    code_procedure_penale: { name: 'المسطرة الجنائية', ref: 'dahir 2002' },
    code_procedure_civile: { name: 'المسطرة المدنية', ref: 'dahir 1974' },
    moudawana: { name: 'مدونة الأسرة', ref: 'dahir 2004' },
    code_travail: { name: 'مدونة الشغل', ref: 'dahir 2003' },
    code_commerce: { name: 'القانون التجاري', ref: 'dahir 1996' },
    code_droits_reels: { name: 'قانون الحقوق العينية', ref: 'dahir 2011' },
    code_urbanisme: { name: 'قانون التعمير', ref: 'dahir 1992' },
  },

  // Analyze a legal question
  async analyze(question) {
    // Simulate processing delay
    await new Promise(r => setTimeout(r, 800));

    const q = question.toLowerCase();
    let response = this.buildResponse(question);
    return response;
  },

  buildResponse(question) {
    const sections = [];
    sections.push({ title: 'ملخص الوقائع', content: 'أنت تطرح السؤال التالي: «' + this.escape(question) + '».' });
    sections.push({ title: 'تحديد المسألة القانونية', content: 'هذه مسألة قانونية تتطلب تحليل النصوص المغربية ذات الصلة. يُرجى تقديم تفاصيل إضافية (الأطراف، التواريخ، الوثائق) للحصول على تحليل أدق.' });
    sections.push({ title: 'النصوص القانونية ذات الصلة', content: 'لم يتم العثور على مصادر موثوقة محددة في قاعدة البيانات الحالية. يُنصح بالرجوع إلى الجريدة الرسمية المغربية (www.sgg.gov.ma) أو بوابة المحاكم (www.cours-appel.ma).' });
    sections.push({ title: 'التحليل والتفسير', content: 'التحليل (توضيحي — غير استشاري): تتطلب هذه المسألة فحص النصوص النافذة والاجتهادات (إن وُجدت). لا يجوز الاعتماد على هذا التحليل كاستشارة قانونية.' });
    sections.push({ title: 'الحقوق والالتزامات', content: 'لا يمكن تحديد الحقوق والالتزامات بدقة دون معرفة جميع الوقائع. يُرجى استكمال المعلومات.' });
    sections.push({ title: 'الإجراءات والخيارات الممكنة', content: '1) جمع الوثائق (عقود، إثباتات، تبليغات).\n2) استشارة محامٍ مغربي.\n3) التحقق من الآجال (المسطرة).\n4) اللجوء إلى الوساطة أو التحكيم إن أمكن.' });
    sections.push({ title: 'المخاطر والآجال', content: 'الآجال (الForclusion) تختلف حسب نوع الدعوى. يجب التحقق من الآجال (المسطرة المدنية/الجنائية) مع مختص.' });
    sections.push({ title: 'المصادر والمراجع', content: '• الجريدة الرسمية المغربية: www.sgg.gov.ma\n• بوابة العدل: www.justice.gov.ma\n• محكمة النقض: www.courdecassation.ma\n• CNDP (حماية المعطيات): www.cndp.ma\n\n⚠️ هذه المنصة مستقلة وغير حكومية. المعلومات توضيحية وليست استشارة قانونية. تُوصى بمراجعة محامٍ.' });
    return sections;
  },

  escape(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }
};

// Inheritance (Mawarith) Calculator Engine
const InheritanceEngine = {
  // Heirs definitions (simplified, to be validated by legal experts)
  heirs: {
    'زوج': { name: 'زوج', type: 'spouse', share: null },
    'زوجة': { name: 'زوجة', type: 'spouse', share: null },
    'أب': { name: 'أب', type: 'parent', share: null },
    'أم': { name: 'أم', type: 'parent', share: null },
    'ابن': { name: 'ابن', type: 'child', share: null },
    'بنت': { name: 'بنت', type: 'child', share: null },
    'جد': { name: 'جد', type: 'grandparent', share: null },
    'جدة': { name: 'جدة', type: 'grandparent', share: null },
  },

  // Calculate shares (simplified demo — requires legal validation)
  calculate(data) {
    // data: { deceased: {gender, hasChildren, hasFather, hasMother, ...}, heirs: [{type, count, gender}], estate: {total, debts, will} }
    const result = { heirs: [], asl: 0, notes: [] };
    const netEstate = (data.estate.total || 0) - (data.estate.debts || 0) - (data.estate.will || 0);
    result.netEstate = netEstate;
    result.notes.push('⚠️ هذا حساب توضيحي (demo). يجب التحقق من القواعد (العول، الرد، الحجب) مع متخصص في المواريث.');
    result.notes.push('التركة الصافية = الإجمالي - الديون - الوصايا = ' + netEstate);
    // Placeholder: equal distribution among listed heirs
    const count = data.heirs.length || 1;
    data.heirs.forEach(h => {
      result.heirs.push({ name: h.name, relation: h.relation, share: (1/count).toFixed(4), amount: (netEstate/count).toFixed(2) });
    });
    result.asl = count;
    return result;
  }
};

// Admin helpers
const Admin = {
  log(action, details) {
    const logs = AADALA.storage.get('audit_logs') || [];
    logs.unshift({ id: 'log_' + Date.now(), action, details, user: AADALA.state.user?.email || 'anonymous', timestamp: new Date().toISOString() });
    if (logs.length > 500) logs.length = 500;
    AADALA.storage.set('audit_logs', logs);
  },
  getLogs() { return AADALA.storage.get('audit_logs') || []; },
};

// Legal Encyclopedia Data (sample, verified references only)
const LegalEncyclopedia = {
  categories: [
    { id: 'constitution', name: 'الدستور', icon: '📜', desc: 'الدستور المغربي 2011' },
    { id: 'civil', name: 'قانون الالتزامات والعقود', icon: '⚖️', desc: 'DOC - Dahir 1913' },
    { id: 'penal', name: 'القانون الجنائي', icon: '🔒', desc: 'Dahir 1962' },
    { id: 'procedure_penale', name: 'المسطرة الجنائية', icon: '📋', desc: 'Dahir 2002' },
    { id: 'procedure_civile', name: 'المسطرة المدنية', icon: '📄', desc: 'Dahir 1974' },
    { id: 'famille', name: 'مدونة الأسرة', icon: '👨‍👩‍👧', desc: 'Dahir 2004' },
    { id: 'travail', name: 'مدونة الشغل', icon: '💼', desc: 'Dahir 2003' },
    { id: 'commerce', name: 'القانون التجاري', icon: '🏢', desc: 'Dahir 1996' },
    { id: 'droits_reels', name: 'الحقوق العينية', icon: '🏠', desc: 'Dahir 2011' },
    { id: 'urbanisme', name: 'قانون التعمير', icon: '🏗️', desc: 'Dahir 1992' },
    { id: 'fiscal', name: 'القانون الضريبي', icon: '💰', desc: 'CGI' },
    { id: 'administratif', name: 'القانون الإداري', icon: '🏛️', desc: 'الجماعات الترابية' },
    { id: 'propriete_intel', name: 'الملكية الفكرية', icon: '💡', desc: 'العلامات والاختراعات' },
    { id: 'consommation', name: 'حماية المستهلك', icon: '🛒', desc: 'قانون 31-08' },
    { id: 'banque', name: 'القانون البنكي', icon: '🏦', desc: 'Bank Al-Maghrib' },
    { id: 'assurance', name: 'قانون التأمين', icon: '🛡️', desc: 'Code des assurances' },
  ],
  texts: [] // To be populated from verified sources
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  AADALA.init();
  // Update auth UI
  updateAuthUI();
  // Populate language selector
  const langArea = document.getElementById('langSelectorArea');
  if (langArea && window.I18N) {
    langArea.innerHTML = I18N.renderSelector();
  }
});

function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const userMenu = document.getElementById('userMenu');
  const userName = document.getElementById('userName');
  if (AADALA.isLoggedIn()) {
    if (loginBtn) loginBtn.classList.add('hidden');
    if (userMenu) userMenu.classList.remove('hidden');
    if (userName) userName.textContent = AADALA.state.user.name;
  } else {
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (userMenu) userMenu.classList.add('hidden');
  }
}

// Shared header HTML generator
function renderHeader(activePage) {
  const t = (k, fb) => (window.I18N && I18N.t ? (I18N.t(k) !== k ? I18N.t(k) : fb) : fb);
  const pages = [
    { href: 'index.html', label: t('home','الرئيسية') },
    { href: 'legal-ai.html', label: t('legalAI','المساعد القانوني') },
    { href: 'gazette.html', label: t('gazette','الجريدة الرسمية') },
    { href: 'encyclopedia.html', label: t('encyclopedia','الموسوعة') },
    { href: 'case-law.html', label: t('caseLaw','الاجتهاد') },
    { href: 'inheritance.html', label: t('inheritance','المواريث') },
    { href: 'legal-aid.html', label: t('legalAid','المساعدة') },
    { href: 'academic.html', label: t('academic','الأكاديمية') },
  ];
  const links = pages.map(p => `<li><a href="${p.href}" class="${p.href === activePage ? 'active' : ''}">${p.label}</a></li>`).join('');
  return `
  <header class="site-header">
    <div class="container">
      <nav class="navbar">
        <a href="index.html" class="logo" aria-label="AADALA.MA">
          <div class="logo-icon" style="font-family:Georgia,serif;">A</div>
          <span>AADALA.MA</span>
        </a>
        <ul class="nav-links" id="navLinks">${links}</ul>
        <div class="nav-actions">
          <div id="langSelectorArea"></div>
          <button onclick="AADALA.toggleTheme()" class="btn btn-ghost btn-sm" title="تبديل المظهر" aria-label="تبديل المظهر">◐</button>
          <div id="authArea">
            <a href="auth/login.html" class="btn btn-outline btn-sm" id="loginBtn">${t('login','تسجيل الدخول')}</a>
            <div id="userMenu" class="hidden flex items-center gap-2">
              <span id="userName" class="text-sm font-semibold"></span>
              <button onclick="AADALA.logout()" class="btn btn-ghost btn-sm">${t('logout','خروج')}</button>
            </div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('navLinks').classList.toggle('open')" aria-label="القائمة">☰</button>
        </div>
      </nav>
    </div>
  </header>`;
}

// Shared footer
function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4>AADALA.MA</h4>
          <p>منصة العدالة والذكاء القانوني المغربي — منصة مستقلة غير حكومية.</p>
          <p style="font-size:.9rem;opacity:.85;">«القانون مفهوم، والحق معلوم.»</p>
        </div>
        <div>
          <h4>الخدمات</h4>
          <ul style="list-style:none; line-height:2;">
            <li><a href="legal-ai.html">المساعد القانوني</a></li>
            <li><a href="encyclopedia.html">الموسوعة القانونية</a></li>
            <li><a href="gazette.html">الجريدة الرسمية</a></li>
            <li><a href="case-law.html">الاجتهاد القضائي</a></li>
            <li><a href="inheritance.html">المواريث</a></li>
          </ul>
        </div>
        <div>
          <h4>المصادر والمنهجية</h4>
          <ul style="list-style:none; line-height:2;">
            <li><a href="https://www.sgg.gov.ma" target="_blank" rel="noopener">الجريدة الرسمية (sgg.gov.ma)</a></li>
            <li><a href="https://www.justice.gov.ma" target="_blank" rel="noopener">وزارة العدل</a></li>
            <li><a href="https://www.courdecassation.ma" target="_blank" rel="noopener">محكمة النقض</a></li>
            <li><a href="design-system.html">نظام التصميم</a></li>
          </ul>
        </div>
        <div>
          <h4>قانوني وثقة</h4>
          <ul style="list-style:none; line-height:2;">
            <li><a href="privacy.html">سياسة الخصوصية</a></li>
            <li><a href="terms.html">شروط الاستخدام</a></li>
            <li><a href="contact.html">اتصل بنا</a></li>
            <li><a href="founder.html">المؤسس</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 AADALA.MA — منصة مستقلة. المعلومات توضيحية وليست استشارة قانونية ولا تمثيلاً قضائياً.</p>
        <p style="font-size:.85rem;margin-top:.25rem;opacity:.8;">يُميَّز بين النص الأصلي والشرح والتحليل الآلي والترجمة. تحقق من المصادر الرسمية قبل الاعتماد.</p>
      </div>
    </div>
  </footer>`;
}
