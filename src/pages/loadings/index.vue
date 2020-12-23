<template>
  <q-page padding class="flex flex-center">
    <q-card style="width: 100%;min-height: calc(100vh - 100px)">
      <q-bar class="bg-blue-grey text-white text-subtitle2" style="height:50px">
        <q-icon name="mdi-archive-arrow-up-outline" size="20px" />
        <q-toolbar-title class="text-subtitle1">
          LIST - BARANG KELUAR
        </q-toolbar-title>
        <q-btn round dense outline icon="add" @click="form()" />
        <q-btn flat round dense icon="more_vert" />
      </q-bar>
      <q-table
        style="height: calc(100vh - 140px)"
        :grid="$q.screen.lt.sm" card-container-style="overflow-y:scroll"
        :flat="$q.screen.lt.sm" :bordered="$q.screen.lt.sm"
        :data="TABLE.rs"
        :columns="TABLE.columns"
        :pagination.sync="TABLE.pagination"
        :rows-per-page-options="TABLE.rowPageOptions"
        rows-per-page-label="LIMIT"
        :pagination-label="(first, last, total, x) => `${TABLE.pagination.last ? TABLE.pagination.page + ' of ' + TABLE.pagination.last : ''}`"
        @request="TABLE.request"
      >
        <template v-slot:item="{ row }">
          <div class="q-pa-xs col-xs-12" :class="{'col-xs-6': $q.screen.gt.xs}">
            <q-card flat bordered @click="view(row)" class="cursor-pointer">
              <q-card-section horizontal class="q-pa-sm">
                <div class="column">
                  <label class="text-grey q-mb-sm">
                    No. Reference
                    <br><strong class="text-dark">{{ row.reference_number || '-' }}</strong>
                  </label>
                  <label class="text-grey q-mb-sm">
                    Market Reference
                    <br><strong class="text-dark">{{ row.reference }}</strong>
                  </label>
                </div>
                <q-space />
                <div class="column">
                  <label class="text-grey-8" v-if="row.date">
                    {{$app.moment(row.date).format('ll')}}
                  </label>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
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
  name: 'LoadingIndex',
  mixins: [MixTable],
  data () {
    return {
      TABLE: {
        api: '/api/loadings',
        params: {
          fields: 'id,date,reference,reference_number'
        },
        rs: [],
        columns: [
          { name: 'prefix' },
          { name: 'date', field: 'date', format: (v) => (v ? this.$app.moment(v).format('L') : '-'), label: 'Date', align: 'left' },
          { name: 'reference_number', field: 'reference_number', label: 'No. Reference', align: 'left' },
          { name: 'reference', field: 'reference', label: 'Market', align: 'left' }
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
        parent: this.$root,
        mode: 'create',
        id: null
      }).onOk(() => {
        this.init()
      })
    },
    view (row) {
      this.$q.dialog({
        component: ViewComponent,
        parent: this.$root,
        mode: 'read',
        id: row.id
        // ...more.props...
      }).onOk(() => {
        this.init()
      })
    }
  }
  // beforeRouteLeave (to, from, next) {
  //   console.warn('beforeRouteLeave', this)
  //   next(false)
  //   const globalDialogs = this.$children.filter(x => {
  //     if (x.$options.name === 'QGlobalDialog') {
  //       return x.$children.find(c => {
  //         if (c.DIALOG && c.Dialog.name) {
  //           c.DIALOG.hide()
  //           return true
  //         }
  //       })
  //     }
  //   })
  //   next(!globalDialogs.length)
  // }
}
</script>
