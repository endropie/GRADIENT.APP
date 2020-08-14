<template>
  <div class="WAL position-relative bg-grey-4" :class="{'WAL__fit': fit}" :style="style">
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>

      <q-drawer id="drawerContact" bordered
        v-model="drawerContact"
        no-swipe-backdrop no-swipe-open no-swipe-close
        class="WAL__drawer-fit"
      >
        <direct-message-contact @contacted="setContact" @hide="drawerContact=false" />
      </q-drawer>

      <q-drawer id="drawerMessage" bordered side="right"
        v-model="drawerMessage"
        show-if-above :breakpoint="600"
        no-swipe-close no-swipe-open
        class="WAL__drawer-fit WAL__drawer-message"
        v-if="conversationBy"
      >
        <direct-message-content ref="messageContent" :user="user" :opponent="conversationBy" @discontacted="disContact"  />
      </q-drawer>

      <q-page-container class="bg-grey-2">
        <q-page >
          <div class="fit absolute overflow-hidden" >
            <direct-message-conversation @contacted="setContact" @contactShow="drawerContact=true"
              :data="conversationLists"
              :user="user"
              :style="{width: drawerMessage || $q.screen.gt.xs ? '300px' : '100%'}"
            />
            <q-card flat v-if="false && $q.screen.gt.xs && !drawerMessage && !conversationBy && !fit"
              class="absolute-right bg-transparent text-weight-thin text-center q-pa-md non-selectable no-border-radius"
              style="margin-left:300px">
              <div class="q-pa-md q-gutter-sm q-mt-xl q-mb-md">
                <q-avatar size="120px" color="teal" text-color="white" icon="widgets" />
              </div>
              <q-card-section>
                <div class="text-h4 text-weight-thin">[{{fit}}] Keep your device connected</div>
              </q-card-section>
              <q-card-section class="q-mt-md">
                Massenger connects to application to sync messages. To reduce deta usage, connect your device to Wi-Fi.
              </q-card-section>
              <q-separator spaced inset />
              <q-card-section>
                Massenger is available for this application, Get it here
              </q-card-section>
            </q-card>
          </div>
        </q-page>
      </q-page-container>

    </q-layout>
  </div>
</template>

<script>
import DirectMessageConversation from '@/components/realtime/DirectMessageConversation'
import DirectMessageContent from '@/components/realtime/DirectMessageContent'
import DirectMessageContact from '@/components/realtime/DirectMessageContact'

export default {
  name: 'WhatsappLayout',
  components: { DirectMessageConversation, DirectMessageContent, DirectMessageContact },
  props: {
    fit: Boolean,
    user: Object
  },
  data () {
    return {
      conversationLists: [],
      conversationBy: null,
      drawerContact: false,
      drawerMessage: false
    }
  },
  computed: {
    style () {
      return {
        height: this.$q.screen.height + 'px'
      }
    }
  },
  created () {
    this.loadConversation()
    const cn = 'messageable.created.channel.' + this.$store.state.auth.user.id
    this.$echo.private(cn).listen('MessageableCreated', (e) => {
      if (this.conversationBy && this.conversationBy.id === e.messageable.sender_id) {
        this.$refs.messageContent.addMessage(e.messageable)
      }
    })
  },
  methods: {
    loadConversation () {
      this.$axios
        .get('/api/realtime/conversations')
        .then((response) => {
          this.conversationLists = JSON.parse(JSON.stringify(response.data))
        })
        .catch((error) => {
          console.error(error.response || error)
        })
    },
    setContact (v, closeDrawerContact = false) {
      if (closeDrawerContact) this.drawerContact = false

      this.conversationBy = v
      setTimeout(() => {
        this.drawerMessage = true
      }, 0)
    },
    disContact () {
      this.conversationBy = null
      this.drawerMessage = false
    }
  }
}
</script>

<style lang="sass">
.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px
  &:before
    content: ''
    height: 127px
    position: fixed
    top: 0
    width: 100%
    // background-color: #009688
  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    width: 90%
    max-width: 950px
    border-radius: 5px
  &__field.q-field--outlined .q-field__control:before
    border: none
  .q-drawer--standard
    .WAL__drawer-close
      display: none

.WAL.WAL__fit
  padding: 0 !important

  .WAL__layout
    border-radius: 0 !important
    width: 100% !important
    max-width: unset

    .WAL__drawer-fit aside.q-drawer
      width: 100% !important

.WAL .WAL__drawer-message aside.q-drawer
  width: calc(100% - 300px) !important
.WAL .WAL__drawer-message aside.q-drawer.q-drawer--mobile
  width: 100% !important
@media (max-width: 850px)
  .WAL
    padding: 0
    &__layout
      width: 100%
      border-radius: 0
@media (min-width: 691px)
  .WAL:not(.WAL__fit)
    .WAL__drawer-open
        display: none
.conversation__summary
  margin-top: 4px
.conversation__more
  margin-top: 0!important
  font-size: 1.4rem

.q-message-text-content img
  max-width: 100px
</style>
