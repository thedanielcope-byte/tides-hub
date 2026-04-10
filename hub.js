/* ============================================================
   Tides Bookkeeping — Employee Hub
   hub.js  |  Sidebar, tabs, mobile toggle, content storage
   ============================================================ */

/* ---- Hub content storage (cross-device, keys: goals-YEAR, pricing-tiers) ---- */
const _HUB_SB_URL = 'https://khhfkxfxefjgunhrihyx.supabase.co';
const _HUB_SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoaGZreGZ4ZWZqZ3VuaHJpaHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzYwMjcsImV4cCI6MjA5MTM1MjAyN30.bYW68xMDUEXBRC1bxOLdj77xCcjXb3wIuHbPAPFdSGo';

async function loadHubContent(key) {
  try {
    const res = await fetch(
      `${_HUB_SB_URL}/rest/v1/hub_content?content_key=eq.${encodeURIComponent(key)}&select=content_value`,
      { headers: { 'apikey': _HUB_SB_KEY, 'Authorization': `Bearer ${_HUB_SB_KEY}` } }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows.length ? rows[0].content_value : null;
  } catch { return null; }
}

async function saveHubContent(key, value) {
  try {
    const check = await fetch(
      `${_HUB_SB_URL}/rest/v1/hub_content?content_key=eq.${encodeURIComponent(key)}&select=id`,
      { headers: { 'apikey': _HUB_SB_KEY, 'Authorization': `Bearer ${_HUB_SB_KEY}` } }
    );
    const rows = await check.json();
    const method = rows.length ? 'PATCH' : 'POST';
    const url = rows.length
      ? `${_HUB_SB_URL}/rest/v1/hub_content?content_key=eq.${encodeURIComponent(key)}`
      : `${_HUB_SB_URL}/rest/v1/hub_content`;
    await fetch(url, {
      method,
      headers: {
        'apikey': _HUB_SB_KEY,
        'Authorization': `Bearer ${_HUB_SB_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ content_key: key, content_value: value })
    });
    return true;
  } catch { return false; }
}

/* ---- Navigation ---- */
const HUB_NAV = [
  { label: '🔵 OVERVIEW', color: '#3b82f6', items: [
    { text: 'Vision, Mission, Core Values', href: 'vision.html' },
    { text: 'Brand Identity',               href: 'brand.html' },
    { text: 'Organization Chart',           href: 'org-chart.html' },
    { text: 'Resources',                    href: 'resources.html' },
  ]},
  { label: '🟢 OPERATIONS', color: '#22c55e', items: [
    { text: 'Team',          href: 'team.html' },
    { text: 'Tasks \u2197',  href: 'https://thedanielcope.com/tides-bookkeeping-tasks/', external: true },
    { text: 'Meetings',      href: 'coming-soon.html?page=Meetings' },
  ]},
  { label: '🟡 MARKETING', color: '#eab308', items: [
    { text: 'Marketing Avenues',     href: 'marketing.html' },
    { text: 'Website Page Tracker',  href: 'website-pages.html' },
    { text: 'Content Planner',       href: 'coming-soon.html?page=Content+Planner' },
    { text: 'Citation Websites',     href: 'coming-soon.html?page=Citation+Websites' },
    { text: 'Affiliate Links',       href: 'marketing.html#affiliates' },
  ]},
  { label: '🟠 CLIENTS', color: '#f97316', items: [
    { text: 'CRM \u2197', href: 'https://app.gohighlevel.com/v2/location/MbY1ICQ6HdzVOrgFncoI/dashboard', external: true },
  ]},
  { label: '🔴 FINANCE', color: '#ef4444', items: [
    { text: 'Passwords \u2197', href: 'https://keepersecurity.com', external: true },
    { text: 'Budget Planner',   href: 'coming-soon.html?page=Budget+Planner' },
  ]},
  { label: '⚪ REVIEW', color: '#6b7280', items: [
    { text: 'Yearly Goals', href: 'goals.html' },
  ]},
  { label: '🟣 PRICING', color: '#a855f7', items: [
    { text: 'Pricing Tiers', href: 'pricing-tiers.html' },
  ]},
  { label: '📘 GUIDES', color: '#215197', items: [
    { text: 'Guides & Manuals', href: 'guides.html' },
  ]},
];

/* ---- Active-state detection ---- */
function isActive(href) {
  if (!href || href.startsWith('http')) return false;
  const curFile   = window.location.pathname.split('/').pop() || 'index.html';
  const curSearch = window.location.search;
  const [hFull]  = href.split('#');
  const [hFile, hQuery] = hFull.split('?');
  const hSearch  = hQuery ? '?' + hQuery : '';
  if (curFile !== hFile) return false;
  if (hSearch && curSearch !== hSearch) return false;
  return true;
}

/* ---- Build sidebar HTML ---- */
function buildSidebar() {
  const curFile = window.location.pathname.split('/').pop() || 'index.html';
  const homeActive = (curFile === 'index.html') ? ' active' : '';

  let sectionsHTML = '';
  HUB_NAV.forEach(section => {
    const color = section.color || 'var(--text-muted)';
    sectionsHTML += `<div class="nav-section"><div class="nav-label" style="color:${color}">${section.label}</div>`;
    section.items.forEach(item => {
      const active = isActive(item.href) ? ' active' : '';
      const ext    = item.external ? ' target="_blank" rel="noopener noreferrer"' : '';
      sectionsHTML += `<a href="${item.href}" class="nav-item${active}"${ext}>${item.text}</a>`;
    });
    sectionsHTML += '</div>';
  });

  const html = `
<div class="sidebar-overlay" id="sidebarOverlay"></div>
<nav class="sidebar" id="sidebar">
  <div class="sidebar-logo">
    <a href="index.html"><img src="logo.png" alt="Tides Bookkeeping"></a>
  </div>
  <div class="sidebar-nav">
    <a href="index.html" class="sidebar-home${homeActive}">🏠 Dashboard</a>
    <div class="sidebar-divider"></div>
    ${sectionsHTML}
  </div>
</nav>`;

  document.body.insertAdjacentHTML('afterbegin', html);

  const ham     = document.getElementById('hubHamburger');
  const overlay = document.getElementById('sidebarOverlay');
  const sidebar = document.getElementById('sidebar');

  const open  = () => { sidebar.classList.add('open');    overlay.classList.add('open'); };
  const close = () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); };

  ham?.addEventListener('click', () => sidebar.classList.contains('open') ? close() : open());
  overlay?.addEventListener('click', close);
}

/* ---- Tab system ---- */
function initTabs() {
  document.querySelectorAll('[data-tab-bar]').forEach(bar => {
    const container = bar.closest('[data-tabs]') || document;
    bar.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const pane = container.querySelector('#' + btn.dataset.tab);
        if (pane) pane.classList.add('active');
      });
    });
  });
}

/* ---- Progress bars ---- */
function initProgress() {
  document.querySelectorAll('.progress-fill[data-pct]').forEach(el => {
    el.style.width = el.dataset.pct + '%';
  });
}

/* ---- PIN auth guard ---- */
(function () {
  const CORRECT = '2277';
  const KEY     = 'tides_hub_auth';
  const page    = window.location.pathname.split('/').pop();
  if (page !== 'pin.html' && localStorage.getItem(KEY) !== CORRECT) {
    sessionStorage.setItem('tides_redirect', window.location.href);
    window.location.replace('pin.html');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  initTabs();
  initProgress();
});
