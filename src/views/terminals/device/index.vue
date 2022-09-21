<template>
  <div class="app-container">
    <div
      class="filter-container"
      align="right"
    >

      <el-input
        v-model="selectDevice"
        class="filter-item"
        style="width: 150px;"
        placeholder="设备ID"
        size="mini"
        prefix-icon="el-icon-search"
        clearable
        @change="reloadData"
      />
      <el-input
        v-model="selectModel"
        class="filter-item"
        style="width: 150px;"
        placeholder="型号"
        size="mini"
        prefix-icon="el-icon-search"
        clearable
        @change="reloadData"
      />

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="text"
        icon="el-icon-plus"
        size="mini"
        @click="handleCreate"
      >新增</el-button>
      <el-button
        :disabled="selectedRows.length === 0"
        class="filter-item"
        style="margin-left: 10px;"
        type="text"
        icon="el-icon-delete"
        size="mini"
        @click="deleteSelectedRows"
      >删除</el-button>
      <el-button
        class="filter-item"
        size="mini"
        type="text"
        icon="el-icon-refresh"
        @click="reloadData"
      >刷新</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="devicesList"
      :height="listHeight"
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        fixed="left"
      />
      <el-table-column
        label="设备标识"
        min-width="150px"
        align="center"
        prop="serialNum"
        sortable="custom"
        fixed="left"
      />

      <el-table-column
        label="MAC"
        width="200"
        align="center"
        prop="macAddr"
      />

      <el-table-column
        label="型 号"
        width="120"
        align="center"
        prop="model"
        sortable="custom"
      />

      <el-table-column
        label="厂 商"
        width="120"
        align="center"
        prop="manufacture"
        sortable="custom"
      />

      <el-table-column
        label="位 置"
        width="160"
        align="center"
        sortable="custom"
        prop="location"
      />
      <el-table-column
        label="创建时间"
        width="150px"
        align="center"
        prop="created"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="启 用"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.activated"
            type="success"
            effect="dark"
            size="mini"
          >
            启用
          </el-tag>
          <el-tag
            v-else
            type="info"
            effect="dark"
            size="mini"
          >
            停用
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100px"
        align="center"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-dropdown
            class="avatar-container right-menu-item"
            trigger="click"
          >
            <div class="el-icon-more" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span
                  style="display:block;"
                  @click="handleUpdate(row)"
                ><i class="el-icon-edit" />编辑</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span
                  style="display:block;"
                  @click="handleViewAuth(row)"
                ><i class="el-icon-view" />查看授权</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span
                  style="display:block;"
                  @click="handleGrant(row)"
                ><i class="el-icon-link" />设置授权</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span
                  style="display:block;"
                  @click="handleDelete(row)"
                ><i class="el-icon-delete" />删除</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span
                  style="display:block;"
                  @click="handleDevicePreview(row)"
                ><i class="el-icon-view" />抓拍记录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="devicesListQuery.page"
      :limit.sync="devicesListQuery.__pageSize"
      align="right"
      @pagination="getDevicesList"
    />
    <device-edit
      :object="editObject"
      :visible="editVisible"
      @cancel="editVisible=false"
      @accept="editVisible=false; reloadData()"
    />
  </div>
