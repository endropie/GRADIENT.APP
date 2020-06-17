<template>
  <q-layout view="lHh Lpr lFf">
    <vue-particles color="#dedede" class="bg-blue-grey-10 fixed fit"></vue-particles>
    <q-header elevated
      class="bg-transparent bg-blue-grey-10 text-white"
      style="opacity:0.6"
      v-if="$route.path !== '/authentication'">
      <q-toolbar>
        <q-toolbar-title>
          REALTIME
        </q-toolbar-title>

        <q-btn class="q-ma-md fixed-bottom-right" color="blue-grey" icon-right="mdi-transfer-right" label="Administrator" to="/admin" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data () {
    return {}
  }
}
</script>
