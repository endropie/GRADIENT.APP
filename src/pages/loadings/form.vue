<template>
  <q-dialog :ref="RECORD.dialog" persistent maximized>
    <q-card v-if="rsForm" style="min-width:250px">
      <q-bar class="bg-blue-grey text-white" style="height:47px">
        <q-btn flat icon="arrow_back_ios" style="width:25px" v-close-popup />
        <q-toolbar-title>RECORD BARANG KELUAR</q-toolbar-title>
        <!-- <q-space /> -->
      </q-bar>
      <q-scroll-area :style="`height: calc(${  FullHeight } - 100px); width:100%`"  :class="{'q-px-sm': $q.screen.gt.sm}">
        <q-card-section class="q-gutter-sm">
          <div class="row" :class="{'column reverse': $q.screen.lt.sm}">
            <q-card flat bordered>
              <q-card-section class="q-pa-sm">
                <q-input class="fit"
                  label="REFERENSI" stack-label
                  data-vv-as="referensi"
                  v-model="rsForm.reference_number"
                  v-validate="''"
                  name="reference_number"
                  :error="errors.has('reference_number')"
                  :error-message="errors.first('reference_number')"
                />

                <div class="row q-col-gutter-sm">
                  <q-select style="width:120px"
                    label="V.I.A" stack-label
                    v-model="rsForm.reference_via"
                    v-validate="'required'" no-error-icon
                    :options="ViaOptions"
                    name="reference_via"
                    :error="errors.has('reference_via')"
                    :error-message="errors.first('reference_via')"
                  />
                  <q-input type="date" input-style="min-width:70px"
                    label="TGL. REFERENSI" stack-label
                    v-model="rsForm.reference_date"
                    data-vv-as="Tgl. referensi"
                    v-validate="'required'" no-error-icon
                    name="reference_date"
                    :error="errors.has('reference_date')"
                    :error-message="errors.first('reference_date')"
                  >
                    <q-input slot="after" type="number" style="width:80px" class="no-padding"
                      label="BATCH" stack-label
                      v-model="rsForm.reference_batch"
                      v-validate="'required'" no-error-icon
                      name="reference_batch"
                      :error="errors.has('reference_batch')"
                    />
                  </q-input>
                </div>
              </q-card-section>
            </q-card>
            <q-space />
            <div>
              <q-input type="date" class="col-12 col-md-3"
                label="TGL. TRANSAKSI"
                v-model="rsForm.date"
                data-vv-name="date"
                v-validate="'required'"
                name="date"
                :error="errors.has('date')"
                :error-message="errors.first('date')"
              />
            </div>
          </div>
          <div v-if="$q.screen.lt.md" class="column q-pa-xs">
            <div class="text-h6">LIST BARANG</div>
            <q-separator spaced inset vertical dark />
            <div class="column">
              <q-card class="q-mb-sm" v-for="(row, index) in rsForm.loading_items" :key="index">
                <q-card-section>
                  <q-badge floating color="blue-grey"
                    class="cursor-pointer"
                    style="top:0;right:0;border-radius:0"
                    @click="removeItem(index)"
                  >
                    <q-icon name="clear" size="16px" />
                  </q-badge>

                  <q-input dense borderless readonly hide-bottom-space
                    prefix="SERIAL"
                    input-class="bg-blue-grey-2 text-weight-medium q-pl-sm q-my-sm on-right"
                    v-model="row.serial"
                    v-validate="'required'"
                    data-vv-as="Serial"
                    :name="`loading_items.${index}.serial`"
                    :error="errors.has(`loading_items.${index}.serial`)"
                    :error-message="errors.first(`loading_items.${index}.serial`)"
                  />
                  <q-field dense outlined readonly
                    :loading="row.__serial_loading"
                    :error="errors.has(`loading_items.${index}.item.id`)"
                    :error-message="errors.first(`loading_items.${index}.item.id`)"
                  >
                    <q-input slot="control" type="hidden" dense borderless readonly hide-bottom-space
                      class="hidden"
                      v-model="row.item"
                      v-validate="'required'"
                      :name="`loading_items.${index}.item.id`"
                      data-vv-as="Item Barang"
                    />
                    <div slot="control" v-if="row.item">{{row.item.name}}</div>
                  </q-field>

                  <q-input dense label="Catatan" v-model="row.notes" autogrow />
                </q-card-section>
              </q-card>
            </div>
            <q-input ref="code" type="text" class="full-width"
              outlined dense
              value="" @keyup.enter="enterCode"
            >
              <q-btn slot="after" glossy color="blue-grey" icon="qr_code" @click="scaningCode" />
            </q-input>
          </div>
          <q-markup-table flat bordered v-else>
            <thead>
              <tr>
                <th key="prefix"></th>
                <th class="text-center" width="20%">Serial</th>
                <th class="text-left" width="50%">Name</th>
                <th class="text-left" width="30%">Note</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in rsForm.loading_items" :key="index">
                <td key="prefix" class="text-blue-grey">
                  ({{index+1}})
                </td>
                <td class="text-left text-weight-medium">
                  <q-input dense outlined disable hide-bottom-space no-error-icon
                    style="min-width:150px"
                    v-model="row.serial"
                    v-validate="'required'"
                    data-vv-as="Serial"
                    :name="`loading_items.${index}.serial`"
                    :error="errors.has(`loading_items.${index}.serial`)"
                    :error-message="errors.first(`loading_items.${index}.serial`)"
                  >
                    <q-btn slot="after" flat dense icon="delete" color="blue-grey" @click="removeItem(index)" >
                      <q-tooltip>Hapus</q-tooltip>
                    </q-btn>
                  </q-input>
                </td>
                <td class="text-left">
                  <q-field dense outlined readonly hide-bottom-space
                    :loading="row.__serial_loading"
                    :error="errors.has(`loading_items.${index}.item.id`)"
                    :error-message="errors.first(`loading_items.${index}.item.id`)"
                  >
                    <q-input slot="control" type="hidden" dense borderless readonly hide-bottom-space
                      class="hidden"
                      v-model="row.item"
                      v-validate="'required'"
                      data-vv-as="Item Barang"
                      :name="`loading_items.${index}.item.id`"
                    />
                    <div slot="control" v-if="row.item">{{row.item.name}}</div>
                  </q-field>
                </td>
                <td class="text-left">
                  <q-input dense outlined style="min-width:150px" v-model="row.notes" />
                </td>
              </tr>
              <tr>
                <td colspan="100%">
                  <q-input ref="code" type="text"
                    outlined dense filled
                    value="" @keyup.enter="enterCode"
                  >
                    <q-btn slot="after" dense glossy color="blue-grey" icon="qr_code" @click="scaningCode" />
                  </q-input>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-scroll-area>
      <q-space />
      <q-separator />
      <q-card-actions align="right" style="height:47px">
        <q-btn glossy color="grey" label="Reset" @click="reset" />
        <q-btn glossy color="positive" label="Save" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import MixRecord from '@/mixins/MixRecord'
