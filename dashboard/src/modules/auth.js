import { store } from './data-store.js';

// LocalStorage key for mock users database
const USERS_DB_KEY = 'igso_users_db';
// LocalStorage key for active session
const SESSION_KEY = 'igso_active_session';

// Initialize mock DB
if (!localStorage.getItem(USERS_DB_KEY)) {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify([
    { email: 'admin@igso.com', password: 'password', role: 'admin', subscription: 'pro', serverCode: 'IGSO-1A2B3C' }
  ]));
}

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_DB_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const user = JSON.parse(session);
      store.setState('currentUser', user);
      return user;
    }
  } catch (e) {
    console.error('Error parsing session', e);
  }
  return null;
}

export async function login(email, password) {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 800));
  
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Hide password from session
    const sessionUser = { ...user };
    delete sessionUser.password;
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    store.setState('currentUser', sessionUser);
    
    // Route based on state
    if (!sessionUser.subscription) {
      store.setState('currentPage', 'subscription');
    } else if (!sessionUser.serverCode) {
      store.setState('currentPage', 'link_server');
    } else {
      store.setState('currentPage', 'dashboard');
    }
    return { success: true };
  } else {
    return { success: false, error: 'Invalid email or password.' };
  }
}

export async function register(email, password) {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 800));
  
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email already registered.' };
  }
  
  const newUser = {
    email,
    password,
    role: 'user',
    subscription: null,
    serverCode: null
  };
  
  users.push(newUser);
  saveUsers(users);
  
  // Auto login
  return await login(email, password);
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  store.setState('currentUser', null);
  store.setState('currentPage', 'login');
}

export function updateSession(updates) {
  const current = getCurrentUser();
  if (current) {
    const updated = { ...current, ...updates };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    store.setState('currentUser', updated);
    
    // Update DB
    const users = getUsers();
    const index = users.findIndex(u => u.email === updated.email);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      saveUsers(users);
    }
  }
}

export function hasPermission(page) {
  const user = getCurrentUser();
  if (!user) return false;
  if (page === 'subscription' || page === 'link_server') return true;
  if (!user.subscription || !user.serverCode) return false;
  return true;
}
export function getRoleBadgeClass(role) {
  if (role === 'admin') return 'badge-purple';
  return 'badge-cyan';
}

export function getRoleLabel(role) {
  return role ? role.toUpperCase() : 'USER';
}
