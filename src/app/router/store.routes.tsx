import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { StoreLayout } from '@/app/layouts/store/store-layout'

const HomePage = lazy(() => import('@/features/store/home/pages/home-page'))
const CatalogPage = lazy(() => import('@/features/store/catalog/pages/catalog-page'))
const StoreCategoriesPage = lazy(() => import('@/features/store/category/pages/store-categories-page'))
const CategoryPage = lazy(() => import('@/features/store/category/pages/category-page'))
const ProductPage = lazy(() => import('@/features/store/product/pages/product-page'))
const FavoritesPage = lazy(() => import('@/features/store/favorites/pages/favorites-page'))
const AboutPage = lazy(() => import('@/features/store/about/pages/about-page'))
const NotFoundPage = lazy(() => import('@/features/store/shared/pages/not-found-page'))

export function StoreRoutes() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/categories" element={<StoreCategoriesPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
