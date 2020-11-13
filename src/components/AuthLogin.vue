<template>
  <q-card v-bind="$attrs" >
    <q-form @submit="onSubmit" class="column" >
      <q-card-section class="q-col-gutter-lg no-padding" >
          <q-input dense type="email"
            id="email" name="body.email"
            color="indigo"
            v-model.trim="data.body.email"
            :label="this.$t('auth.login.email')"
            autofocus
            v-validate="'required'"
            :error="errors.has('body.email')"
            :error-message="errors.first('body.email')"
          />
            <!-- lazy-rules -->
            <!-- :rules="validations['email']" -->
          <q-input dense type="password"
            id="password" name="body.password"
            :label="this.$t('auth.login.password')"
            color="indigo"
            v-model="data.body.password"
            v-validate="'required'"
            :error="errors.has('body.password')"
            :error-message="errors.first('body.password')"
          />
            <!-- :rules="validations['password']" -->
            <!-- lazy-rules -->
          <div class="row justify-between no-wrap q-my-sm">
            <q-checkbox id="rememberMe" color="indigo" v-model="data.rememberMe" :label="this.$t('auth.login.remember_me')" />
            <q-space />
            <span>
              <q-btn dense flat no-caps size="sm" tabindex="100"
                :label="$t('auth.login.password_forgot')"
                @click="$emit('tab','forgot')" />
            </span>
          </div>
      </q-card-section>

      <q-card-actions class="no-padding">
        <q-btn type="submit" class="full-width" color="indigo" :label="$t('auth.login.login')" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import MixForm from '@/mixins/MixForm'
import isEmail from 'validator/lib/isEmail'
export default {
  name: 'AuthLogin',
  mixins: [MixForm],
  data () {
    return {
      profile: null,
      data: {
        body: {
          email: '',
          password: ''
        },
        rememberMe: false
      },
      validations: {
        email: [
          val => !!val || this.$t('auth.validations.required'),
          val => isEmail(val) || this.$t('auth.validations.email')
        ],
        password: [val => !!val || this.$t('auth.validations.required')]
      }
    }
  },
  computed: {
    location () {
      return window.location.host
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      // if (this.$store.getters['auth/loggedIn']) {
      //   this.$emit('hide')
      //   this.$router.replace('/admin')
      // }
    },
    onSubmit () {
      const submit = () => {
        this.$q.loading.show()
        this.$auth
          .login(this.data)
          .then(() => {
            this.$emit('done')
          })
          .catch(error => {
            this.RECORD.setErrorResponse(error.response || error)
          })
          .finally(() => {
            this.$q.loading.hide()
          })
      }

      this.$validator.validate().then(valid => {
        if (!valid) return false
        submit()
      })
    }
  }
}
</script>
