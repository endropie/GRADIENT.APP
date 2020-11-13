<template>
  <q-layout view="lHh Lpr lFf">
    <vue-particles color="#dedede" class="bg-blue-grey-10 fixed fit" />
    <q-header elevated
      class="bg-transparent bg-blue-grey-10 text-white"
      style="opacity:0.6"
      v-if="$route.path !== '/authentication'">
      <q-toolbar>
        <q-icon :name="$app.config.brand_icon" size="sm" />
        <q-toolbar-title class="text-weight-bold text-white">
          {{$app.config.brand_name}}
        </q-toolbar-title>
        <q-btn label="Administrator" to="/admin"
          color="blue-grey"
          icon-right="mdi-transfer-right"
          class="fixed-bottom-right" :class="($q.screen.lt.sm ? 'q-ma-sm' : 'q-ma-md')"
        />
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
