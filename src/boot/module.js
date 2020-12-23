import storeModule from '@/store/module-realtime'

export default ({ Vue, app, store, router }) => {
  // Register auth store
  store.registerModule('realtime', storeModule)

  Vue.mixin({
    beforeRouteLeave (to, from, next) {
      const globalDialogs = this.$root.$children.filter(x => {
        if (x.$options.name === 'QGlobalDialog') {
          return x.$children.find(c => {
            if (c.DIALOG && c.DIALOG.name) {
              if (c.DIALOG.beforeHide === true) c.DIALOG.hide()
              else if (typeof c.DIALOG.beforeHide === 'function') c.DIALOG.beforeHide()
              else {
                // ## no-action
              }
              // console.warn('FIX HIDE', c)
              return true
            }
          })
        }
      })

      next(!globalDialogs.length)
    }
  })

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