import CodeScanner from '@/components/CodeScanner'
export default {
  name: 'ReceiveForm',
  mixins: [MixRecord],
  data () {
    return {
      rsForm: null,
      RECORD: {
        dialog: 'dialog',
        api: '/api/loadings',
        setForm: (v = {}) => ({
          reference_number: null,
          reference_via: null,
          reference_date: null,
          reference_batch: null,
          date: new Date().toISOString().slice(0, 10),
          loading_items: [],
          ...v
        }),
        setFormItem: (v = {}) => ({
          serial: null,
          item: null,
          notes: null,
          __serial_loading: false,
          ...v
        })
      }
    }
  },
  created () {
    this.init()
  },
  computed: {
    FullHeight () {
      return window.innerHeight + 'px'
    },
    ViaOptions () {
      return [
        'STP-TP', 'STP-BL', 'STP-SH', 'STP-BLI',
        'GDS-TP', 'GDS-BL', 'GDS-SH', 'GDS-BLI',
        'COD', 'RSL'
      ]
    }
  },
  methods: {
    init () {
      this.rsForm = this.RECORD.setForm()
    },
    loadSerial (v, index = null) {
      if (index !== null) this.rsForm.loading_items[index].__serial_loading = true
      this.$axios.get(`/api/items/serial/${v}`)
        .then((response) => {
          if (response.data.item) {
            this.rsForm.loading_items[index].item = response.data.item
          }
        })
        .catch((error) => {
          console.error(error.response || error)
        })
        .finally(() => {
          if (index !== null) this.rsForm.loading_items[index].__serial_loading = false
        })
    },
    enterCode (e) {
      this.addNewItem(e.target.value)
      e.target.value = ''
    },
    scaningCode () {
      this.$q.dialog({
        parent: this,
        component: CodeScanner
      }).onOk(val => {
        this.addNewItem(val)
      })
    },
    addNewItem (v) {
      if (!String(v).length) return this.$q.notify({ message: 'Please enter code..', textColor: 'white', type: 'warning' })

      if (this.rsForm.loading_items.find(x => x.serial === v)) {
        this.$q.notify({ type: 'negative', message: 'Serial has been added.' })
      } else {
        this.rsForm.loading_items.push(this.RECORD.setFormItem({ serial: v, item: null }))
        this.loadSerial(v, this.rsForm.loading_items.length - 1)
      }
    },
    removeItem (index) {
      this.rsForm.loading_items.splice(index, 1)
    },
    reset () {
      const reset = () => {
        this.init()
      }
      this.$q.dialog({
        title: 'RESET',
        message: 'Konfirmasi reset data',
        ok: 'Ya, Reset',
        cancel: 'Batal'
      }).onOk(() => {
        reset()
      })
    },
    save () {
      const submit = () => {
        this.$q.loading.show()
        this.$axios.post(this.RECORD.api, this.rsForm)
          .then((response) => {
            const message = `LOADING ${response.data.reference} CREATED!`
            this.$q.notify({ type: 'positive', message })
            this.$emit('ok')
            this.hide()
          })
          .catch((error) => {
            this.RECORD.setErrorResponse(error.response || error)
            let message = { code: 0, text: 'SAVE INVALID' }

            if (error.response) {
              if (error.statusText) message.text = error.response.statusText
              if (error.response.data && error.response.data.message) message = error.response.data.message
            }
            this.$q.notify({ type: 'negative', message: message })
          })
          .finally(() => {
            this.$q.loading.hide()
          })
      }

      this.$validator.validate().then(valid => {
        if (!valid) return this.$q.notify({ type: 'negative', message: 'SUBMIT FAILED' })
        const len = this.rsForm.loading_items.length
        const desc = Object
          .values(this.$function.groupBy(this.rsForm.loading_items, row => row.item.id))
          .map(rows => {
            return rows.length ? `(${rows.length}) ${rows[0].item.name}` : null
          })
          .join('<BR>')

        this.$q.dialog({
          title: 'SIMPAN',
          html: true,
          message: `${desc}<BR><B>Konfirmasi keluar (${len}) total unit<b>`,
          ok: 'Ya, Simpan',
          cancel: 'Batal'
        }).onOk(() => {
          submit()
        })
      })
    }
  }
}
</script>
