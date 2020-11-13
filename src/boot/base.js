import UXSelect from '@/components/UXSelect'

export default ({ app, Vue }) => {
  const instanceFunction = {
    groupBy: (items, key) => {
      const att = (v) => typeof key === 'function' ? key(v) : key
      return items.reduce((result, item) => ({
        ...result,
        [att(item)]: [...(result[att(item)] || []), item]
      }), {})
    }
  }

  const instanceApp = {
    env: process.env,
    test: function () {
      console.warn('ini APP tester', this)
    }
  }

  Vue.prototype.$app = instanceApp
  Vue.prototype.$function = instanceFunction

  Vue.component('ux-select', UXSelect)
}
