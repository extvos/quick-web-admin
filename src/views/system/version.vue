<template>
  <div class="app-container">
    <el-descriptions :column="2" size="medium" border class="margin-top" title="版本详情" :extra="versionInfo['git.build.version']">
      <el-descriptions-item label="版本"> {{ versionInfo['git.build.version'] }} </el-descriptions-item>
      <el-descriptions-item label="代码标签"> {{ versionInfo['git.closest.tag.name'] }} </el-descriptions-item>
      <el-descriptions-item label="代码哈希"> {{ versionInfo['git.commit.id'] }} </el-descriptions-item>
      <el-descriptions-item label="提交时间"> {{ versionInfo['git.commit.time'] }} </el-descriptions-item>
      <el-descriptions-item label="编译时间"> {{ versionInfo['git.build.time'] }} </el-descriptions-item>
      <el-descriptions-item label="最后提交者"> {{ versionInfo['git.commit.user.name'] }} &lt; {{ versionInfo['git.commit.user.name'] }} &gt; </el-descriptions-item>
      <el-descriptions-item label="最后提交注释"> {{ versionInfo['git.commit.message.full'] }} </el-descriptions-item>
      <el-descriptions-item label="是否为干净版本"> {{ versionInfo['git.dirty'] == 'false' }} </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { Request } from '@/api/standard'
export default {
  name: 'VersionInfo',
  data() {
    return {
      versionInfo: {}
    }
  },
  created() {
    console.log('getting version info')
    Request('_builtin/version/info').get().then(res => {
      console.log('res:>', res)
      this.versionInfo = res
    })
  }

}
</script>

<style>
</style>
