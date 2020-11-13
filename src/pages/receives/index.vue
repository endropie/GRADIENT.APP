<template>
  <q-page padding class="flex flex-center">

    <q-card class="column" style="width: 100%;min-height: calc(100vh - 100px)">
      <q-card-section class="row q-pa-sm">
        <div>
          <div class="text-subtitle2">LIST - PENERIMAAN BARANG</div>
        </div>
        <q-space />
        <div>
          <q-btn dense glossy round color="blue-grey" icon="add" @click="form()" />
          <!-- <q-btn round color="blue-grey" icon="add" @click="$router.push('/receives/create')" /> -->
        </div>
        <!-- <div class="text-subtitle2">by John Doe</div> -->
      </q-card-section>
      <q-table
        style="height: calc(100vh - 150px)"
        :grid="$q.screen.lt.sm"
        :data="TABLE.rs"
        :columns="TABLE.columns"
        :pagination.sync="TABLE.pagination"
        :rows-per-page-options="TABLE.rowPageOptions"
        @request="TABLE.request"
      >
      <q-td  slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:50px">
        <q-btn flat dense color="blue-grey" icon="wysiwyg" @click="view(rs.row)" />
      </q-td>
      </q-table>
    </q-card>

  </q-page>
</template>

<script>
import MixTable from '@/mixins/MixTable'
import ViewComponent from './view'
import FormComponent from './form'
export default {
  name: 'ReceivesIndex',
  mixins: [MixTable],
  data () {
    return {
      test: null,
      TABLE: {
        api: '/api/receives',
        params: {
          fields: 'id,date,reference'
        },
        rs: [],
        columns: [
          { name: 'prefix' },
          { name: 'date', field: 'date', label: 'Date', align: 'left' },
          { name: 'reference', field: 'reference', label: 'Reference', align: 'left' }
        ],
        pagination: {
          sortBy: 'date',
          descending: true,
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0
        }
      }
    }
  },
  created () {
    this.init()
  },
  computed: {
  },
  methods: {
    init () {
      this.TABLE.request()
    },
    form (row = null) {
      this.$q.dialog({
        component: FormComponent,
        parent: this,
        mode: 'create',
        id: null
        // ...more.props...
      }).onOk(() => {
        this.load()
      })
    },
    view (row) {
      this.$q.dialog({
        component: ViewComponent,
        parent: this,
        mode: 'read',
        id: row.id
        // ...more.props...
      }).onOk(() => {
        this.load()
      })
    }
  }
}
</script>
