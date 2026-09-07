/**
 * Topbar Component
 * Displays server status, current user, and global notifications
 */
import { store } from '../modules/data-store.js';
import { getCurrentUser, getRoleBadgeClass } from '../modules/auth.js';

export function renderTopbar() {
  const user = getCurrentUser();
  if (!user) return '';

  const serverStatus = store.getState('serverStatus') || 'online';
  const settings = store.getState('settings') || {};
  const serverName = settings.serverName || 'MC-Modded-01';
  
  const statusColor = serverStatus === 'online' ? 'green' : (serverStatus === 'warning' ? 'amber' : 'red');
  const statusText = serverStatus.charAt(0).toUpperCase() + serverStatus.slice(1);

  return `
    <header class="topbar" id="topbar">
      <div class="topbar-left">
        <div class="server-status-indicator">
          <span class="status-dot status-dot--${serverStatus}"></span>
          <span class="status-text text-${statusColor}">${serverName} - ${statusText}</span>
        </div>
      </div>
      <div class="topbar-right">
        <div class="topbar-action">
          <span class="notification-bell">🔔</span>
        </div>
        <div class="topbar-user">
          <span class="badge ${getRoleBadgeClass(user.role)}">${user.displayName || user.email}</span>
        </div>
      </div>
    </header>
  `;
}
