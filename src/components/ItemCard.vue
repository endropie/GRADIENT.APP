<template>
  <div class="fit">
    <skeleton-card v-if="!Item" avatar box />
    <q-card v-else>
      <q-card-section >
        <div class="text-h6 text-no-wrap ellipsis">{{Item.name}}</div>
        <div class="text-subtitle2">#{{Item.code}}</div>
      </q-card-section>
      <q-card-section>
        <slot name="body" :item="Item">
        </slot>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import SkeletonCard from '@/components/SkeletonCard'
export default {
  name: 'ItemCard',
  components: { SkeletonCard },
  props: {
    id: Number,
    item: Object
  },
  data () {
    return {
      loading: true,
      api: '/api/items',
      row: null
    }
  },
  created () {
    this.init()
  },
  computed: {
    Item () {
      return this.item || this.row
    }
  },
  methods: {
    init () {
      if (!this.item) {
        // console.warn('GET', `${this.api}/${this.$props.id}`)
        this.$axios.get(`${this.api}/${this.$props.id}`)
          .then((response) => {
            setTimeout(() => {
              this.row = JSON.parse(JSON.stringify(response.data))
            }, 500)
          }).catch((error) => {
            console.error(error.response || error)
          })
      }
    }
  }
}
</script>
