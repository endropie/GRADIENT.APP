<template>
  <div style="height:100%;">
    <q-toolbar class="bg-grey-3 text-black">
      <q-btn dense round flat unelevated icon="keyboard_arrow_left"
        class="q-mr-sm"
        @click="$emit('discontacted')"
      />
      <q-btn round flat>
        <q-avatar>
          <img :src="opponent.avatar">
        </q-avatar>
      </q-btn>
      <span class="q-subtitle-1 q-pl-sm text-truncate ellipsis">
        {{ opponent.name }} {{[isNextLoad]}}
      </span>
      <q-space/>

      <q-btn round flat icon="search" />
      <q-btn round flat icon="more_vert">
        <q-menu auto-close :offset="[110, 0]">
          <q-list style="min-width: 150px">
            <q-item clickable>
              <q-item-section>Contact info</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Block</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Select messages</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Silence</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Clear messages</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Erase messages</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <q-scroll-area ref="scroller" id="scroller"
      class="bg-grey-2"
      style="height: calc(100% - 100px);"
    >
      <q-infinite-scroll reverse :offset="50"
        :disable="!isNextLoad"
        scroll-target="#scroller > scroll"
        @load="onNextLoad">
        <template slot="loading">
          <div class="row justify-center q-my-md absolute-top">
            <q-spinner color="primary" name="dots" size="20px" />
          </div>
        </template>
        <div class=" q-px-md q-pt-sm">
          <template v-for="item in converseMessages">
              <!-- :stamp="`${qdate.formatDate(item.created_at, 'DD MMM HH:mm')} <q-icon name='check' ></q-icon>`"
              :text="[item.text]" -->
            <q-chat-message :key="item.id"
              text-color="dark"
              :bg-color="Boolean(user.id === item.sender_id) ? 'light-blue-2' : 'white'"
              :sent="Boolean(user.id === item.sender_id)"
            >
              <div>
                {{item.text}}
              </div>
              <div class="q-message-stamp text-right">
                {{qdate.formatDate(item.created_at, 'DD MMM HH:mm')}}
                <span style="font-size:1rem" >
                  <q-icon name="not_interested" v-if="item.deleted_at" />
                  <q-icon name="done_all" v-else-if="item.readed_at" color="primary" />
                  <q-icon name="done_all" v-else-if="item.received_at" />
                  <q-icon name="check" v-else-if="item.created_at" />
                </span>
              </div>
            </q-chat-message>
          </template>
        </div>
      </q-infinite-scroll>
    </q-scroll-area>
    <q-toolbar class="bg-grey-3 text-black row" style="">
      <q-btn round flat icon="insert_emoticon" class="q-mr-sm" />
      <q-input rounded outlined dense class="WAL__field col-grow q-mr-sm" bg-color="white"
        v-model="message"
        placeholder="Type a message"
        @keydown.enter="sendMessage" />
      <q-btn round flat>
        <q-icon name="attachment" class="rotate-135" />
      </q-btn>
      <q-btn round flat icon="mic" />
    </q-toolbar>
  </div>
</template>

<script>
import { date } from 'quasar'
export default {
  props: {
    opponent: { type: Object, required: true },
    user: { type: Object, required: true }
  },
  data () {
    return {
      qdate: date,
      message: '',
      converseMessages: [],
      isNextLoad: true
    }
  },
  watch: {
    'opponent.id': function () {
      this.converseMessages = []
      this.isNextLoad = true
      this.fetchMessage()
    }
  },
  created () {
    this.fetchMessage()
  },
  methods: {
    fetchMessage (callback = false) {
      if (!this.opponent) return
      const lastMessageAt = this.converseMessages.length ? this.converseMessages[0].created_at : ''
      const url = `/api/realtime/converse-messages/${this.opponent.id}?lastMessageAt=${lastMessageAt}`
      this.$axios
        .get(url)
        .then((response) => {
          // console.warn('GET', url, response.data)
          if (response.data.length === 0) this.isNextLoad = false
          const newMessages = response.data.filter((item, i) => !this.converseMessages.some(x => x.id === item.id))
          this.converseMessages.unshift(...newMessages.reverse())
          this.$nextTick(() => {
            if (callback === false) {
              this.scrollDown()
              if (response.data.length) {
                this.receiveMessage(response.data)
                this.readMessage(response.data)
              }
            } else {
              setTimeout(() => { return callback() }, 1000)
            }
          })
        })
        .catch((error) => {
          console.error(error.response || error)
          if (callback) {
            this.isNextLoad = false
            callback()
          }
        }).finally(() => {
          //
        })
    },
    sendMessage () {
      if (String(this.message).length > 0) {
        // console.warn('sendMessage', `"${this.message}"`, this.user)
        this.$axios
          .post('/api/realtime/send-message', {
            text: this.message,
            sender_id: this.user.id,
            receiver_id: this.opponent.id
          })
          .then((response) => {
            const newMessage = JSON.parse(JSON.stringify(response.data))
            this.converseMessages.push(newMessage)
            this.$nextTick(() => { this.scrollDown() })
          }).catch((error) => {
            console.error(error.response || error)
          })

        this.message = ''
      }
    },
    addMessage (newMessage) {
      this.converseMessages.push(newMessage)
      this.receiveMessage(newMessage)
      this.readMessage(newMessage)
      this.$nextTick(() => { this.scrollDown() })
    },
    receiveMessage (message) {
      if (Array.isArray(message)) {
        message = message.find(x => x.sender_id === this.opponent.id)
        if (!message) return false
        if (message.received_at) return false
      }

      if (message.readed_at) return false

      this.$axios
        .post(`/api/realtime/receive-message/${message.id}`)
        .then((response) => {
          this.setMessageStatus('received_at', response.data)
        })
        .catch((error) => {
          console.error(error.response || error)
        })
    },
    readMessage (message) {
      if (Array.isArray(message)) {
        message = message.find(x => x.sender_id === this.opponent.id)
        if (!message) return false
        if (message.readed_at) return false
      }

      if (message.readed_at) return false

      this.$axios
        .post(`/api/realtime/read-message/${message.id}`)
        .then((response) => {
          this.setMessageStatus('readed_at', response.data)
        })
        .catch((error) => {
          console.error(error.response || error)
        })
    },
    setMessageStatus (status, message) {
      this.converseMessages.map((item, i) => {
        if (!item[status] && item.sender_id === message.sender_id) {
          this.converseMessages[i][status] = message[status]
          // console.warn('setMessageStatus => ADA', this.converseMessages[i])
        }
      })
    },
    scrollDown (duration = 0) {
      this.$nextTick(() => {
        const scrollArea = this.$refs.scroller
        const scrollTarget = scrollArea.getScrollTarget()
        scrollArea.setScrollPosition(scrollTarget.scrollHeight, duration)
      })
    },
    onNextLoad (v, done) {
      setTimeout(() => {
        // console.warn(v, done)
        this.fetchMessage(done)
      }, 2000)
    }
  }
}
</script>
<style lang="stylus">
.vscroller .q-virtual-scroll__content
  flex-direction: column-reverse
</style>
