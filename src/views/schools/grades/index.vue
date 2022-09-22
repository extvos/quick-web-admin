<template>
  <div class="app-container">
    <split-pane split="vertical" :min-percent="20" :default-percent="30">
      <template slot="paneL">
        <div class="left-container">
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
          <el-tree
            :data="data"
            node-key="id"
            default-expand-all
            draggable
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            @node-drag-start="handleDragStart"
            @node-drag-enter="handleDragEnter"
            @node-drag-leave="handleDragLeave"
            @node-drag-over="handleDragOver"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
            @current-change="onChange"
          />
        </div>
      </template>
      <template slot="paneR">
        <div class="right-container">
          <router-view />
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import splitPane from 'vue-splitpane'
export default {
  name: 'CategoryIndex',
  components: { splitPane },
  directives: { waves },
  data() {
    return {
      editVisible: false,
      editObject: {},
      selectedObject: null,
      listQuery: {},
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2',
          children: [{
            id: 11,
            label: '三级 3-2-1'
          }, {
            id: 12,
            label: '三级 3-2-2'
          }, {
            id: 13,
            label: '三级 3-2-3'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
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
      // this.$refs.list.getList()
    },
    onSelectionChange(obj) {
      this.selectedObject = obj
    },
    handleDragStart(node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner'
      } else {
        return true
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1
    },
    onChange(t, node) {
      console.log('onChange: t = ', t)
      console.log('onChange: node = ', node)
      this.$router.replace('/school/grade/edit/' + t.id)
    }
  }
}
</script>
  <style scoped>
    .app-container {
    position: relative;
    height: 88vh;
  }

  .left-container {
    /* background-color: #F38181; */
    height: 100%;
    /* min-width: 300px; */
    /* padding-left: 5px; */
    padding-right: 5px;
  }

  .right-container {
    /* background-color: #FCE38A; */
    height: 100%;
    padding-left: 5px;
    /* padding-right: 5px; */
  }

  .top-container {
    background-color: #FCE38A;
    width: 100%;
    height: 100%;
  }

  .bottom-container {
    width: 100%;
    background-color: #95E1D3;
    height: 100%;
  }
  </style>
