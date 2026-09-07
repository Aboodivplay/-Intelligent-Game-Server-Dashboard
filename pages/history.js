import { store } from '../modules/data-store.js';

export function renderHistory() {
  const alertHistory = store.getState('alertHistory') || [];
  
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">History & Export</h1>
        <p class="text-secondary mt-xs">Review past telemetry, alerts, and export data</p>
      </div>
      <div class="flex gap-sm">
        <button class="btn btn-secondary" id="export-csv-btn">📊 Export CSV</button>
        <button class="btn btn-secondary" id="export-json-btn">🗄️ Export JSON</button>
      </div>
    </div>

    <div class="page-grid mt-lg">
      <div class="card col-span-2">
        <h3 class="card-title mb-md">Past Predictions Log</h3>
        <div class="overflow-x-auto">
          <table class="data-table w-full text-left">
            <thead>
              <tr>
                <th class="p-sm text-secondary text-sm uppercase">Timestamp</th>
                <th class="p-sm text-secondary text-sm uppercase">Type</th>
                <th class="p-sm text-secondary text-sm uppercase">Confidence</th>
                <th class="p-sm text-secondary text-sm uppercase">Root Cause</th>
                <th class="p-sm text-secondary text-sm uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              ${alertHistory.map(alert => `
                <tr class="border-b border-glass hover:bg-glass">
                  <td class="p-sm text-muted">${new Date(alert.timestamp).toLocaleString()}</td>
                  <td class="p-sm font-500 ${alert.severity === 'critical' ? 'text-red' : 'text-amber'}">${alert.title}</td>
                  <td class="p-sm">${alert.confidence.toFixed(1)}%</td>
                  <td class="p-sm text-secondary truncate" style="max-width: 200px">${alert.rootCause}</td>
                  <td class="p-sm"><span class="badge ${alert.status === 'dismissed' ? 'badge-secondary' : 'badge-green'}">${alert.status}</span></td>
                </tr>
              `).join('')}
              ${alertHistory.length === 0 ? `<tr><td colspan="5" class="p-xl text-center text-muted">No historical data available yet.</td></tr>` : ''}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function initHistory() {
  document.getElementById('export-csv-btn')?.addEventListener('click', () => {
    alert('Simulating CSV export... In production this would download historical telemetry & prediction logs.');
  });
  
  document.getElementById('export-json-btn')?.addEventListener('click', () => {
    const data = {
      telemetry: store.getState('telemetryHistory'),
      alerts: store.getState('alertHistory'),
      remediation: store.getState('remediationLog')
    };
    
    // Create and trigger download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `igso-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
