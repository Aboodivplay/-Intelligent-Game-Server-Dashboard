import { store } from '../modules/data-store.js';
import { updateSession } from '../modules/auth.js';

export function renderLinkServer() {
  // Generate a random code if we don't have one
  let code = store.getState('pendingServerCode');
  if (!code) {
    code = 'IGSO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    store.setState('pendingServerCode', code);
  }

  return `
    <div class="page-header mb-xl">
      <div class="text-center w-full">
        <h1 class="page-title text-4xl mb-sm text-cyan" style="font-family: 'VT323', monospace;">LINK YOUR SERVER</h1>
        <p class="text-secondary">Your subscription is active. Now, let's connect your Minecraft server to the Engine.</p>
      </div>
    </div>

    <div class="card max-w-2xl mx-auto p-xl text-center" style="border-radius: 4px; border: 1px solid var(--accent-cyan);">
      <h3 class="text-lg font-bold mb-md">Your Unique License Code</h3>
      
      <div class="bg-secondary p-lg mb-lg border border-glass" style="border-radius: 4px;">
        <div class="text-5xl font-mono text-cyan tracking-wider font-bold" id="license-code">${code}</div>
      </div>

      <div class="text-left text-sm text-secondary bg-black bg-opacity-50 p-md rounded mb-lg">
        <p class="mb-sm"><strong class="text-primary">Step 1:</strong> Start your Minecraft server with the IGSO Telemetry Mod installed.</p>
        <p class="mb-sm"><strong class="text-primary">Step 2:</strong> Join the game as a Server Operator (OP).</p>
        <p><strong class="text-primary">Step 3:</strong> Run the following command in chat:</p>
        <code class="block mt-xs bg-black p-sm text-green font-mono border border-glass">/igso link ${code}</code>
      </div>

      <div class="flex-col align-center justify-center gap-sm mt-xl">
        <div class="loader inline-block" style="width: 24px; height: 24px; border: 3px solid var(--glass-border); border-top-color: var(--accent-cyan); border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p class="text-sm text-cyan animate-pulse">Waiting for server connection...</p>
      </div>
      
      <!-- Hidden bypass button for testing without the mod -->
      <button id="bypass-link-btn" class="btn btn-sm mt-xl text-muted" style="background: transparent; border: 1px dashed var(--glass-border); opacity: 0.3;">Bypass (Dev Only)</button>
    </div>
  `;
}

export function initLinkServer() {
  const code = store.getState('pendingServerCode');
  const backendUrl = store.getState('backendUrl') || 'http://127.0.0.1:5000';
  
  // Register the code with the Python backend so it knows what to listen for
  fetch(`${backendUrl}/api/register_license`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: code })
  }).catch(e => console.warn('Could not register code with backend:', e));

  // Poll the backend to see if the mod has successfully linked
  const pollInterval = setInterval(async () => {
    try {
      const res = await fetch(`${backendUrl}/api/check_license_status?code=${code}`);
      if (res.ok) {
        const data = await res.json();
        if (data.linked) {
          clearInterval(pollInterval);
          finishLinking(code);
        }
      }
    } catch (e) {
      // ignore
    }
  }, 2000);

  // Dev bypass button
  const bypassBtn = document.getElementById('bypass-link-btn');
  if (bypassBtn) {
    bypassBtn.addEventListener('click', () => {
      clearInterval(pollInterval);
      finishLinking(code);
    });
  }

  // Cleanup
  store.subscribe('currentPage', (page) => {
    if (page !== 'link_server') clearInterval(pollInterval);
  });
}

function finishLinking(code) {
  // Update local session
  updateSession({ serverCode: code });
  // Route to dashboard
  store.setState('currentPage', 'dashboard');
}
