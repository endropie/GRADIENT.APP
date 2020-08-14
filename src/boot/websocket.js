import { axiosInstance } from 'boot/axios'
import Echo from 'laravel-echo'

window.Pusher = require('pusher-js')

export default ({ app, store, Vue }) => {
  // Echo initial
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'exKEY',
    authEndpoint: `http://${window.location.hostname}:8000/api/broadcasting/auth`,
    authorizer: (channel, options) => {
      return {
        authorize: (socketId, call) => {
          const data = { socket_id: socketId, channel_name: channel.name }
          axiosInstance
            .post(`http://${window.location.hostname}:8000/api/broadcasting/auth`, data)
            .then((response) => {
              call(false, response.data)
            })
            .catch((error) => {
              console.warn(error.response || error)
              call(true, error)
            })
        }
      }
    },
    forceTLS: false,
    encrypted: true,
    wsHost: window.location.hostname,
    wsPort: 6001,
    disableStats: true,
    enabledTransports: ['ws', 'wss']
  })

  Vue.prototype.$echo = window.Echo
}
