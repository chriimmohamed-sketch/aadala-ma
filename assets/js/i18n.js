// AADALA.MA — Internationalization (i18n) System
// 10 languages: ar, zgh, fr, en, es, de, fa, tr, nl, it
// Arabic is the canonical language.

const I18N = {
  currentLang: localStorage.getItem('aadala_lang') || 'ar',
  languages: [
    { code: 'ar', name: 'العربية', native: 'العربية', dir: 'rtl', font: 'Tajawal' },
    { code: 'zgh', name: 'الأمازيغية', native: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', dir: 'rtl', font: 'Tajawal' },
    { code: 'fr', name: 'Français', native: 'Français', dir: 'ltr', font: 'system-ui' },
    { code: 'en', name: 'English', native: 'English', dir: 'ltr', font: 'system-ui' },
    { code: 'es', name: 'Español', native: 'Español', dir: 'ltr', font: 'system-ui' },
    { code: 'de', name: 'Deutsch', native: 'Deutsch', dir: 'ltr', font: 'system-ui' },
    { code: 'fa', name: 'فارسی', native: 'فارسی', dir: 'rtl', font: 'Tajawal' },
    { code: 'tr', name: 'Türkçe', native: 'Türkçe', dir: 'ltr', font: 'system-ui' },
    { code: 'nl', name: 'Nederlands', native: 'Nederlands', dir: 'ltr', font: 'system-ui' },
    { code: 'it', name: 'Italiano', native: 'Italiano', dir: 'ltr', font: 'system-ui' },
  ],

  // Translations (Arabic complete, French partial, others planned)
  translations: {
    ar: {
      home: 'الرئيسية', legalAI: 'المساعد القانوني', encyclopedia: 'الموسوعة',
      gazette: 'ال burglary الرسمية', caseLaw: 'الاجتهاد', inheritance: 'المواريث',
      legalAid: 'المساعدة', academic: 'الأكاديمية', founder: 'المؤسس',
      login: 'تسجيل الدخول', register: 'إنشاء حساب', logout: 'خروج',
      search: 'بحث', theme: 'المظهر', dark: 'داكن', light: 'فاتح',
      disclaimer: 'منصة مستقلة. المعلومات توضيحية وليست استشارة قانونية.',
      footer: '© 2026 AADALA.MA — منصة مستقلة.',
      privacy: 'سياسة الخصوصية', terms: 'شروط الاستخدام', contact: 'اتصل بنا',
      designSystem: 'نظام التصميم', notFound: 'الصفحة غير موجودة',
      backHome: 'العودة للرئيسية', loading: 'جاري التحميل...',
      notAvailable: 'قيد التطوير', source: 'المصدر', status: 'الحالة',
      date: 'التاريخ', number: 'الرقم', type: 'النوع', summary: 'الملخص',
      notFoundText: 'لا توجد نصوص في هذه الفئة حالياً.',
    },
    fr: {
      home: 'Accueil', legalAI: 'Assistant juridique', encyclopedia: 'Encyclopédie',
      gazette: 'Journal Officiel', caseLaw: 'Jurisprudence', inheritance: 'Successions',
      legalAid: 'Aide juridique', academic: 'Académique', founder: 'Fondateur',
      login: 'Connexion', register: 'Inscription', logout: 'Déconnexion',
      search: 'Rechercher', theme: 'Thème', dark: 'Sombre', light: 'Clair',
      disclaimer: 'Plateforme indépendante. Informations indicatives, pas de conseil juridique.',
      footer: '© 2026 AADALA.MA — Plateforme indépendante.',
      privacy: 'Confidentialité', terms: 'Conditions', contact: 'Contact',
      designSystem: 'Design System', notFound: 'Page non trouvée',
      backHome: 'Retour à l\'accueil', loading: 'Chargement...',
      notAvailable: 'En développement', source: 'Source', status: 'Statut',
      date: 'Date', number: 'Numéro', type: 'Type', summary: 'Résumé',
      notFoundText: 'Aucun texte dans cette catégorie pour le moment.',
    },
    en: {
      home: 'Home', legalAI: 'Legal AI', encyclopedia: 'Encyclopedia',
      gazette: 'Official Gazette', caseLaw: 'Case Law', inheritance: 'Inheritance',
      legalAid: 'Legal Aid', academic: 'Academic', founder: 'Founder',
      login: 'Login', register: 'Register', logout: 'Logout',
      search: 'Search', theme: 'Theme', dark: 'Dark', light: 'Light',
      disclaimer: 'Independent platform. Informational only, not legal advice.',
      footer: '© 2026 AADALA.MA — Independent platform.',
      privacy: 'Privacy', terms: 'Terms', contact: 'Contact',
      designSystem: 'Design System', notFound: 'Page not found',
      backHome: 'Back to home', loading: 'Loading...',
      notAvailable: 'In development', source: 'Source', status: 'Status',
      date: 'Date', number: 'Number', type: 'Type', summary: 'Summary',
      notFoundText: 'No texts in this category yet.',
    },
    // Other languages: placeholder (to be completed)
    zgh: {}, fa: {}, es: {}, de: {}, tr: {}, nl: {}, it: {}
  },

  // Get translation
  t(key) {
    const lang = this.currentLang;
    const dict = this.translations[lang] || {};
    if (dict[key]) return dict[key];
    // Fallback to Arabic
    if (this.translations.ar[key]) return this.translations.ar[key];
    return key;
  },

  // Set language
  setLang(code) {
    const lang = this.languages.find(l => l.code === code);
    if (!lang) return;
    this.currentLang = code;
    localStorage.setItem('aadala_lang', code);
    document.documentElement.setAttribute('lang', code);
    document.documentElement.setAttribute('dir', lang.dir);
    document.documentElement.style.fontFamily = lang.font + ', sans-serif';
    // Re-render if needed
    if (window.onLangChange) window.onLangChange(code);
  },

  // Get current language info
  current() {
    return this.languages.find(l => l.code === this.currentLang) || this.languages[0];
  },

  // Check if translation exists
  hasTranslation(code) {
    const dict = this.translations[code];
    return dict && Object.keys(dict).length > 0;
  },

  // Render language selector
  renderSelector() {
    const cur = this.current();
    let html = `<select id="langSelector" onchange="I18N.setLang(this.value)" style="padding:0.4rem 0.6rem;border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-surface);color:var(--color-text);font-family:var(--font-ui);cursor:pointer;">`;
    this.languages.forEach(l => {
      const available = this.hasTranslation(l.code) ? '' : ' (قيد التطوير)';
      html += `<option value="${l.code}" ${l.code === cur.code ? 'selected' : ''}>${l.native}${available}</option>`;
    });
    html += '</select>';
    return html;
  },

  // Initialize
  init() {
    if (typeof document !== 'undefined') {
      const lang = this.current();
      document.documentElement.setAttribute('lang', this.currentLang);
      document.documentElement.setAttribute('dir', lang.dir);
    }
  }
};

// Initialize on load
if (typeof window !== 'undefined') {
  I18N.init();
  window.I18N = I18N;
}
