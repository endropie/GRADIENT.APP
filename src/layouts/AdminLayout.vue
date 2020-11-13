<template>
  <q-layout view="lHh Lpr lFf" class="bg-blue-grey-1">
    <q-header elevated class="bg-blue-grey-2 text-blue-grey">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          ADMINISTRATION
        </q-toolbar-title>

        <q-btn dense flat icon-right="exit_to_app" @click="logout" >
          <q-tooltip>
            LOGOUT
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-3 text-blue-grey"
    >
      <q-list >
        <q-item-label
          header
          class="text-grey-8 text-right"
        >
        <span class="text-subtitle2 q-pa-md">{{$app.config.brand_name}}</span>
        <q-icon :name="$app.config.brand_icon" size="18px" />
        </q-item-label>
        <q-item clickable to="/admin/dashboard">
          <q-item-section top avatar>
            <q-avatar square icon="widgets" />
          </q-item-section>
          <q-item-section>
            <q-item-label>DASBORD</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/admin/receives">
          <q-item-section top avatar>
            <q-avatar icon="mdi-widgets-outline" />
          </q-item-section>
          <q-item-section>
            <q-item-label>PENERIMAAN BARANG</q-item-label>
            <q-item-label caption lines="2">Register of receives.</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/admin/loadings">
          <q-item-section top avatar>
            <q-avatar icon="mdi-archive-arrow-up-outline" />
          </q-item-section>
          <q-item-section>
            <q-item-label>PENGELUARAN BARANG</q-item-label>
            <q-item-label caption lines="2">Checkout of Delivery.</q-item-label>
          </q-item-section>
        </q-item>
        <EssentialLink v-show="false"
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink'

export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Docs',
          caption: 'quasar.dev',
          icon: 'school',
          link: 'https://quasar.dev'
        },
        {
          title: 'Github',
          caption: 'github.com/quasarframework',
          icon: 'code',
          link: 'https://github.com/quasarframework'
        },
        {
          title: 'Discord Chat Channel',
          caption: 'chat.quasar.dev',
          icon: 'chat',
          link: 'https://chat.quasar.dev'
        },
        {
          title: 'Forum',
          caption: 'forum.quasar.dev',
          icon: 'record_voice_over',
          link: 'https://forum.quasar.dev'
        },
        {
          title: 'Twitter',
          caption: '@quasarframework',
          icon: 'rss_feed',
          link: 'https://twitter.quasar.dev'
        },
        {
          title: 'Facebook',
          caption: '@QuasarFramework',
          icon: 'public',
          link: 'https://facebook.quasar.dev'
        },
        {
          title: 'Quasar Awesome',
          caption: 'Community Quasar projects',
          icon: 'favorite',
          link: 'https://awesome.quasar.dev'
        }
      ]
    }
  },

  methods: {
    logout () {
      this.$q.dialog({
        title: this.$t('auth.logout.confirm'),
        message: this.$t('auth.logout.confirmation'),
        ok: this.$t('auth.logout.logout'),
        cancel: this.$t('auth.logout.cancel')
      }).onOk(() => {
        this.$auth.logout().then(() => {
          this.$router.replace('/')
        })
      }).onCancel(() => {
        // this.$router.go(-1)
      })
    }
  }
}
</script>
