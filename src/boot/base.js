
export default ({ app, Vue }) => {
  const instanceApp = {
    env: process.env
  }

  Vue.prototype.$app = instanceApp

  // console.warn('APP', app)
  app.tester = function () {
    console.warn('ini APP tester', this)
  }
}
