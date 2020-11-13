<template>
  <q-dialog ref="dialog" persistent maximized>
    <q-card v-if="rsForm" style="min-width:250px">
      <q-bar class="bg-blue-grey text-white" style="height:47px">
        <q-btn flat icon="arrow_back_ios" style="width:25px" v-close-popup />
        <q-toolbar-title>FORM PENERIMAAN BARANG</q-toolbar-title>
        <!-- <q-space /> -->
      </q-bar>
      <q-scroll-area style="height: calc(100vh - 100px); width:100%"  :class="{'q-px-sm': $q.screen.gt.sm}">
        <q-card-section>
          <q-card flat bordered class="q-mb-sm">
            <q-card-section :horizontal="!$q.screen.lt.sm" :class="{'q-px-md q-gutter-sm': !$q.screen.lt.sm}">
              <q-input type="date"
                label="Date"
                v-model="rsForm.date"
                data-vv-name="date"
                v-validate="'required'"
                name="date"
                :error="errors.has('date')"
                :error-message="errors.first('date')"
              />
              <q-space />
              <q-input  type="text"
                label="No. Referensi" stack-label
                v-model="rsForm.reference_number"
                v-validate=""
                name="reference_number"
                :error="errors.has('reference_number')"
                :error-message="errors.first('reference_number')"
              />
              <q-input type="text"
                label="Batch" stack-label
                v-model="rsForm.reference_batch"
                v-validate=""
                name="reference_batch"
                :error="errors.has('reference_batch')"
                :error-message="errors.first('reference_batch')"
              />
            </q-card-section>
          </q-card>
          <q-card flat bordered v-if="$q.screen.lt.md">
            <q-card-section>
              <div class="text-subtitle2">LIST BARANG</div>
            </q-card-section>
            <q-separator />
            <q-list separator v-show="rsForm.receive_items.length">
              <q-item v-for="(row, index) in rsForm.receive_items" :key="index">
                <q-item-section>
                    <q-input dense borderless readonly hide-bottom-space
                      prefix="NO. SERIAL"
                      input-class="bg-blue-grey text-white text-weight-medium q-pl-sm q-my-sm on-right"
                      v-model="row.serial"
                      v-validate="'required'"
                      :name="`loading_items.${index}.serial`"
                      :error="errors.has(`loading_items.${index}.serial`)"
                      :error-message="errors.first(`loading_items.${index}.serial`)"
                    >
                      <q-btn slot="after" dense outline size="11px" icon="clear" color="blue-grey" @click="removeItem(index)" />
                    </q-input>
                    <ux-select dense outlined
                      placeholder="Pilih Barang"
                      v-model="row.item"
                      filter source="/api/items?mode=all&limit=20" :source-keys="['name']"
                      input-debounce="500"
                      option-value="id"
                      option-label="name"
                      v-validate="'required'"
                      :name="`receive_items.${index}.item.id`"
                      :error="errors.has(`receive_items.${index}.item.id`)"
                      :error-message="errors.first(`receive_items.${index}.item.id`)"
                    />
                    <q-input dense label="Catatan" v-model="row.notes" autogrow />

                </q-item-section>
              </q-item>
            </q-list>
            <q-separator />
            <q-card-actions vertical>
              <q-input ref="code" type="text" class="full-width"
                filled dense bottom-slots
                value="" @keydown.enter="enterCode"
              >
                <q-chip :slot="$q.screen.lt.sm ? 'hint' : 'prepend'" v-if="as_item"
                  :class="{'full-width': $q.screen.lt.sm}"
                  square size="10px" icon="widgets"
                  color="blue-grey" text-color="white"
                  class="glossy no-margin"
                  :label="as_item.name"
                  removable @remove="[as_item = null, $refs.code.focus()]"
                />
                <q-btn slot="after" glossy dense size="18px" color="blue-grey" icon="qr_code" @click="scaningCode" />
                <q-btn slot="prepend" flat color="blue-grey" icon="widgets" v-if="!as_item">
                  <q-popup-edit v-model="as_item" auto-save  :cover="false" :offset="[0, 10]">
                    <ux-select dense outlined autofocus hide-bottom-space no-error-icon bottom-slots
                      label="CARI BARANG"
                      style="width:250px"
                      v-model="as_item"
                      filter source="/api/items?mode=all&limit=20" :source-keys="['name']"
                      input-debounce="500"
                      option-value="id"
                      option-label="name"
                      @input="() =>$refs.code.focus()"
                    >
                      <q-icon slot="prepend" name="widgets" />
                      <div slot="counter"> <q-icon name="search" /> Input barang akan diregister</div>
                    </ux-select>
                  </q-popup-edit>
                </q-btn>
              </q-input>
            </q-card-actions>
          </q-card>
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
              <tr v-for="(row, index) in rsForm.receive_items" :key="index">
                <td key="prefix" class="text-blue-grey">
                  ({{index+1}})
                </td>
                <td class="text-left text-weight-medium">
                  <q-input dense outlined disable hide-bottom-space no-error-icon
                    style="min-width:150px"
                    v-model="row.serial"
                    v-validate="'required'"
                    :name="`receive_items.${index}.serial`"
                    :error="errors.has(`receive_items.${index}.serial`)"
                    :error-message="errors.first(`receive_items.${index}.serial`)"
                  >
                    <q-btn slot="after" flat dense icon="delete" color="blue-grey" @click="removeItem(index)" >
                      <q-tooltip>Hapus</q-tooltip>
                    </q-btn>
                  </q-input>
                </td>
                <td class="text-left">
                  <ux-select dense outlined hide-bottom-space no-error-icon
                    style="min-width:200px"
                    v-model="row.item"
                    filter source="/api/items?mode=all&limit=20" :source-keys="['name']"
                    input-debounce="500"
                    option-value="id"
                    option-label="name"
                    v-validate="'required'"
                    :name="`receive_items.${index}.item.id`"
                    :error="errors.has(`receive_items.${index}.item.id`)"
                    :error-message="errors.first(`receive_items.${index}.item.id`)"
                  />
                </td>
                <td class="text-left">
                  <q-input dense outlined style="min-width:150px" v-model="row.notes" />
                </td>
              </tr>
              <tr>
                <td colspan="100%">
                  <q-input ref="code" type="text" bottom-slots
                    outlined dense filled
                    value="" @keydown.enter="enterCode"
                  >
                    <q-chip  :slot="$q.screen.lt.sm ? 'hint' : 'prepend'" v-if="as_item"
                      :class="{'full-width': $q.screen.lt.sm}"
                      square size="10px" icon="widgets"
                      color="blue-grey" text-color="white"
                      class="glossy no-margin"
                      :label="as_item.name"
                      removable @remove="[as_item = null, $refs.code.focus()]"
                    />
                    <q-btn slot="after" glossy dense size="18px" color="blue-grey" icon="qr_code" @click="scaningCode" />
                    <q-btn slot="prepend" dense flat color="blue-grey" icon="widgets" v-if="!as_item">
                      <q-popup-edit v-model="as_item" auto-save :cover="false" :offset="[0, 10]">
                        <ux-select dense outlined autofocus hide-bottom-space no-error-icon
                          label="CARI BARANG"
                          style="width:250px"
                          v-model="as_item"
                          filter source="/api/items?mode=all&limit=20" :source-keys="['name']"
                          input-debounce="500"
                          option-value="id"
                          option-label="name"
                          @input="$refs.code.focus()"
                          bottom-slots
                        >
                          <q-icon slot="prepend" name="widgets" />
                          <div slot="counter"> <q-icon name="search" /> Input barang akan diregister</div>
                        </ux-select>
                      </q-popup-edit>
                    </q-btn>
                  </q-input>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-scroll-area>
      <q-space />
      <q-separator />
      <q-card-actions align="right" class="items-end">
        <q-btn glossy color="grey" label="Reset" @click="reset()" />
        <q-btn glossy color="positive" label="Save" @click="save()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import mixRecord from '@/mixins/MixRecord'
