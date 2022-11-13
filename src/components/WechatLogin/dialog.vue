<template>
  <el-dialog
    :title="title"
    :visible="visible"
    :before-close="handleClose"
    width="480px"
    :close-on-click-modal="false"
    append-to-body
    @close="closeDialog"
  >
    <div class="qr-code">
      <div v-loading="qrloading" style="width: 100%; height: 276px;" :style="{backgroundImage:`url(${qrCodeUrl})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}">
        <el-card v-if="qrResult" class="box-card" style="width: 100%; height: 100%;">
          <el-result :icon="qrResult.success?'success':'error'" :title="qrResult.message" :sub-title="qrResult.success?'':'点击按钮重试'">
            <template slot="extra">
              <el-button v-if="!qrResult.success" type="primary" icon="el-icon-refresh-right" size="small" @click="changeQrTimeCode">重试</el-button>
              <el-button v-else type="primary" size="small" @click="closeDialog">关闭</el-button>
            </template>
          </el-result>
        </el-card>
      </div>
      <div class="qr-tips" align="center">
        <span v-if="!qrResult" size="mini">
          <small v-if="qrStatus == 0">请使用微信扫描二维码登录</small>
          <small v-else-if="qrStatus >0 && qrStatus < 5">已扫码，请稍候</small>
          <small v-else-if="qrStatus == 5">未注册或绑定用户</small>
          <br><br>
          <el-button type="text" icon="el-icon-refresh-right" size="small" @click="changeQrTimeCode">刷新</el-button>
        </span>
      </div>
    </div>

  </el-dialog>
</template>

<script>
import { FullUrl, Request } from '@/api/standard'
export default {
  name: 'Register',
  components: { },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    autoClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      qrResult: null,
      provider: '',
      qrStatus: 0,
      qrTips: '请使用微信扫描二维码登录',
      qrTimeCode: new Date().getTime(),
      qrloading: false
    }
  },
  computed: {
    qrCodeUrl() {
      return FullUrl('/auth/oauth2/wechat/code-img?size=256' + '&t=' + this.qrTimeCode)
    }
  },
  watch: {
    visible(v1, v2) {
      console.log('visible:> ', v1, v2)
      if (v1) {
        setTimeout(this.chechQrCodeStatus, 3000)
      }
    }
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
    chechQrCodeStatus() {
      Request('/auth/oauth2/wechat/auth-refresh').get().then(res => {
        const d = res.data
        console.log('Request status:>', d.status, d.session, d.userId, d.username)
        if (!this.visible) {
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
          if (this.autoClose) {
            this.$notify({
              title: '成功',
              message: '绑定微信登录成功!',
              type: 'success'
            })
            this.closeDialog()
          } else {
            this.qrResult = { success: true, message: '绑定微信登录成功!' }
          }
          this.qrloading = false
        }
      })
    },
    handleReset() {
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

