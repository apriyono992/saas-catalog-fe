# API Contract — Category image

**Status:** Backend shipped and live. FE store-side consumption (`GET /store/categories`, `getStoreCategories()`, `CategoryListItem`) is already implemented. **The CMS/admin side (upload & manage the image) is not yet implemented in FE** — that's what this contract covers.

Full generic reference: `docs/API_DOCUMENTATION.md` §3.2 (Categories) and §2 (Store endpoints). This doc exists to give the CMS-side work a single, copy-pasteable spec.

## 1. What changed

Categories can now have one optional display image (icon/banner), managed from the CMS. It's a single slot — uploading again replaces the previous image (old file removed from storage). There is no gallery/multi-image for categories (unlike products).

## 2. Data contract — `Category` type

`src/types/api/category.types.ts` is missing the new field. Update it:

```ts
export interface Category {
  id: string
  tenantId: string
  name: string
  slug: string
  imageUrl: string | null   // NEW
  createdAt: string
  updatedAt: string
}
```

`imageUrl` is `null` until an image is uploaded. It's a **path relative to the API origin** (e.g. `/uploads/categories/<id>/<uuid>.png` in local dev, or a full S3 URL in prod) — exactly the same shape product image/thumbnail URLs already use. Resolve it the same way, with the existing helper:

```ts
import { resolveAssetUrl } from '@/lib/resolve-asset-url'

<img src={resolveAssetUrl(category.imageUrl)} />
```

No changes needed to `CreateCategoryDto` / `UpdateCategoryDto` — the image is never set via those, only via the endpoints below. `imageUrl` already appears on every existing category response (list/detail/create/update) once the type is updated — no new fetch is required to see it.

## 3. Endpoints (CMS, JWT-protected)

### Upload / replace image

```
POST /cms/categories/:id/image
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

| Part | Constraint |
|---|---|
| `file` (form field) | Single file. `image/jpeg`, `image/png`, or `image/webp` only. Max **5 MB** (server-enforced). |

**Response `200`** — the full updated `Category`:
```json
{
  "id": "e66e1792-ec4e-4f5c-87f1-5d6f9bc0b6e0",
  "tenantId": "03108008-e5c8-45f2-9a74-e56305c238fe",
  "name": "Baju",
  "slug": "baju",
  "imageUrl": "/uploads/categories/e66e1792-ec4e-4f5c-87f1-5d6f9bc0b6e0/77d59a05-5c99-405a-bb6d-d7c207de849b.png",
  "createdAt": "2026-08-16T14:29:24.090Z",
  "updatedAt": "2026-08-17T14:40:53.399Z"
}
```

**Errors**
| Status | Cause |
|---|---|
| `400` | No file attached, unreadable/too-large file, or a MIME type other than jpeg/png/webp (`"Only JPEG, PNG, or WEBP images are allowed"`) |
| `404` | Category doesn't exist for the current tenant |
| `401` | Missing/invalid/expired token |

Re-uploading on a category that already has an image **replaces it** — the previous file is deleted from storage as part of the same call. No separate "delete then upload" step needed.

### Remove image

```
DELETE /cms/categories/:id/image
Authorization: Bearer <accessToken>
```

**Response `204`** — no body. `imageUrl` becomes `null`. **Idempotent** — calling it again (or on a category with no image) still returns `204`, not an error.

## 4. Suggested FE changes (not applied — reference only)

Mirrors the exact pattern already used for product images in `src/services/cms/product-images.api.ts`. Add to `src/services/cms/categories.api.ts`:

```ts
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types/api/category.types'

// ...existing listCategories/createCategory/updateCategory/deleteCategory...

export function uploadCategoryImage(id: string, file: File, onProgress?: (percent: number) => void) {
  const formData = new FormData()
  formData.append('file', file)

  return cmsClient
    .post<Category>(`/cms/categories/${id}/image`, formData, {
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return
        onProgress(Math.round((event.loaded / event.total) * 100))
      },
    })
    .then((res) => res.data)
}

export function deleteCategoryImage(id: string) {
  return cmsClient.delete(`/cms/categories/${id}/image`)
}
```

UI-side, the category form only has Name/Slug fields today (`src/features/admin/categories/*`) — an image upload field/dropzone would need adding there, same shape as the product images tab.

## 5. Store-side (already implemented, for reference)

```
GET /store/categories
X-Tenant-Host: <tenant hostname>
```
→ `200 CategoryListItem[]` — `{ id, name, slug, imageUrl }`. Already wired up: `src/types/api/store.types.ts` (`CategoryListItem`) and `src/services/store/categories.api.ts` (`getStoreCategories()`). No action needed here.

## 6. Manual verification

```bash
# Upload
curl -X POST "$BASE_URL/cms/categories/$CATEGORY_ID/image" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@image.png;type=image/png"

# Remove
curl -X DELETE "$BASE_URL/cms/categories/$CATEGORY_ID/image" \
  -H "Authorization: Bearer $TOKEN"
```
Or via Postman: `CMS (Tenant Admin) > Categories > Category Image` folder (`docs/postman/SaaS-Catalog-API.postman_collection.json`).
