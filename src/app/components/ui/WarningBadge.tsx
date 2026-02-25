import React from 'react';
import { Info, TriangleAlert, CircleAlert } from 'lucide-react';

type WarningType = 'info' | 'advisory' | 'blocking';

interface WarningBadgeProps {
  type: WarningType;
  message: string;
  actions?: Array<{ label: string; onClick: () => void }>;
}

export function WarningBadge({ type, message, actions }: WarningBadgeProps) {
  const icons = {
    info: Info,
    advisory: TriangleAlert,
    blocking: CircleAlert
  };

  const styles = {
    info: 'bg-[var(--accent-amber)]/10 border-[var(--accent-amber)]/30 text-[var(--accent-amber)]',
    advisory: 'bg-[var(--warning-red)]/10 border-[var(--warning-red)]/30 text-[var(--warning-red)]',
    blocking: 'bg-[var(--warning-red)]/20 border-[var(--warning-red)]/50 text-[var(--warning-red)]'
  };

  const Icon = icons[type];

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${styles[type]}`}>
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <p className="text-sm">{message}</p>
        {actions && actions.length > 0 && (
          <div className="flex items-center gap-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="text-xs px-3 py-1 rounded bg-current/10 hover:bg-current/20 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}