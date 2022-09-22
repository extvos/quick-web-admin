<template>
  <el-dialog
    :title="dialogTitle"
    :visible="visible"
    :before-close="handleClose"
    width="840px"
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
        <el-col :span="10">
          <el-form-item
            label="用户名"
            prop="username"
          >
            <el-input
              v-model="editForm.username"
              :disabled="editForm.id"
              class="filter-item"
              size="mini"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            label="昵 称"
            prop="nickname"
          >
            <el-input
              v-model="editForm.nickname"
              class="filter-item"
              size="mini"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item
            label="密 码"
            prop="password1"
          >
            <el-row :gutter="5">
              <el-col :span="10">
                <el-input
                  v-model="password1"
                  show-password
                  size="mini"
                />
              </el-col>
              <el-col :offset="1" :span="10">
                <el-input
                  v-model="password2"
                  show-password
                  size="mini"
                />
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item
            label="电 话"
            prop="cellphone"
          >
            <el-input
              v-model="editForm.cellphone"
              class="filter-item"
              size="mini"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            label="邮 箱"
            prop="email"
          >
            <el-input
              v-model="editForm.email"
              class="filter-item"
              size="mini"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="激 活">
            <el-switch v-model="editForm.status" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="角 色"
            prop="selectRoles"
          >
            <role-select v-model="editForm.roleIds" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="权 限"
            prop="selectPermissions"
          >
            <permission-select v-model="editForm.permissionIds" size="mini" />
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
import md5 from 'js-md5'
import { validUsername } from '@/utils/validate'
import { Restlet } from '@/api/standard'
const User = new Restlet('/_builtin/auth/user', '/_builtin/auth/user')
import PermissionSelect from '../permissions/select.vue'
import RoleSelect from '../roles/select.vue'
export default {
  name: 'UserEdit',
  components: { PermissionSelect, RoleSelect },
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
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名！'))
      } else {
        callback()
      }
    }
    return {
      dialogTitle: '',
      password1: '',
      password2: '',
      defaultForm: {
        username: '',
        cellphone: '',
        email: ''
      },
      origForm: {},
      editForm: {
        username: '',
        cellphone: '',
        email: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入正确的用户名！', trigger: 'blur', validator: validateUsername }
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
          this.dialogTitle = '编辑用户：' + this.editForm.username
          this.origForm = Object.assign({}, this.defaultForm, newVal)
        } else {
          this.dialogTitle = '新增用户'
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
    save() {
      const updateData = {}
      for (const [key, value] of Object.entries(this.editForm)) {
        if (value !== this.origForm[key]) {
          updateData[key] = value
        }
      }
      if (this.password1 !== '' && this.password2 !== '') {
        if (this.password1 !== this.password2) {
          this.$message.error('两次输入密码不匹配！')
          return
        } else if (this.password1.length < 5) {
          this.$message.error('密码长度不能小于5！')
          return
        } else {
          updateData['password'] = md5(this.password1)
          this.editForm.password = md5(this.password1)
        }
      }
      if (updateData.length === 0) {
        this.$message.error('未作任何修改...')
      } else {
        if (this.editForm.id) {
          User.update(this.editForm.id, updateData).then(res => {
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
          if (!this.editForm.password) {
            this.$message.error('密码不能为空！')
            return
          }
          User.create(this.editForm).then(res => {
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
    },
    handleSave() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.save()
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
