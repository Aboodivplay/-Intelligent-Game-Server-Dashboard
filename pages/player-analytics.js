import { store } from '../modules/data-store.js';

let pollInterval = null;
let latestData = { players: [], lag_culprits: [] };
let fetchError = false;

async function fetchPlayerData() {
  try {
    const url = store.getState('backendUrl') || 'http://127.0.0.1:5000';
    const response = await fetch(`${url}/api/players`);
    if (response.ok) {
      latestData = await response.json();
      fetchError = false;
    } else {
      fetchError = true;
    }
  } catch (error) {
    fetchError = true;
  }
  
  // Only re-render if we are still on the analytics page
  if (store.getState('currentPage') === 'analytics') {
    renderContentOnly();
  }
}

export function renderPlayerAnalytics() {
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Player Analytics</h1>
        <p class="text-secondary mt-xs">Real-time telemetry and lag attribution from the Forge Server Mod</p>
      </div>
      <div class="flex align-center gap-sm">
        ${fetchError 
          ? `<span class="badge badge-red badge-pulse">Backend Disconnected</span>` 
          : `<span class="badge badge-green badge-pulse">Backend Connected</span>`}
      </div>
    </div>

    <div id="analytics-content">
      ${renderInnerContent()}
    </div>
  `;
}

function renderInnerContent() {
  if (fetchError) {
    return `
      <div class="card bg-card-muted text-center p-xl border-dashed border-glass text-secondary mt-lg">
        <div class="text-4xl mb-sm">🔌</div>
        <h3 class="text-lg text-primary mb-xs">Cannot reach Python Backend</h3>
        <p class="text-sm">Ensure the backend server (<code>server.py</code>) is running on port 5000.</p>
        <p class="text-xs text-muted mt-md">To test this UI without the real Minecraft mod, you can run a script to send mock POST data to the backend.</p>
      </div>
    `;
  }

  const { players, lag_culprits } = latestData;

  return `
    <!-- Lag Culprits Section (Only show if there are culprits) -->
    ${lag_culprits.length > 0 ? `
      <div class="mt-lg" style="animation-delay: 50ms">
        <h2 class="text-lg font-bold mb-md flex-between">
          <span>⚠️ High Lag Risk Detected</span>
        </h2>
        <div class="page-grid">
          ${lag_culprits.map(culprit => `
            <div class="card card-accent-red">
              <div class="card-header border-0 mb-0 pb-0">
                <h3 class="card-title text-red">${culprit.playerName}</h3>
                <span class="badge badge-red">Risk Score: ${culprit.riskScore}</span>
              </div>
              <div class="card-body mt-md">
                <p class="text-sm text-secondary">Identified Cause:</p>
                <p class="font-bold text-primary">${culprit.cause}</p>
                <div class="mt-sm text-sm text-muted">Location: Chunk [${culprit.chunk}]</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- All Players Table -->
    <div class="mt-xl pt-lg border-t border-glass" style="animation-delay: 100ms">
      <h2 class="text-lg font-bold mb-md flex-between">
        <span>Active Players Online: ${players.length}</span>
      </h2>
      <div class="card overflow-hidden p-0">
        <div class="overflow-x-auto">
          <table class="data-table w-full text-left">
            <thead class="bg-card-hover">
              <tr>
                <th class="p-md text-secondary text-sm uppercase">Player</th>
                <th class="p-md text-secondary text-sm uppercase">Ping</th>
                <th class="p-md text-secondary text-sm uppercase">XYZ</th>
                <th class="p-md text-secondary text-sm uppercase">Chunk (X, Z)</th>
                <th class="p-md text-secondary text-sm uppercase">Lag Risk</th>
              </tr>
            </thead>
            <tbody>
              ${players.length > 0 ? players.map(p => `
                <tr class="border-b border-glass hover:bg-glass">
                  <td class="p-md font-bold text-cyan">${p.name}</td>
                  <td class="p-md">
                    <span class="${p.ping < 50 ? 'text-green' : (p.ping < 150 ? 'text-amber' : 'text-red')} font-bold">
                      ${p.ping} ms
                    </span>
                  </td>
                  <td class="p-md text-muted font-mono text-sm">
                    ${p.x}, ${p.y}, ${p.z}
                  </td>
                  <td class="p-md text-muted font-mono text-sm">
                    [${p.chunkX}, ${p.chunkZ}]
                  </td>
                  <td class="p-md">
                    ${p.lagRisk > 0 
                      ? `<div class="flex-col gap-xs">
                          <span class="badge ${p.lagRisk > 40 ? 'badge-red' : 'badge-amber'} badge-sm">Score: ${p.lagRisk}</span>
                          <span class="text-xs text-secondary truncate max-w-full" style="max-width: 150px" title="${p.riskCause}">${p.riskCause}</span>
                         </div>`
                      : `<span class="badge badge-gray badge-sm">Safe</span>`
                    }
                  </td>
                </tr>
              `).join('') : `
                <tr><td colspan="5" class="p-xl text-center text-muted">No players currently connected.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderContentOnly() {
  const container = document.getElementById('analytics-content');
  if (container) {
    container.innerHTML = renderInnerContent();
  }
}

export function initPlayerAnalytics() {
  // Fetch immediately
  fetchPlayerData();
  
  // Start polling
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(fetchPlayerData, 1000);
  
  // Cleanup when navigating away
  const unsubscribe = store.subscribe('currentPage', (page) => {
    if (page !== 'analytics') {
      clearInterval(pollInterval);
      pollInterval = null;
    }
  });
}