</template>
<style scoped>
/* .table {
  margin-top: 30px;
  margin-left: 20px;
  margin-right: 30px;
} */
</style>
<script>
import { Device } from '../api.js' // updateGroup, queryGroup, queryMode
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DeviceEdit from './edit.vue'
export default {
  name: 'Devices',
  components: { Pagination, DeviceEdit },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      devicesListQuery: {
        page: 1,
        __page: 0,
        __pageSize: 10,
        identity__startswith: '',
        package: '',
        __orderBy: '-created'
      },
      listGroupQuery: {
        page: 1,
        __page: 0,
        __pageSize: 30
      },
      showReviewer: false,
      editObject: null,
      editVisible: false,

      selectModel: '',
      selectDevice: '',
      selectGroups: [],

      dialogDevicePreviewVisible: false,
      dialogPackagePreviewVisible: false,
      dialogPakcageUpdateVisible: false,
      dialogStatus: '',
      deivceId: '',
      downloadLoading: false,
      selectedRows: [],
      groupName: '',
      allGroups: [],
      devicesList: [],
      selectArea: '',
      areaGroups: [],
      packageId: ''
    }
  },
  computed: {
    listHeight: function() {
      // 获取浏览器可视区域高度
      if (this.tableHeight) {
        return this.tableHeight
      }
      return `${document.documentElement.clientHeight}` - 240 // document.body.clientWidth;
    }
  },
  updated() {

  },
  created() {
    this.devicesListQuery.__page = 0
    this.devicesListQuery.__pageSize = 20
    this.devicesListQuery.page = 1
    this.devicesListQuery.identity__startswith = ''
    this.devicesListQuery.model__startswith = ''
    this.devicesListQuery.group_id = ''
    this.devicesListQuery.__orderBy = '-created'
    this.selectPackage = ''
    this.selectArea = ''
    this.groupName = ''
    this.selectDevice = ''
    this.selectModel = ''
    this.getDevicesList()
  },
  methods: {
    getDevicesList() {
      this.devicesList = []
      this.listLoading = true
      const params = {}
      params.__page = this.devicesListQuery.page - 1
      params.__pageSize = this.devicesListQuery.__pageSize
      if (this.selectGroups.length > 0) {
        params.group__in = this.selectGroups.join(',')
      }
      if (this.selectDevice !== '') {
        params.identity__startswith = this.selectDevice
      }
      if (this.selectModel !== '') {
        params.model__startswith = this.selectModel
      }
      if (this.devicesListQuery.package !== '') {
        params.package = this.devicesListQuery.package
      }
      params.__orderBy = this.devicesListQuery.__orderBy
      Device.list(params).then(response => {
        this.devicesList = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    reloadData() {
      this.devicesListQuery.__page = 0
      this.total = 0
      this.devicesListQuery.page = 1
      console.log('reloadData: selectGroups:', this.selectGroups)
      this.getDevicesList()
    },
    handleFilter() {
      this.devicesListQuery.page = 1
      this.getDevicesList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'created') {
        if (order === 'ascending') {
          this.devicesListQuery.__orderBy = 'created'
        } else {
          this.devicesListQuery.__orderBy = '-created'
        }
        this.handleFilter()
      }
    },
    sortByID(order) {

    },
    handleCreate() {
      this.resetTemp()
      this.editVisible = true
      this.editObject = null
    },
    handleGroup() {
      this.editVisible = true
    },
    handleUpdate(row) {
      this.editObject = row
      this.editVisible = true
    },
    handleDevicePreview(row) {
      this.deivceId = row.id
      this.dialogDevicePreviewVisible = true
    },
    handlePackagePreview(row) {
      this.packageId = row.package
      if (this.packageId === '') {
        this.$message.error('当前设备还未升级!')
        return
      }
      this.dialogPackagePreviewVisible = true
    },
    handleLastPackagePreview(row) {
      this.packageId = row.lastPackage
      if (this.packageId === '') {
        this.$message.error('当前设备还未升级!')
        return
      }
      this.dialogPackagePreviewVisible = true
    },
    exitDevicePreview() {
      this.dialogDevicePreviewVisible = false
    },
    exitPackagePreview() {
      this.dialogPackagePreviewVisible = false
    },
    updateData(data) {
      // data未返回id
      // for (const v of this.list) {
      //   if (v.id === this.temp.id) {
      //     const index = this.list.indexOf(v)
      //     this.list.splice(index, 1, data.data.updates)
      //     break
      //   }
      // }
      this.getDevicesList()
    },
    deleteSelectedRows() {
      this.$confirm('确认删除当前选择得设备吗', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Device.delete(this.selectedRows).then(_ => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.selectedRows.forEach(row => {
            const index = this.devicesList.indexOf(row)
            this.devicesList.splice(index, 1)
            this.total--
          })
        }).catch(err => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 2000
          })
          console.error(err)
        })
      }).catch(() => {

      })
    },
    handleViewAuth(row) {
      Device.getAuth(row.id).then(res => {
        this.$alert(res.data, '授权内容如下')
      })
    },
    handleGrant(row) {
      this.$confirm('MQTT授权仅限测试时候使用，确认要操作么？', '注意', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Device.grantMqtt(row.id).then(_ => {
          Device.getAuth(row.id).then(res => {
            this.$alert(res.data, '已设置授权内容如下')
          })
        })
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除当前选择得设备吗', '注意', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Device.delete(row.id)
          .then(_ => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.devicesList.indexOf(row)
            this.devicesList.splice(index, 1)
            this.total--
          })
          .catch(err => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
            console.error(err)
          })
      }).catch(() => {

      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getSortClass: function(key) {
      const sort = this.devicesListQuery.sort
      return sort === `+${key}` ? 'ascending' : sort === `-${key}` ? 'descending' : ''
    },
    handleSelectionChange(selectedRows) {
      this.selectedRows = selectedRows
    },
    queryPackageId(packageId, packageName) {
      this.dialogPakcageUpdateVisible = false
      if (packageId === '') {
        return
      }
      this.selectPackage = packageName
      this.devicesListQuery.package = packageId
      this.getDevicesList()
    },
    showPackageUpdate() {
      this.dialogPakcageUpdateVisible = true
    },
    clearSelectPackage() {
      this.selectPackage = ''
      this.devicesListQuery.package = ''
      this.getDevicesList()
    }
  }
}
</script>
<style scoped>
.el-input {
    margin-right: 10px;
}
</style>
