
export default ({ app, Vue }) => {
  const instanceApp = {
    env: process.env,
    groupBy: (items, key) => {
      const att = (v) => typeof key === 'function' ? key(v) : key
      return items.reduce((result, item) => ({
        ...result,
        [att(item)]: [...(result[att(item)] || []), item]
      }), {})
    }
  }

  Vue.prototype.$app = instanceApp

  // console.warn('APP', app)
  app.tester = function () {
    console.warn('ini APP tester', this)
  }
}
