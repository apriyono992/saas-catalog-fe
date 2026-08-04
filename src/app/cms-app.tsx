import { BrowserRouter } from 'react-router-dom'
import { CmsRoutes } from '@/app/router/cms.routes'
import { useSessionBootstrap } from '@/hooks/use-session-bootstrap'
import { FullscreenSpinner } from '@/components/common/fullscreen-spinner'

export default function CmsApp() {
  const status = useSessionBootstrap()

  if (status === 'idle') {
    return <FullscreenSpinner />
  }

  return (
    <BrowserRouter>
      <CmsRoutes />
    </BrowserRouter>
  )
}
