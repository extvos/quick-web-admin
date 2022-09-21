<template>
  <div class="app-container">
    <div
      class="filter-container"
      align="right"
    >
      <el-button
        class="filter-item"
        type="text"
        size="mini"
        icon="el-icon-plus"
        @click="handleEdit()"
      >新增</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="text"
        size="mini"
        icon="el-icon-refresh"
        @click="handleRefresh"
      >刷新
      </el-button>
    </div>
    <user-list
      ref="list"
      :table-height="listHeight"
      :queries="listQuery"
      @selected="onSelectionChange"
    />
  </div>
</template>

<script>
import UserList from './list.vue'
import waves from '@/directive/waves' // Waves directive
export default {
  name: 'UserIndex',
  components: { UserList },
  directives: { waves },
  data() {
    return {
      editVisible: false,
      editObject: {},
      selectedObject: null,
      listQuery: {}
    }
  },
  computed: {
    listHeight: function() {
      // 获取浏览器可视区域高度
      return `${document.documentElement.clientHeight}` - 236 // document.body.clientWidth;
    }
  },
  methods: {
    handleEdit() {
      this.$refs.list.handleEdit(0, null)
    },
    handleRefresh() {
      this.$refs.list.getList()
    },
    onSelectionChange(obj) {
      this.selectedObject = obj
    }
  }
}
</script>
