<template>
  <q-page padding class="flex justify-center">
    <div class="q-mt-md" :style="`min-height: calc(100vh - 100px);width:${$q.screen.lt.sm ? '18' : '22'}rem`">
      <q-card class="q-my-xl">
        <q-card-section class="bg-blue-grey-2 text-center"
          :class="{
            'text-indigo': tab === 'login',
            'text-secondary': tab === 'register'
          }"
        >
          <q-icon :name="$app.config.brand_icon" class="text-h1" />
          <div>
            <span class="text-h6"> {{$app.config.brand_name}} </span>
            <span class="text-caption text-" >V.1</span>
          </div>
        </q-card-section>
        <q-tabs
          v-model="tab"
          align="justify"
          active-color="white"
          :active-bg-color="tab === 'register' ? 'secondary' : 'indigo'"
        >

          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Register" v-if="$auth.config.form_register" />
          <!-- <q-tab class="text-teal" name="forgot" label="Forgot" /> -->
        </q-tabs>
        <q-separator />
        <q-card-section class="q-py-none">
          <q-tab-panels v-model="tab" animated transition-prev="scale" transition-next="scale">
            <q-tab-panel name="login">
              <auth-login flat class="fit" @done="logged" @tab="v => tab = v" />
            </q-tab-panel>

            <q-tab-panel name="register" v-if="$auth.config.form_register">
              <auth-register flat class="fit" @done="registered" />
            </q-tab-panel>

            <q-tab-panel name="forgot" class=" text-center">
              <div class="text-h6 text-uppercase">Forgot Password</div>
              <div class="clolumn text-grey">
                <q-icon name="warning" size="120px" />
                <div class="q-mb-lg">
                  Sory, Forgot password is undercontraction!
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </div>
    <q-btn to="/" label="Landing"
      color="blue-grey" icon="mdi-transfer-left"
      class="absolute-bottom-left "
      :class="($q.screen.lt.sm ? 'q-ma-sm' : 'q-ma-md')"
    />
  </q-page>
</template>

<script>
import AuthLogin from '@/components/AuthLogin'
import AuthRegister from '@/components/AuthRegister'

export default {
  name: 'Authentication',
  components: { AuthLogin, AuthRegister },
  data () {
    return {
      tab: 'login'
    }
  },
  methods: {
    logged () {
      this.$router.push('/admin/dashboard')
    },
    registered () {
      this.$router.push('/')
    }
  }
}
</script>
