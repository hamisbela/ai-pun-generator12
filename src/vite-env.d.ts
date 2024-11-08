/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDFLARE_API_TOKEN: string
  readonly VITE_CLOUDFLARE_ACCOUNT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}