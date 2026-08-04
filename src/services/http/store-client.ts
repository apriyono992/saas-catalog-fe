import axios from 'axios'

export const storeClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

if (import.meta.env.DEV) {
  // The backend resolves tenants from the real Host header, which localhost
  // can't fake — mirrors the workaround the API docs describe for Postman/curl.
  storeClient.interceptors.request.use((config) => {
    config.headers['X-Tenant-Host'] = import.meta.env.VITE_DEV_TENANT_HOST
    return config
  })
}
