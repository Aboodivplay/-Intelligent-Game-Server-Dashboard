/**
 * Alert Card Component
 * Displays a predictive alert with confidence score
 */

import { renderSuggestionCard } from './suggestion-card.js';
import { generateSuggestions } from '../modules/suggestion-engine.js';

export function renderAlertCard(alert) {
  const isCritical = alert.severity === 'critical';
  const severityColor = isCritical ? 'red' : (alert.severity === 'warning' ? 'amber' : 'cyan');
  
  // Format time to impact
  const minutes = Math.floor(alert.timeToImpact / 60);
  const seconds = alert.timeToImpact % 60;
  const timeString = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;

  // Format timestamp
  const time = new Date(alert.timestamp).toLocaleTimeString();

  // Generate suggestions
  const suggestions = generateSuggestions(alert);

  return `
    <div class="card alert-card alert-card--${alert.severity}" id="alert-${alert.id}">
      <div class="alert-header">
        <div class="flex gap-sm">
          <span class="text-2xl">${isCritical ? '⚠️' : '🔔'}</span>
          <div>
            <h3 class="card-title text-${severityColor}">${alert.title}</h3>
            <span class="text-sm text-muted">${time}</span>
          </div>
        </div>
        <div class="alert-badges">
          <span class="badge badge-${severityColor} ${alert.status === 'active' ? 'badge-pulse' : ''}">${alert.status.toUpperCase()}</span>
        </div>
      </div>
      
      <div class="alert-body mt-md">
        <p class="text-primary mb-md">${alert.description}</p>
        
        <div class="flex-between mt-sm">
          <span class="text-secondary text-sm">Root Cause: <strong class="text-primary">${alert.rootCause}</strong></span>
          <span class="text-secondary text-sm">Impact in: <strong class="countdown-timer text-${severityColor}">${timeString}</strong></span>
        </div>

        <div class="confidence-meter mt-md">
          <div class="flex-between mb-sm">
            <span class="text-sm text-secondary">AI Confidence Score</span>
            <span class="text-sm font-bold">${alert.confidence.toFixed(1)}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill bg-accent-purple" style="width: ${alert.confidence}%"></div>
          </div>
        </div>
      </div>

      ${suggestions.length > 0 && alert.status === 'active' ? `
        <div class="alert-suggestions mt-lg">
          <h4 class="text-sm text-secondary uppercase mb-sm">💡 Crash Prevention Suggestions</h4>
          <div class="flex-col gap-sm">
            ${suggestions.map(s => renderSuggestionCard(s, alert.id)).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="alert-footer mt-md flex gap-sm">
        ${alert.status === 'active' ? `
          <button class="btn btn-secondary btn-sm alert-dismiss-btn" data-id="${alert.id}">Dismiss</button>
        ` : ''}
      </div>
    </div>
  `;
}
