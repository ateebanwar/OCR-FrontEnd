import React from 'react';
import {
  FileText,
  Calendar,
  Hash,
  Download,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  User,
  FileCheck,
} from 'lucide-react';
import { ConversionSummary } from '../../types/document';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatDate, formatCurrency } from '../../utils/formatters';

export interface DocumentSummaryCardProps {
  summary: ConversionSummary;
  sourceFilename?: string;
  hasXlsxData?: boolean;
  onDownloadXlsx?: () => void;
  isDownloading?: boolean;
  downloadSuccess?: boolean;
  downloadError?: string | null;
  onOpenReview?: () => void;
  onViewCorrections?: () => void;
  onReset?: () => void;
}

export const DocumentSummaryCard: React.FC<DocumentSummaryCardProps> = ({
  summary,
  sourceFilename,
  hasXlsxData = true,
  onDownloadXlsx,
  isDownloading = false,
  downloadSuccess = false,
  downloadError = null,
  onOpenReview,
  onViewCorrections,
  onReset,
}) => {
  const { document: doc, financial: fin, status, review, corrections } = summary;

  const isVerified = status === 'VERIFIED';
  const isVerifiedWithCorrections = status === 'VERIFIED_WITH_CORRECTIONS';
  const isReviewRequired = status === 'REVIEW_REQUIRED';
  const openIssuesCount =
    review?.openIssueCount ?? (summary.issues?.filter((i) => !i.resolved).length ?? 0);
  const isReviewResolved = isReviewRequired && openIssuesCount === 0;

  // Requirement 2: The button must be visible for:
  // - VERIFIED
  // - VERIFIED_WITH_CORRECTIONS
  // - REVIEW_REQUIRED only after the backend has successfully resolved the review and provides a downloadable XLSX
  const canDownload =
    Boolean(onDownloadXlsx) &&
    Boolean(hasXlsxData) &&
    (isVerified || isVerifiedWithCorrections || isReviewResolved);

  return (
    <div className="rounded-2xl bg-surface border border-border-strong/70 p-6 sm:p-8 shadow-card dark:shadow-card-dark space-y-6 animate-fadeIn">
      {/* Status Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-border">
        {/* Status titles */}
        <div className="space-y-2">
          {isVerified && (
            <div>
              <p className="text-xs uppercase font-mono tracking-wider text-foreground-muted font-semibold">
                Document Processed
              </p>
              <div className="flex items-center gap-2.5 mt-1">
                <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                  VERIFIED
                </span>
                <Badge variant="verified">100% RECONCILED</Badge>
              </div>
              <p className="text-xs text-foreground-subtle mt-0.5">
                Zero tolerance math verification completed. All figures balanced.
              </p>
            </div>
          )}

          {isVerifiedWithCorrections && (
            <div className="space-y-2">
              <div>
                <p className="text-xs uppercase font-mono tracking-wider text-foreground-muted font-semibold">
                  Document Processed
                </p>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                    Verified with Corrections
                  </span>
                  <Badge variant="correction">AUTO-RESOLVED</Badge>
                </div>
              </div>
              <p className="text-xs text-foreground-muted">
                {corrections?.length || 1} correction{corrections?.length === 1 ? '' : 's'}{' '}
                {corrections?.length === 1 ? 'was' : 'were'} automatically resolved.
              </p>
              {onViewCorrections && (
                <div className="pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onViewCorrections}
                    leftIcon={<FileCheck className="w-3.5 h-3.5 text-blue-500" />}
                  >
                    View Corrections
                  </Button>
                </div>
              )}
            </div>
          )}

          {isReviewRequired && !isReviewResolved && (
            <div className="space-y-2">
              <div>
                <p className="text-xs uppercase font-mono tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                  Action Required
                </p>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                    Review Required
                  </span>
                  <Badge variant="review">{openIssuesCount} OPEN</Badge>
                </div>
              </div>
              <p className="text-xs text-foreground-muted">
                {openIssuesCount} discrepanc{openIssuesCount === 1 ? 'y' : 'ies'} detected in extraction requiring authoritative human confirmation.
              </p>
              {onOpenReview && (
                <div className="pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onOpenReview}
                    leftIcon={<AlertTriangle className="w-4 h-4 text-amber-300" />}
                  >
                    Resolve Review ({openIssuesCount})
                  </Button>
                </div>
              )}
            </div>
          )}

          {isReviewResolved && (
            <div>
              <p className="text-xs uppercase font-mono tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                Review Resolved
              </p>
              <div className="flex items-center gap-2.5 mt-1">
                <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                  VERIFIED
                </span>
                <Badge variant="verified">RESOLVED & RECONCILED</Badge>
              </div>
              <p className="text-xs text-foreground-subtle mt-0.5">
                All discrepancies were confirmed and reconciled with zero variance.
              </p>
            </div>
          )}
        </div>

        {/* Reset button in header */}
        {onReset && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="flex-shrink-0"
          >
            New Document
          </Button>
        )}
      </div>

      {/* Document Summary Block */}
      <div className="p-5 sm:p-6 rounded-xl bg-surface-elevated/70 border border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border/70 pb-3">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">
            Document Summary
          </h3>
          <span className="text-xs text-foreground-subtle font-mono truncate max-w-sm">
            {sourceFilename || doc.sourceFilename}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
          <div>
            <span className="text-foreground-subtle block font-mono text-[11px] uppercase mb-0.5">
              Pages:
            </span>
            <span className="font-semibold text-foreground text-sm font-mono">
              {doc.processedPages || doc.totalPdfPages}
            </span>
          </div>

          <div>
            <span className="text-foreground-subtle block font-mono text-[11px] uppercase mb-0.5">
              Line Items:
            </span>
            <span className="font-semibold text-foreground text-sm font-mono">
              {doc.extractedLineItemCount}
            </span>
          </div>

          <div>
            <span className="text-foreground-subtle block font-mono text-[11px] uppercase mb-0.5">
              Currency:
            </span>
            <span className="font-semibold text-foreground text-sm font-mono">
              {fin.currency || 'USD'}
            </span>
          </div>

          <div>
            <span className="text-foreground-subtle block font-mono text-[11px] uppercase mb-0.5">
              Subtotal:
            </span>
            <span className="font-semibold text-foreground text-sm font-mono tabular-nums">
              {formatCurrency(fin.subtotal, fin.currency)}
            </span>
          </div>

          <div>
            <span className="text-foreground-subtle block font-mono text-[11px] uppercase mb-0.5">
              Tax:
            </span>
            <span className="font-semibold text-foreground text-sm font-mono tabular-nums">
              {formatCurrency(fin.taxTotal, fin.currency)}
            </span>
          </div>

          <div>
            <span className="text-foreground-subtle block font-mono text-[11px] uppercase mb-0.5">
              Grand Total:
            </span>
            <span className="font-bold text-foreground text-base font-mono tabular-nums">
              {formatCurrency(fin.grandTotal, fin.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action: Download Excel (Req 1, 2, 12, 13, 14, 16, 17) */}
      {canDownload && (
        <div className="space-y-3 pt-1">
          <Button
            variant="primary"
            size="lg"
            onClick={onDownloadXlsx}
            disabled={isDownloading}
            isLoading={isDownloading}
            leftIcon={
              isDownloading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )
            }
            className="w-full sm:w-auto px-8 py-3.5 text-base font-bold shadow-md justify-center"
          >
            {isDownloading ? 'Preparing Excel...' : 'Download Excel'}
          </Button>

          {/* Success confirmation (Req 16) */}
          {downloadSuccess && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Excel downloaded successfully.</span>
            </div>
          )}

          {/* User-facing error without stack traces (Req 14 & 15) */}
          {downloadError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{downloadError}</span>
            </div>
          )}
        </div>
      )}

      {/* Extracted Invoice Metadata & Parties */}
      <div className="pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-surface-elevated/40 border border-border/50">
          <div className="flex items-center gap-1.5 text-foreground-subtle mb-1">
            <Hash className="w-3.5 h-3.5" />
            <span className="font-mono uppercase text-[10px]">Invoice / Doc #</span>
          </div>
          <p className="font-semibold text-foreground font-mono truncate">
            {doc.invoiceNumber || doc.documentNumber || '—'}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-surface-elevated/40 border border-border/50">
          <div className="flex items-center gap-1.5 text-foreground-subtle mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-mono uppercase text-[10px]">Invoice Date</span>
          </div>
          <p className="font-semibold text-foreground font-mono">
            {formatDate(doc.invoiceDate)}
          </p>
        </div>

        {doc.vendorName ? (
          <div className="p-3 rounded-lg bg-surface-elevated/40 border border-border/50">
            <div className="flex items-center gap-1.5 text-foreground-subtle mb-1">
              <Building className="w-3.5 h-3.5" />
              <span className="font-mono uppercase text-[10px]">Issuer / Vendor</span>
            </div>
            <p className="font-medium text-foreground truncate">{doc.vendorName}</p>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-surface-elevated/40 border border-border/50">
            <div className="flex items-center gap-1.5 text-foreground-subtle mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span className="font-mono uppercase text-[10px]">Document Type</span>
            </div>
            <p className="font-medium text-foreground font-mono uppercase">
              {doc.documentType}
            </p>
          </div>
        )}

        {doc.customerName ? (
          <div className="p-3 rounded-lg bg-surface-elevated/40 border border-border/50">
            <div className="flex items-center gap-1.5 text-foreground-subtle mb-1">
              <User className="w-3.5 h-3.5" />
              <span className="font-mono uppercase text-[10px]">Recipient / Customer</span>
            </div>
            <p className="font-medium text-foreground truncate">{doc.customerName}</p>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-surface-elevated/40 border border-border/50">
            <div className="flex items-center gap-1.5 text-foreground-subtle mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-mono uppercase text-[10px]">Reconciliation</span>
            </div>
            <p className="font-medium text-foreground font-mono">
              {fin.reconciliationVerificationStatus ? 'Zero Variance' : fin.overallReconciliationStatus}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
