<template>
  <direct-message :fit="false" :user="$store.getters['auth/user']" />
</template>

<script>
import DirectMessage from '@/components/realtime/DirectMessage'

export default {
  name: 'DirectMessagePage',
  components: { DirectMessage },
  created () {
    console.info('DirectMessagePage created!')
  }
}
</script>
