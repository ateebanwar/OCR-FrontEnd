import React from 'react';
import { AlertCircle, RotateCcw, ShieldAlert } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { ProcessingState } from './ProcessingState';
import { DocumentSummaryCard } from '../results/DocumentSummaryCard';
import { FinancialTotalsCard } from '../results/FinancialTotalsCard';
import { CorrectionsList } from '../results/CorrectionsList';
import { LineItemsTable } from '../results/LineItemsTable';
import { ReviewModal } from '../review/ReviewModal';
import { Button } from '../../components/common/Button';
import { useGenerator } from '../../context/GeneratorContext';

export const GeneratorScreen: React.FC = () => {
  const {
    status,
    isProcessing,
    filename,
    uploadMode,
    uploadProgress,
    currentStage,
    processResult,
    processError,
    isReviewModalOpen,
    isDownloadingXlsx,
    downloadSuccess,
    downloadError,
    startProcessing,
    resetGenerator,
    cancelProcessing,
    downloadXlsx,
    setReviewModalOpen,
    handleReviewResolved,
    clearError,
  } = useGenerator();

  const handleViewCorrections = () => {
    const el = document.getElementById('corrections-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const docStatus = processResult?.summary?.status;
  const isRejected = docStatus === 'REJECTED';
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
            onClick={resetGenerator}
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
            onClick={clearError}
            className="text-xs hover:underline text-foreground-subtle"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* State 1: File Uploader (when not processing and no result) */}
      {!isProcessing && !processResult && (
        <FileUploader
          onProcess={startProcessing}
          isProcessing={isProcessing}
        />
      )}

      {/* State 2: Uploading / Processing state */}
      {isProcessing && (
        <ProcessingState
          filename={filename || 'document.pdf'}
          status={status}
          uploadMode={uploadMode}
          uploadProgress={uploadProgress}
          currentStage={currentStage}
          onCancel={cancelProcessing}
        />
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
              onClick={resetGenerator}
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
            onDownloadXlsx={downloadXlsx}
            isDownloading={isDownloadingXlsx}
            downloadSuccess={downloadSuccess}
            downloadError={downloadError}
            onOpenReview={() => setReviewModalOpen(true)}
            onViewCorrections={handleViewCorrections}
            onReset={resetGenerator}
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
              onClose={() => setReviewModalOpen(false)}
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
