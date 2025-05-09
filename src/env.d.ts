/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_URL: string;
    readonly VITE_MOCK_API: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}