import { store } from './data-store.js';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const KNOWLEDGE_BASE = {
  entity_spike: [
    { action: 'Clear all dropped item entities in loaded chunks', impact: 40, risk: 'low', command: '/kill @e[type=item]', executable: true, category: 'Entity Management' },
    { action: 'Remove non-persistent hostile mobs beyond 5-chunk radius', impact: 30, risk: 'low', command: '/kill @e[type=!player,distance=..80]', executable: true, category: 'Entity Management' },
    { action: 'Reduce mob spawn rate by 50% temporarily', impact: 25, risk: 'medium', command: 'set mob-spawn-rate 50%', executable: true, category: 'Configuration' },
    { action: 'Investigate specific mod entity leaks in profiler', impact: 15, risk: 'low', command: null, executable: false, category: 'Diagnostics' }
  ],
  memory_leak: [
    { action: 'Force Java garbage collection cycle', impact: 60, risk: 'low', command: 'System.gc()', executable: true, category: 'Memory Management' },
    { action: 'Restart the leaking mod/plugin identified by profiler', impact: 50, risk: 'medium', command: 'reload plugin <name>', executable: true, category: 'Plugin Management' },
    { action: 'Reduce max allocated heap size and restart', impact: 70, risk: 'high', command: null, executable: false, category: 'Server Configuration' },
    { action: 'Clear cached chunk data for unloaded regions', impact: 35, risk: 'low', command: 'unload-chunks --inactive', executable: true, category: 'Memory Management' },
    { action: 'Schedule server restart during low-player window', impact: 95, risk: 'medium', command: null, executable: false, category: 'Server Management' }
  ],
  cpu_spike: [
    { action: 'Throttle tick rate of the identified heavy mod', impact: 35, risk: 'medium', command: 'throttle-mod <name> 5tps', executable: true, category: 'Performance Tuning' },
    { action: 'Disable redstone processing in non-player chunks', impact: 20, risk: 'low', command: 'set redstone-tick false --empty-chunks', executable: true, category: 'Configuration' },
    { action: 'Reduce view/simulation distance by 4 chunks', impact: 30, risk: 'low', command: 'set view-distance 8', executable: true, category: 'Configuration' },
    { action: 'Profile and identify CPU-heavy scripts for manual review', impact: 15, risk: 'low', command: '/spark profiler --start', executable: true, category: 'Diagnostics' }
  ],
  tps_degradation: [
    { action: 'Unload inactive chunks beyond 5-chunk radius', impact: 25, risk: 'low', command: 'unload-chunks --radius=5', executable: true, category: 'Chunk Management' },
    { action: 'Reduce entity processing to every other tick', impact: 20, risk: 'medium', command: 'set entity-tick-rate 2', executable: true, category: 'Performance Tuning' },
    { action: 'Temporarily disable non-essential world generation', impact: 15, risk: 'low', command: 'set generate-structures false', executable: true, category: 'Configuration' },
    { action: 'Clear pending scheduled tasks queue', impact: 30, risk: 'medium', command: 'clear-tasks --non-critical', executable: true, category: 'Task Management' }
  ],
  bandwidth_saturation: [
    { action: 'Reduce server render distance from 16 to 8 chunks', impact: 50, risk: 'low', command: 'set view-distance 8', executable: true, category: 'Network Optimization' },
    { action: 'Enable packet compression for all connections', impact: 30, risk: 'low', command: 'set network-compression 256', executable: true, category: 'Network Optimization' },
    { action: 'Throttle entity sync rate for distant entities', impact: 25, risk: 'medium', command: 'set entity-tracking-range 50%', executable: true, category: 'Network Optimization' },
    { action: 'Temporarily limit max players to reduce load', impact: 40, risk: 'medium', command: 'set max-players <current-20>', executable: false, category: 'Server Management' }
  ],
  cascading_failure: [
    { action: 'Initiate graceful server restart with 2-min player warning', impact: 100, risk: 'high', command: 'restart --graceful --warn=120', executable: false, category: 'Emergency' },
    { action: 'Enable safe-mode: disable all non-essential mods', impact: 80, risk: 'high', command: 'safe-mode --enable', executable: false, category: 'Emergency' },
    { action: 'Freeze world save and create backup snapshot', impact: 0, risk: 'low', command: 'save-all && backup-create', executable: true, category: 'Data Protection' },
    { action: 'Kick all players with reconnect message', impact: 60, risk: 'high', command: 'kickall "Server maintenance - reconnect in 2 minutes"', executable: false, category: 'Emergency' }
  ]
};

const suggestionsStore = new Map(); // alertId -> suggestions[]

/**
 * Generates an array of suggestion objects based on a prediction.
 * @param {Object} prediction 
 * @returns {Array}
 */
export function generateSuggestions(prediction) {
  const templates = KNOWLEDGE_BASE[prediction.anomalyType] || [];
  let suggestions = templates.map((t, idx) => ({
    id: uuidv4(),
    alertId: prediction.id,
    rank: idx + 1,
    action: t.action,
    impact: t.impact,
    risk: t.risk,
    command: t.command,
    executable: t.executable,
    category: t.category,
    status: 'pending',
    appliedAt: null,
    outcome: null
  }));

  suggestions.sort((a, b) => {
    let scoreA = a.impact;
    let scoreB = b.impact;
    if (prediction.severity !== 'critical') {
      if (a.risk === 'high') scoreA -= 50;
      if (b.risk === 'high') scoreB -= 50;
    }
    return scoreB - scoreA;
  });

  suggestions.forEach((s, idx) => s.rank = idx + 1);
  suggestionsStore.set(prediction.id, suggestions);
  return suggestions;
}

/**
 * Marks a suggestion as applied and logs it.
 * @param {string} alertId 
 * @param {string} suggestionId 
 * @returns {boolean}
 */
export function applySuggestion(alertId, suggestionId) {
  const suggestions = suggestionsStore.get(alertId);
  if (!suggestions) return false;
  
  const suggestion = suggestions.find(s => s.id === suggestionId);
  if (!suggestion) return false;

  suggestion.status = 'applied';
  suggestion.appliedAt = Date.now();

  const logEntry = {
    id: uuidv4(),
    timestamp: Date.now(),
    alertId,
    suggestionId,
    action: suggestion.action,
    category: suggestion.category,
    status: 'success'
  };

  const log = store.getState('remediationLog');
  store.setState('remediationLog', [logEntry, ...log]);

  store.emit('suggestion-applied', logEntry);
  return true;
}

/**
 * Marks a suggestion as rejected.
 * @param {string} alertId 
 * @param {string} suggestionId 
 * @returns {boolean}
 */
export function rejectSuggestion(alertId, suggestionId) {
  const suggestions = suggestionsStore.get(alertId);
  if (!suggestions) return false;
  
  const suggestion = suggestions.find(s => s.id === suggestionId);
  if (!suggestion) return false;

  suggestion.status = 'rejected';
  return true;
}

/**
 * Returns statistics on suggestions.
 * @returns {Object}
 */
export function getSuggestionStats() {
  const log = store.getState('remediationLog');
  const applied = log.length;
  const success = log.filter(l => l.status === 'success').length;
  
  const byCategory = {};
  log.forEach(l => {
    byCategory[l.category] = (byCategory[l.category] || 0) + 1;
  });

  let mostCommonType = 'None';
  let max = 0;
  for (const [cat, count] of Object.entries(byCategory)) {
    if (count > max) {
      max = count;
      mostCommonType = cat;
    }
  }

  return {
    applied,
    successRate: applied > 0 ? ((success / applied) * 100).toFixed(1) : 0,
    mostCommonType
  };
}
