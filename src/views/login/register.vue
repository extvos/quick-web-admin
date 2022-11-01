<template>
  <el-dialog
    title="注册新用户"
    :visible="visible"
    :before-close="handleClose"
    width="640px"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      :disabled="loading"
      class="register-form"
      auto-complete="on"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="registerForm.username"
              placeholder="用户名"
              name="username"
              type="text"
              auto-complete="on"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="password1">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              ref="password1"
              v-model="registerForm.password1"
              :type="passwordType"
              placeholder="输入密码"
              name="password1"
              auto-complete="on"
            />
            <span
              class="show-pwd"
              @click="showPwd(1)"
            >
              <svg-icon icon-class="eye" />
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="password2">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              ref="password2"
              v-model="registerForm.password2"
              :type="passwordType"
              placeholder="重复输入密码"
              name="password2"
              auto-complete="on"
            />
            <span
              class="show-pwd"
              @click="showPwd(2)"
            >
              <svg-icon icon-class="eye" />
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="phoneNumber">
            <span class="svg-container">
              <svg-icon icon-class="phone" />
            </span>
            <el-input
              ref="phoneNumber"
              v-model="registerForm.phoneNumber"
              placeholder="电话号码"
              name="phoneNumber"
              type="text"
              auto-complete="on"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="email">
            <span class="svg-container">
              <svg-icon icon-class="email" />
            </span>
            <el-input
              ref="email"
              v-model="registerForm.email"
              placeholder="邮件地址"
              name="email"
              type="text"
              auto-complete="on"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item
            prop="captcha"
          >
            <span class="svg-container">
              <svg-icon icon-class="captcha" />
            </span>
            <el-input
              ref="captcha"
              v-model="registerForm.captcha"
              placeholder="验证码"
              name="captcha"
              auto-complete="on"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <img
            :src="codeUrl"
            class="captcha-code"
            @click="changeCode"
          >
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="12" align="left" style="margin-bottom:20px; margin-top:10px" />
      <el-col :span="12" align="right" style="margin-bottom:20px; margin-top:10px">
        <el-button
          style="height: 48px; width: 128px;"
          @click.native.prevent="handleReset"
        >重 置</el-button>
        <el-button
          :loading="loading"
          type="primary"
          style="height: 48px; width: 128px;"
          @click.native.prevent="handleRegister"
        >注 册</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import md5 from 'js-md5'
import { FullUrl, Request } from '@/api/standard'
import { validUsername } from '@/utils/validate'
import defaultSettings from '@/settings'
import logoSrc from '@/assets/logo.png'
import loginBg from '@/assets/login_bg.jpg'
const { title } = defaultSettings
export default {
  name: 'Register',
  components: { },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    provider: {
      type: String,
      default: null
    },
    openId: {
      type: String,
      default: null
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名！'))
      } else {
        Request('/auth/check-username?username=' + value).post({ }).then(res => {
          if (res.data.exists) {
            callback(new Error('用户名已经存在！'))
          } else {
            callback()
          }
        })
      }
    }
    const validatecaptcha = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (value.length > 0) {
        Request('/auth/check-email?email=' + value).post({ }).then(res => {
          if (res.data.exists) {
            callback(new Error('所用邮件地址已经注册！'))
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }
    const validateCellphone = (rule, value, callback) => {
      if (value.length > 0) {
        Request('/auth/check-cellphone?cellphone=' + value).post({ }).then(res => {
          if (res.data.exists) {
            callback(new Error('所用电话号码已经注册！'))
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }
    return {
      timeCode: new Date().getTime(),
      title: title,
      background: loginBg,
      registerForm: {
        username: '',
        password1: '',
        password2: '',
        phoneNumber: '',
        email: '',
        captcha: ''
      },
      registerRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password1: [
          { required: true, trigger: 'blur', validator: this.validatePassword }
        ],
        password2: [
          { required: true, trigger: 'blur', validator: this.validatePassword }
        ],
        captcha: [
          { required: true, trigger: 'blur', validator: validatecaptcha }
        ],
        phoneNumber: [
          { required: true, trigger: 'blur', validator: validateCellphone }
        ],
        email: [
          { required: true, trigger: 'blur', validator: validateEmail }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      logo: logoSrc
    }
  },
  computed: {
    codeUrl() {
      return FullUrl('/auth/captcha-image' + '?timestamp=' + this.timeCode)
    },
    qrCodeUrl() {
      return FullUrl('/auth/oauth2/wechat/code-img?size=256' + '&t=' + this.qrTimeCode)
    }
  },
  watch: {
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.registerForm.username === '') {
      this.$refs.username.focus()
    } else if (this.registerForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    closeDialog() {
      this.handleCancel()
    },
    handleClose(done) {
      done()
    },
    handleCancel() {
      this.handleReset()
      this.$emit('close', false)
    },
    validatePassword(rule, value, callback) {
      if (value.length < 4) {
        callback(new Error('密码不能少于4位数字！'))
      } else {
        if (this.registerForm.password1 && this.registerForm.password2) {
          if (this.registerForm.password1 !== this.registerForm.password2) {
            callback(new Error('两次密码输入不匹配'))
            return
          }
        }
        callback()
      }
    },
    changeCode() {
      this.timeCode = new Date().getTime()
    },
    changeQrTimeCode() {
      this.qrResult = null
      this.qrloading = false
      this.qrTimeCode = new Date().getTime()
      setTimeout(this.chechQrCodeStatus, 3000)
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd(n) {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        if (n === 1) {
          this.$refs.password1.focus()
        } else {
          this.$refs.password2.focus()
        }
      })
    },
    handleReset() {
      this.registerForm = {
        username: '',
        password1: '',
        password2: '',
        phoneNumber: '',
        email: '',
        captcha: ''
      }
      this.changeCode()
      this.loading = false
      this.$refs.registerForm.resetFields()
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            username: this.registerForm.username,
            password: md5(this.registerForm.password1),
            phoneNumber: this.registerForm.phoneNumber,
            email: this.registerForm.email
          }
          let url = '/auth/register?captcha=' + this.registerForm.captcha
          if (this.provider) {
            url = '/auth/oauth2/' + this.provider + '/register?captcha=' + this.registerForm.captcha
            if (this.openId) {
              params.openId = this.openId
            }
          }
          Request(url).post(params).then(res => {
            this.$message.success('注册成功')
            this.$emit('close', true)
            this.loading = false
          }).catch(e => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#5a788e;
$cursor: #fff;

.el-result {
  padding: 10px 10px;
}

/* reset element-ui css */
.register-form {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #070606;
      height: 47px;
      // caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        // -webkit-text-fill-color: $cursor !important;
      }
    }
    placeholder {
      color: #2c2a2a;
    }
  }
  .el-form-item {
    border: 1px solid rgba(17, 16, 16, 0.5);
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #1d1c1c;
    margin-top: 8px;
    margin-bottom: 24px;
  }
  .captcha-code {
    margin-top: 8px;
    margin-bottom: 24px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#4b6f9e;
$dark_gray:#3b4346;
$light_gray:#eee;
$light-blue: #514b4b;

  .register-form {
    position: relative;
    // width: 800px;
    // max-width: 100%;
    // height: 400px;
    // top: 100px;
    // height: 100%;
    padding: 0px 32px;
    margin: 0 auto;
    overflow: hidden;
    // background: $light_gray; //linear-gradient(135deg, transparent 20px, $light_gray 0) top left;
    // background-color: $bg;
    // box-shadow: 12px 12px 40px rgba(0, 0, 0, 1);
    // border-color: rgba(0, 0, 0, .05);
    .el-button {
      margin-bottom: 0 auto;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
</style>
