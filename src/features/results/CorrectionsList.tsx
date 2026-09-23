import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { CorrectionRecord } from '../../types/review';

interface CorrectionsListProps {
  corrections: CorrectionRecord[];
}

export const CorrectionsList: React.FC<CorrectionsListProps> = ({ corrections }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!corrections || corrections.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-surface border border-amber-500/30 p-6 shadow-card dark:shadow-card-dark space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Automatic Engine Corrections ({corrections.length})
            </h3>
            <p className="text-xs text-foreground-muted">
              Resolved arithmetic or label ambiguities verified by secondary reasoning pass
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-foreground-muted hover:text-foreground flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-surface-elevated transition-colors"
        >
          <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-1">
          {corrections.map((corr) => (
            <div
              key={corr.issueId}
              className="p-3.5 rounded-xl bg-surface-elevated/70 border border-border text-xs space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="font-semibold text-foreground">
                    Field: <code className="font-mono text-xs bg-surface px-1.5 py-0.5 rounded border border-border">{corr.field}</code>
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase text-foreground-subtle">
                  Page {corr.page} • {corr.source}
                </span>
              </div>

              {/* Value comparison */}
              <div className="grid grid-cols-2 gap-3 p-2 rounded-lg bg-surface border border-border/60 font-mono text-[11px]">
                <div>
                  <span className="text-foreground-subtle block text-[10px] uppercase">Original Extracted</span>
                  <span className="text-rose-500 line-through">
                    {String(corr.originalValue ?? 'null')}
                  </span>
                </div>
                <div>
                  <span className="text-foreground-subtle block text-[10px] uppercase">Engine Corrected</span>
                  <span className="text-emerald-500 font-semibold">
                    {String(corr.finalValue ?? corr.correctedValue ?? '—')}
                  </span>
                </div>
              </div>

              {/* Reason */}
              <p className="text-foreground-muted leading-relaxed text-[11px]">
                <strong className="text-foreground font-medium">Reason: </strong>
                {corr.reason}
              </p>

              {/* Evidence */}
              {corr.evidence && corr.evidence.length > 0 && (
                <div className="text-[11px] text-foreground-subtle font-mono pt-1 border-t border-border/40">
                  <span>Evidence: {corr.evidence.join(' | ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
