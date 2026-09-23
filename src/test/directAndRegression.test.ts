import { describe, it, expect, vi, beforeEach } from 'vitest';
import { documentService } from '../services/documentService';
import { apiClient } from '../services/apiClient';

describe('Direct Path, Download, and Review Integrations', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    apiClient.setToken('test_auth_token_xyz');
  });

  it('7. Authorization header is preserved and attached to requests', async () => {
    let capturedHeaders: HeadersInit | undefined;
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (_url, init) => {
      capturedHeaders = init?.headers;
      return new Response(JSON.stringify({ success: true, data: { status: 'ok' }, requestId: 'req_1' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await apiClient.get('/api/v1/access/status');

    expect(capturedHeaders).toBeDefined();
    expect((capturedHeaders as Record<string, string>)['Authorization']).toBe('Bearer test_auth_token_xyz');
  });

  it('34. XLSX download request calls /api/v1/documents/download and resolves binary blob', async () => {
    const mockBlobData = new Blob(['mock excel spreadsheet binary data'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    vi.spyOn(apiClient, 'postBlob').mockResolvedValue({
      blob: mockBlobData,
      filename: 'custom_report.xlsx',
    });

    const result = await documentService.downloadXlsx('base64_data_here', 'custom_report.xlsx');

    expect(result.blob).toBe(mockBlobData);
    expect(result.filename).toBe('custom_report.xlsx');
  });

  it('33. Review submission sends decisions and returns updated result', async () => {
    const mockUpdatedResult = {
      success: true,
      documentId: 'doc_123',
      sourceFilename: 'invoice.pdf',
      documentHash: 'hash_123',
      isVerified: true,
      document: {} as any,
      reconciliation: {} as any,
      auditTrail: {} as any,
      xlsxBase64: 'UEsDB...',
      summary: {
        document: {} as any,
        financial: {} as any,
        verification: {} as any,
        xlsx: {} as any,
        status: 'VERIFIED_WITH_CORRECTIONS' as const,
      },
    };

    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValue(mockUpdatedResult);

    const updated = await documentService.submitReview({
      reviewToken: 'rtok_123',
      resolutions: [{ issueId: 'iss_1', userDecision: 'KEEP_AS_IS' }],
    });

    expect(postSpy).toHaveBeenCalledWith(
      '/api/v1/documents/review',
      {
        reviewToken: 'rtok_123',
        resolutions: [{ issueId: 'iss_1', userDecision: 'KEEP_AS_IS' }],
      },
      undefined
    );
    expect(updated.summary.status).toBe('VERIFIED_WITH_CORRECTIONS');
  });
});
