import { store } from '../modules/data-store.js';

export function renderSettings() {
  const settings = store.getState('settings') || {};
  
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Admin Settings</h1>
        <p class="text-secondary mt-xs">System configuration and agent management</p>
      </div>
    </div>

    <div class="page-grid mt-lg">
      <div class="card" style="animation-delay: 50ms">
        <h3 class="card-title mb-md">General Settings</h3>
        
        <div class="input-group mb-md">
          <label class="form-label">Server Display Name</label>
          <input type="text" id="setting-server-name" class="form-input w-full mt-xs" value="${settings.serverName || 'MC-Modded-01'}">
        </div>
        
        <div class="input-group mb-md">
          <label class="form-label">Telemetry Interval (ms)</label>
          <input type="number" id="setting-interval" class="form-input w-full mt-xs" value="${settings.telemetryInterval || 1000}" step="100" min="500" max="5000">
        </div>
        
        <div class="mt-md border-t border-glass pt-sm">
          <button class="btn btn-primary" id="save-general-btn">Save Changes</button>
        </div>
      </div>
      
      <div class="card" style="animation-delay: 100ms">
        <h3 class="card-title mb-md">AI Prediction Engine</h3>
        
        <div class="mb-lg">
          <div class="flex-between mb-xs">
            <label class="form-label">Minimum Confidence Threshold</label>
            <span class="text-cyan font-bold" id="conf-display">${settings.confidenceThreshold || 70}%</span>
          </div>
          <p class="text-xs text-muted mb-sm">Alerts below this threshold will be silently logged instead of notifying administrators.</p>
          <input type="range" id="setting-confidence" class="w-full" min="50" max="99" value="${settings.confidenceThreshold || 70}">
        </div>
        
        <div class="flex-between align-center p-sm border border-glass rounded bg-glass">
          <div>
            <div class="font-500">Audio Alerts</div>
            <div class="text-xs text-secondary">Play sound for critical predictions</div>
          </div>
          <label class="toggle-switch toggle-sm">
            <input type="checkbox" id="setting-sound" ${settings.alertSound !== false ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
      
      <div class="card" style="animation-delay: 150ms">
        <h3 class="card-title mb-md">Edge Agent Status</h3>
        
        <div class="flex gap-md align-center mb-md">
          <div class="health-ring" style="width: 60px; height: 60px; border-radius: 50%; background: var(--bg-secondary); border: 4px solid var(--accent-green); flex-shrink: 0;"></div>
          <div>
            <div class="text-green font-bold">CONNECTED</div>
            <div class="text-xs text-secondary mt-xs">Latency: 14ms | Last Ping: Just now</div>
          </div>
        </div>
        
        <div class="bg-black p-sm rounded font-mono text-xs text-muted border border-glass">
          Agent Version: v1.0.4-beta<br>
          Host OS: Ubuntu 22.04 LTS<br>
          CPU overhead: 2.1% (Compliant)
        </div>
        
        <div class="mt-md flex gap-sm">
          <button class="btn btn-secondary btn-sm flex-grow">Restart Agent</button>
          <button class="btn btn-danger btn-sm">Disconnect</button>
        </div>
      </div>
    </div>
  `;
}

export function initSettings() {
  const confSlider = document.getElementById('setting-confidence');
  const confDisplay = document.getElementById('conf-display');
  
  if (confSlider && confDisplay) {
    confSlider.addEventListener('input', (e) => {
      confDisplay.textContent = e.target.value + '%';
    });
    
    confSlider.addEventListener('change', (e) => {
      const settings = store.getState('settings') || {};
      store.setState('settings', { ...settings, confidenceThreshold: parseInt(e.target.value) });
    });
  }
  
  document.getElementById('setting-sound')?.addEventListener('change', (e) => {
    const settings = store.getState('settings') || {};
    store.setState('settings', { ...settings, alertSound: e.target.checked });
  });
  
  document.getElementById('save-general-btn')?.addEventListener('click', () => {
    const name = document.getElementById('setting-server-name').value;
    const interval = parseInt(document.getElementById('setting-interval').value);
    
    const settings = store.getState('settings') || {};
    store.setState('settings', { 
      ...settings, 
      serverName: name,
      telemetryInterval: interval
    });
    
    const btn = document.getElementById('save-general-btn');
    btn.textContent = 'Saved!';
    btn.classList.add('bg-accent-green');
    
    setTimeout(() => {
      btn.textContent = 'Save Changes';
      btn.classList.remove('bg-accent-green');
    }, 2000);
  });
}
