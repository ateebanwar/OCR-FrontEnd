import React, { useEffect, useState } from 'react';
import { Loader2, ShieldCheck, FileSpreadsheet, Sparkles, UploadCloud } from 'lucide-react';
import { GeneratorStatus } from '../../context/GeneratorContext';
import { UploadMode } from '../../types/api';

interface ProcessingStateProps {
  filename: string;
  status?: GeneratorStatus;
  uploadMode?: UploadMode | null;
  uploadProgress?: number | null;
  currentStage?: string;
  onCancel?: () => void;
}

const PROCESSING_STAGES = [
  'Analyzing layout complexity and document structure...',
  'Extracting financial line items and entity tables...',
  'Executing zero-tolerance mathematical reconciliation...',
  'Running second-pass verification gate and semantic rules...',
  'Assembling certified XLSX financial workbook...',
  'Finalizing authoritative audit trail...',
];

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  filename,
  status = 'PROCESSING',
  uploadMode: _uploadMode = null,
  uploadProgress = null,
  currentStage,
  onCancel,
}) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (status !== 'PROCESSING') return;

    // Cycle through stage descriptions sequentially to reflect realistic server progress
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < PROCESSING_STAGES.length - 1 ? prev + 1 : prev));
    }, 2800);

    return () => clearInterval(interval);
  }, [status]);

  const isUploading = status === 'UPLOADING';
  const hasRealProgress = isUploading && uploadProgress !== null && uploadProgress !== undefined;

  const displayStageText = () => {
    if (currentStage && currentStage.trim().length > 0) {
      if (hasRealProgress) {
        return `Uploading PDF document (${uploadProgress}%)...`;
      }
      return currentStage;
    }
    if (isUploading) {
      return hasRealProgress ? `Uploading PDF document (${uploadProgress}%)...` : 'Uploading PDF document...';
    }
    return PROCESSING_STAGES[stageIndex];
  };

  return (
    <div className="rounded-2xl bg-surface border border-border-strong/70 p-8 sm:p-12 shadow-card dark:shadow-card-dark text-center space-y-6 animate-fadeIn">
      {/* Centered Graphic */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center text-foreground shadow-subtle">
          {isUploading ? (
            <UploadCloud className="w-8 h-8 text-foreground" />
          ) : (
            <FileSpreadsheet className="w-8 h-8 text-foreground" />
          )}
        </div>
        <div className="absolute -top-1 -right-1">
          <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center shadow-md">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          </div>
        </div>
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-base font-semibold text-foreground">
          {isUploading ? 'Uploading Document' : 'Processing Document Intelligence'}
        </h3>
        <p className="text-xs text-foreground-muted font-mono truncate">
          {filename}
        </p>
      </div>

      {/* Progress Bar: Determinate if real percentage is available, otherwise honest indeterminate */}
      <div className="w-full max-w-md mx-auto space-y-2">
        <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden relative">
          {hasRealProgress ? (
            <div
              className="h-full bg-foreground rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, uploadProgress))}%` }}
            />
          ) : (
            <div className="h-full w-1/3 bg-foreground rounded-full absolute animate-[indeterminate_1.8s_ease-in-out_infinite]" />
          )}
        </div>

        <div className="flex items-center justify-center gap-2 pt-1 text-xs font-mono text-foreground-muted">
          <Sparkles className="w-3.5 h-3.5 text-foreground-subtle animate-pulse" />
          <span>{displayStageText()}</span>
        </div>
      </div>

      {/* Reassurance Info / Cancel Action */}
      <div className="pt-4 border-t border-border max-w-sm mx-auto flex flex-col items-center gap-3">
        <div className="flex items-center justify-center gap-2 text-[11px] text-foreground-subtle">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Authoritative multi-tiered verification in progress</span>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-foreground-muted hover:text-rose-500 transition-colors underline-offset-2 hover:underline"
          >
            Cancel operation
          </button>
        )}
      </div>
    </div>
  );
};
