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
    <product-list
      ref="list"
      :table-height="listHeight"
      :queries="listQuery"
      @selected="onSelectionChange"
    />
    <product-edit
      :visible="editVisible"
      :edit-object="editObject"
      @success="handleRefresh()"
      @cancel="editVisible = false"
    />
  </div>
</template>

<script>
import ProductList from './list.vue'
import ProductEdit from './edit.vue'
import waves from '@/directive/waves' // Waves directive

export default {
  name: 'ProductIndex',
  components: { ProductList, ProductEdit },
  directives: { waves },
  data() {
    return {
      editVisible: false,
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
    handleRefresh() {

    },
    onSelectionChange() {

    }
  }
}
</script>
