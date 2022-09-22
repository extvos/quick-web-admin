<template>
  <el-dialog
    :title="dialogTitle"
    :visible="visible"
    :before-close="handleClose"
    width="540px"
    :close-on-click-modal="false"
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
            label="角色代码"
            prop="code"
          >
            <el-input
              v-model="editForm.code"
              class="filter-item"
              size="mini"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="角色名称"
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
            label="权 限"
            prop="selectPermissions"
          >
            <permission-check v-model="editForm.permissionIds" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="注释"
            prop="comment"
          >
            <el-input
              v-model="editForm.comment"
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
import { validUsername } from '@/utils/validate'
import { Restlet } from '@/api/standard'
const Role = new Restlet('/_builtin/auth/role', '/_builtin/auth/role')
import PermissionCheck from '../permissions/check.vue'
export default {
  name: 'RoleEdit',
  components: { PermissionCheck },
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
    const validateCode = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的代码！'))
      } else {
        callback()
      }
    }
    return {
      dialogTitle: '',
      defaultForm: {
        id: '',
        name: '',
        code: '',
        comment: ''
      },
      origForm: {},
      editForm: {
        id: '',
        name: '',
        code: '',
        comment: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入正确的代码！', trigger: 'blur', validator: validateCode }
        ]
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
          this.dialogTitle = '编辑角色：' + this.editForm.name
          this.origForm = Object.assign({}, this.defaultForm, newVal)
        } else {
          this.dialogTitle = '新增角色'
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
    // permissionChanged(val){
    //   console.log("permissionChanged1:>", val)
    //   console.log("permissionChanged2:>", this.editForm.permissionIds)
    // },
    handleSave() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          // alert('submit!');
          const updateData = {}
          for (const [key, value] of Object.entries(this.editForm)) {
            if (value !== this.origForm[key]) {
              updateData[key] = value
            }
          }
          if (updateData.length === 0) {
            this.$message.error('未作任何修改...')
          } else {
            if (this.editForm.id) {
              Role.update(this.editForm.id, updateData).then(res => {
                console.log('handleSave:>', res)
                this.$notify({
                  title: '成功',
                  message: '更新成功！',
                  type: 'success',
                  duration: 2000
                })
                this.$emit('success', true)
              })
            } else {
              Role.create(this.editForm).then(res => {
                console.log('handleSave:>', res)
                this.$notify({
                  title: '成功',
                  message: '更新成功！',
                  type: 'success',
                  duration: 2000
                })
                this.$emit('success', true)
              })
            }
          }
        } else {
          // console.log('error submit!!');
          this.$message.error('数据填写有误！')
          return false
        }
      })
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
