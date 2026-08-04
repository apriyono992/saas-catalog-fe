import { BrowserRouter } from 'react-router-dom'
import { StoreRoutes } from '@/app/router/store.routes'

export default function StoreApp() {
  return (
    <BrowserRouter>
      <StoreRoutes />
    </BrowserRouter>
  )
}
