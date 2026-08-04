/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_CMS_APP_DOMAIN: string
  readonly VITE_DEV_TENANT_HOST: string
  readonly VITE_DEV_DEFAULT_SHELL: 'store' | 'cms'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
