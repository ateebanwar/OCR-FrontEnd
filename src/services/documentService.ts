import { apiClient } from './apiClient';
import { DocumentProcessingResult } from '../types/document';
import { ReviewResolutionRequest } from '../types/review';

export const documentService = {
  /**
   * Uploads and initiates high-precision processing of a PDF financial document.
   */
  async processDocument(file: File): Promise<DocumentProcessingResult> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return apiClient.postFormData<DocumentProcessingResult>(
      '/api/v1/documents/process',
      formData
    );
  },

  /**
   * Submits user review decisions for discrepancies or ambiguous values,
   * receiving an updated backend-authoritative result.
   */
  async submitReview(payload: ReviewResolutionRequest): Promise<DocumentProcessingResult> {
    return apiClient.post<DocumentProcessingResult>(
      '/api/v1/documents/review',
      payload
    );
  },

  /**
   * Requests the real binary XLSX spreadsheet for a processed document.
   * Calls POST /api/v1/documents/download with Authorization: Bearer <accessToken>,
   * handles the response as a real XLSX binary file, and returns both the binary Blob
   * and the backend-provided filename (ending with .xlsx).
   */
  async downloadXlsx(
    xlsxBase64: string,
    filename?: string
  ): Promise<{ blob: Blob; filename: string }> {
    const defaultName = filename || 'financial_report.xlsx';
    const result = await apiClient.postBlob('/api/v1/documents/download', {
      xlsxBase64,
      filename: defaultName,
    });

    let resolvedFilename = result.filename || defaultName;
    if (!resolvedFilename.toLowerCase().endsWith('.xlsx')) {
      resolvedFilename = `${resolvedFilename}.xlsx`;
    }

    return {
      blob: result.blob,
      filename: resolvedFilename,
    };
  },
};
