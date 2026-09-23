import React, { useState } from 'react';
import { AlertCircle, RotateCcw, ShieldAlert } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { ProcessingState } from './ProcessingState';
import { DocumentSummaryCard } from '../results/DocumentSummaryCard';
import { FinancialTotalsCard } from '../results/FinancialTotalsCard';
import { CorrectionsList } from '../results/CorrectionsList';
import { LineItemsTable } from '../results/LineItemsTable';
import { ReviewModal } from '../review/ReviewModal';
import { Button } from '../../components/common/Button';
import { DocumentProcessingResult } from '../../types/document';
import { documentService } from '../../services/documentService';
import { triggerBlobDownload } from '../../utils/download';

export const GeneratorScreen: React.FC = () => {
  const [processingFile, setProcessingFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<DocumentProcessingResult | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // XLSX download state
  const [isDownloadingXlsx, setIsDownloadingXlsx] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleStartProcess = async (file: File) => {
    setProcessingFile(file);
    setIsProcessing(true);
    setProcessError(null);
    setProcessResult(null);
    setDownloadSuccess(false);
    setDownloadError(null);

    try {
      const result = await documentService.processDocument(file);
      setProcessResult(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setProcessError(err.message);
      } else {
        setProcessError('Document processing encountered an error. Please verify the PDF format.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setProcessingFile(null);
    setIsProcessing(false);
    setProcessResult(null);
    setProcessError(null);
    setIsReviewModalOpen(false);
    setDownloadSuccess(false);
    setDownloadError(null);
  };

  const handleDownloadXlsx = async () => {
    // Prevent duplicate download clicks (Req 13)
    if (isDownloadingXlsx) return;

    if (!processResult?.xlsxBase64) {
      setDownloadError('Unable to download the Excel file. Please try again.');
      return;
    }

    setIsDownloadingXlsx(true);
    setDownloadError(null);
    setDownloadSuccess(false);

    try {
      const defaultName = `${processResult.sourceFilename.replace(/\.pdf$/i, '')}_reconciled.xlsx`;
      const filename = processResult.summary.xlsx?.generatedXlsxFilename || defaultName;

      // Backend call with Authorization header and real binary XLSX response (Req 3, 4, 5, 6, 7, 8, 9)
      const { blob, filename: resolvedFilename } = await documentService.downloadXlsx(
        processResult.xlsxBase64,
        filename
      );

      // Trigger browser download of authentic binary XLSX (Req 8, 9, 10, 11)
      triggerBlobDownload(blob, resolvedFilename);
      setDownloadSuccess(true);
      // Auto-clear success notification after 6 seconds (Req 16)
      setTimeout(() => setDownloadSuccess(false), 6000);
    } catch {
      // User-friendly safe error without stack traces (Req 14 & 15)
      setDownloadError('Unable to download the Excel file. Please try again.');
    } finally {
      setIsDownloadingXlsx(false);
    }
  };

  const handleViewCorrections = () => {
    const el = document.getElementById('corrections-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReviewResolved = (updatedResult: DocumentProcessingResult) => {
    setProcessResult(updatedResult);
  };

  const status = processResult?.summary?.status;
  const isRejected = status === 'REJECTED';
  const openIssues = processResult?.summary?.issues?.filter((i) => !i.resolved) || [];
  const reviewToken = processResult?.summary?.review?.reviewToken;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Financial Document Generator
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-0.5">
            Upload PDF invoices, receipts, or statements for zero-tolerance math reconciliation
          </p>
        </div>

        {processResult && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            New Document
          </Button>
        )}
      </div>

      {/* Global Error Banner */}
      {processError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Processing Notice</p>
              <p>{processError}</p>
            </div>
          </div>
          <button
            onClick={() => setProcessError(null)}
            className="text-xs hover:underline text-foreground-subtle"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* State 1: File Uploader (when not processing and no result) */}
      {!isProcessing && !processResult && (
        <FileUploader
          onProcess={handleStartProcess}
          isProcessing={isProcessing}
        />
      )}

      {/* State 2: Processing state */}
      {isProcessing && (
        <ProcessingState filename={processingFile?.name || 'document.pdf'} />
      )}

      {/* State 3: Rejected Status */}
      {processResult && isRejected && (
        <div className="rounded-2xl bg-surface border border-rose-500/40 p-8 shadow-card dark:shadow-card-dark text-center space-y-5 animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-foreground">
              Document Rejected
            </h3>
            <p className="text-xs text-foreground-muted">
              {processResult.summary.verification.gateFailureReasons?.[0] ||
                'The document failed strict verification or completeness checks.'}
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Try Another Document
            </Button>
          </div>
        </div>
      )}

      {/* State 4: Valid Results (VERIFIED, VERIFIED_WITH_CORRECTIONS, REVIEW_REQUIRED) */}
      {processResult && !isRejected && (
        <div className="space-y-6">
          {/* Primary Document Summary Card with prominent action */}
          <DocumentSummaryCard
            summary={processResult.summary}
            sourceFilename={processResult.sourceFilename}
            hasXlsxData={Boolean(processResult.xlsxBase64)}
            onDownloadXlsx={handleDownloadXlsx}
            isDownloading={isDownloadingXlsx}
            downloadSuccess={downloadSuccess}
            downloadError={downloadError}
            onOpenReview={() => setIsReviewModalOpen(true)}
            onViewCorrections={handleViewCorrections}
            onReset={handleReset}
          />

          {/* Grid: Financial Totals & Corrections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <FinancialTotalsCard
              financial={processResult.summary.financial}
            />

            <div id="corrections-section">
              {processResult.summary.corrections &&
              processResult.summary.corrections.length > 0 ? (
                <CorrectionsList
                  corrections={processResult.summary.corrections}
                />
              ) : (
                <div className="rounded-2xl bg-surface border border-border p-6 text-xs text-foreground-muted space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Zero Corrections Required
                  </h4>
                  <p>
                    All figures, tax rates, and subtotal lines matched the extracted values exactly with 0.00 mathematical tolerance.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Breakdown Table */}
          <LineItemsTable
            lineItems={processResult.document.lineItems}
            currency={processResult.document.currency}
          />

          {/* Review Resolution Modal */}
          {reviewToken && openIssues.length > 0 && (
            <ReviewModal
              isOpen={isReviewModalOpen}
              onClose={() => setIsReviewModalOpen(false)}
              reviewToken={reviewToken}
              issues={openIssues}
              onReviewResolved={handleReviewResolved}
            />
          )}
        </div>
      )}
    </div>
  );
};
