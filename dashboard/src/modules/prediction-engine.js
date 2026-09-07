import { store } from './data-store.js';

let intervalId = null;

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Starts checking predictions periodically.
 */
export function startPredictions() {
  if (intervalId) return;
  intervalId = setInterval(analyzeTrends, 5000);
}

/**
 * Stops predictions checking.
 */
export function stopPredictions() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/**
 * Analyzes recent telemetry to detect patterns.
 */
function analyzeTrends() {
  const history = store.getState('telemetryHistory');
  if (history.length < 30) return; // Need enough data

  const recent30 = history.slice(-30);
  const first10 = recent30.slice(0, 10);
  const last10 = recent30.slice(-10);

  const avgCpu = recent30.reduce((acc, val) => acc + val.cpu, 0) / 30;
  if (avgCpu > 70) {
    generatePrediction('lag_spike', 'cpu_spike', 'warning', Math.min(99, avgCpu), recent30[recent30.length - 1]);
  }

  const avgFirstEntities = first10.reduce((acc, val) => acc + val.entityCount, 0) / 10;
  const avgLastEntities = last10.reduce((acc, val) => acc + val.entityCount, 0) / 10;
  if (avgLastEntities - avgFirstEntities > 200) {
    generatePrediction('tps_drop', 'entity_spike', 'warning', 85, recent30[recent30.length - 1]);
  }

  const avgFirstRam = first10.reduce((acc, val) => acc + val.ram.used, 0) / 10;
  const avgLastRam = last10.reduce((acc, val) => acc + val.ram.used, 0) / 10;
  if (avgLastRam - avgFirstRam > 2.0) {
    generatePrediction('memory_leak', 'memory_leak', 'critical', 92, recent30[recent30.length - 1]);
  }

  const recent20 = history.slice(-20);
  const avgTps = recent20.reduce((acc, val) => acc + val.tps, 0) / 20;
  if (avgTps < 16) {
    generatePrediction('lag_spike', 'tps_degradation', 'warning', 88, recent30[recent30.length - 1]);
  }

  const lastTelemetry = recent30[recent30.length - 1];
  if (lastTelemetry.bandwidth.out > 80) {
    generatePrediction('lag_spike', 'bandwidth_saturation', 'info', 75, lastTelemetry);
  }
}

/**
 * Generates a prediction if it meets criteria.
 * @param {string} type 
 * @param {string} anomalyType 
 * @param {string} severity 
 * @param {number} confidence 
 * @param {Object} metrics 
 */
function generatePrediction(type, anomalyType, severity, confidence, metrics) {
  const threshold = store.getState('settings').confidenceThreshold || 70;
  if (confidence < threshold) return;

  const alerts = store.getState('alerts');
  const existing = alerts.find(a => a.anomalyType === anomalyType && (Date.now() - a.timestamp) < 120000);
  if (existing) return;

  const titleMap = {
    'entity_spike': 'Abnormal Entity Density Detected',
    'memory_leak': 'Potential Memory Leak Identified',
    'cpu_spike': 'Severe CPU Overload',
    'tps_degradation': 'Cascading TPS Degradation',
    'bandwidth_saturation': 'Bandwidth Saturation Warning'
  };

  const prediction = {
    id: uuidv4(),
    type,
    anomalyType,
    severity,
    confidence: Number(confidence.toFixed(1)),
    title: titleMap[anomalyType] || 'Anomaly Detected',
    description: `Automated detection engine recognized a pattern consistent with ${anomalyType.replace('_', ' ')}.`,
    rootCause: `Metrics indicate abnormal behavior correlated with ${type}.`,
    timeToImpact: Math.floor(Math.random() * 300) + 300,
    timestamp: Date.now(),
    status: 'active',
    metrics
  };

  const updatedAlerts = [...alerts, prediction];
  store.setState('alerts', updatedAlerts);
  store.emit('new-prediction', prediction);
}

/**
 * Dismisses an alert.
 * @param {string} id 
 */
export function dismissAlert(id) {
  const alerts = store.getState('alerts');
  const alert = alerts.find(a => a.id === id);
  if (alert) {
    alert.status = 'dismissed';
    store.setState('alerts', alerts.filter(a => a.id !== id));
    
    const history = store.getState('alertHistory');
    store.setState('alertHistory', [...history, alert]);
  }
}

/**
 * Resolves an alert.
 * @param {string} id 
 * @param {string} resolution 
 */
export function resolveAlert(id, resolution) {
  const alerts = store.getState('alerts');
  const alert = alerts.find(a => a.id === id);
  if (alert) {
    alert.status = 'resolved';
    alert.resolution = resolution;
    store.setState('alerts', alerts.filter(a => a.id !== id));
    
    const history = store.getState('alertHistory');
    store.setState('alertHistory', [...history, alert]);
  }
}

/**
 * Gets active alerts sorted by severity.
 * @returns {Array}
 */
export function getActiveAlerts() {
  const alerts = store.getState('alerts');
  const severityScore = { 'critical': 3, 'warning': 2, 'info': 1 };
  return [...alerts].sort((a, b) => severityScore[b.severity] - severityScore[a.severity]);
}

/**
 * Gets prediction statistics.
 * @returns {Object}
 */
export function getPredictionStats() {
  const history = store.getState('alertHistory');
  const total = history.length;
  const correct = history.filter(a => a.status === 'resolved').length;
  
  const byType = {};
  history.forEach(a => {
    byType[a.anomalyType] = (byType[a.anomalyType] || 0) + 1;
  });

  return {
    total,
    correct,
    accuracy: total > 0 ? ((correct / total) * 100).toFixed(1) : 100,
    byType
  };
}
