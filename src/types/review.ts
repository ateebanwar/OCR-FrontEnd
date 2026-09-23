export type DocumentStatus =
  | 'VERIFIED'
  | 'VERIFIED_WITH_CORRECTIONS'
  | 'REVIEW_REQUIRED'
  | 'REJECTED';

export type IssueType =
  | 'EXTRACTION_CORRECTION'
  | 'AMBIGUOUS_VALUE'
  | 'RECONCILIATION_WARNING'
  | 'RECONCILIATION_ERROR'
  | 'COMPLETENESS_WARNING'
  | 'SEMANTIC_VALIDATION_WARNING'
  | 'SEMANTIC_VALIDATION_ERROR'
  | 'XLSX_VALIDATION_ERROR'
  | 'SECURITY_ERROR'
  | 'PROCESSING_ERROR';

export type IssueSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type IssueStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';

export type ResolutionDecision =
  | 'DISCOUNT'
  | 'CREDIT'
  | 'REFUND'
  | 'ADJUSTMENT'
  | 'OTHER'
  | 'KEEP_AS_IS';

export interface IssueEvidence {
  page?: number;
  text?: string;
  field?: string;
  context?: string;
}

export interface ReviewIssue {
  id: string;
  type: IssueType;
  severity: IssueSeverity;
  status: IssueStatus;
  page: number;
  field: string;
  lineItemIndex?: number;
  originalValue: unknown;
  aiInterpretation: {
    field: string;
    value: unknown;
  };
  message: string;
  reason: string;
  evidence: IssueEvidence[];
  resolutionOptions: ResolutionDecision[];
  resolved: boolean;
  userDecision?: ResolutionDecision;
  customMeaning?: string | null;
  customValue?: unknown;
  resolvedAt?: string;
}

export interface CorrectionRecord {
  issueId: string;
  page: number;
  field: string;
  lineItemIndex?: number;
  originalField: string;
  originalValue: unknown;
  finalValue: unknown;
  correctedValue?: unknown;
  interpretation?: string;
  discount?: number;
  reason: string;
  evidence: string[];
  resolved: boolean;
  timestamp: string;
  source: 'AUTOMATIC_ENGINE' | 'USER';
}

export interface ReviewState {
  required: boolean;
  openIssueCount: number;
  reviewToken?: string;
}

export interface IssueResolutionInput {
  issueId: string;
  userDecision: ResolutionDecision;
  customMeaning?: string | null;
  customValue?: unknown;
}

export interface ReviewResolutionRequest {
  reviewToken: string;
  resolutions: IssueResolutionInput[];
}
