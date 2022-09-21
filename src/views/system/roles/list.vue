<template>
  <div>
    <el-table
      ref="listTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      :height="tableHeight"
      size="mini"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="onSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="30"
        fixed="left"
      />
      <el-table-column
        label="角色代码"
        align="center"
        width="180"
        prop="code"
      />
      <el-table-column
        label="角色名称"
        align="center"
        width="240"
        prop="name"
      />
      <el-table-column
        label="权 限"
        align="center"
        min-width="240"
        prop="permissions"
      >
        <template slot-scope="scope">
          <el-tag v-for="perm in scope.row.permissions" :key="perm.id" size="small" style="margin-left: 5px;"> {{ perm.name }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="注 释"
        header-align="center"
        prop="comment"
        min-width="200"
        align="center"
      />
      <el-table-column
        align="center"
        label="操 作"
        width="120px"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.row.id, scope.row)"
          >编辑</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.id, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery_page"
      :limit.sync="listQuery.__pageSize"
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
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import EditDialog from './edit.vue'
import { Restlet } from '@/api/standard'
const Role = new Restlet('/_builtin/auth/role', '/_builtin/auth/role')
export default {
  name: 'RoleList',
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
        __page: 0,
        __pageSize: 50,
        __orderBy: '-updated'
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
      this.listQuery.__orderBy = this.orderBy
    }
    if (this.pageSize !== 0) {
      this.listQuery.__pageSize = this.pageSize
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
      this.listQuery.__page = this.listQuery_page - 1
      this.listLoading = false
      const queryParams = Object.assign({}, this.listQuery, this.queries)
      Role.list(queryParams).then(res => {
        this.list = res.data
        this.total = res.total
      })
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
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Role.delete(row.id).then(_ => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    },
    onSelectionChange(val) {
      this.$emit('selected', val)
    },
    handleFilter() {
      this.listQuery_page = 1
      this.getList()
    },
    sortChange(data) {
      if (data) {
        const fieldName = data.prop
        if (data.order === 'descending') {
          this.listQuery.__orderBy = '-' + fieldName
        } else {
          this.listQuery.__orderBy = fieldName
        }
      } else {
        this.listQuery.__orderBy = 'id'
      }
      this.getList()
    }
  }
}
</script>
