/**
 * Simple reactive state management store.
 */

const listeners = new Map();
const customEvents = new Map();

const state = {
  currentUser: null,
  currentPage: 'login',
  telemetry: {},
  telemetryHistory: [],
  alerts: [],
  alertHistory: [],
  remediationRules: [
    { id: 1, name: 'Clear Dropped Entities', anomalyType: 'entity_spike', action: 'clear_entities', enabled: true, threshold: 80, risk: 'low' },
    { id: 2, name: 'Force Garbage Collection', anomalyType: 'memory_leak', action: 'force_gc', enabled: true, threshold: 75, risk: 'low' },
    { id: 3, name: 'Throttle Mod Tick Rate', anomalyType: 'cpu_spike', action: 'throttle_mod', enabled: true, threshold: 85, risk: 'medium' },
    { id: 4, name: 'Reduce Render Distance', anomalyType: 'bandwidth_saturation', action: 'reduce_render', enabled: false, threshold: 90, risk: 'low' },
    { id: 5, name: 'Unload Inactive Chunks', anomalyType: 'tps_degradation', action: 'unload_chunks', enabled: true, threshold: 70, risk: 'low' },
    { id: 6, name: 'Graceful Server Restart', anomalyType: 'cascading_failure', action: 'restart_server', enabled: false, threshold: 95, risk: 'high' }
  ],
  remediationLog: [],
  settings: {
    confidenceThreshold: 70,
    autoRemediationEnabled: true,
    alertSound: true,
    telemetryInterval: 1000,
    serverName: 'MC-Modded-01'
  },
  serverStatus: 'online',
  predictionAccuracy: 84.7
};

export const store = {
  state,
  listeners,

  /**
   * Updates state and notifies listeners.
   * @param {string} key - State key to update
   * @param {any} value - New value
   */
  setState(key, value) {
    this.state[key] = value;
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(callback => callback(value));
    }
  },

  /**
   * Returns state value.
   * @param {string} key - State key
   * @returns {any}
   */
  getState(key) {
    return this.state[key];
  },

  /**
   * Registers listener for state changes.
   * @param {string} key - State key to subscribe to
   * @param {Function} callback - Callback function
   */
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
  },

  /**
   * Custom event emission.
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  emit(event, data) {
    if (customEvents.has(event)) {
      customEvents.get(event).forEach(callback => callback(data));
    }
  },

  /**
   * Custom event listener.
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!customEvents.has(event)) {
      customEvents.set(event, []);
    }
    customEvents.get(event).push(callback);
  }
};
