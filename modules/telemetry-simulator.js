import { store } from './data-store.js';

let intervalId = null;

let baseCpu = 35;
let baseRam = 6;
let baseTps = 20;
let baseEntities = 300;
let basePlayers = 45;
let baseBandwidthIn = 15;
let baseBandwidthOut = 25;
let baseChunks = 1500;
let baseGcPause = 10;
let uptimeHours = 120.5;

let currentPattern = 'NORMAL';
let patternTimer = 0;

const PATTERNS = ['NORMAL', 'ENTITY_SPIKE', 'MEMORY_LEAK', 'CPU_OVERLOAD', 'BANDWIDTH_SPIKE'];

/**
 * Starts the telemetry simulation.
 */
export function startSimulation() {
  if (intervalId) return;
  const interval = store.getState('settings').telemetryInterval || 1000;
  intervalId = setInterval(generateTelemetry, interval);
}

/**
 * Stops the telemetry simulation.
 */
export function stopSimulation() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/**
 * Generates a single telemetry snapshot and updates the store.
 */
function generateTelemetry() {
  patternTimer++;
  if (patternTimer > 30) {
    patternTimer = 0;
    const rand = Math.random();
    if (rand < 0.70) currentPattern = 'NORMAL';
    else if (rand < 0.80) currentPattern = 'ENTITY_SPIKE';
    else if (rand < 0.88) currentPattern = 'MEMORY_LEAK';
    else if (rand < 0.95) currentPattern = 'CPU_OVERLOAD';
    else currentPattern = 'BANDWIDTH_SPIKE';
  }

  // Smooth transitions based on pattern
  if (currentPattern === 'NORMAL') {
    baseCpu += (35 - baseCpu) * 0.1 + (Math.random() * 4 - 2);
    baseEntities += (300 - baseEntities) * 0.1 + (Math.random() * 10 - 5);
    baseRam += (6 - baseRam) * 0.05 + (Math.random() * 0.2 - 0.1);
    baseTps += (20 - baseTps) * 0.1;
    baseBandwidthOut += (25 - baseBandwidthOut) * 0.1;
    baseGcPause += (10 - baseGcPause) * 0.1;
  } else if (currentPattern === 'ENTITY_SPIKE') {
    baseEntities += (750 - baseEntities) * 0.05;
    baseCpu += (65 - baseCpu) * 0.05;
    baseTps -= 0.1;
  } else if (currentPattern === 'MEMORY_LEAK') {
    baseRam += 0.05;
    baseGcPause += (45 - baseGcPause) * 0.05;
  } else if (currentPattern === 'CPU_OVERLOAD') {
    baseCpu += (90 - baseCpu) * 0.1;
    baseTps -= 0.2;
  } else if (currentPattern === 'BANDWIDTH_SPIKE') {
    baseBandwidthOut += (85 - baseBandwidthOut) * 0.1;
  }

  basePlayers += Math.random() * 2 - 1;
  basePlayers = Math.max(0, Math.min(100, basePlayers));
  baseChunks = Math.round(basePlayers * 30 + 150);
  
  baseCpu = Math.max(0, Math.min(100, baseCpu));
  baseRam = Math.max(0, Math.min(16, baseRam));
  baseTps = Math.max(0, Math.min(20, baseTps));
  baseEntities = Math.max(0, baseEntities);
  baseBandwidthOut = Math.max(0, baseBandwidthOut);
  
  uptimeHours += 1 / 3600; // Increment slightly

  const telemetry = {
    timestamp: Date.now(),
    cpu: Number(baseCpu.toFixed(1)),
    ram: { used: Number(baseRam.toFixed(2)), total: 16 },
    tps: Number(baseTps.toFixed(1)),
    entityCount: Math.round(baseEntities),
    activePlayers: Math.round(basePlayers),
    bandwidth: { in: Number(baseBandwidthIn.toFixed(1)), out: Number(baseBandwidthOut.toFixed(1)) },
    loadedChunks: baseChunks,
    gcPause: Math.round(baseGcPause),
    uptime: Number(uptimeHours.toFixed(2))
  };

  const history = store.getState('telemetryHistory');
  history.push(telemetry);
  if (history.length > 300) {
    history.shift();
  }

  store.setState('telemetry', telemetry);
  store.setState('telemetryHistory', history);
}

/**
 * Returns formatted server uptime string.
 * @returns {string}
 */
export function getServerUptime() {
  const hours = Math.floor(uptimeHours);
  const minutes = Math.floor((uptimeHours - hours) * 60);
  return `${hours}h ${minutes}m`;
}

/**
 * Returns calculated stats over history.
 * @returns {Object}
 */
export function getTelemetryStats() {
  const history = store.getState('telemetryHistory');
  if (history.length === 0) return {};

  const stats = { cpu: { sum: 0, min: 100, max: 0 }, tps: { sum: 0, min: 20, max: 0 }, ram: { sum: 0, min: 16, max: 0 } };
  
  history.forEach(t => {
    stats.cpu.sum += t.cpu;
    stats.cpu.min = Math.min(stats.cpu.min, t.cpu);
    stats.cpu.max = Math.max(stats.cpu.max, t.cpu);
    
    stats.tps.sum += t.tps;
    stats.tps.min = Math.min(stats.tps.min, t.tps);
    stats.tps.max = Math.max(stats.tps.max, t.tps);
    
    stats.ram.sum += t.ram.used;
    stats.ram.min = Math.min(stats.ram.min, t.ram.used);
    stats.ram.max = Math.max(stats.ram.max, t.ram.used);
  });
  
  const count = history.length;
  return {
    cpu: { avg: (stats.cpu.sum / count).toFixed(1), min: stats.cpu.min.toFixed(1), max: stats.cpu.max.toFixed(1) },
    tps: { avg: (stats.tps.sum / count).toFixed(1), min: stats.tps.min.toFixed(1), max: stats.tps.max.toFixed(1) },
    ram: { avg: (stats.ram.sum / count).toFixed(1), min: stats.ram.min.toFixed(1), max: stats.ram.max.toFixed(1) }
  };
}
