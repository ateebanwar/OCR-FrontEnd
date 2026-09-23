import React, { useEffect, useState } from 'react';
import { Loader2, ShieldCheck, FileSpreadsheet, Sparkles } from 'lucide-react';

interface ProcessingStateProps {
  filename: string;
}

const STAGES = [
  'Uploading PDF document buffer...',
  'Analyzing layout complexity and document structure...',
  'Extracting financial line items and entity tables...',
  'Executing zero-tolerance mathematical reconciliation...',
  'Running second-pass verification gate and semantic rules...',
  'Assembling certified XLSX financial workbook...',
  'Finalizing authoritative audit trail...',
];

export const ProcessingState: React.FC<ProcessingStateProps> = ({ filename }) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    // Cycle through stage descriptions sequentially to reflect realistic server progress
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl bg-surface border border-border-strong/70 p-8 sm:p-12 shadow-card dark:shadow-card-dark text-center space-y-6 animate-fadeIn">
      {/* Centered Graphic */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center text-foreground shadow-subtle">
          <FileSpreadsheet className="w-8 h-8 text-foreground" />
        </div>
        <div className="absolute -top-1 -right-1">
          <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center shadow-md">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          </div>
        </div>
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-base font-semibold text-foreground">
          Processing Document Intelligence
        </h3>
        <p className="text-xs text-foreground-muted font-mono truncate">
          {filename}
        </p>
      </div>

      {/* Indeterminate Animated Status Bar */}
      <div className="w-full max-w-md mx-auto space-y-2">
        <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden relative">
          <div className="h-full w-1/3 bg-foreground rounded-full absolute animate-[indeterminate_1.8s_ease-in-out_infinite]" />
        </div>

        <div className="flex items-center justify-center gap-2 pt-1 text-xs font-mono text-foreground-muted">
          <Sparkles className="w-3.5 h-3.5 text-foreground-subtle animate-pulse" />
          <span>{STAGES[stageIndex]}</span>
        </div>
      </div>

      {/* Reassurance Info */}
      <div className="pt-4 border-t border-border max-w-sm mx-auto flex items-center justify-center gap-2 text-[11px] text-foreground-subtle">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Authoritative multi-tiered verification in progress</span>
      </div>
    </div>
  );
};
