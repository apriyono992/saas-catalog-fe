import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/app/layouts/cms/auth-layout'
import { CmsLayout } from '@/app/layouts/cms/cms-layout'
import { AuthGuard } from '@/app/guards/auth-guard'
import { GuestGuard } from '@/app/guards/guest-guard'
import { RoleGuard } from '@/app/guards/role-guard'
import { useAuthStore } from '@/stores/auth-store'
import { getRoleLandingRoute } from '@/lib/role-routes'

const LoginPage = lazy(() => import('@/features/admin/auth/pages/login-page'))
const DashboardPage = lazy(() => import('@/features/admin/dashboard/pages/dashboard-page'))
const CategoriesPage = lazy(() => import('@/features/admin/categories/pages/categories-page'))
const CategoryNewPage = lazy(() => import('@/features/admin/categories/pages/category-new-page'))
const CategoryEditPage = lazy(() => import('@/features/admin/categories/pages/category-edit-page'))
const ProductsPage = lazy(() => import('@/features/admin/products/pages/products-page'))
const ProductNewPage = lazy(() => import('@/features/admin/products/pages/product-new-page'))
const ProductEditPage = lazy(() => import('@/features/admin/products/pages/product-edit-page'))
const SettingsPage = lazy(() => import('@/features/admin/settings/pages/settings-page'))
const AppearancePage = lazy(() => import('@/features/admin/appearance/pages/appearance-page'))
const ProfilePage = lazy(() => import('@/features/admin/profile/pages/profile-page'))
const AnalyticsPage = lazy(() => import('@/features/admin/analytics/pages/analytics-page'))
const ActivityLogsPage = lazy(() => import('@/features/admin/activity-logs/pages/activity-logs-page'))
const TenantsPage = lazy(() => import('@/features/admin/tenants/pages/tenants-page'))
const TenantDetailPage = lazy(() => import('@/features/admin/tenants/pages/tenant-detail-page'))
const PlatformUsersPage = lazy(() => import('@/features/admin/users/pages/platform-users-page'))
const PlatformMarketplacesPage = lazy(() => import('@/features/admin/marketplaces/pages/platform-marketplaces-page'))
const CmsNotFoundPage = lazy(() => import('@/features/admin/shared/pages/not-found-page'))

function RoleLandingRedirect() {
  const user = useAuthStore((s) => s.user)
  return <Navigate to={getRoleLandingRoute(user!.role)} replace />
}

export function CmsRoutes() {
  return (
    <Routes>
      <Route element={<GuestGuard />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<AuthGuard />}>
        <Route element={<CmsLayout />}>
          <Route index element={<RoleLandingRedirect />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route element={<RoleGuard allow={['admin']} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/new" element={<ProductNewPage />} />
            <Route path="/products/:id" element={<ProductEditPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/new" element={<CategoryNewPage />} />
            <Route path="/categories/:id" element={<CategoryEditPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/appearance" element={<AppearancePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/activity-logs" element={<ActivityLogsPage />} />
          </Route>

          <Route element={<RoleGuard allow={['superadmin']} />}>
            <Route path="/tenants" element={<TenantsPage />} />
            <Route path="/tenants/:id" element={<TenantDetailPage />} />
            <Route path="/users" element={<PlatformUsersPage />} />
            <Route path="/marketplaces" element={<PlatformMarketplacesPage />} />
          </Route>

          <Route path="*" element={<CmsNotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
