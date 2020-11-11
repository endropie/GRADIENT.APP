import storeModule from '@/store/module-realtime'

export default ({ app, store, router }) => {
  // Register auth store
  store.registerModule('realtime', storeModule)

  const { routes } = router.options
  const routeData = routes.find(r => r.path === '/admin')
  const currentRoutes = routeData.children.map(route => route.path)
  const newRoutes = [
    {
      path: 'receives',
      name: 'receives',
      meta: { auth: true },
      component: () => import('pages/receives')
    },
    {
      path: 'loadings',
      name: 'loadings.index',
      meta: { auth: true },
      component: () => import('pages/loadings')
    }
  ]

  routeData.children = []
  for (const route of newRoutes) {
    if (!currentRoutes.includes(route.path)) {
      routeData.children.push(route)
    }
  }
  router.addRoutes([routeData])
}
