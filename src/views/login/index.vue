<template>
  <div
    :style="{backgroundImage:`url(${background})`}"
    class="login-container"
  >
    <div class="login-container-mask" />
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-card"
      auto-complete="on"
      label-position="left"
    >
      <el-row>
        <el-col :span="24">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="帐号登录" name="passwordTab">
              <div class="login-form">
                <div
                  class="title-container"
                  align="center"
                >
                  <h4 class="title"> 请登陆</h4>
                </div>
                <el-form-item prop="username">
                  <span class="svg-container">
                    <svg-icon icon-class="user" />
                  </span>
                  <el-input
                    ref="username"
                    v-model="loginForm.username"
                    placeholder="用户名"
                    name="username"
                    type="text"
                    auto-complete="on"
                  />
                </el-form-item>
                <el-form-item prop="password">
                  <span class="svg-container">
                    <svg-icon icon-class="password" />
                  </span>
                  <el-input
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="密码"
                    name="password"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin"
                  />
                  <span
                    class="show-pwd"
                    @click="showPwd"
                  >
                    <svg-icon icon-class="eye" />
                  </span>
                </el-form-item>
                <div class="capt">
                  <el-form-item
                    prop="captcha"
                    style="width:160px"
                  >
                    <span class="svg-container">
                      <svg-icon icon-class="captcha" />
                    </span>
                    <el-input
                      ref="captcha"
                      v-model="loginForm.captcha"
                      style="width:100px"
                      placeholder="验证码"
                      name="captcha"
                      auto-complete="on"
                      @keyup.enter.native="handleLogin"
                    />
                  </el-form-item>
                  <img
                    :src="codeUrl"
                    class="code"
                    style="height:50px;margin-top:24px"
                    @click="changeCode"
                  >
                </div>
                <el-row :gutter="30">
                  <el-col :span="10">
                    <el-button
                      style="width:100%;margin-bottom:20px;margin-top:20px"
                      @click="handleRegister(false)"
                    >注 册</el-button></el-col>
                  <el-col :span="14">
                    <el-button
                      :loading="loading"
                      type="primary"
                      style="width:100%;margin-bottom:20px;margin-top:20px"
                      @click.native.prevent="handleLogin"
                    >登 录</el-button>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="扫码登录" name="qrCodeTab">
              <div class="qr-code">
                <div v-loading="qrloading" style="width: 100%; height: 276px;" :style="{backgroundImage:`url(${qrCodeUrl})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}">
                  <el-card v-if="qrResult" class="box-card" style="width: 100%; height: 100%;">
                    <el-result :icon="qrResult.success?'success':'error'" :title="qrResult.message" :sub-title="qrResult.success?'请稍候...':'点击按钮重试'">
                      <template v-if="!qrResult.success" slot="extra">
                        <el-button type="primary" icon="el-icon-refresh-right" size="small" @click="changeQrTimeCode">重试</el-button>
                      </template>
                    </el-result>
                  </el-card>
                </div>
                <div class="qr-tips" align="center">
                  <span v-if="!qrResult" size="mini">
                    <small v-if="qrStatus == 0">请使用微信扫描二维码登录</small>
                    <small v-else-if="qrStatus >0 && qrStatus < 5">已扫码，请稍候</small>
                    <small v-else-if="qrStatus == 5">未注册或绑定用户，请
                      <el-button size="mini" @click="handleRegister(true)">注册</el-button>
                      或
                      <el-button size="mini" @click="attachVisible = true">绑定</el-button>
                    </small>
                    <br><br>
                    <el-button type="text" icon="el-icon-refresh-right" size="small" @click="changeQrTimeCode">刷新</el-button>
                  </span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-form>
    <attach-dialog :visible="attachVisible" @close="attachVisible = false" />
    <register-dialog :visible="registerVisible" :provider="provider" @close="registerVisible = false" />
    <footer>
      &copy; 2022
    </footer>
  </div>
</template>

