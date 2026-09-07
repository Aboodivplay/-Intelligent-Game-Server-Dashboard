import { store } from '../modules/data-store.js';

let serverConfig = {
  autoClearTnt: false,
  autoClearItems: false,
  autoKillHostiles: false
};

// Fetch initial config from backend
async function fetchConfig() {
  try {
    const url = store.getState('backendUrl') || 'http://127.0.0.1:5000';
    const res = await fetch(`${url}/api/config`);
    if (res.ok) {
      serverConfig = await res.json();
      renderContentOnly();
    }
  } catch (e) {}
}

// Toggle and save config
window.toggleServerRule = async (key) => {
  serverConfig[key] = !serverConfig[key];
  renderContentOnly(); // optimistic update
  
  try {
    const url = store.getState('backendUrl') || 'http://127.0.0.1:5000';
    await fetch(`${url}/api/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: serverConfig[key] })
    });
  } catch (e) {
    // Revert on failure
    serverConfig[key] = !serverConfig[key];
    renderContentOnly();
  }
};

export function renderRemediation() {
  const manualOverride = store.getState('settings')?.manualOverride || false;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Remediation Controls</h1>
        <p class="text-secondary mt-xs">Manage automated rules and manual overrides</p>
      </div>
      <div class="flex gap-sm">
        ${manualOverride ? '<span class="badge badge-amber badge-pulse">MANUAL OVERRIDE ACTIVE</span>' : ''}
      </div>
    </div>

    <div id="remediation-content">
      ${renderInnerContent()}
    </div>
  `;
}

function renderInnerContent() {
  const manualOverride = store.getState('settings')?.manualOverride || false;

  return `
    <div class="page-grid mt-lg">
      
      <!-- New Minecraft Server Config Panel -->
      <div class="card col-span-2">
        <div class="card-header border-b border-glass pb-md">
          <h2 class="card-title flex align-center gap-sm">
            <span>🎮 Minecraft In-Game Rules</span>
            <span class="badge badge-cyan">Live Sync</span>
          </h2>
          <p class="text-sm text-secondary mt-xs">Changes here instantly update the IOGS mod running on the Minecraft server.</p>
        </div>
        <div class="card-body pt-md flex-col gap-md">
          
          <div class="flex-between p-md bg-card-muted border border-glass radius-md hover:bg-glass transition">
            <div>
              <div class="font-bold text-red">🧨 Auto-Clear TNT</div>
              <div class="text-sm text-secondary">Executes /kill @e[type=tnt] if primed TNT count exceeds 20 in a chunk.</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" onchange="toggleServerRule('autoClearTnt')" ${serverConfig.autoClearTnt ? 'checked' : ''} ${manualOverride ? 'disabled' : ''}>
              <div class="toggle-slider"></div>
            </label>
          </div>

          <div class="flex-between p-md bg-card-muted border border-glass radius-md hover:bg-glass transition">
            <div>
              <div class="font-bold text-green">📦 Auto-Clear Dropped Items</div>
              <div class="text-sm text-secondary">Executes /kill @e[type=item] if dropped items exceed 300.</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" onchange="toggleServerRule('autoClearItems')" ${serverConfig.autoClearItems ? 'checked' : ''} ${manualOverride ? 'disabled' : ''}>
              <div class="toggle-slider"></div>
            </label>
          </div>

          <div class="flex-between p-md bg-card-muted border border-glass radius-md hover:bg-glass transition">
            <div>
              <div class="font-bold text-purple">🧟 Auto-Kill Hostile Mobs</div>
              <div class="text-sm text-secondary">Executes /kill command for zombies, skeletons, creepers if mob density causes severe TPS drop.</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" onchange="toggleServerRule('autoKillHostiles')" ${serverConfig.autoKillHostiles ? 'checked' : ''} ${manualOverride ? 'disabled' : ''}>
              <div class="toggle-slider"></div>
            </label>
          </div>

        </div>
      </div>
      
      <!-- Existing GP1 Rules below -->
      <div class="card col-span-2 mt-md">
        <div class="card-header">
          <h2 class="card-title">Simulated Dashboard Rules</h2>
        </div>
        <div class="card-body p-xl text-center text-muted border-dashed border-glass m-md">
          Legacy GP1 configuration rules have been disabled in favor of live Minecraft server sync.
        </div>
      </div>

    </div>
  `;
}

function renderContentOnly() {
  const container = document.getElementById('remediation-content');
  if (container) {
    container.innerHTML = renderInnerContent();
  }
}

export function initRemediation() {
  fetchConfig();
}
