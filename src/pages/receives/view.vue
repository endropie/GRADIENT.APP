<template>
  <q-dialog :ref="RECORD.dialog" persistent maximized>
    <q-card style="min-height: 100vh" v-if="rsView">
      <q-bar class="bg-blue-grey text-white" style="height:47px">
        <q-btn flat icon="arrow_back_ios" style="width:25px" v-close-popup />
        <q-toolbar-title>PENERIMAAN BARANG</q-toolbar-title>
        <!-- <q-space /> -->
      </q-bar>
      <q-scroll-area style="height: calc(100vh - 100px); width:100%" :class="{'q-px-sm': $q.screen.gt.sm}">
        <q-card-section>
          <div class="row q-mb-md">
            <div class="text-h6">Reference: {{rsView.reference}}</div>
            <q-space />
            <div v-if="rsView.date">
              {{$app.moment(rsView.date).format('ll')}}
            </div>
          </div>
          <div class="column q-gutter-sm" v-if="$q.screen.lt.sm">
            <item-card  v-for="(row, index) in rsView.receive_items" :key="index" :item="row.item">
              <template v-slot:body>
                <div>Serial: {{row.serial}}</div>
              </template>
            </item-card>
          </div>
          <q-markup-table flat bordered v-else class="no-margin">
            <thead>
              <tr>
                <th key="prefix"></th>
                <th class="text-center" width="20%">Serial</th>
                <th class="text-left" width="50%">Name</th>
                <th class="text-left" width="30%">Note</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in rsView.receive_items" :key="index">
                <td key="prefix">{{index+1}}</td>
                <td class="text-left">
                  {{row.serial}}
                </td>
                <td class="text-left">
                  <div v-if="row.item">
                    {{row.item.name}}
                  </div>
                  <div v-else class="text-italic">
                    ITEM#{{row.item_id}}
                  </div>
                </td>
                <td class="text-left">
                  {{row.notes}}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-scroll-area>
      <q-separator />
      <q-card-actions align="right" style="height:47px">
        <q-btn label="Cancel" color="blue-grey-5" v-close-popup />
        <q-btn flat label="Delete" color="negative" @click="destroy()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import MixRecord from '@/mixins/MixRecord'
import ItemCard from '@/components/ItemCard'
export default {
  name: 'ReceiveView',
  mixins: [MixRecord],
  components: { ItemCard },
  data () {
    return {
      rsView: null,
      RECORD: {
        dialog: 'dialog',
        api: '/api/receives',
        params: {
          fields: 'date,reference',
          receive_items_fields: 'id,serial,notes',
          receive_items_item_fields: 'id,code,name',
          includes: 'receive_items.item'
        }
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.RECORD.load(v => {
        this.rsView = v
      })
    },
    destroy () {
      const submit = () => {
        this.$q.loading.show()
        this.$axios.delete(`${this.RECORD.api}/${this.$props.id}`)
          .then((response) => {
            this.hide()
            this.$emit('ok')
          })
          .catch((error) => {
            console.error(error.response || error)
          })
          .finally(() => {
            this.$q.loading.hide()
          })
      }

      this.$q.dialog({
        title: 'KONFIRMASI',
        message: 'Yakin untuk menghapus data ?',
        ok: 'Ya, Hapus',
        cancel: 'Batal'
      }).onOk(() => {
        submit()
      })
    }
  }
}
</script>
