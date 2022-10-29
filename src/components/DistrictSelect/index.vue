<template>
  <el-cascader
    ref="selector"
    v-model="district"
    :props="props"
    :size="size"
    placeholder="行政区域"
    clearable
    @change="onSelectChange"
  />
</template>
<script>
import { Request } from '@/api/standard'
export default {
  name: 'DistrictSelect',
  props: {
    value: {
      type: String,
      default: ''
    },
    maxLevel: {
      type: Number,
      default: 4
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad: this.lazyLoad
      },
      district: null
    }
  },
  watch: {
    value(v1, v2) {
      this.district = v1.split(',')
    }
  },
  created() {
    this.district = this.value.split(',')
  },
  methods: {
    lazyLoad(node, resolve) {
      const { level } = node
      const params = { __orderBy: 'id', __pageSize: 999 }
      if (level === 0) {
        params.grade = 1
      } else if (level < this.maxLevel) {
        params.parentId = node.data.id
      } else {
        resolve([])
        return
      }
      Request('/_builtin/address').get(params).then(res => {
        const nodes = res.data.map(item => ({
          label: item.name,
          value: item.id,
          id: item.id,
          leaf: level >= (this.maxLevel - 1)
        }))
        resolve(nodes)
      })
    },
    onSelectChange(v1) {
      const r = v1.join(',')
      const nodes = this.$refs.selector.getCheckedNodes()
      const rl = nodes.length > 0 ? nodes[0].pathLabels.join(',') : ''
      console.log('onSelectChange1:', v1)
      console.log('onSelectChange2:', this.district)
      console.log('onSelectChange3:', r)
      console.log('onSelectChange4:', rl)
      this.$emit('change', r, rl)
      this.$emit('input', r, rl)
    }
  }
}
</script>
  <style lang="scss" scoped>
  .el-select {
      margin-right: 10px;
  }
  .el-input {
      margin-top: 10px;
  }
  </style>

