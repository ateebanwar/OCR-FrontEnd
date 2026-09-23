import { ApiSuccessResponse, ApiErrorResponse } from '../types/api';

const DEFAULT_API_BASE_URL = 'https://ocr-backend-pi.vercel.app';

export class ApiError extends Error {
  public code: string;
  public status: number;
  public details?: unknown;

  constructor(message: string, code: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

type UnauthorizedHandler = () => void;

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private onUnauthorized: UnauthorizedHandler | null = null;

  constructor() {
    this.baseUrl = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
  }

  public setToken(token: string | null): void {
    this.token = token;
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = sessionStorage.getItem('ocr_token');
    }
    return this.token;
  }

  public setOnUnauthorized(handler: UnauthorizedHandler | null): void {
    this.onUnauthorized = handler;
  }

  private getHeaders(isJsonBody: boolean = false): HeadersInit {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (isJsonBody) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private handleHttpError(status: number, errorData?: ApiErrorResponse['error']): never {
    if (status === 401) {
      if (this.onUnauthorized) {
        this.onUnauthorized();
      }
      throw new ApiError(
        errorData?.message || 'Session expired or unauthorized. Please sign in again.',
        errorData?.code || 'UNAUTHORIZED',
        401,
        errorData?.details
      );
    }

    const message = errorData?.message || `Request failed with status ${status}`;
    const code = errorData?.code || `HTTP_${status}`;
    throw new ApiError(message, code, status, errorData?.details);
  }

  public async get<T>(path: string, signal?: AbortSignal): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    let res: Response;

    try {
      res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(false),
        signal,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError('Request was cancelled.', 'ABORTED', 0);
      }
      const origMsg = err instanceof Error ? err.message : '';
      throw new ApiError(
        origMsg ? `Network error: ${origMsg}` : 'Unable to connect to the backend server. Please check your connection.',
        'NETWORK_ERROR',
        0
      );
    }

    if (!res.ok) {
      let errorBody: ApiErrorResponse['error'] | undefined;
      try {
        const json: ApiErrorResponse = await res.json();
        errorBody = json.error;
      } catch {
        // Ignored, fallback to generic
      }
      this.handleHttpError(res.status, errorBody);
    }

    const result: ApiSuccessResponse<T> = await res.json();
    return result.data;
  }

  public async post<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    let res: Response;

    try {
      res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: body ? JSON.stringify(body) : undefined,
        signal,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError('Request was cancelled.', 'ABORTED', 0);
      }
      const origMsg = err instanceof Error ? err.message : '';
      throw new ApiError(
        origMsg ? `Network error: ${origMsg}` : 'Unable to connect to the backend server. Please check your connection.',
        'NETWORK_ERROR',
        0
      );
    }

    if (!res.ok) {
      let errorBody: ApiErrorResponse['error'] | undefined;
      try {
        const json: ApiErrorResponse = await res.json();
        errorBody = json.error;
      } catch {
        // Ignored
      }
      this.handleHttpError(res.status, errorBody);
    }

    const result: ApiSuccessResponse<T> = await res.json();
    return result.data;
  }

  public async postFormData<T>(path: string, formData: FormData, signal?: AbortSignal): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    let res: Response;

    try {
      // Do not set Content-Type header so the browser automatically sets boundary
      res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: formData,
        signal,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError('Request was cancelled.', 'ABORTED', 0);
      }
      const origMsg = err instanceof Error ? err.message : '';
      throw new ApiError(
        origMsg ? `Upload failed: ${origMsg}` : 'Upload failed. Please check your connection to the server.',
        'NETWORK_ERROR',
        0
      );
    }

    if (!res.ok) {
      let errorBody: ApiErrorResponse['error'] | undefined;
      try {
        const json: ApiErrorResponse = await res.json();
        errorBody = json.error;
      } catch {
        // Ignored
      }
      this.handleHttpError(res.status, errorBody);
    }

    const result: ApiSuccessResponse<T> = await res.json();
    return result.data;
  }

  public async postBlob(
    path: string,
    body: unknown,
    signal?: AbortSignal
  ): Promise<{ blob: Blob; filename: string | null }> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    let res: Response;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream, */*',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError('Request was cancelled.', 'ABORTED', 0);
      }
      const origMsg = err instanceof Error ? err.message : '';
      throw new ApiError(
        origMsg ? `Download failed: ${origMsg}` : 'Download failed. Network connection error.',
        'NETWORK_ERROR',
        0
      );
    }

    if (!res.ok) {
      let errorBody: ApiErrorResponse['error'] | undefined;
      try {
        const json: ApiErrorResponse = await res.json();
        errorBody = json.error;
      } catch {
        // Ignored
      }
      this.handleHttpError(res.status, errorBody);
    }

    // Extract backend-provided filename from Content-Disposition header when available (Req 8)
    const disposition = res.headers.get('content-disposition');
    let filename: string | null = null;
    if (disposition) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i);
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, '').trim();
      }
    }

    const blob = await res.blob();
    return { blob, filename };
  }
}

export const apiClient = new ApiClient();
