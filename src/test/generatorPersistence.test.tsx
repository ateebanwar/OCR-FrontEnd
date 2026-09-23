import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { GeneratorProvider, useGenerator } from '../context/GeneratorContext';
import { documentService } from '../services/documentService';
import { DocumentProcessingResult } from '../types/document';

// Test component simulating App layout with tab switching
const TestAppShell: React.FC<{
  onTabChange?: (tab: string) => void;
}> = () => {
  const [activeTab, setActiveTab] = useState<'generator' | 'settings' | 'about'>('generator');
  const generator = useGenerator();

  return (
    <div>
      {/* Navigation tabs */}
      <nav>
        <button data-testid="nav-generator" onClick={() => setActiveTab('generator')}>
          Generator
        </button>
        <button data-testid="nav-settings" onClick={() => setActiveTab('settings')}>
          Settings
        </button>
        <button data-testid="nav-about" onClick={() => setActiveTab('about')}>
          About
        </button>
      </nav>

      <div data-testid="current-tab">{activeTab}</div>

      {/* Main content conditionally mounting screens based on active tab */}
      {activeTab === 'generator' && (
        <div data-testid="generator-screen">
          <div data-testid="status">{generator.status}</div>
          <div data-testid="is-processing">{String(generator.isProcessing)}</div>
          <div data-testid="filename">{generator.filename || 'no-file'}</div>
          <div data-testid="current-stage">{generator.currentStage}</div>
          <div data-testid="process-error">{generator.processError || 'no-error'}</div>
          {generator.processResult && (
            <div data-testid="result-doc-id">{generator.processResult.documentId}</div>
          )}
          <button
            data-testid="start-btn"
            onClick={() => {
              const file = new File(['mock content'], 'my_invoice.pdf', { type: 'application/pdf' });
              generator.startProcessing(file);
            }}
          >
            Start
          </button>
          <button data-testid="reset-btn" onClick={generator.resetGenerator}>
            Reset
          </button>
        </div>
      )}

      {activeTab === 'settings' && (
        <div data-testid="settings-screen">
          <h3>Settings View</h3>
        </div>
      )}

      {activeTab === 'about' && (
        <div data-testid="about-screen">
          <h3>About View</h3>
        </div>
      )}
    </div>
  );
};