<script>
import { FullUrl, Request } from '@/api/standard'
import { validUsername } from '@/utils/validate'
import defaultSettings from '@/settings'
import logoSrc from '@/assets/logo.png'
import loginBg from '@/assets/login_bg.jpg'
import AttachDialog from './attach.vue'
import RegisterDialog from './register.vue'
const { title } = defaultSettings
export default {
  name: 'Login',
  components: { AttachDialog, RegisterDialog },
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
      activeTab: 'qrCodeTab',
      loginForm: {
        username: '',
        password: '',
        captcha: ''
      },
      loginRules: {
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
      attachVisible: false,
      registerVisible: false,
      qrResult: null,
      provider: '',
      qrStatus: 0,
      qrTips: '请使用微信扫描二维码登录',
      qrTimeCode: new Date().getTime(),
      qrloading: false,
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
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    },
    activeTab: function(t) {
      console.log('activeTab:>', t)
      this.qrStatus = 0
      if (t === 'qrCodeTab') {
        setTimeout(this.chechQrCodeStatus, 3000)
      }
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    if (this.activeTab === 'qrCodeTab') {
      setTimeout(this.chechQrCodeStatus, 3000)
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
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
    handleRegister(n) {
      if (n) {
        this.provider = 'wechat'
      } else {
        this.provider = ''
      }
      this.registerVisible = true
    },
    chechQrCodeStatus() {
      Request('/auth/oauth2/wechat/auth-refresh').get().then(res => {
        const d = res.data
        console.log('Request status:>', d.status, d.session, d.userId, d.username)
        if (this.activeTab !== 'qrCodeTab') {
          this.qrloading = false
          this.qrResult = null
          this.qrStatus = 0
          return
        }
        this.qrStatus = d.status
        if (d.status < 0) {
          this.qrloading = false
          this.qrResult = {
            success: false,
            message: '失败！'
          }
          return
        }
        if (d.status > 0) {
          this.qrloading = true
          this.qrTips = '已扫码，请稍候'
        }
        if (d.status === 5) {
          this.qrTips = '未注册或绑定用户，请完成注册绑定'
        }
        if (d.status < 6) {
          setTimeout(this.chechQrCodeStatus, 1000)
        } else {
          // this.qrloading = false
          this.$store.dispatch('user/loginCheck')
            .then(() => {
              console.log('loginCheck:> done ...')
              this.qrResult = { success: true, message: '登录成功!' }
              setTimeout(() => {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              }, 2000)
              this.qrloading = false
            })
            .catch((e) => {
              console.log('loginCheck:> failed ...', e)
              this.qrResult = { success: false, message: e }
              this.qrloading = false
              // this.changeQrTimeCode()
            })
        }
      })
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
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
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
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>
<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#5a788e;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    // color: $cursor;
  }
}
.login-container-mask {
  background: $bg;
  opacity: 0.8;
  min-height: 100%;
  width: 100%;
  position: absolute;
}
.capt {
  display: flex;
  justify-content: space-between;
  margin-top: -20px;
}

.el-result {
  padding: 10px 10px;
}

.el-tabs__header {
  align-content: center;
  padding-top: 12px;
  margin-left: 24px;
  margin-right: 24px;
}

.el-tabs__nav-wrap:after {
  background-color: none;
}

.qr-code {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 20px;
}
.qr-tips {
  margin-top: 10px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
}
/* reset element-ui css */
.login-card {
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #1d1c1c;
  }
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
      color: #514b4b;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
    placeholder {
      color: #514b4b;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg:#4b6f9e;
$dark_gray:#3b4346;
$light_gray:#eee;
$light-blue: #514b4b;

footer {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 32px;
  width: 100%;
  color: #eee;
  font-size: 0.8em;
  text-align: center;
  line-height: 32px;
  text-shadow: 1px 1px 1px #2d3a4b;
}
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-card {
    position: relative;
    width: 400px;
    max-width: 100%;
    // height: 420px;
    top: 100px;
    margin: 0 auto;
    background: $light_gray; //linear-gradient(135deg, transparent 20px, $light_gray 0) top left;
    // background-color: $bg;
    box-shadow: 12px 12px 40px rgba(0, 0, 0, 1);
    border-color: rgba(0, 0, 0, 0.05);
  }
  .login-brand {
    position: relative;
    // width: 100%;
    height: 420px;
    background: $bg;
    text-align: center;
    vertical-align: middle;
    // margin: 0 auto;
    // padding: 0 auto;
    .logo {
      width: 188px;
      height: 188px;
      vertical-align: middle;
      margin-top: 40px;
      margin-left: 20px;
      margin-right: 10px;
    }

    .title {
      display: inline-block;
      margin-top: 20px;
      // margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 32px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
  .login-form {
    position: relative;
    // width: 800px;
    // max-width: 100%;
    // height: 400px;
    // top: 100px;
    // height: 100%;
    padding: 0px 25px;
    margin: 0 auto;
    overflow: hidden;
    background: $light_gray; //linear-gradient(135deg, transparent 20px, $light_gray 0) top left;
    // background-color: $bg;
    // box-shadow: 12px 12px 40px rgba(0, 0, 0, 1);
    // border-color: rgba(0, 0, 0, .05);
    .el-form-item {
      margin-top: 24px;
      margin-bottom: 24px;
    }
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

  .title-container {
    position: relative;

    .title {
      font-size: 20px;
      color: $dark_gray;
      // text-shadow: 1px 1px 1px #999;
      margin: 0px auto 30px auto;
      text-align: center;
      // font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
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
}
</style>
