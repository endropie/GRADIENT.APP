<template>
  <q-dialog :ref="DIALOG.name" persistent maximized>
    <q-card>
      <q-bar class="bg-blue-grey text-white">
        <q-icon name="qr_code" v-if="!$app.env.DEV" />
        <q-icon v-else dense flat icon="qr_code" @click="onDecode('1234567890')" >
          <q-tooltip> TESTING </q-tooltip>
        </q-icon>
        <q-toolbar-title>CODE SCANING</q-toolbar-title>
        <q-space />
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
import MixDialog from '@/mixins/MixDialog'
import { StreamBarcodeReader } from 'vue-barcode-reader'
export default {
  name: 'CodeScanner',
  mixins: [MixDialog],
  components: { StreamBarcodeReader },
  methods: {
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