describe('Generator State Persistence Across Navigation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockResult: DocumentProcessingResult = {
    success: true,
    documentId: 'doc_verified_999',
    sourceFilename: 'my_invoice.pdf',
    documentHash: 'hash_999',
    isVerified: true,
    document: {
      documentId: 'doc_verified_999',
      documentHash: 'hash_999',
      documentType: 'invoice',
      invoiceNumber: 'INV-999',
      documentNumber: 'INV-999',
      invoiceDate: '2026-09-01',
      deliveryDate: null,
      purchaseOrderNumber: null,
      referenceNumbers: [],
      vendor: { name: 'Vendor', address: null, taxId: null, email: null, phone: null, contactPerson: null },
      customer: { name: 'Cust', address: null, taxId: null, email: null, phone: null, contactPerson: null },
      currency: 'USD',
      currencySymbol: '$',
      language: 'en',
      lineItems: [],
      totals: { subtotal: 100, discountTotal: null, taxTotal: 10, taxesBreakdown: null, shippingCharges: null, additionalCharges: null, rounding: null, grandTotal: 110, paidAmount: null, balanceDue: null },
      paymentInfo: { dueDate: null, paymentTerms: null, paymentMethod: null, bankDetails: null },
      notes: [],
      rawTextSnippets: [],
      metadata: { pageCount: 1, pagesCovered: [1], isScanned: false, ocrConfidence: 0.99, extractorModel: 'gemini-1.5-pro', extractedAt: '2026-09-01T00:00:00Z', processingTimeMs: 1200 },
    },
    reconciliation: {
      documentId: 'doc_verified_999',
      reconciledAt: '2026-09-01T00:00:00Z',
      overallStatus: 'EXACT_MATCH',
      isVerified: true,
      toleranceApplied: 0,
      currency: 'USD',
      currencyPrecision: 2,
      lineItems: [],
      totals: { calculatedSubtotal: 100, extractedSubtotal: 100, subtotalVariance: 0, calculatedTaxTotal: 10, extractedTaxTotal: 10, taxVariance: 0, calculatedGrandTotal: 110, extractedGrandTotal: 110, grandTotalVariance: 0, calculatedBalanceDue: null, extractedBalanceDue: null, balanceDueVariance: null, status: 'EXACT_MATCH', discrepancies: [], isVerified: true },
      discrepancies: [],
      auditNotes: [],
    },
    auditTrail: { stages: [], totalProcessingTimeMs: 1200, retryCount: 0, escalationCount: 0, modelsUsed: ['gemini-1.5-pro'] },
    xlsxBase64: 'UEsDBBQAAAAIA...',
    summary: {
      document: { sourceFilename: 'my_invoice.pdf', documentType: 'invoice', invoiceNumber: 'INV-999', documentNumber: 'INV-999', invoiceDate: '2026-09-01', dueDate: null, purchaseOrderNumber: null, referenceNumbers: [], vendorName: 'Vendor', customerName: 'Cust', currency: 'USD', language: 'en', totalPdfPages: 1, processedPages: 1, extractedPages: [1], failedPages: [], skippedPages: [], extractionCompleteness: 1, isFullyCovered: true, extractedLineItemCount: 0 },
      financial: { currency: 'USD', subtotal: 100, discountTotal: null, taxTotal: 10, taxBreakdown: null, shippingCharges: null, additionalCharges: null, rounding: null, grandTotal: 110, paidAmount: null, balanceDue: null, overallReconciliationStatus: 'EXACT_MATCH', reconciliationVerificationStatus: true, calculatedSubtotal: 100, extractedSubtotal: 100, subtotalVariance: 0, calculatedTaxTotal: 10, extractedTaxTotal: 10, taxVariance: 0, calculatedGrandTotal: 110, extractedGrandTotal: 110, grandTotalVariance: 0, calculatedBalanceDue: null, extractedBalanceDue: null, balanceDueVariance: null, discrepancies: [], toleranceApplied: 0, currencyPrecision: 2, sourceRoundingApplied: 0 },
      verification: { isVerified: true, reconciliationVerified: true, secondPassVerified: true, completenessVerified: true, semanticVerified: true, xlsxVerified: true, verificationGateStatus: 'PASSED', gateFailureReasons: [], discrepancies: [] },
      xlsx: { generatedXlsxFilename: 'my_invoice_reconciled.xlsx', xlsxValid: true, sheetCount: 3, sheetNames: ['Summary', 'Line Items', 'Audit'], totalRowCount: 20, totalColumnCount: 8, formulaCount: 4, workbookErrors: [], summarySheetPresent: true, lineItemsSheetPresent: true, auditSheetPresent: true },
      status: 'VERIFIED',
    },
  };

  it('16-20. State survives Generator -> Settings -> About -> Generator while processing in background', async () => {
    let resolveProcessing: (res: DocumentProcessingResult) => void;
    const processingPromise = new Promise<DocumentProcessingResult>((resolve) => {
      resolveProcessing = resolve;
    });

    const processSpy = vi.spyOn(documentService, 'processDocumentHybrid').mockImplementation(async (_file, options) => {
      options?.onModeSelected?.('direct');
      options?.onStageChange?.('Executing zero-tolerance reconciliation...');
      return processingPromise;
    });

    render(
      <GeneratorProvider>
        <TestAppShell />
      </GeneratorProvider>
    );

    // Initial state
    expect(screen.getByTestId('status').textContent).toBe('IDLE');

    // 1. User starts processing
    await act(async () => {
      screen.getByTestId('start-btn').click();
    });

    expect(screen.getByTestId('status').textContent).toBe('PROCESSING');
    expect(screen.getByTestId('filename').textContent).toBe('my_invoice.pdf');
    expect(screen.getByTestId('current-stage').textContent).toBe('Executing zero-tolerance reconciliation...');

    // 2. User navigates to Settings
    await act(async () => {
      screen.getByTestId('nav-settings').click();
    });
    expect(screen.getByTestId('current-tab').textContent).toBe('settings');
    expect(screen.queryByTestId('generator-screen')).toBeNull();

    // 3. User navigates to About
    await act(async () => {
      screen.getByTestId('nav-about').click();
    });
    expect(screen.getByTestId('current-tab').textContent).toBe('about');

    // Processing request is NOT duplicated or aborted
    expect(processSpy).toHaveBeenCalledTimes(1);

    // 4. Background processing finishes while user is on About screen
    await act(async () => {
      resolveProcessing!(mockResult);
    });

    // 5. User returns to Generator screen
    await act(async () => {
      screen.getByTestId('nav-generator').click();
    });

    // 6. Completed result is displayed immediately!
    expect(screen.getByTestId('status').textContent).toBe('COMPLETED');
    expect(screen.getByTestId('filename').textContent).toBe('my_invoice.pdf');
    expect(screen.getByTestId('result-doc-id').textContent).toBe('doc_verified_999');
    expect(screen.getByTestId('is-processing').textContent).toBe('false');

    // Verify file was NOT re-uploaded or re-processed
    expect(processSpy).toHaveBeenCalledTimes(1);
  });

  it('21. REVIEW_REQUIRED survives sidebar navigation', async () => {
    const reviewResult: DocumentProcessingResult = {
      ...mockResult,
      summary: {
        ...mockResult.summary,
        status: 'REVIEW_REQUIRED',
        issues: [
          {
            id: 'iss_1',
            type: 'RECONCILIATION_ERROR',
            severity: 'CRITICAL',
            status: 'OPEN',
            page: 1,
            field: 'grandTotal',
            originalValue: 120,
            aiInterpretation: { field: 'grandTotal', value: 120 },
            message: 'Tax discrepancy detected',
            reason: 'Calculated differs from extracted',
            evidence: [{ text: 'Invoice text shows $120 total' }],
            resolutionOptions: ['KEEP_AS_IS', 'ADJUSTMENT'],
            resolved: false,
          },
        ],
        review: {
          required: true,
          openIssueCount: 1,
          reviewToken: 'rtok_secret123',
        },
      },
    };

    vi.spyOn(documentService, 'processDocumentHybrid').mockResolvedValue(reviewResult);

    render(
      <GeneratorProvider>
        <TestAppShell />
      </GeneratorProvider>
    );

    // Start
    await act(async () => {
      screen.getByTestId('start-btn').click();
    });

    expect(screen.getByTestId('status').textContent).toBe('REVIEW_REQUIRED');

    // Navigate to Settings then back
    await act(async () => {
      screen.getByTestId('nav-settings').click();
    });
    await act(async () => {
      screen.getByTestId('nav-generator').click();
    });

    // REVIEW_REQUIRED preserved!
    expect(screen.getByTestId('status').textContent).toBe('REVIEW_REQUIRED');
    expect(screen.getByTestId('filename').textContent).toBe('my_invoice.pdf');
  });

  it('22. ERROR state survives sidebar navigation', async () => {
    vi.spyOn(documentService, 'processDocumentHybrid').mockRejectedValue(
      new Error('Cloud upload failed: Connection timeout')
    );

    render(
      <GeneratorProvider>
        <TestAppShell />
      </GeneratorProvider>
    );

    await act(async () => {
      screen.getByTestId('start-btn').click();
    });

    expect(screen.getByTestId('status').textContent).toBe('ERROR');
    expect(screen.getByTestId('process-error').textContent).toBe('Cloud upload failed: Connection timeout');

    // Navigate away and back
    await act(async () => {
      screen.getByTestId('nav-settings').click();
    });
    await act(async () => {
      screen.getByTestId('nav-generator').click();
    });

    // Error preserved!
    expect(screen.getByTestId('status').textContent).toBe('ERROR');
    expect(screen.getByTestId('process-error').textContent).toBe('Cloud upload failed: Connection timeout');
  });

  it('26. AbortController is NOT triggered by sidebar navigation, only on explicit reset', async () => {
    let capturedSignal: AbortSignal | undefined;
    vi.spyOn(documentService, 'processDocumentHybrid').mockImplementation(async (_file, options) => {
      capturedSignal = options?.signal;
      return new Promise(() => {}); // Intentionally pending
    });

    render(
      <GeneratorProvider>
        <TestAppShell />
      </GeneratorProvider>
    );

    await act(async () => {
      screen.getByTestId('start-btn').click();
    });

    expect(capturedSignal?.aborted).toBe(false);

    // Navigate to settings and about
    await act(async () => {
      screen.getByTestId('nav-settings').click();
    });
    expect(capturedSignal?.aborted).toBe(false);

    await act(async () => {
      screen.getByTestId('nav-about').click();
    });
    expect(capturedSignal?.aborted).toBe(false);

    await act(async () => {
      screen.getByTestId('nav-generator').click();
    });
    expect(capturedSignal?.aborted).toBe(false);

    // Now explicit user reset
    await act(async () => {
      screen.getByTestId('reset-btn').click();
    });

    // Signal is now aborted!
    expect(capturedSignal?.aborted).toBe(true);
    expect(screen.getByTestId('status').textContent).toBe('IDLE');
  });
});
