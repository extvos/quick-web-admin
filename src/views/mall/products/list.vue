<template>
  <div>
    <el-table
      ref="listTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      :height="tableHeight"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :load="loadSKU"
      size="mini"
      highlight-current-row
      style="width: 100%;"
      default-expand-all
      @sort-change="sortChange"
      @selection-change="onSelectionChange"
    >
      <el-table-column
        type="selection"
        width="30"
        fixed="left"
      />
      <el-table-column
        label="商品名称"
        header-align="center"
        min-width="240"
        prop="name"
        fixed="left"
      />
      <el-table-column
        label="描 述"
        header-align="center"
        min-width="160"
        prop="description"
      />
      <el-table-column
        label="单 价"
        header-align="center"
        prop="price"
        align="right"
        width="180"
      />
      <el-table-column
        label="更 新"
        header-align="center"
        prop="updated"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <date-time
            :time="scope.row.updated"
            format="YYYY-MM-DD HH:mm"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操 作"
        width="80px"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.row.id)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery_page"
      :limit.sync="listQuery.__limit"
      :page-sizes="[25,50,100]"
      align="right"
      @pagination="getList"
    />
    <edit-dialog
      :visible="editVisible"
      :edit-object="editObject"
      @success="getList()"
      @cancel="editVisible = false"
    />
  </div>
</template>

<script>
//   import { getObjects } from '../api/std'
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
//   import OperateMenu from '../widgets/operateMenu'
//   import StatusTag from '../widgets/statusTag'
//   import UploadDialog from './upload.vue'
import EditDialog from './edit.vue'
//   import SelectFile from './select-file.vue'
export default {
  name: 'ProductList',
  components: {
    Pagination,
    EditDialog
  },
  filters: {
  },
  props: {
    queries: {
      type: Object,
      default: null
    },
    hiddens: {
      type: Array,
      default: function() {
        return []
      }
    },
    orderBy: {
      type: String,
      default: ''
    },
    pageSize: {
      type: Number,
      default: 0
    },
    tableHeight: {
      type: Number,
      default: undefined
    },
    defaultProps: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      imglist: null,
      total: 0,
      listLoading: true,
      listQuery_page: 1,
      filterKeyword: '',
      filterStatus: '',
      filterParent: '',
      filterVendor: '',
      listQuery: {
        __offset: 0,
        __limit: 50,
        __order_by: '-updated'
      },
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      uploadVisible: false,
      uploadTarget: '',
      editObject: {},
      editVisible: false,
      selectVisible: false,
      selectId: '',
      selectName: '',
      downloadLoading: false
    }
  },
  computed: {
    contentName() {
      return ''
    }
  },
  watch: {
    queries: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.listQuery_page = 1
        this.getList()
      }
    }
  },
  created() {
    if (this.orderBy !== '') {
      this.listQuery.__order_by = this.orderBy
    }
    if (this.pageSize !== 0) {
      this.listQuery.__limit = this.pageSize
    }
    this.getList()
  },
  methods: {
    getList() {
      this.editVisible = false
      this.uploadVisible = false
      this.listLoading = true
      this.list = []
      this.list = []
      this.listQuery.__offset = this.listQuery.__limit * (this.listQuery_page - 1)
      this.listLoading = false
      //   const queryParams = Object.assign({}, this.listQuery, this.queries)
      // getObjects('image', queryParams).then(response => {
      //   this.list = response.data.data
      //   this.total = response.data.__control.total
      // })
    },
    loadSKU(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }
        ])
      }, 1000)
    },
    handleEdit(index, row) {
      if (row) {
        this.editObject = row
      } else {
        this.editObject = Object.assign({}, this.defaultProps)
      }
      this.editVisible = true
      // this.$message.error('暂未支持')
    },
    handleUpload(index, row) {
      if (row) {
        this.uploadTarget = '/apis/metas/image/' + row.id + '/upload'
        this.uploadVisible = true
      }
    },
    handleOpen(s) {
      window.open(s)
    },
    handleSelect(idx, img) {
      if (img) {
        this.selectVisible = true
        this.selectId = img.id
        this.selectName = img.name
      }
    },
    handleSelectDone() {
      this.selectVisible = false
      this.getList()
    },
    onSelectionChange(val) {
      this.$emit('selected', val)
    },
    handlePreviewImage(index, row) {
      if (row) {
        this.$alert('<img width="100%" src="' + row.uri + '">', '图片预览', {
          dangerouslyUseHTMLString: true
        })
      }
    },
    handleFilter() {
      this.listQuery_page = 1
      this.getList()
    },
    sortChange(data) {
      if (data) {
        const fieldName = data.prop
        if (data.order === 'descending') {
          this.listQuery.__order_by = '-' + fieldName
        } else {
          this.listQuery.__order_by = fieldName
        }
      } else {
        this.listQuery.__order_by = 'id'
      }
      this.getList()
    }
  }
}
</script>
