/** Uploaded file URLs come back as paths relative to the API origin (e.g. `/uploads/x.jpg`). */
export function resolveAssetUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url
  return `${import.meta.env.VITE_API_BASE_URL || ''}${url}`
}
