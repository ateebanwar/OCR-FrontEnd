import React from 'react';
import { FileSpreadsheet, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/common/Button';

interface DownloadExcelCardProps {
  filename: string;
  isDownloading: boolean;
  downloadSuccess: boolean;
  downloadError: string | null;
  onDownload: () => void;
  disabled?: boolean;
}

export const DownloadExcelCard: React.FC<DownloadExcelCardProps> = ({
  filename,
  isDownloading,
  downloadSuccess,
  downloadError,
  onDownload,
  disabled = false,
}) => {
  const cleanFilename = filename.toLowerCase().endsWith('.xlsx')
    ? filename
    : `${filename}.xlsx`;

  return (
    <div className="rounded-2xl bg-surface border-2 border-foreground/15 p-6 shadow-card dark:shadow-card-dark space-y-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center font-bold shadow-sm flex-shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">
                Download Certified Excel Spreadsheet
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                .XLSX FORMAT
              </span>
            </div>
            <p className="text-xs text-foreground-muted font-mono truncate max-w-md">
              {cleanFilename}
            </p>
            <p className="text-[11px] text-foreground-subtle">
              Verified multi-tab workbook containing summary sheet, line-item ledger, and mathematical audit trail
            </p>
          </div>
        </div>

        {/* Primary Download Button */}
        <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
          <Button
            variant="primary"
            size="lg"
            onClick={onDownload}
            disabled={disabled || isDownloading}
            isLoading={isDownloading}
            leftIcon={
              isDownloading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )
            }
            className="w-full sm:w-auto px-6 py-3 font-semibold text-sm shadow-md"
          >
            {isDownloading ? 'Preparing Excel...' : 'Download Excel'}
          </Button>

          {/* Success notice */}
          {downloadSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Excel downloaded successfully.</span>
            </div>
          )}
        </div>
      </div>

      {/* Error notice */}
      {downloadError && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{downloadError}</span>
        </div>
      )}
    </div>
  );
};
