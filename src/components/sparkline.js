/**
 * Sparkline Component
 * Simple mini-chart for showing historical metric trends
 */

export function renderSparkline(id, data, colorClass = 'accent-cyan', height = 60, min = 0, max = null) {
  if (!data || data.length === 0) return `<div class="sparkline-empty">No data</div>`;

  // Calculate actual max if not provided
  const actualMax = max || Math.max(...data, 1);
  const actualMin = min !== null ? min : Math.min(...data, 0);
  const range = actualMax - actualMin || 1;

  // Calculate SVG path
  const width = 100; // SVG viewBox width
  const step = width / Math.max(data.length - 1, 1);
  
  let pathD = `M 0,${height - ((data[0] - actualMin) / range) * height}`;
  
  for (let i = 1; i < data.length; i++) {
    const x = i * step;
    const y = height - ((data[i] - actualMin) / range) * height;
    pathD += ` L ${x},${y}`;
  }

  return `
    <div class="sparkline-container" id="sparkline-${id}" style="height: ${height}px;">
      <svg class="sparkline-canvas" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <path class="sparkline-line ${colorClass}" d="${pathD}" fill="none" stroke-width="2" />
        <path class="sparkline-area ${colorClass}-glow" d="${pathD} L ${width},${height} L 0,${height} Z" fill="currentColor" opacity="0.1" stroke="none" />
      </svg>
    </div>
  `;
}

export function updateSparkline(id, data, height = 60, min = 0, max = null) {
  const container = document.getElementById(`sparkline-${id}`);
  if (!container || !data || data.length === 0) return;

  const actualMax = max || Math.max(...data, 1);
  const actualMin = min !== null ? min : Math.min(...data, 0);
  const range = actualMax - actualMin || 1;
  const width = 100;
  const step = width / Math.max(data.length - 1, 1);
  
  let pathD = `M 0,${height - ((data[0] - actualMin) / range) * height}`;
  for (let i = 1; i < data.length; i++) {
    const x = i * step;
    const y = height - ((data[i] - actualMin) / range) * height;
    pathD += ` L ${x},${y}`;
  }

  const line = container.querySelector('.sparkline-line');
  const area = container.querySelector('.sparkline-area');
  
  if (line) line.setAttribute('d', pathD);
  if (area) area.setAttribute('d', `${pathD} L ${width},${height} L 0,${height} Z`);
}
