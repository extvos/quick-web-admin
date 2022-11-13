<template>
  <el-dialog
    title="绑定用户"
    :visible="visible"
    :before-close="handleClose"
    width="520px"
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
        <el-col :span="24">
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
        <el-col :span="24">
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              ref="password"
              v-model="registerForm.password"
              :type="passwordType"
              placeholder="输入密码"
              name="password"
              auto-complete="on"
            />
            <span
              class="show-pwd"
              @click="showPwd"
            >
              <svg-icon icon-class="eye" />
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="14">
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
        <el-col :span="10">
          <img
            :src="codeUrl"
            class="captcha-code"
            @click="changeCode"
          >
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24" align="center" style="margin-bottom:20px; margin-top:10px">
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%; height: 48px;"
            @click.native.prevent="handleLogin"
          >绑 定</el-button>
        </el-col>
      </el-row>
    </el-form>

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
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('密码不能少于4位数字！'))
      } else {
        callback()
      }
    }
    const validatecaptcha = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入验证码'))
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
        password: '',
        captcha: ''
      },
      registerRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        captcha: [
          { required: true, trigger: 'blur', validator: validatecaptcha }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      logo: logoSrc,
      otherQuery: {}
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
    // if (this.registerForm.username === '') {
    //   this.$refs.username.focus()
    // } else if (this.registerForm.password === '') {
    //   this.$refs.password.focus()
    // }
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
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleReset() {
      this.registerForm = {
        username: '',
        password: '',
        captcha: ''
      }
      this.changeCode()
      this.loading = false
      this.$refs.registerForm.resetFields()
    },
    handleLogin() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            username: this.registerForm.username,
            password: md5(this.registerForm.password)
          }
          const url = '/auth/oauth2/' + this.provider + '/login?captcha=' + this.registerForm.captcha
          Request(url).post(params).then(res => {
            this.$message.success('登录绑定成功')
            this.$emit('close', true)
            this.loading = false
          }).catch(e => {
            this.loading = false
            this.changeCode()
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