import CodeScanner from '@/components/CodeScanner'
export default {
  name: 'ReceiveForm',
  mixins: [mixRecord],
  data () {
    return {
      rsForm: null,
      as_item: null,
      SHEET: {
        items: { data: [], loading: false, api: '/api/items?mode=all' }
      },
      RECORD: {
        api: '/api/receives',
        params: {
          fields: 'id,date,reference',
          includes: 'receive_items.item'
        },
        setForm: (v = {}) => ({
          reference_number: null,
          reference_batch: null,
          date: new Date().toISOString().slice(0, 10),
          receive_items: [],
          ...v
        }),
        setFormItem: (v = {}) => ({
          serial: null,
          item: null,
          notes: null,
          ...v
        })
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    init () {
      this.RECORD.load(v => {
        this.rsForm = v
      })
    },
    scaningCode () {
      this.$q.dialog({
        parent: this,
        component: CodeScanner
      }).onOk(val => {
        this.addNewItem(val)
      })
    },
    enterCode (e) {
      this.addNewItem(e.target.value)
      e.target.value = ''
    },
    addNewItem (v) {
      if (!String(v).length) return this.$q.notify({ message: 'Please enter code..', textColor: 'white', type: 'warning' })

      if (this.rsForm.receive_items.find(x => x.serial === v)) {
        this.$q.notify({ type: 'negative', message: 'Serial has been added.' })
      } else {
        this.rsForm.receive_items.push(this.RECORD.setFormItem({ serial: v, item: this.as_item }))
      }
    },
    removeItem (index) {
      this.rsForm.receive_items.splice(index, 1)
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
            const message = `${response.data.reference} created!`
            this.$q.notify({ type: 'positive', message })
            this.$emit('ok')
            this.hide()
          })
          .catch((error) => {
            this.fieldError(error.response || null)
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
        const len = this.rsForm.receive_items.length
        const desc = Object
          .values(this.$function.groupBy(this.rsForm.receive_items, row => row.item.id))
          .map(rows => {
            return rows.length ? `(${rows.length}) ${rows[0].item.name}` : null
          })
          .join('<BR>')

        this.$q.dialog({
          title: 'SIMPAN',
          html: true,
          message: `${desc}<BR><B>Konfirmasi penerimaan (${len}) total unit<b>`,
          ok: 'Ya, Simpan',
          cancel: 'Batal'
        }).onOk(() => {
          submit()
        })
      })
    },
    fieldError ({ ...ErrRes }, form = null) {
      if (ErrRes.status && ErrRes.status === 422) {
        if (this.$validator && ErrRes.data && ErrRes.data.errors) {
          this.$validator.errors.clear()
          const ErrorFields = ErrRes.data.errors
          const scope = form ? { scope: form } : {}

          for (const field in ErrorFields) {
            if (field) {
              const basefield = Object.assign({ field: field, msg: ErrorFields[field][0] }, scope)
              this.$validator.errors.add(basefield)
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="stylus">
.q-field__bottom
  padding 0px !important
</style>
