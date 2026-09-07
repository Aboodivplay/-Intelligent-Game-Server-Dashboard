/**
 * Gauge Component
 * SVG-based circular gauge for metrics like CPU and RAM
 */

export function renderGauge(id, label, value, max, unit = '%') {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Determine color based on threshold
  let colorClass = 'gauge--healthy';
  if (percentage > 85) colorClass = 'gauge--critical';
  else if (percentage > 70) colorClass = 'gauge--warning';

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return `
    <div class="gauge-container" id="gauge-${id}">
      <svg class="gauge-svg" viewBox="0 0 100 100">
        <circle class="gauge-bg" cx="50" cy="50" r="${radius}" />
        <circle class="gauge-ring ${colorClass}" cx="50" cy="50" r="${radius}" 
                stroke-dasharray="${circumference}" 
                stroke-dashoffset="${strokeDashoffset}" />
      </svg>
      <div class="gauge-content">
        <span class="gauge-value">${typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(1) : value}${unit}</span>
      </div>
      <div class="gauge-label">${label}</div>
    </div>
  `;
}

export function updateGauge(id, value, max, unit = '%') {
  const container = document.getElementById(`gauge-${id}`);
  if (!container) return;

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  let colorClass = 'gauge--healthy';
  if (percentage > 85) colorClass = 'gauge--critical';
  else if (percentage > 70) colorClass = 'gauge--warning';

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const ring = container.querySelector('.gauge-ring');
  if (ring) {
    ring.className.baseVal = `gauge-ring ${colorClass}`;
    ring.setAttribute('stroke-dashoffset', strokeDashoffset);
  }

  const valEl = container.querySelector('.gauge-value');
  if (valEl) {
    valEl.textContent = `${typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(1) : value}${unit}`;
  }
}
