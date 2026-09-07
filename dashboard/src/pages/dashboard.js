import { store } from '../modules/data-store.js';
import { renderGauge, updateGauge } from '../components/gauge.js';
import { renderSparkline, updateSparkline } from '../components/sparkline.js';

export function renderDashboard() {
  const telemetry = store.getState('telemetry') || {};
  const history = store.getState('telemetryHistory') || [];
  const uptime = store.getState('uptime') || '0h 0m';

  const cpuData = history.map(h => h.cpu);
  const ramData = history.map(h => (h.ram?.used || 0));
  const tpsData = history.map(h => h.tps);
  const entityData = history.map(h => h.entityCount);

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Real-Time Telemetry</h1>
        <p class="text-secondary mt-xs">Monitoring server health and predicting anomalies</p>
      </div>
      <div class="flex gap-md">
        <div class="stat-badge">
          <span class="text-muted text-xs uppercase">Uptime</span>
          <div class="font-bold" id="dash-uptime">${uptime}</div>
        </div>
        <div class="stat-badge">
          <span class="text-muted text-xs uppercase">Active Players</span>
          <div class="font-bold text-cyan" id="dash-players">${telemetry.activePlayers || 0}</div>
        </div>
      </div>
    </div>

    <div class="page-grid mt-lg">
      <!-- CPU Card -->
      <div class="card card-accent-cyan" style="animation-delay: 50ms">
        <div class="card-header">
          <h3 class="card-title">CPU Utilization</h3>
          <span class="badge badge-cyan badge-pulse">LIVE</span>
        </div>
        <div class="flex-between">
          ${renderGauge('cpu', 'Host CPU', telemetry.cpu || 0, 100, '%')}
          <div class="flex-col gap-sm flex-grow ml-lg">
            <div class="text-sm text-secondary">30-second trend</div>
            ${renderSparkline('cpu-spark', cpuData.slice(-30), 'accent-cyan', 40, 0, 100)}
          </div>
        </div>
      </div>

      <!-- RAM Card -->
      <div class="card card-accent-purple" style="animation-delay: 100ms">
        <div class="card-header">
          <h3 class="card-title">Memory Allocation</h3>
          <span class="text-sm text-muted" id="dash-ram-text">${(telemetry.ram?.used || 0).toFixed(1)} / ${(telemetry.ram?.total || 16)} GB</span>
        </div>
        <div class="flex-between">
          ${renderGauge('ram', 'Heap Usage', telemetry.ram?.used || 0, telemetry.ram?.total || 16, 'GB')}
          <div class="flex-col gap-sm flex-grow ml-lg">
            <div class="text-sm text-secondary">GC Pauses: <strong class="text-primary" id="dash-gc">${telemetry.gcPause || 0}ms</strong></div>
            ${renderSparkline('ram-spark', ramData.slice(-30), 'accent-purple', 40, 0, 16)}
          </div>
        </div>
      </div>

      <!-- TPS Card -->
      <div class="card card-accent-green" style="animation-delay: 150ms">
        <div class="card-header">
          <h3 class="card-title">Server TPS</h3>
          <span class="text-sm text-muted">Target: 20.0</span>
        </div>
        <div class="flex-between">
          <div class="gauge-container">
            <div id="dash-tps" class="text-3xl font-bold ${telemetry.tps < 18 ? 'text-amber' : (telemetry.tps < 15 ? 'text-red' : 'text-green')}">
              ${(telemetry.tps || 20).toFixed(1)}
            </div>
            <div class="gauge-label mt-xs">Ticks / Sec</div>
          </div>
          <div class="flex-col gap-sm flex-grow ml-lg">
             ${renderSparkline('tps-spark', tpsData.slice(-30), 'accent-green', 40, 0, 20)}
          </div>
        </div>
      </div>

      <!-- Entities Card -->
      <div class="card card-accent-amber" style="animation-delay: 200ms">
        <div class="card-header">
          <h3 class="card-title">World State</h3>
        </div>
        <div class="flex-between mt-sm">
          <div>
            <div class="text-sm text-secondary">Loaded Entities</div>
            <div class="text-2xl font-bold mt-xs" id="dash-entities">${telemetry.entityCount || 0}</div>
          </div>
          <div>
            <div class="text-sm text-secondary">Loaded Chunks</div>
            <div class="text-2xl font-bold mt-xs" id="dash-chunks">${telemetry.loadedChunks || 0}</div>
          </div>
        </div>
        <div class="mt-md pt-sm border-t border-glass">
          ${renderSparkline('entity-spark', entityData.slice(-60), 'accent-amber', 30)}
        </div>
      </div>
    </div>
  `;
}

export function initDashboard() {
  window.updateDashboardData = () => {
    const telemetry = store.getState('telemetry') || {};
    const history = store.getState('telemetryHistory') || [];
    const uptime = store.getState('uptime') || '0h 0m';

    // Update text elements
    const eUptime = document.getElementById('dash-uptime');
    const ePlayers = document.getElementById('dash-players');
    const eRamText = document.getElementById('dash-ram-text');
    const eGc = document.getElementById('dash-gc');
    const eTps = document.getElementById('dash-tps');
    const eEntities = document.getElementById('dash-entities');
    const eChunks = document.getElementById('dash-chunks');

    if (eUptime) eUptime.textContent = uptime;
    if (ePlayers) ePlayers.textContent = telemetry.activePlayers || 0;
    if (eRamText) eRamText.textContent = \`\${(telemetry.ram?.used || 0).toFixed(1)} / \${(telemetry.ram?.total || 16)} GB\`;
    if (eGc) eGc.textContent = \`\${telemetry.gcPause || 0}ms\`;
    if (eTps) {
      eTps.textContent = (telemetry.tps || 20).toFixed(1);
      eTps.className = \`text-3xl font-bold \${telemetry.tps < 18 ? 'text-amber' : (telemetry.tps < 15 ? 'text-red' : 'text-green')}\`;
    }
    if (eEntities) eEntities.textContent = telemetry.entityCount || 0;
    if (eChunks) eChunks.textContent = telemetry.loadedChunks || 0;

    // Update Gauges (this gives smooth circle animation)
    updateGauge('cpu', telemetry.cpu || 0, 100, '%');
    updateGauge('ram', telemetry.ram?.used || 0, telemetry.ram?.total || 16, 'GB');

    // Update Sparklines
    if (history.length > 0) {
      const cpuData = history.map(h => h.cpu);
      const ramData = history.map(h => (h.ram?.used || 0));
      const tpsData = history.map(h => h.tps);
      const entityData = history.map(h => h.entityCount);

      updateSparkline('cpu-spark', cpuData.slice(-30), 40, 0, 100);
      updateSparkline('ram-spark', ramData.slice(-30), 40, 0, 16);
      updateSparkline('tps-spark', tpsData.slice(-30), 40, 0, 20);
      updateSparkline('entity-spark', entityData.slice(-60), 30);
    }
  };
}
