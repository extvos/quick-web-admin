<template>
  <div class="app-container" align="center">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><b>{{ route.meta.title }}</b></span>
          </div>
          <el-form
            label-position="right"
            label-width="120px"
          >
            <el-form-item
              label="Parameters"
              prop="params"
            >
              <span>{{ params }}</span>
            </el-form-item>
            <el-form-item
              label="Path"
              prop="path"
            >
              <span>{{ path }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>

export default {
  name: 'VersionInfo',
  data() {
    return {
      route: {},
      params: {},
      path: '',
      info: {
        version: '',
        tag: ''
      },
      brand: {

      }
    }
  },
  computed: {
  },
  created() {
    console.log('Dummy:>', this.$route)
    this.route = this.$route
    this.params = this.$route.params
    this.path = this.$route.path
  },
  methods: {
  }
}
</script>
