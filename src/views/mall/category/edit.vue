<template>
  <el-dialog
    :title="dialogTitle"
    :visible="visible"
    :before-close="handleClose"
    width="540px"
    @close="closeDialog"
  >
    <el-form
      ref="editForm"
      :model="editForm"
      :rules="rules"
      label-position="right"
      label-width="120px"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item
            label="ID"
            prop="id"
          >{{ editForm.id }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item
            label="Vendor"
            prop="vendor"
          >{{ editForm.vendor }} : {{ editForm.refId }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="Parent"
            prop="parent"
          >{{ editForm.parent }} : {{ editForm.parentId }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item
            label="名 称"
            prop="name"
          >
            <el-input
              v-model="editForm.name"
              class="filter-item"
              size="mini"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="类 型"
            prop="type"
          >
            <el-select
              v-model="editForm.type"
              size="mini"
            >
              <el-option
                label="海报"
                value="Poster"
              />
              <el-option
                label="剧照"
                value="Screenshot"
              />
              <el-option
                label="其他"
                value="Other"
              />
            </el-select>

          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="标 签"
            prop="tags"
          >
            <tag
              ref="tags"
              v-model="editForm.tags"
              class="filter-item"
              size="mini"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="mini"
        @click="handleCancel"
      >取 消</el-button>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-check"
        @click="handleSave"
      >保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import Tag from '@/components/Tag'
export default {
  name: 'CategoryEdit',
  components: { Tag },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    editObject: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogTitle: '',
      defaultForm: {
        id: '',
        vendor: '',
        refId: '',
        name: '',
        type: '',
        parent: '',
        tags: [],
        parentId: ''
      },
      origForm: {},
      editForm: {
        id: '',
        vendor: '',
        refId: '',
        name: '',
        type: '',
        parent: '',
        tags: [],
        parentId: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
        // duration: [{type: 'number', required: true, message: '请输入数值', trigger: 'change'}],
        // type: [{required: true, message: '请选择类型', trigger: 'change'}],
        // price: [{type: 'number', required: true, message: '请输入数值', trigger: 'change'}],
        // trial: [{type: 'number', required: true, message: '请输入数值', trigger: 'change'}],
        // flag: [{required: true, message: '请上传图片'}],
        // image: [{required: true, message: '请上传图片'}],
        // enabled: [{type: 'boolean', required: true, message: '请输入数值', trigger: 'change'}],
        // title: [{required: true, message: '请填写标题', trigger: 'blur'}],
        // description: [{required: true, message: '请填写描述', trigger: 'blur'}]
      }
    }
  },
  computed: {},
  watch: {
    editObject: function(newVal, oldVal) {
      console.log('editObject:>', newVal)
      if (newVal !== oldVal) {
        this.editForm = Object.assign({}, this.defaultForm, newVal)
        if (this.editForm.id) {
          this.dialogTitle = '编辑图片：' + this.editForm.name
          this.origForm = Object.assign({}, this.defaultForm, newVal)
        } else {
          this.dialogTitle = '新增图片'
          this.origForm = Object.assign({})
        }
      }
    }
  },
  created() {

  },
  methods: {
    closeDialog() {
      this.handleCancel()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleCancel() {
      this.$refs['editForm'].resetFields()
      this.$emit('cancel', false)
    },
    handleSave() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          // alert('submit!');
        } else {
          // console.log('error submit!!');
          this.$message.error('数据填写有误！')
          return false
        }
      })
      const updateData = []
      for (const [key, value] of Object.entries(this.editForm)) {
        if (value !== this.origForm[key]) {
          updateData[key] = value
          updateData.push({ name: key, value: value })
        }
      }
      if (updateData.length === 0) {
        this.$message.error('未作任何修改...')
      } else {
        if (this.editForm.id) {
          // updateObject('image', this.editForm.id, updateData).then(res => {
          //   console.log('handleSave:>', res)
          //   this.$notify({
          //     title: '成功',
          //     message: '更新成功！',
          //     type: 'success',
          //     duration: 2000
          //   })
          //   this.$emit('success', true)
          // })
        } else {
          // createObject('image', updateData, this.editForm.parent, this.editForm.parentId).then(res => {
          //   console.log('handleSave:>', res)
          //   this.$notify({
          //     title: '成功',
          //     message: '更新成功！',
          //     type: 'success',
          //     duration: 2000
          //   })
          //   this.$emit('success', true)
          // })
        }
      }
    }
  }
}

</script>

  <style scoped>
      .handle-box {
          margin-bottom: 20px;
      }

      .handle-select {
          width: 120px;
      }

      .handle-input {
          width: 300px;
          display: inline-block;
      }

      .del-dialog-cnt {
          font-size: 16px;
          text-align: center
      }

      .pre-img-title {
          width: 110px;
          text-align: right;
      }

      .pre-img {
          width: 128px;
          height: 128px;
          background: #f8f8f8;
          border: 1px solid #eee;
          margin-left: 10px;
          border-radius: 5px;
      }

      .crop-demo {
          display: flex;
          align-items: flex-end;
      }

      .crop-demo-btn {
          position: relative;
          width: 100px;
          height: 40px;
          line-height: 40px;
          padding: 0 20px;
          margin-left: 10px;
          background-color: #409eff;
          color: #fff;
          font-size: 14px;
          border-radius: 4px;
          box-sizing: border-box;
      }

      .crop-input {
          position: absolute;
          width: 100px;
          height: 40px;
          left: 0;
          top: 0;
          opacity: 0;
          cursor: pointer;
      }

      .el-upload--text {
          background-color: #fff;
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          box-sizing: border-box;
          width: 180px;
          height: 180px;
          text-align: center;
          cursor: pointer;
          position: relative;
          overflow: hidden;
      }

      .avatar-uploader .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          width: 128px;
          height: 128px;
          position: relative;
          overflow: hidden;
      }

      .avatar-uploader .el-upload:hover {
          border-color: #409EFF;
      }

      .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 128px;
          height: 128px;
          line-height: 128px;
          text-align: center;
      }

      .avatar {
          width: 128px;
          height: 128px;
          display: block;
      }

  </style>
