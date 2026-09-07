/**
 * Sidebar Navigation Component
 * Collapsible sidebar with animated nav items and role-based menu filtering
 */
import { store } from '../modules/data-store.js';
import { hasPermission, getCurrentUser, logout, getRoleLabel } from '../modules/auth.js';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', page: 'dashboard' },
  { id: 'analytics', label: 'Player Analytics', icon: '👥', page: 'analytics' },
  { id: 'alerts', label: 'Predictive Alerts', icon: '🔔', page: 'alerts' },
  { id: 'remediation', label: 'Remediation', icon: '🛡️', page: 'remediation' },
  { id: 'history', label: 'History & Export', icon: '📜', page: 'history' },
  { id: 'settings', label: 'Settings', icon: '⚙️', page: 'settings' },
];

/**
 * Renders the sidebar navigation
 * @returns {string} HTML string for the sidebar
 */
export function renderSidebar() {
  const user = getCurrentUser();
  if (!user) return '';

  const navItems = NAV_ITEMS.filter(item => hasPermission(item.page));
  const currentPage = store.getState('currentPage');
  const activeAlerts = (store.getState('alerts') || []).filter(a => a.status === 'active');

  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <img src="src/assets/logo.jpg" alt="IGSO" style="height: 28px; border-radius: 4px;">
          <span class="logo-text text-xl">IGSO</span>
        </div>
      </div>
      <nav class="sidebar-nav mt-md">
        ${navItems.map(item => `
          <div class="nav-item ${currentPage === item.page ? 'active' : ''}" 
               data-page="${item.page}" 
               id="nav-${item.id}">
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-label">${item.label}</span>
            ${item.id === 'alerts' && activeAlerts.length > 0 
              ? `<span class="nav-badge badge-pulse">${activeAlerts.length}</span>` 
              : ''}
          </div>
        `).join('')}
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-user-avatar">${(user.displayName || user.email).charAt(0).toUpperCase()}</div>
          <div class="sidebar-user-info">
            <span class="sidebar-user-name">${user.displayName || user.email}</span>
            <span class="sidebar-user-role">${getRoleLabel ? getRoleLabel(user.role) : user.role}</span>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm w-full mt-sm" id="sidebar-logout-btn">
          Logout
        </button>
      </div>
    </aside>
  `;
}

/**
 * Attaches event listeners to the sidebar
 */
export function initSidebar() {
  // Nav item clicks
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      store.setState('currentPage', page);
    });
  });

  // Logout button
  const logoutBtn = document.getElementById('sidebar-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
    });
  }
}
