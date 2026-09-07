import { login, register } from '../modules/auth.js';

let isRegistering = false;

export function renderLogin() {
  return `
    <div class="login-page">
      <div class="card login-card">
        <div class="login-logo mb-lg text-center" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
          <img src="src/assets/logo.jpg" alt="IGSO Logo" style="height: 64px; border-radius: 8px; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);">
          <h1 class="login-title text-3xl font-bold" style="font-family: 'VT323', monospace;">IGSO Engine</h1>
          <p class="text-secondary text-sm mt-xs">${isRegistering ? 'Create a new account' : 'Sign in to manage your servers'}</p>
        </div>

        <form id="login-form" class="flex-col gap-md">
          <div class="input-group">
            <label class="form-label" for="email">Email Address</label>
            <input type="email" id="email" class="form-input w-full" placeholder="admin@igso.com" required>
          </div>
          
          <div class="input-group mt-md">
            <label class="form-label" for="password">Password</label>
            <input type="password" id="password" class="form-input w-full" placeholder="••••••••" required>
          </div>

          <div id="login-error" class="login-error hidden mt-sm bg-red-900 bg-opacity-20 border border-red-500 p-sm rounded text-red text-sm"></div>

          <button type="submit" id="submit-btn" class="btn btn-primary btn-lg w-full mt-lg" style="font-family: 'VT323', monospace; font-size: 1.2rem; letter-spacing: 1px;">
            ${isRegistering ? 'CREATE ACCOUNT' : 'LOGIN'}
          </button>
        </form>
        
        <div class="text-center mt-lg text-sm text-secondary">
          ${isRegistering ? 'Already have an account?' : 'Need an account?'} 
          <a href="#" id="toggle-mode" class="text-cyan font-bold">${isRegistering ? 'Sign In' : 'Register'}</a>
        </div>
      </div>
    </div>
  `;
}

export function initLogin() {
  const form = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');
  const toggleBtn = document.getElementById('toggle-mode');
  const submitBtn = document.getElementById('submit-btn');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isRegistering = !isRegistering;
      // Re-render the login page without changing the route
      document.getElementById('app').innerHTML = renderLogin();
      initLogin();
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      errorEl.classList.add('hidden');
      submitBtn.textContent = 'PLEASE WAIT...';
      submitBtn.disabled = true;

      try {
        const result = isRegistering ? await register(email, password) : await login(email, password);
        
        if (!result.success) {
          errorEl.textContent = result.error;
          errorEl.classList.remove('hidden');
          submitBtn.textContent = isRegistering ? 'CREATE ACCOUNT' : 'LOGIN';
          submitBtn.disabled = false;
        }
        // If success, the app.js store subscriber will automatically handle routing!
      } catch (err) {
        errorEl.textContent = 'An unexpected error occurred.';
        errorEl.classList.remove('hidden');
        submitBtn.textContent = isRegistering ? 'CREATE ACCOUNT' : 'LOGIN';
        submitBtn.disabled = false;
      }
    });
  }
}
