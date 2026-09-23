import { ReviewIssue, CorrectionRecord, ReviewState, DocumentStatus } from './review';

export type DocumentType =
  | 'invoice'
  | 'bill'
  | 'purchase_order'
  | 'receipt'
  | 'statement'
  | 'tax_document'
  | 'accounting_document'
  | 'financial_report'
  | 'other';

export interface DocumentParty {
  name: string;
  address: string | null;
  taxId: string | null;
  email: string | null;
  phone: string | null;
  contactPerson: string | null;
}

export interface LineItem {
  lineNumber: number;
  description: string;
  sku: string | null;
  quantity: number;
  unit: string | null;
  unitPrice: number;
  discount: number | null;
  taxRate: number | null;
  taxAmount: number | null;
  lineSubtotal: number | null;
  lineTotal: number;
}

export interface TaxBreakdown {
  name: string;
  rate: number | null;
  amount: number;
}

export interface FinancialTotals {
  subtotal: number | null;
  discountTotal: number | null;
  taxTotal: number | null;
  taxesBreakdown: TaxBreakdown[] | null;
  shippingCharges: number | null;
  additionalCharges: number | null;
  rounding: number | null;
  grandTotal: number;
  paidAmount: number | null;
  balanceDue: number | null;
}

export interface PaymentInformation {
  dueDate: string | null;
  paymentTerms: string | null;
  paymentMethod: string | null;
  bankDetails: {
    bankName: string | null;
    accountNumber: string | null;
    routingNumber: string | null;
    iban: string | null;
    swiftBic: string | null;
  } | null;
}

export interface CanonicalFinancialDocument {
  documentId: string;
  documentHash: string;
  documentType: DocumentType;
  invoiceNumber: string | null;
  documentNumber: string | null;
  invoiceDate: string | null;
  deliveryDate: string | null;
  purchaseOrderNumber: string | null;
  referenceNumbers: string[];
  vendor: DocumentParty;
  customer: DocumentParty;
  currency: string;
  currencySymbol: string | null;
  language: string | null;
  lineItems: LineItem[];
  totals: FinancialTotals;
  paymentInfo: PaymentInformation;
  notes: string[];
  rawTextSnippets: string[];
  metadata: {
    pageCount: number;
    pagesCovered: number[];
    isScanned: boolean;
    ocrConfidence: number;
    extractorModel: string;
    extractedAt: string;
    processingTimeMs: number;
  };
}

export type ReconciliationStatus =
  | 'EXACT_MATCH'
  | 'ACCEPTABLE_ROUNDING'
  | 'DISCREPANCY'
  | 'MISSING_DATA';

export interface LineItemReconciliation {
  lineNumber: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number | null;
  taxRate: number | null;
  calculatedSubtotal: number;
  calculatedTotal: number;
  extractedTotal: number;
  variance: number;
  isMatched: boolean;
  notes: string | null;
}

export interface TotalsReconciliation {
  calculatedSubtotal: number;
  extractedSubtotal: number | null;
  subtotalVariance: number;
  calculatedTaxTotal: number;
  extractedTaxTotal: number | null;
  taxVariance: number;
  calculatedGrandTotal: number;
  extractedGrandTotal: number;
  grandTotalVariance: number;
  calculatedBalanceDue: number | null;
  extractedBalanceDue: number | null;
  balanceDueVariance: number | null;
  status: ReconciliationStatus;
  discrepancies: string[];
  isVerified: boolean;
}

export interface FinancialReconciliationReport {
  documentId: string;
  reconciledAt: string;
  overallStatus: ReconciliationStatus;
  isVerified: boolean;
  toleranceApplied: number;
  currency: string;
  currencyPrecision: number;
  lineItems: LineItemReconciliation[];
  totals: TotalsReconciliation;
  discrepancies: string[];
  auditNotes: string[];
}

export interface DocumentSummaryInfo {
  sourceFilename: string;
  documentType: DocumentType;
  invoiceNumber: string | null;
  documentNumber: string | null;
  invoiceDate: string | null;
  dueDate: string | null;
  purchaseOrderNumber: string | null;
  referenceNumbers: string[];
  vendorName: string | null;
  customerName: string | null;
  currency: string;
  language: string | null;
  totalPdfPages: number;
  processedPages: number;
  extractedPages: number[];
  failedPages: number[];
  skippedPages: number[];
  extractionCompleteness: number;
  isFullyCovered: boolean;
  extractedLineItemCount: number;
}

export interface FinancialSummaryInfo {
  currency: string;
  subtotal: number | null;
  discountTotal: number | null;
  taxTotal: number | null;
  taxBreakdown: TaxBreakdown[] | null;
  shippingCharges: number | null;
  additionalCharges: number | null;
  rounding: number | null;
  grandTotal: number;
  paidAmount: number | null;
  balanceDue: number | null;
  overallReconciliationStatus: ReconciliationStatus;
  reconciliationVerificationStatus: boolean;
  calculatedSubtotal: number;
  extractedSubtotal: number | null;
  subtotalVariance: number;
  calculatedTaxTotal: number;
  extractedTaxTotal: number | null;
  taxVariance: number;
  calculatedGrandTotal: number;
  extractedGrandTotal: number;
  grandTotalVariance: number;
  calculatedBalanceDue: number | null;
  extractedBalanceDue: number | null;
  balanceDueVariance: number | null;
  discrepancies: string[];
  toleranceApplied: number;
  currencyPrecision: number;
  sourceRoundingApplied: number;
}

export interface VerificationSummaryInfo {
  isVerified: boolean;
  reconciliationVerified: boolean;
  secondPassVerified: boolean;
  completenessVerified: boolean;
  semanticVerified: boolean;
  xlsxVerified: boolean;
  verificationGateStatus: 'PASSED' | 'FAILED';
  gateFailureReasons: string[];
  discrepancies: string[];
}

export interface XlsxSummaryInfo {
  generatedXlsxFilename: string;
  xlsxValid: boolean;
  sheetCount: number;
  sheetNames: string[];
  totalRowCount: number;
  totalColumnCount: number;
  formulaCount: number;
  workbookErrors: string[];
  summarySheetPresent: boolean;
  lineItemsSheetPresent: boolean;
  auditSheetPresent: boolean;
}

export interface ConversionSummary {
  document: DocumentSummaryInfo;
  financial: FinancialSummaryInfo;
  verification: VerificationSummaryInfo;
  xlsx: XlsxSummaryInfo;
  status?: DocumentStatus;
  issues?: ReviewIssue[];
  corrections?: CorrectionRecord[];
  review?: ReviewState;
}

export interface StageDuration {
  stage: string;
  durationMs: number;
  timestamp: string;
}

export interface ProcessingAuditTrail {
  stages: StageDuration[];
  totalProcessingTimeMs: number;
  selectedModel?: string;
  retryCount: number;
  escalationCount: number;
  correctionCount?: number;
  modelsUsed: string[];
}

export interface DocumentProcessingResult {
  success: boolean;
  documentId: string;
  sourceFilename: string;
  documentHash: string;
  isVerified: boolean;
  document: CanonicalFinancialDocument;
  reconciliation: FinancialReconciliationReport;
  auditTrail: ProcessingAuditTrail;
  xlsxBase64: string;
  summary: ConversionSummary;
}
