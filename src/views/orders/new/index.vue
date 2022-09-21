<template>
  <div class="app-container">
    <el-col
      :span="16"
      :offset="4"
      class="filter-container"
      align="left"
    >
      <h4>录入新订单</h4>
      <el-divider />
      <edit-form />
    </el-col>
  </div>
</template>

<script>
import EditForm from './form.vue'

import waves from '@/directive/waves' // Waves directive

export default {
  name: 'CategoryIndex',
  components: { EditForm },
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
