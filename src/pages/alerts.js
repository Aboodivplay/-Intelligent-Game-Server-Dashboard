import { store } from '../modules/data-store.js';
import { renderAlertCard } from '../components/alert-card.js';
import { applySuggestion } from '../modules/suggestion-engine.js';

export function renderAlerts() {
  const alerts = store.getState('alerts') || [];
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const pastAlerts = store.getState('alertHistory') || [];

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Predictive Alerts</h1>
        <p class="text-secondary mt-xs">AI-driven crash predictions and prevention suggestions</p>
      </div>
    </div>

    <div class="mt-lg">
      <h2 class="text-lg font-bold mb-md flex-between">
        <span>Active Predictions</span>
        ${activeAlerts.length > 0 ? `<span class="badge badge-red badge-pulse">${activeAlerts.length} Critical</span>` : ''}
      </h2>
      
      ${activeAlerts.length === 0 ? `
        <div class="card bg-card-muted text-center p-xl border-dashed border-glass text-secondary">
          <div class="text-4xl mb-sm">✨</div>
          <p>No active predictions. Server is running smoothly.</p>
        </div>
      ` : `
        <div class="flex-col gap-md">
          ${activeAlerts.map(alert => renderAlertCard(alert)).join('')}
        </div>
      `}
    </div>

    <div class="mt-xl pt-lg border-t border-glass">
      <h2 class="text-lg font-bold mb-md">Recent History (Last 24h)</h2>
      <div class="card overflow-hidden">
        <table class="data-table w-full text-left">
          <thead>
            <tr>
              <th class="p-sm text-secondary text-sm uppercase">Time</th>
              <th class="p-sm text-secondary text-sm uppercase">Prediction</th>
              <th class="p-sm text-secondary text-sm uppercase">Confidence</th>
              <th class="p-sm text-secondary text-sm uppercase">Outcome</th>
            </tr>
          </thead>
          <tbody>
            ${pastAlerts.slice(0, 5).map(alert => `
              <tr class="border-b border-glass hover:bg-glass">
                <td class="p-sm text-muted">${new Date(alert.timestamp).toLocaleTimeString()}</td>
                <td class="p-sm font-500">${alert.title}</td>
                <td class="p-sm">${alert.confidence.toFixed(1)}%</td>
                <td class="p-sm"><span class="badge ${alert.status === 'dismissed' ? 'badge-secondary' : 'badge-green'}">${alert.status}</span></td>
              </tr>
            `).join('')}
            ${pastAlerts.length === 0 ? `<tr><td colspan="4" class="p-md text-center text-muted">No historical alerts</td></tr>` : ''}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function initAlerts() {
  document.querySelectorAll('.suggestion-apply-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const alertId = e.target.dataset.alertId;
      const suggestionId = e.target.dataset.suggestionId;
      
      const btnEl = e.target;
      btnEl.disabled = true;
      btnEl.innerHTML = '<span class="animate-pulse">Applying...</span>';
      
      setTimeout(() => {
        applySuggestion(alertId, suggestionId);
      }, 800); // simulate network delay
    });
  });

  document.querySelectorAll('.alert-dismiss-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const alertId = e.target.dataset.id;
      import('../modules/prediction-engine.js').then(module => {
        module.dismissAlert(alertId);
      });
    });
  });
}
