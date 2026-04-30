let API = '';

async function initConfig() {
  try {
    const res = await fetch('/config');
    const { backendUrl } = await res.json();
    API = backendUrl + '/api';
  } catch {
    API = 'http://localhost:8080/api';
  }
}

// Sidebar nav items
const NAV = [
  { href: '/dashboard',       icon: '🏠', label: 'Dashboard',       color: '#7c6fff' },
  { href: '/mentor',          icon: '🤖', label: 'AI Mentor',        color: '#ff4081' },
  { href: '/ncert',           icon: '📚', label: 'NCERT Hub',        color: '#00e676' },
  { href: '/practice',        icon: '🎯', label: 'Daily Practice',   color: '#ffd700' },
  { href: '/interview',       icon: '🎤', label: 'Mock Interview',   color: '#ff9800' },
  { href: '/current-affairs', icon: '📰', label: 'Current Affairs',  color: '#00e5ff' },
  { href: '/important-dates', icon: '📅', label: 'Important Dates',  color: '#e040fb' },
  { href: '/admin',           icon: '🛡️', label: 'Admin Panel',      color: '#ff5252' },
];

function renderSidebar() {
  const path = window.location.pathname;
  const nav = NAV.map(n => `
    <a href="${n.href}" class="sidebar-item ${path === n.href ? 'active' : ''}">
      <div class="sidebar-icon" style="background:${n.color}20">${n.icon}</div>
      <span>${n.label}</span>
    </a>`).join('');

  document.getElementById('sidebar').innerHTML = `
    <div style="padding:24px 20px;border-bottom:1px solid var(--border)">
      <div class="flex items-center gap-3">
        <div class="float" style="width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg,#7c6fff,#ff4081);display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 4px 15px rgba(124,111,255,.4)">🎓</div>
        <div>
          <div style="font-family:'Baloo 2',cursive;font-weight:800;font-size:15px;background:linear-gradient(135deg,#a78bfa,#ff4081);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Sakshi's Mentor</div>
          <div style="font-size:11px;color:var(--text-muted);font-weight:600">🚀 IAS Journey 2035</div>
        </div>
      </div>
    </div>
    <nav style="padding:12px;margin-top:8px">${nav}</nav>
    <div style="padding:16px;border-top:1px solid var(--border);margin-top:auto;position:absolute;bottom:0;width:100%;background:linear-gradient(0deg,#0f0f25,transparent)">
      <div style="background:linear-gradient(135deg,rgba(124,111,255,.15),rgba(255,64,129,.1));border:1px solid rgba(124,111,255,.2);border-radius:14px;padding:12px 14px;font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:8px;font-weight:700">
        <span class="streak-fire" style="font-size:16px">🔥</span>
        <span style="color:#a78bfa">Dream: IAS Officer 2035</span>
      </div>
    </div>`;
}

function initLayout() {
  renderSidebar();
  const toggle = document.getElementById('mobile-toggle');
  const overlay = document.getElementById('overlay');
  const sidebar = document.getElementById('sidebar');
  if (toggle) {
    toggle.onclick = () => { sidebar.classList.toggle('open'); overlay.classList.toggle('show'); };
    overlay.onclick = () => { sidebar.classList.remove('open'); overlay.classList.remove('show'); };
  }
}

// API helper
async function api(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Render markdown-like text to HTML
function renderMd(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#f0f0ff">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^## (.*$)/gm, '<h3 style="color:#a78bfa;font-size:15px;font-weight:700;margin:16px 0 8px">$1</h3>')
    .replace(/^### (.*$)/gm, '<h4 style="color:#f5c842;font-size:14px;font-weight:600;margin:8px 0 4px">$1</h4>')
    .replace(/^- (.*$)/gm, '<li style="margin:4px 0;color:#c0c0d0">$1</li>')
    .replace(/^(\d+\. .*)$/gm, '<li style="margin:4px 0">$1</li>')
    .replace(/\n/g, '<br/>');
}

function loading(msg = 'Loading...') {
  return `<div class="flex items-center justify-center" style="min-height:200px;flex-direction:column;gap:12px">
    <div style="width:32px;height:32px;border:2px solid var(--primary);border-top-color:transparent;border-radius:50%" class="spinner"></div>
    <p style="color:var(--text-muted);font-size:14px">${msg}</p>
  </div>`;
}

document.addEventListener('DOMContentLoaded', async () => {
  await initConfig();
  initLayout();
});
