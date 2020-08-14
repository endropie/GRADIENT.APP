<template>
  <div class="full-height">
    <q-toolbar class="bg-grey-3">
      <q-avatar class="cursor-pointer">
        <img src="https://cdn.quasar.dev/app-icons/icon-128x128.png" />
      </q-avatar>

      <span class="q-subtitle-1 q-pl-sm text-truncate ellipsis">
        {{ user.name }}
      </span>
      <q-space />
      <q-btn round flat icon="message" @click="$emit('contactShow')" />
      <q-btn round flat icon="more_vert">
        <q-menu auto-close :offset="[110, 8]">
          <q-list style="min-width: 150px">
            <q-item clickable>
              <q-item-section>New group</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Archived</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Favorites</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Settings</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <q-toolbar class="bg-white">
      <q-input rounded outlined dense class="WAL__field full-width" bg-color="white" v-model="search" placeholder="Search or start a new conversation">
        <template slot="prepend">
          <q-icon name="search" />
        </template>
      </q-input>
    </q-toolbar>
    <q-separator />
    <q-scroll-area class="bg-white" style="height: calc(100% - 100px)">
      <q-list>
        <q-item
          v-for="(conversation) in data"
          :key="conversation.id"
          clickable
          v-ripple v-close-popup
          @click="setUser(conversation)"
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src="conversation.avatar">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">
              {{ conversation.name }}
            </q-item-label>
            <q-item-label class="conversation__summary" caption lines="1" v-if="conversation.last_message">
              <span style="font-size:1rem">
                <q-icon name="done_all" color="primary" v-if="conversation.last_message.readed_at" />
                <q-icon name="done_all" v-else-if="conversation.last_message.received_at" />
                <q-icon name="check" v-else-if="conversation.last_message.created_at" />
                <q-icon name="not_interested" v-if="conversation.deleted_at" />
              </span>
              <span class="q-ml-xs" v-text="conversation.last_message.text" />
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label caption>
              {{ conversation.time }}
            </q-item-label>
            <q-icon name="keyboard_arrow_down" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </div>
</template>

<script>
export default {
  props: {
    data: Array,
    user: Object
  },
  data () {
    return {
      search: ''
    }
  },
  methods: {
    setUser (v) {
      this.$emit('contacted', v)
    }
  }
}
</script>
