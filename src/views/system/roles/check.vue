<template>
  <div>
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;" />
    <el-checkbox-group v-model="selected" @change="handleChange">
      <el-checkbox v-for="item in options" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import { Restlet } from '@/api/standard'
const Role = new Restlet('/_builtin/auth/role', '/_builtin/auth/role')
export default {
  name: 'RoleSelect',
  props: {
    size: {
      type: String,
      default: 'mini'
    },
    value: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: true,
      selected: [],
      options: []
    }
  },
  watch: {
    value(v1, v2) {
      this.selected = [...this.value]
    }
  },
  created() {
    Role.list({ __pageSize: 999 }).then(res => {
      this.options = res.data
    })
    this.selected = this.value
  },
  methods: {
    handleChange(val) {
      const checkedCount = val.length
      this.checkAll = checkedCount === this.options.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.options.length
      this.$emit('change', val)
      this.$emit('input', val)
    },
    handleCheckAllChange(val) {
      this.selected = val ? this.options.map(e => e.id) : []
      this.isIndeterminate = false
      this.$emit('change', this.selected)
      this.$emit('input', this.selected)
    }
  }
}
</script>
<style scoped>
  .el-select {
    width: 100%;
  }
  </style>
