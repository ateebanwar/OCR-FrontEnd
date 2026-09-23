import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';
import { DocumentProcessingResult } from '../types/document';
import { UploadMode } from '../types/api';
import { documentService } from '../services/documentService';
import { triggerBlobDownload } from '../utils/download';

export type GeneratorStatus =
  | 'IDLE'
  | 'UPLOADING'
  | 'PROCESSING'
  | 'REVIEW_REQUIRED'
  | 'COMPLETED'
  | 'ERROR';

export interface GeneratorContextType {
  // State
  status: GeneratorStatus;
  isProcessing: boolean;
  selectedFile: File | null;
  filename: string | null;
  fileSize: number | null;
  uploadMode: UploadMode | null;
  uploadProgress: number | null;
  currentStage: string;
  processResult: DocumentProcessingResult | null;
  processError: string | null;
  isReviewModalOpen: boolean;
  isDownloadingXlsx: boolean;
  downloadSuccess: boolean;
  downloadError: string | null;

  // Actions
  startProcessing: (file: File) => Promise<void>;
  resetGenerator: () => void;
  cancelProcessing: () => void;
  downloadXlsx: () => Promise<void>;
  setReviewModalOpen: (open: boolean) => void;
  handleReviewResolved: (updatedResult: DocumentProcessingResult) => void;
  clearError: () => void;
}

const GeneratorContext = createContext<GeneratorContextType | undefined>(undefined);

export interface GeneratorProviderProps {
  children: ReactNode;
}

export const GeneratorProvider: React.FC<GeneratorProviderProps> = ({ children }) => {
  const [status, setStatus] = useState<GeneratorStatus>('IDLE');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [currentStage, setCurrentStage] = useState<string>('');
  const [processResult, setProcessResult] = useState<DocumentProcessingResult | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // XLSX download state
  const [isDownloadingXlsx, setIsDownloadingXlsx] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Active network request controller — kept in ref so unmounting views never abort it
  const abortControllerRef = useRef<AbortController | null>(null);

  const isProcessing = status === 'UPLOADING' || status === 'PROCESSING';

  const clearError = useCallback(() => {
    setProcessError(null);
  }, []);

  const resetGenerator = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus('IDLE');
    setSelectedFile(null);
    setUploadMode(null);
    setUploadProgress(null);
    setCurrentStage('');
    setProcessResult(null);
    setProcessError(null);
    setIsReviewModalOpen(false);
    setIsDownloadingXlsx(false);
    setDownloadSuccess(false);
    setDownloadError(null);
  }, []);

  const cancelProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus('IDLE');
    setSelectedFile(null);
    setUploadProgress(null);
    setCurrentStage('');
  }, []);

  const startProcessing = useCallback(async (file: File) => {
    // If an existing request is active, cancel it before starting new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setSelectedFile(file);
    setStatus('UPLOADING');
    setUploadProgress(null);
    setUploadMode(null);
    setCurrentStage('Preparing document...');
    setProcessError(null);
    setProcessResult(null);
    setDownloadSuccess(false);
    setDownloadError(null);

    try {
      const result = await documentService.processDocumentHybrid(file, {
        signal: controller.signal,
        onModeSelected: (mode) => {
          setUploadMode(mode);
          if (mode === 'direct') {
            setStatus('PROCESSING');
            setCurrentStage('Processing PDF document...');
          } else {
            setStatus('UPLOADING');
          }
        },
        onUploadProgress: (percent) => {
          setUploadProgress(percent);
          if (percent >= 100) {
            setStatus('PROCESSING');
            setCurrentStage('Processing PDF document...');
          }
        },
        onStageChange: (stage) => {
          setCurrentStage(stage);
          if (stage.includes('Processing')) {
            setStatus('PROCESSING');
          }
        },
      });

      // Processing finished successfully
      setProcessResult(result);

      const docStatus = result?.summary?.status;
      const openIssues = result?.summary?.issues?.filter((i) => !i.resolved) || [];
      const hasReviewToken = Boolean(result?.summary?.review?.reviewToken);

      if (docStatus === 'REVIEW_REQUIRED' || (hasReviewToken && openIssues.length > 0)) {
        setStatus('REVIEW_REQUIRED');
      } else {
        setStatus('COMPLETED');
      }
    } catch (err: unknown) {
      // If deliberately aborted by the user, don't show an error
      if (err instanceof Error && (err.name === 'AbortError' || err.message.includes('cancelled') || err.message.includes('aborted'))) {
        setStatus('IDLE');
        return;
      }
      setStatus('ERROR');
      if (err instanceof Error) {
        setProcessError(err.message);
      } else {
        setProcessError('Document processing encountered an error. Please verify the PDF format.');
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  const handleReviewResolved = useCallback((updatedResult: DocumentProcessingResult) => {
    setProcessResult(updatedResult);
    const openIssues = updatedResult?.summary?.issues?.filter((i) => !i.resolved) || [];
    if (openIssues.length === 0) {
      setStatus('COMPLETED');
      setIsReviewModalOpen(false);
    }
  }, []);

  const downloadXlsx = useCallback(async () => {
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

      const { blob, filename: resolvedFilename } = await documentService.downloadXlsx(
        processResult.xlsxBase64,
        filename
      );

      triggerBlobDownload(blob, resolvedFilename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 6000);
    } catch {
      setDownloadError('Unable to download the Excel file. Please try again.');
    } finally {
      setIsDownloadingXlsx(false);
    }
  }, [isDownloadingXlsx, processResult]);

  return (
    <GeneratorContext.Provider
      value={{
        status,
        isProcessing,
        selectedFile,
        filename: selectedFile?.name || processResult?.sourceFilename || null,
        fileSize: selectedFile?.size || null,
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
        setReviewModalOpen: setIsReviewModalOpen,
        handleReviewResolved,
        clearError,
      }}
    >
      {children}
    </GeneratorContext.Provider>
  );
};

export const useGenerator = (): GeneratorContextType => {
  const context = useContext(GeneratorContext);
  if (!context) {
    throw new Error('useGenerator must be used within a GeneratorProvider');
  }
  return context;
};
