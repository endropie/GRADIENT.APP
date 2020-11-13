
<script>
export default {
  name: 'MixRecord',
  props: {
    mode: { type: String, default: 'create' },
    id: Number
  },
  data () {
    return {
      RECORD: {
        api: null,
        params: {
          fields: '*'
        },
        setForm: (v = {}) => ({}),
        load: (resolve, reject = null) => {
          if (this.mode === 'create') return resolve(this.RECORD.setForm())
          if (this.mode === 'update' || this.mode === 'read') {
            this.$q.loading.show()
            this.$axios.get(`${this.RECORD.api}/${this.$props.id}`, { params: this.RECORD.params })
              .then(response => {
                // console.warn('LOAD RESPONSE', response)
                this.RECORD.data = response.data
                resolve(response.data)
              })
              .catch((error) => {
                if (!reject) this.$q.notify({ type: 'negative', message: `RECORD #${this.$props.id} LOAD FAILED!` })
                reject(error.response || error)
              })
              .finally(() => {
                this.$q.loading.hide()
              })
          }
        }
      }
    }
  }
}
</script>
