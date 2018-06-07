<template>
 <div class="login">
   <m-header mTitle="欢迎登录"></m-header>
   <div class="loginInfo">
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
         <span ref="iconEye" @click="changeInputType" class="eye-hidden icon-hidden"></span>
       </div>
     </div>
     <div @click="login" class="button">登录</div>
     <div class="others">
       <router-link tag="span" to="/register">快速注册</router-link>
       <span>|</span>
       <router-link tag="span" to="/homepage">随便转转</router-link>
     </div>
   </div>
 </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import {addClass, removeClass, hasClass} from 'common/js/dom'
import {cipher} from 'common/js/secret'
import {config} from 'api/config'
import axios from 'axios'
export default {
  name: '',
  data () {
    return {
      pwdType: 'password',
      username: '',
      password: ''
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    uFocus () {
      this.username === '' && addClass(this.$refs.UText, 'active')
    },
    pFocus () {
      this.password === '' && addClass(this.$refs.PText, 'active')
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
    changeInputType () {
      let type = this.$refs.pwdInput.type
      type === 'text' ? this.pwdType = 'password' : this.pwdType = 'text'
      let el = this.$refs.iconEye
      if (hasClass(el, 'icon-visible')) {
        removeClass(el, 'icon-visible')
        addClass(el, 'icon-hidden')
      } else {
        addClass(el, 'icon-visible')
        removeClass(el, 'icon-hidden')
      }
    },
    login () {
      if (this.username.trim().length === 0) {
        this.$alert('用户名不能为空，也不能为空字符！', '提示', {
          confirmButtonText: '确定'
        })
      } else if (this.password.trim().length === 0) {
        this.$alert('密码不能为空！', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        axios.post(config.loginUrl, {
          userName: this.username,
          password: cipher('aes192', '123', this.password)
        }).then((res) => {
          // console.log(res)
          this.$confirm(res.data.msg, '提示', {
            confirmButtonText: '确定'
          }).then(() => {
            if (res.data.code === 0) {
              localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
              this.$router.push('/homepage')
            }
          })
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  },
  components: {
    MHeader
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .login
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 10
    background : $color-background-white
    .loginInfo
      position: absolute
      top: 20%
      width: 100%
      overflow : hidden
      .info
        padding:18px 25px
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
          padding-right: 15%
</style>
