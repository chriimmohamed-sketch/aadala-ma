/* CHRVVIM — Universal page navigation
 * Add <nav id="site-navigation"></nav> and load this file on every page.
 * Edit the PAGES array below to match your site's real routes.
 */
(() => {
  'use strict';
  if (window.__chrvvimNavigationLoaded) return;
  window.__chrvvimNavigationLoaded = true;

  const PAGES = [
    { label: 'الرئيسية', href: '/index.html', icon: '⌂' },
    { label: 'مشكلتي', href: '/mushkilati.html', icon: '✦' },
    { label: 'ملفي', href: '/profile/', icon: '♙' },
    { label: 'الموسوعة', href: '/ar/legal', icon: '▤' },
    { label: 'المساعد', href: '/ar/ai', icon: '✦' },
    { label: 'المساطر', href: '/ar/procedures', icon: '▦' }
  ];

  const currentPath = normalizePath(location.pathname);
  const nav = document.getElementById('site-navigation') || document.createElement('nav');
  nav.id = 'site-navigation';
  nav.className = 'chrvvim-nav';
  nav.setAttribute('aria-label', 'التنقل الرئيسي');

  const brand = document.createElement('a');
  brand.className = 'chrvvim-nav__brand';
  brand.href = '/';
  brand.textContent = 'chrvvim';
  nav.appendChild(brand);

  const menu = document.createElement('div');
  menu.className = 'chrvvim-nav__links';
  PAGES.forEach(page => {
    const link = document.createElement('a');
    link.className = 'chrvvim-nav__link';
    link.href = page.href;
    link.innerHTML = `<span class="chrvvim-nav__icon" aria-hidden="true">${escapeHTML(page.icon)}</span><span>${escapeHTML(page.label)}</span>`;
    if (normalizePath(page.href) === currentPath) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
    menu.appendChild(link);
  });
  nav.appendChild(menu);

  const toggle = document.createElement('button');
  toggle.className = 'chrvvim-nav__toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'فتح قائمة التنقل');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  nav.insertBefore(toggle, menu);
  toggle.addEventListener('click', () => {
    const opened = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(opened));
    toggle.setAttribute('aria-label', opened ? 'إغلاق قائمة التنقل' : 'فتح قائمة التنقل');
  });

  if (!document.getElementById('chrvvim-navigation-style')) {
    const style = document.createElement('link');
    style.id = 'chrvvim-navigation-style';
    style.rel = 'stylesheet';
    style.href = '/assets/navigation.css';
    document.head.appendChild(style);
  }
  if (!document.getElementById('site-navigation')) document.body.prepend(nav);

  function normalizePath(path) {
    try { path = new URL(path, location.origin).pathname; } catch (_) {}
    path = path.replace(/index\.html$/i, '').replace(/\/$/, '');
    return path || '/';
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
})();
