/**
 * Suggestion Card Component
 * Displays a crash prevention suggestion
 */

export function renderSuggestionCard(suggestion, alertId) {
  const riskColor = suggestion.risk === 'low' ? 'green' : (suggestion.risk === 'medium' ? 'amber' : 'red');
  
  return `
    <div class="suggestion-card" id="suggestion-${suggestion.id}">
      <div class="flex-between">
        <div class="flex gap-sm">
          <div class="suggestion-rank">${suggestion.rank}</div>
          <div>
            <div class="suggestion-action font-500">${suggestion.action}</div>
            <div class="text-sm text-muted mt-xs">Category: ${suggestion.category}</div>
          </div>
        </div>
        ${suggestion.executable && suggestion.status === 'pending' ? `
          <button class="btn btn-primary btn-sm suggestion-apply-btn" 
                  data-alert-id="${alertId}" 
                  data-suggestion-id="${suggestion.id}">
            Apply Fix
          </button>
        ` : (suggestion.status === 'applied' ? `
          <span class="badge badge-green">✓ Applied</span>
        ` : (suggestion.executable ? '' : `
          <span class="badge badge-secondary">Manual Action Required</span>
        `))}
      </div>
      
      <div class="suggestion-meta mt-sm flex gap-md">
        <div class="suggestion-impact">
          <span class="text-xs text-secondary">Est. Impact:</span>
          <span class="text-sm text-green font-bold">+${suggestion.impact}% Recovery</span>
        </div>
        <div class="suggestion-risk">
          <span class="text-xs text-secondary">Risk:</span>
          <span class="badge badge-${riskColor} badge-sm">${suggestion.risk.toUpperCase()}</span>
        </div>
      </div>
    </div>
  `;
}
