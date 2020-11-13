<template>
  <q-dialog ref="dialog" persistent maximized>
    <q-card>
      <q-bar class="bg-blue-grey text-white">
        CODE SCANING..
        <q-space />
        <q-btn dense flat icon="qr_code" @click="onDecode('1234567890')" v-if="$app.env.DEV" >
          <q-tooltip> TESTING </q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
      <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { StreamBarcodeReader } from 'vue-barcode-reader'

export default {
  name: 'CodeScanner',
  components: { StreamBarcodeReader },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDecode (v) {
      this.$emit('ok', v)
      this.hide()
    },
    onLoaded (v) {
      // console.warn('LOADED', v)
    }
  }
}
</script>
