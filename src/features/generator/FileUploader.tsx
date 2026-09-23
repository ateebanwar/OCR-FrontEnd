import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { formatFileSize } from '../../utils/formatters';

interface FileUploaderProps {
  onProcess: (file: File) => void;
  isProcessing: boolean;
}

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export const FileUploader: React.FC<FileUploaderProps> = ({
  onProcess,
  isProcessing,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setValidationError(null);

    // Validate type (must be PDF)
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setValidationError('Invalid file format. Please upload a standard PDF document.');
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError('File exceeds the maximum 25 MB size limit.');
      return;
    }

    if (file.size === 0) {
      setValidationError('The selected file appears to be empty.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartProcess = () => {
    if (selectedFile) {
      onProcess(selectedFile);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
        id="pdf-upload-input"
        disabled={isProcessing}
      />

      {/* Upload Dropzone */}
      {!selectedFile ? (
        <label
          htmlFor="pdf-upload-input"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 select-none ${
            dragActive
              ? 'border-foreground bg-surface-elevated scale-[0.99]'
              : 'border-border hover:border-border-strong bg-surface hover:bg-surface-elevated/40'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-foreground mb-4 shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            Drop your PDF financial document here
          </h3>
          <p className="text-xs text-foreground-muted mt-1 max-w-sm">
            Drag and drop or click to browse invoices, bills, receipts, or statements (up to 25 MB)
          </p>
          <div className="mt-4 px-3 py-1 rounded-full bg-surface-elevated border border-border text-[11px] font-mono text-foreground-subtle">
            PDF FORMAT ONLY • DUAL-PASS OCR
          </div>
        </label>
      ) : (
        /* Selected File Card */
        <div className="rounded-2xl bg-surface border border-border-strong/70 p-5 shadow-card dark:shadow-card-dark space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-foreground flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate max-w-md">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-foreground-subtle font-mono mt-0.5">
                  {formatFileSize(selectedFile.size)} • Ready for processing
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="text-xs text-foreground-muted hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-surface-elevated transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={isProcessing}
                aria-label="Remove selected file"
                className="text-foreground-subtle hover:text-rose-500 p-1.5 rounded-lg hover:bg-surface-elevated transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-border flex justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={handleStartProcess}
              isLoading={isProcessing}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Process Document
            </Button>
          </div>
        </div>
      )}

      {/* Validation Error */}
      {validationError && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};
