import { store } from '../modules/data-store.js';
import { updateSession } from '../modules/auth.js';

export function renderSubscription() {
  return `
    <div class="page-header mb-xl">
      <div class="text-center w-full">
        <h1 class="page-title text-4xl mb-sm" style="font-family: 'VT323', monospace;">CHOOSE YOUR PLAN</h1>
        <p class="text-secondary">Unlock the full power of IGSO Engine for your server.</p>
      </div>
    </div>

    <div class="page-grid mt-lg max-w-5xl mx-auto" style="grid-template-columns: repeat(3, 1fr); gap: 24px;">
      
      <!-- Basic Plan -->
      <div class="card flex-col align-center text-center p-xl hover:border-cyan transition-normal border-glass" style="border-radius: 4px;">
        <h3 class="text-xl font-bold mb-xs" style="font-family: 'VT323', monospace;">BASIC</h3>
        <div class="text-4xl font-bold text-cyan mb-lg">$4.99<span class="text-sm text-secondary">/mo</span></div>
        <ul class="text-left text-sm text-secondary flex-col gap-sm mb-xl w-full">
          <li>✔ 1 Minecraft Server</li>
          <li>✔ Basic Telemetry</li>
          <li>✔ 24h Data Retention</li>
          <li class="text-muted">✖ Neural Net Predictions</li>
        </ul>
        <button class="btn btn-secondary w-full mt-auto select-plan" data-plan="basic">Select Basic</button>
      </div>

      <!-- Pro Plan -->
      <div class="card card-accent-cyan flex-col align-center text-center p-xl relative" style="border-radius: 4px; transform: scale(1.05); z-index: 10;">
        <div class="absolute top-0 right-0 bg-cyan text-black text-xs font-bold px-sm py-xs" style="border-bottom-left-radius: 4px;">MOST POPULAR</div>
        <h3 class="text-xl font-bold mb-xs text-cyan" style="font-family: 'VT323', monospace;">PRO ENGINE</h3>
        <div class="text-4xl font-bold text-primary mb-lg">$12.99<span class="text-sm text-secondary">/mo</span></div>
        <ul class="text-left text-sm text-secondary flex-col gap-sm mb-xl w-full">
          <li>✔ 3 Minecraft Servers</li>
          <li>✔ Real-Time Telemetry</li>
          <li>✔ 7-Day Data Retention</li>
          <li>✔ LSTM Neural Net Predictions</li>
          <li>✔ Auto-Remediation Engine</li>
        </ul>
        <button class="btn btn-primary w-full mt-auto select-plan" data-plan="pro">Select Pro</button>
      </div>

      <!-- Enterprise Plan -->
      <div class="card flex-col align-center text-center p-xl hover:border-purple transition-normal border-glass" style="border-radius: 4px;">
        <h3 class="text-xl font-bold mb-xs" style="font-family: 'VT323', monospace;">NETWORK</h3>
        <div class="text-4xl font-bold text-purple mb-lg">$29.99<span class="text-sm text-secondary">/mo</span></div>
        <ul class="text-left text-sm text-secondary flex-col gap-sm mb-xl w-full">
          <li>✔ Unlimited Servers</li>
          <li>✔ BungeeCord / Velocity Support</li>
          <li>✔ 30-Day Data Retention</li>
          <li>✔ Custom ML Models</li>
          <li>✔ Priority Support</li>
        </ul>
        <button class="btn btn-secondary w-full mt-auto select-plan" data-plan="network">Select Network</button>
      </div>

    </div>
  `;
}

export function initSubscription() {
  const buttons = document.querySelectorAll('.select-plan');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const plan = e.target.getAttribute('data-plan');
      
      // Simulate Stripe checkout
      e.target.textContent = 'Processing...';
      e.target.disabled = true;

      setTimeout(() => {
        // Update user session with subscription
        updateSession({ subscription: plan });
        
        // Move to link server page
        store.setState('currentPage', 'link_server');
      }, 1500);
    });
  });
}
