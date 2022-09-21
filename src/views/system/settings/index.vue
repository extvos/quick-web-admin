<template>
  <div class="app-container">
    <el-descriptions :column="2" size="medium" border class="margin-top" title="系统参数" extra="?">
      <el-descriptions-item label="CPU"> xxx </el-descriptions-item>
      <el-descriptions-item label="RAM"> xxx </el-descriptions-item>
      <el-descriptions-item label="Loading"> xxx </el-descriptions-item>
      <el-descriptions-item label="Storage"> xxx </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
//   import { Request } from '@/api/standard'
export default {
  name: 'OptionsInfo',
  data() {
    return {
      options: {}
    }
  },
  created() {
    //   Request('_builtin/version/info').get().then(res => {
    //     console.log('res:>', res)
    //     this.versionInfo = res
    //   })
  }

}
</script>

  <style>
  </style>
