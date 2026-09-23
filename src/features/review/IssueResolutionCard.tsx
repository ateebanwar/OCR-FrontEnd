import React from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { ReviewIssue, ResolutionDecision, IssueResolutionInput } from '../../types/review';
import { Select } from '../../components/common/Select';
import { Input } from '../../components/common/Input';

interface IssueResolutionCardProps {
  issue: ReviewIssue;
  resolution: IssueResolutionInput;
  onChangeResolution: (updated: IssueResolutionInput) => void;
}

export const IssueResolutionCard: React.FC<IssueResolutionCardProps> = ({
  issue,
  resolution,
  onChangeResolution,
}) => {
  const options = issue.resolutionOptions.map((opt) => ({
    value: opt,
    label: opt.replace(/_/g, ' '),
  }));

  const handleDecisionChange = (decision: ResolutionDecision) => {
    onChangeResolution({
      ...resolution,
      userDecision: decision,
    });
  };

  const handleCustomMeaningChange = (val: string) => {
    onChangeResolution({
      ...resolution,
      customMeaning: val,
    });
  };

  return (
    <div className="p-4 rounded-xl bg-surface-elevated/70 border border-amber-500/30 text-xs space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground">{issue.message}</h4>
            <p className="text-foreground-muted text-[11px] mt-0.5">{issue.reason}</p>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-surface border border-border text-foreground-subtle">
            Page {issue.page} • {issue.field}
          </span>
        </div>
      </div>

      {/* Discrepancy comparison */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-surface border border-border/70 font-mono text-[11px]">
        <div>
          <span className="text-foreground-subtle block text-[10px] uppercase">Extracted Value</span>
          <span className="text-foreground font-semibold">
            {String(issue.originalValue ?? 'null')}
          </span>
        </div>
        <div>
          <span className="text-foreground-subtle block text-[10px] uppercase">AI Interpretation</span>
          <span className="text-emerald-500 font-semibold">
            {String(issue.aiInterpretation?.value ?? 'null')}
          </span>
        </div>
        {issue.evidence && issue.evidence.length > 0 && (
          <div className="col-span-2 sm:col-span-1">
            <span className="text-foreground-subtle block text-[10px] uppercase">Context</span>
            <span className="text-foreground-muted truncate block">
              {issue.evidence[0].context || issue.evidence[0].text || 'Document line match'}
            </span>
          </div>
        )}
      </div>

      {/* Resolution Selector */}
      <div className="pt-2 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
        <div>
          <Select
            label="Resolution Action"
            options={options}
            value={resolution.userDecision}
            onChange={(e) => handleDecisionChange(e.target.value as ResolutionDecision)}
          />
        </div>

        {(resolution.userDecision === 'OTHER' || resolution.userDecision === 'ADJUSTMENT') && (
          <div>
            <Input
              label="Custom Meaning / Reference Note"
              placeholder="e.g. Promotional credit applied"
              value={resolution.customMeaning || ''}
              onChange={(e) => handleCustomMeaningChange(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Small Hint */}
      <div className="flex items-center gap-1.5 text-[10px] text-foreground-subtle pt-1">
        <HelpCircle className="w-3 h-3" />
        <span>Decision will be authoritatively verified by backend recalculation</span>
      </div>
    </div>
  );
};
