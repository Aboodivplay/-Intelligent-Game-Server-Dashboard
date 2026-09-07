/**
 * Main Application Shell and Router
 */
import { store } from './modules/data-store.js';
import { getCurrentUser, hasPermission } from './modules/auth.js';
import { startSimulation, stopSimulation } from './modules/telemetry-simulator.js';
import { startPredictions, stopPredictions } from './modules/prediction-engine.js';

// Components
import { renderSidebar, initSidebar } from './components/sidebar.js';
import { renderTopbar } from './components/topbar.js';

// Pages
import { renderLogin, initLogin } from './pages/login.js';
import { renderDashboard, initDashboard } from './pages/dashboard.js';
import { renderAlerts, initAlerts } from './pages/alerts.js';
import { renderRemediation, initRemediation } from './pages/remediation.js';
import { renderHistory, initHistory } from './pages/history.js';
import { renderSettings, initSettings } from './pages/settings.js';
import { renderPlayerAnalytics, initPlayerAnalytics } from './pages/player-analytics.js';
import { renderSubscription, initSubscription } from './pages/subscription.js';
import { renderLinkServer, initLinkServer } from './pages/link-server.js';

class App {
  constructor() {
    this.root = document.getElementById('app');
    this.init();
  }

  init() {
    // Listen for page changes
    store.subscribe('currentPage', () => this.render());
    
    // Listen for data updates to re-render if on a data-heavy page
    store.subscribe('telemetry', () => {
      if (store.getState('currentPage') === 'dashboard') {
        if (window.updateDashboardData) {
          window.updateDashboardData();
        } else {
          this.renderContentOnly();
        }
      }
    });
    
    store.subscribe('alerts', () => {
      const currentPage = store.getState('currentPage');
      // Update the notification bell count
      const bellCount = document.querySelector('.notification-count');
      if (bellCount) {
        const alerts = store.getState('alerts') || [];
        bellCount.textContent = alerts.length;
        if (alerts.length > 0) bellCount.classList.remove('hidden');
        else bellCount.classList.add('hidden');
      }

      // Only re-render content if on the alerts page
      if (currentPage === 'alerts') {
        this.renderContentOnly();
      }
    });

    store.subscribe('remediationRules', () => {
      if (store.getState('currentPage') === 'remediation') this.renderContentOnly();
    });

    // Start simulation when user logs in
    store.subscribe('currentUser', (user) => {
      if (user) {
        startSimulation();
        startPredictions();
      } else {
        stopSimulation();
        stopPredictions();
      }
    });

    // Initial render
    this.render();
  }

  render() {
    const currentPage = store.getState('currentPage');
    const user = getCurrentUser();

    if (currentPage === 'login' || !user) {
      if (currentPage !== 'login') store.setState('currentPage', 'login');
      this.root.innerHTML = renderLogin();
      initLogin();
      return;
    }

    // Check permissions
    if (!hasPermission(currentPage)) {
      if (!user.subscription) store.setState('currentPage', 'subscription');
      else if (!user.serverCode) store.setState('currentPage', 'link_server');
      else store.setState('currentPage', 'dashboard');
      return;
    }

    // Render app shell (sidebar + topbar + main content)
    this.root.innerHTML = `
      <div class="app-layout">
        ${renderSidebar()}
        <div class="main-wrapper" style="flex-grow: 1;">
          ${renderTopbar()}
          <main class="main-content" id="main-content">
            ${this.getPageContent(currentPage)}
          </main>
        </div>
      </div>
    `;

    // Initialize all components
    initSidebar();
    this.initPageLogic(currentPage);
  }

  // Optimized re-render for just the main content area (avoids flashing sidebar)
  renderContentOnly() {
    const currentPage = store.getState('currentPage');
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = this.getPageContent(currentPage);
      this.initPageLogic(currentPage);
    }
  }

  getPageContent(page) {
    switch (page) {
      case 'subscription': return renderSubscription();
      case 'link_server': return renderLinkServer();
      case 'dashboard': return renderDashboard();
      case 'alerts': return renderAlerts();
      case 'remediation': return renderRemediation();
      case 'history': return renderHistory();
      case 'settings': return renderSettings();
      case 'analytics': return renderPlayerAnalytics();
      default: return `<div>Page not found</div>`;
    }
  }

  initPageLogic(page) {
    switch (page) {
      case 'subscription': initSubscription(); break;
      case 'link_server': initLinkServer(); break;
      case 'dashboard': initDashboard(); break;
      case 'alerts': initAlerts(); break;
      case 'remediation': initRemediation(); break;
      case 'history': initHistory(); break;
      case 'settings': initSettings(); break;
      case 'analytics': initPlayerAnalytics(); break;
    }
  }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
