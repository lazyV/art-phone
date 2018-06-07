<template>
  <div class="register">
    <m-header mTitle="欢迎注册"></m-header>
    <div class="registerInfo">
      <div class="info">
        <span class="icon icon-username" style="font-size: 19px"></span>
        <div class="item">
          <input ref="uNameInput" @blur="uBlur" v-model="username" id="username" type="text" autofocus @focus="uFocus">
          <label for="username" class="text" ref="UText"> 请输入用户名</label>
        </div>
      </div>
      <div class="info">
        <span class="icon icon-password"></span>
        <div class="item">
          <input ref="pwdInput" @blur="pBlur" id="password" :type="pwdType" @focus="pFocus">
          <label for="password" class="text" ref="PText"> 请输入密码（6-12位）</label>
          <span ref="iconEye" @click="changeInputType" class="eye-hidden icon-eye-hidden"></span>
        </div>
      </div>
      <div class="info">
        <span class="icon icon-password"></span>
        <div class="item">
          <input ref="rePwdInput" type="password" @blur="rBlur" id="rePassword" @focus="rFocus">
          <label for="rePassword" class="text" ref="RText"> 请确认密码</label>
        </div>
      </div>
      <div @click="register" class="button">注册</div>
      <div class="others">
        <span>已有账号</span>
        <router-link tag="a" to="/login">去登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import {addClass, removeClass, hasClass} from 'common/js/dom'
import {config} from 'api/config'
import {cipher} from 'common/js/secret'
import axios from 'axios'
export default {
  name: '',
  data () {
    return {
      pwdType: 'password',
      username: '',
      password: '',
      rePassword: '',
      userPwdPass: false
    }
  },
  mounted () {
  },
  methods: {
    uFocus () {
      this.username === '' && addClass(this.$refs.UText, 'active')
    },
    pFocus () {
      this.password === '' && addClass(this.$refs.PText, 'active')
    },
    rFocus () {
      this.rePassword === '' && addClass(this.$refs.RText, 'active')
    },
    changeInputType () {
      let type = this.$refs.pwdInput.type
      type === 'text' ? this.pwdType = 'password' : this.pwdType = 'text'
      let el = this.$refs.iconEye
      if (hasClass(el, 'icon-eye')) {
        removeClass(el, 'icon-eye')
        addClass(el, 'icon-eye-hidden')
      } else {
        addClass(el, 'icon-eye')
        removeClass(el, 'icon-eye-hidden')
      }
    },
    uBlur () {
      this.username = this.$refs.uNameInput.value
      if (this.username.trim() === '') {
        this.$refs.uNameInput.value = ''
        removeClass(this.$refs.UText, 'active')
      }
    },
    pBlur () {
      this.password = this.$refs.pwdInput.value
      if (this.password.trim() === '') {
        this.$refs.pwdInput.value = ''
        removeClass(this.$refs.PText, 'active')
      }
    },
    rBlur () {
      this.rePassword = this.$refs.rePwdInput.value
      if (this.password.trim() === '') {
        this.$refs.rePwdInput.value = ''
        removeClass(this.$refs.RText, 'active')
      }
    },
    register () {
      let reg = /^[[0-9a-zA-Z_]{6,12}$/ig
      if (this.username !== '' && this.password !== '') {
        this.userPwdPass = this._checkStr(this.password, reg)
      }
      if (this.userPwdPass) {
        axios.post(config.registerUrl, {
          userName: this.username,
          password: cipher('aes192', '123', this.password)
        }).then((res) => {
          this.$alert(res.data.msg, '提示', {
            confirmButtonText: '确定'
          })
          if (res.data.code === 0) {
            this.$alert(`${res.data.msg},即将跳转到登陆页面`, '提示', {
              confirmButtonText: '确定'
            })
            this.$router.push('/login')
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    _checkStr (str, reg) {
      if (str.indexOf(' ') !== -1) {
        this.$alert('密码中不能包含空格！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      if (reg.test(str)) {
        if (this.rePassword !== this.password) {
          this.$alert('两次输入的密码不一致', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        if (this._isSimplePwd(str) < 2) {
          this.$alert('输入的密码过于简单！tip:至少包含数字字母下划线中的两种！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        return true
      } else {
        this.$alert('密码格式不正确', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
    },
    _isSimplePwd (str) {
      if (str.length < 6) {
        return 0
      }
      let ls = 0
      if (str.match(/([a-z])+/)) {
        ls++
      }
      if (str.match(/([0-9])+/)) {
        ls++
      }
      if (str.match(/([A-Z])+/)) {
        ls++
      }
      if (str.match(/[^a-zA-Z0-9]+/)) {
        ls++
      }
      return ls
    }
  },
  components: {
    MHeader
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .register
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 10
    background : $color-background-white
    .registerInfo
      position: absolute
      top: 20%
      width: 100%
      overflow : hidden
      .info
        padding:15px 25px
        width: 100%
        box-sizing : border-box
        display : flex
        .icon
          font-size : $font-size-large-x
          line-height: 38px
          color: $color-theme-d
          padding:10px 10px 0 0
        .item
          position: relative
          width: 85%
          border-bottom:1px solid $color-theme-d
          .text
            display: block
            position: absolute
            top: 23px
            font-size: $font-size-medium
            transition : all 0.2s linear
            color: $color-text-ll
          .text.active
            top: 0px
            font-size: $font-size-small
            color: $color-text-l
          input
            margin-top: 18px
            height: 25px
            background : transparent
            outline: none
          .eye-hidden
            font-size: 20px
            color: $color-text-ll
            position: absolute
            right: 30px
            top: 20px
      .button
        width: 80%
        line-height: 38px
        -webkit-border-radius: 38px
        -moz-border-radius: 38px
        border-radius: 38px
        background :$color-theme-d
        text-align: center
        margin: 25px auto
      .others
        width: 80%
        text-align: center
        margin: 40px auto
        span
          color: $color-text-ll
</style>
