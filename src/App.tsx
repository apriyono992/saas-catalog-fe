import { lazy, Suspense } from 'react'
import { AppProviders } from '@/app/providers/app-providers'
import { FullscreenSpinner } from '@/components/common/fullscreen-spinner'
import { resolveShell } from '@/app/shell-resolver'

const StoreApp = lazy(() => import('@/app/store-app'))
const CmsApp = lazy(() => import('@/app/cms-app'))

const shell = resolveShell()

function App() {
  return (
    <AppProviders>
      <Suspense fallback={<FullscreenSpinner />}>{shell === 'cms' ? <CmsApp /> : <StoreApp />}</Suspense>
    </AppProviders>
  )
}

export default App
