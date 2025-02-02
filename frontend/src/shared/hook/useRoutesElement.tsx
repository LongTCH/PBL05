import { RouteObject, useRoutes } from 'react-router-dom'
import { ADMIN_ROUTER, AUTH_ROUTER, GAME_V2_ROUTES, PRIVATE_ROUTER } from '../path'

// component
import { Children, Suspense, lazy } from 'react'
import { RouteLazy } from '../../interface/app'
import NotFoundPage from '../../pages/not-found'
import PrivateRoutes from '../../routes/PrivateRoutes'
import AuthRoutes from 'src/routes/AuthRoutes'
import { path } from 'src/constants/path'
import GameV2Routes from 'src/routes/GameV2Routes'
import AdminRoutes from 'src/routes/AdminRoutes'

interface RouteElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routeElement: () => Promise<any>
  isPrivate?: boolean
}
interface LazyRouteProps {
  routes: RouteLazy[]
}
function LazyElement({ routeElement }: RouteElement) {
  const LazyComponent = lazy(routeElement)
  return (
    <Suspense
      fallback={
        <div className='flex h-screen w-full items-center justify-center'>
          <span className='loading loading-spinner loading-lg'></span>
        </div>
      }
    >
      <LazyComponent />
    </Suspense>
  )
}
function wrapRoutesWithLazy({ routes }: LazyRouteProps): RouteObject[] {
  return routes?.map((route: RouteLazy) => ({
    path: route.path,
    element: <LazyElement routeElement={route.element} />,
    ...(route.children && { children: wrapRoutesWithLazy({ routes: route.children }) })
  }))
}
export default function useRouteElements() {
  const routeElements = [
    {
      path: '*',
      element: <NotFoundPage />
    },
    {
      path: path.home,
      element: <PrivateRoutes />,
      children: PRIVATE_ROUTER
    },
    {
      path: path.auth,
      element: <AuthRoutes />,
      children: AUTH_ROUTER
    },
    {
      path: path.gamev2,
      element: <GameV2Routes />,
      children: GAME_V2_ROUTES
    },
    {
      path: path.admin,
      element: <AdminRoutes />,
      children: ADMIN_ROUTER
    }
  ]
  return useRoutes(routeElements)
}
