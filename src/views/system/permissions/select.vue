<template>
  <el-select
    v-model="value"
    :size="size"
    multiple
    collapse-tags
    placeholder="请选择"
    @change="handleChange"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
      <span style="float: left">{{ item.code }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 24px;">{{ item.name }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { Restlet } from '@/api/standard'
const Permission = new Restlet('/_builtin/auth/permission', '/_builtin/auth/permission')
export default {
  name: 'PermissionSelect',
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
      options: []
    }
  },
  created() {
    Permission.list({ __pageSize: 999 }).then(res => {
      this.options = res.data
    })
  },
  methods: {
    handleChange(val) {
      this.$emit('change', val)
      this.$emit('input', val)
    }
  }
}
</script>
<style scoped>
.el-select {
  width: 100%;
}
</style>
