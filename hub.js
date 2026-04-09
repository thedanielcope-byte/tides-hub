/* ============================================================
   Tides Bookkeeping — Employee Hub
   hub.js  |  Sidebar, tabs, mobile toggle
   ============================================================ */

const HUB_NAV = [
  { label: 'OVERVIEW', items: [
    { text: 'Vision, Mission, Core Values', href: 'vision.html' },
    { text: 'Brand Identity',               href: 'brand.html' },
    { text: 'Organization Chart',           href: 'org-chart.html' },
    { text: 'Resources',                    href: 'resources.html' },
  ]},
  { label: 'OPERATIONS', items: [
    { text: 'Team',      href: 'team.html' },
    { text: 'Tasks',     href: 'coming-soon.html?page=Tasks' },
    { text: 'Projects',  href: 'projects.html' },
    { text: 'Meetings',  href: 'coming-soon.html?page=Meetings' },
  ]},
  { label: 'MARKETING', items: [
    { text: 'Marketing Avenues',  href: 'marketing.html' },
    { text: 'Content Planner',    href: 'coming-soon.html?page=Content+Planner' },
    { text: 'Citation Websites',  href: 'coming-soon.html?page=Citation+Websites' },
    { text: 'Affiliate Links',    href: 'marketing.html#affiliates' },
  ]},
  { label: 'CLIENTS', items: [
    { text: 'Clients Database', href: 'coming-soon.html?page=Clients+Database' },
    { text: 'Deal Tracking',    href: 'coming-soon.html?page=Deal+Tracking' },
  ]},
  { label: 'FINANCE', items: [
    { text: 'Passwords \u2197', href: 'https://keepersecurity.com', external: true },
    { text: 'Budget Planner',   href: 'coming-soon.html?page=Budget+Planner' },
    { text: 'Subscriptions',    href: 'coming-soon.html?page=Subscriptions' },
  ]},
  { label: 'BUYER', items: [
    { text: 'Buyer Personas',    href: 'coming-soon.html?page=Buyer+Personas' },
    { text: 'Customer Insights', href: 'coming-soon.html?page=Customer+Insights' },
    { text: 'Email List',        href: 'coming-soon.html?page=Email+List' },
  ]},
  { label: 'REVIEW', items: [
    { text: 'Yearly Goals', href: 'goals.html' },
    { text: 'Reviews',      href: 'coming-soon.html?page=Reviews' },
    { text: 'Milestones',   href: 'coming-soon.html?page=Milestones' },
  ]},
  { label: 'PRODUCTS', items: [
    { text: 'Products & Inventory', href: 'coming-soon.html?page=Products+%26+Inventory' },
  ]},
];

/* ---- Active-state detection ---- */
function isActive(href) {
  if (!href || href.startsWith('http')) return false;
  const curFile   = window.location.pathname.split('/').pop() || 'index.html';
  const curSearch = window.location.search;
  // Strip hash from href for comparison
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
    sectionsHTML += `<div class="nav-section"><div class="nav-label">${section.label}</div>`;
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

  /* Mobile toggle */
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

document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  initTabs();
  initProgress();
});
