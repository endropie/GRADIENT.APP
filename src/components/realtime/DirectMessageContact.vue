<template>

<div style="height: 100%">
  <q-toolbar class="bg-grey-3">
    <q-btn dense flat round icon="chevron_left" class="on-left" @click="$emit('hide')" />
    <div class="text-subtitle1">Contacts</div>
  </q-toolbar>

  <q-toolbar class="bg-grey-2">
    <q-input rounded outlined dense bg-color="white"
      v-model="search" debounce="1200"
      placeholder="Search your contact"
      class="WAL__field full-width"
    >
      <template slot="prepend">
        <q-icon name="search" />
      </template>
    </q-input>
  </q-toolbar>
  <q-scroll-area style="height: calc(100% - 100px)">
    <q-list>
      <q-item
        v-for="(contact) in contacts"
        :key="contact.id"
        clickable
        v-ripple
        @click="setContact(contact)"
      >
        <q-item-section avatar>
          <q-avatar>
            <img :src="contact.avatar">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">
            {{ contact.name }}
          </q-item-label>
          <q-item-label class="conversation__summary text-no-wrap ellipsis" caption>
            <q-icon name="email" />
            {{ contact.email }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>

        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</div>

</template>

<script>
// import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      search: '',
      contacts: []
    }
  },
  watch: {
    search: function (v) {
      this.fetchUser(v)
    }
  },
  methods: {
    fetchUser (v) {
      console.warn('FETCH USER ', v)
      this.$axios
        .get(`/api/realtime/contacts?search=${v}`)
        .then((response) => {
          console.warn(response, this.$store)
          this.contacts = JSON.parse(JSON.stringify(response.data))
        }).catch((error) => {
          console.error(error.response || error)
        })
    },
    setContact (v) {
      this.$store.dispatch('realtime/addConversation', v)
      this.$emit('contacted', v, true)
    }
  }
}
</script>
