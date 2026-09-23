/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_DIRECT_UPLOAD_MAX_MB?: string;
  readonly VITE_MAX_UPLOAD_SIZE_MB?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
