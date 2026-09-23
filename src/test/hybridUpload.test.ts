import { describe, it, expect, vi, beforeEach } from 'vitest';
import { documentService } from '../services/documentService';
import { apiClient } from '../services/apiClient';
import { put } from '@vercel/blob/client';

vi.mock('@vercel/blob/client', () => ({
  put: vi.fn(),
  upload: vi.fn(),
}));

describe('Hybrid PDF Transport and Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockResult = {
    success: true,
    documentId: 'doc_123',
    sourceFilename: 'sample.pdf',
    documentHash: 'hash_abc',
    isVerified: true,
    document: {
      documentId: 'doc_123',
      documentHash: 'hash_abc',
      documentType: 'invoice' as const,
      invoiceNumber: 'INV-001',
      documentNumber: 'INV-001',
      invoiceDate: '2026-09-01',
      deliveryDate: null,
      purchaseOrderNumber: null,
      referenceNumbers: [],
      vendor: { name: 'Acme Corp', address: null, taxId: null, email: null, phone: null, contactPerson: null },
      customer: { name: 'Client LLC', address: null, taxId: null, email: null, phone: null, contactPerson: null },
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
      documentId: 'doc_123',
      reconciledAt: '2026-09-01T00:00:00Z',
      overallStatus: 'EXACT_MATCH' as const,
      isVerified: true,
      toleranceApplied: 0,
      currency: 'USD',
      currencyPrecision: 2,
      lineItems: [],
      totals: { calculatedSubtotal: 100, extractedSubtotal: 100, subtotalVariance: 0, calculatedTaxTotal: 10, extractedTaxTotal: 10, taxVariance: 0, calculatedGrandTotal: 110, extractedGrandTotal: 110, grandTotalVariance: 0, calculatedBalanceDue: null, extractedBalanceDue: null, balanceDueVariance: null, status: 'EXACT_MATCH' as const, discrepancies: [], isVerified: true },
      discrepancies: [],
      auditNotes: [],
    },
    auditTrail: { stages: [], totalProcessingTimeMs: 1200, retryCount: 0, escalationCount: 0, modelsUsed: ['gemini-1.5-pro'] },
    xlsxBase64: 'UEsDBBQAAAAIA...',
    summary: {
      document: { sourceFilename: 'sample.pdf', documentType: 'invoice' as const, invoiceNumber: 'INV-001', documentNumber: 'INV-001', invoiceDate: '2026-09-01', dueDate: null, purchaseOrderNumber: null, referenceNumbers: [], vendorName: 'Acme Corp', customerName: 'Client LLC', currency: 'USD', language: 'en', totalPdfPages: 1, processedPages: 1, extractedPages: [1], failedPages: [], skippedPages: [], extractionCompleteness: 1, isFullyCovered: true, extractedLineItemCount: 0 },
      financial: { currency: 'USD', subtotal: 100, discountTotal: null, taxTotal: 10, taxBreakdown: null, shippingCharges: null, additionalCharges: null, rounding: null, grandTotal: 110, paidAmount: null, balanceDue: null, overallReconciliationStatus: 'EXACT_MATCH' as const, reconciliationVerificationStatus: true, calculatedSubtotal: 100, extractedSubtotal: 100, subtotalVariance: 0, calculatedTaxTotal: 10, extractedTaxTotal: 10, taxVariance: 0, calculatedGrandTotal: 110, extractedGrandTotal: 110, grandTotalVariance: 0, calculatedBalanceDue: null, extractedBalanceDue: null, balanceDueVariance: null, discrepancies: [], toleranceApplied: 0, currencyPrecision: 2, sourceRoundingApplied: 0 },
      verification: { isVerified: true, reconciliationVerified: true, secondPassVerified: true, completenessVerified: true, semanticVerified: true, xlsxVerified: true, verificationGateStatus: 'PASSED' as const, gateFailureReasons: [], discrepancies: [] },
      xlsx: { generatedXlsxFilename: 'sample_reconciled.xlsx', xlsxValid: true, sheetCount: 3, sheetNames: ['Summary', 'Line Items', 'Audit'], totalRowCount: 20, totalColumnCount: 8, formulaCount: 4, workbookErrors: [], summarySheetPresent: true, lineItemsSheetPresent: true, auditSheetPresent: true },
      status: 'VERIFIED' as const,
    },
  };

  // UPLOAD SELECTION Tests
  it('1. <= direct threshold (e.g. 2 MB) chooses direct multipart upload', async () => {
    const postFormDataSpy = vi.spyOn(apiClient, 'postFormData').mockResolvedValue(mockResult);
    const postSpy = vi.spyOn(apiClient, 'post');

    // 2 MB file <= 4 MB
    const file = new File([new Uint8Array(2 * 1024 * 1024)], 'invoice_2mb.pdf', { type: 'application/pdf' });
    let selectedMode: string | null = null;

    const result = await documentService.processDocumentHybrid(file, {
      onModeSelected: (mode) => { selectedMode = mode; },
    });

    expect(selectedMode).toBe('direct');
    expect(postFormDataSpy).toHaveBeenCalledTimes(1);
    expect(postFormDataSpy).toHaveBeenCalledWith('/api/v1/documents/process', expect.any(FormData), undefined);
    // Blob path should NOT be invoked
    expect(postSpy).not.toHaveBeenCalledWith('/api/v1/documents/upload-token', expect.anything(), expect.anything());
    expect(put).not.toHaveBeenCalled();
    expect(result.documentId).toBe('doc_123');
  });

  it('2. > direct threshold (e.g. 7 MB) chooses private Blob upload', async () => {
    const postSpy = vi.spyOn(apiClient, 'post').mockImplementation(async (path) => {
      if (path === '/api/v1/documents/upload-token') {
        return {
          clientToken: 'mock_token_123',
          blobPathname: 'uploads/mock_uuid.pdf',
          maxSizeBytes: 25 * 1024 * 1024,
          allowedContentTypes: ['application/pdf'],
        };
      }
      if (path === '/api/v1/documents/process') {
        return mockResult;
      }
      throw new Error(`Unexpected path: ${path}`);
    });

    vi.mocked(put).mockResolvedValue({
      url: 'https://blob.vercel.com/uploads/mock_uuid.pdf',
      downloadUrl: 'https://blob.vercel.com/uploads/mock_uuid.pdf?download=1',
      pathname: 'uploads/mock_uuid.pdf',
      contentType: 'application/pdf',
      contentDisposition: 'inline',
      etag: 'mock_etag_123',
    });

    const postFormDataSpy = vi.spyOn(apiClient, 'postFormData');

    // 7 MB file > 4 MB threshold
    const file = new File([new Uint8Array(7 * 1024 * 1024)], 'invoice_7mb.pdf', { type: 'application/pdf' });
    let selectedMode: string | null = null;

    const result = await documentService.processDocumentHybrid(file, {
      onModeSelected: (mode) => { selectedMode = mode; },
    });

    expect(selectedMode).toBe('blob');
    // Step 1: upload authorization requested
    expect(postSpy).toHaveBeenCalledWith('/api/v1/documents/upload-token', { filename: 'invoice_7mb.pdf' }, undefined);
    // Step 2: Vercel Blob client upload performed directly
    expect(put).toHaveBeenCalledWith(
      'uploads/mock_uuid.pdf',
      file,
      expect.objectContaining({
        access: 'private',
        contentType: 'application/pdf',
        token: 'mock_token_123',
      })
    );
    // Step 3: Process endpoint called with JSON { blobPathname, filename }
    expect(postSpy).toHaveBeenCalledWith(
      '/api/v1/documents/process',
      { blobPathname: 'uploads/mock_uuid.pdf', filename: 'invoice_7mb.pdf' },
      undefined
    );
    // Large PDF is NOT sent as multipart to process endpoint
    expect(postFormDataSpy).not.toHaveBeenCalled();
    expect(result.documentId).toBe('doc_123');
  });

  it('3. > 25 MB is rejected immediately with exact error message', async () => {
    // 25 MB + 1 byte
    const largeFile = new File([new Uint8Array(25 * 1024 * 1024 + 1)], 'too_large.pdf', { type: 'application/pdf' });

    await expect(documentService.processDocumentHybrid(largeFile)).rejects.toThrow(
      'File is too large. Maximum supported PDF size is 25 MB.'
    );
  });

  it('4. zero-byte file is rejected immediately', async () => {
    const emptyFile = new File([], 'empty.pdf', { type: 'application/pdf' });

    await expect(documentService.processDocumentHybrid(emptyFile)).rejects.toThrow(
      'The selected file appears to be empty.'
    );
  });

  it('5. Blob upload failure is handled with clear user-facing error', async () => {
    vi.spyOn(apiClient, 'post').mockImplementation(async (path) => {
      if (path === '/api/v1/documents/upload-token') {
        return {
          clientToken: 'mock_token_123',
          blobPathname: 'uploads/mock_uuid.pdf',
          maxSizeBytes: 25 * 1024 * 1024,
          allowedContentTypes: ['application/pdf'],
        };
      }
      return mockResult;
    });

    vi.mocked(put).mockRejectedValue(new Error('Network error uploading to storage'));

    const file = new File([new Uint8Array(6 * 1024 * 1024)], 'invoice_6mb.pdf', { type: 'application/pdf' });

    await expect(documentService.processDocumentHybrid(file)).rejects.toThrow(
      'Cloud upload failed: Network error uploading to storage'
    );
  });

  it('6. Backend upload-token failure is handled cleanly', async () => {
    vi.spyOn(apiClient, 'post').mockImplementation(async (path) => {
      if (path === '/api/v1/documents/upload-token') {
        throw new Error('Upload authorization rejected by server');
      }
      return mockResult;
    });

    const file = new File([new Uint8Array(6 * 1024 * 1024)], 'invoice_6mb.pdf', { type: 'application/pdf' });

    await expect(documentService.processDocumentHybrid(file)).rejects.toThrow(
      'Failed to authorize secure upload: Upload authorization rejected by server'
    );
  });

  it('7. Configured thresholds match default 4 MB and 25 MB', () => {
    const thresholds = documentService.getThresholds();
    expect(thresholds.directMaxMb).toBe(4);
    expect(thresholds.maxUploadSizeMb).toBe(25);
    expect(thresholds.directMaxBytes).toBe(4 * 1024 * 1024);
    expect(thresholds.maxSizeBytes).toBe(25 * 1024 * 1024);
  });
});
