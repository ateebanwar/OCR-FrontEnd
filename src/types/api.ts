export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  requestId: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorBody;
  requestId: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface UploadTokenRequest {
  filename: string;
}

export interface UploadTokenData {
  clientToken: string;
  blobPathname: string;
  maxSizeBytes: number;
  allowedContentTypes: string[];
}

export interface BlobProcessRequest {
  blobPathname: string;
  filename: string;
}

export type UploadMode = 'direct' | 'blob';
