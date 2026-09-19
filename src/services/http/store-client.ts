import axios from 'axios'

export const storeClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

if (import.meta.env.DEV && import.meta.env.VITE_DEV_TENANT_HOST) {
  storeClient.interceptors.request.use((config) => {
    config.headers['x-tenant-host'] = import.meta.env.VITE_DEV_TENANT_HOST
    return config
  })
}
