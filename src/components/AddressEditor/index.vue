<template>
  <el-cascader v-model="district" :props="props" placeholder="行政区域" @change="onSelectChange" />
</template>
<script>
import { Request } from '@/api/standard'
export default {
  name: 'AddressEditor',
  data() {
    return {
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          console.log('Node:>', node)
          const params = { __orderBy: 'id' }
          if (level === 0) {
            params.grade = 1
          } else if (level <= 3) {
            params.parentId = node.data.id
          } else {
            resolve([])
            return
          }
          Request('/_builtin/address').get(params).then(res => {
            const nodes = res.data.map(item => ({
              label: item.name,
              value: item.name,
              id: item.id,
              leaf: level >= 3
            }))
            resolve(nodes)
          })
        }
      },
      district: '',
      address: ''
    }
  },
  created() {
  },
  methods: {
    onSelectChange(v1) {
      console.log('onSelectChange1:', v1)
      console.log('onSelectChange2:', this.district)
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

