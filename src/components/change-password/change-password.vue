<template>
  <div class="changePwd">
    <m-header mTitle="修改密码"></m-header>
    <div class="wrapper">
      <span>用户名</span>
      <div>{{userInfo.userName}}</div>
      <span><label for="oldPassword">旧密码</label></span>
      <div>
        <input id="oldPassword" v-model="oldPassword" autofocus type="password" placeholder="输入您的的密码">
      </div>
      <span><label for="password">新密码</label></span>
      <div>
        <input id="password" v-model="password" type="password" placeholder="请输入新密码">
      </div>
      <span><label for="rePassword">确认新密码</label></span>
      <div>
        <input id="rePassword" v-model="rePassword" type="password" placeholder="请确认新密码">
      </div>
      <button @click="submit">提交</button>
    </div>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import {config} from 'api/config'
import {cipher} from 'common/js/secret'
import axios from 'axios'

export default {
  name: '',
  data () {
    return {
      userInfo: localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')),
      oldPassword: '',
      password: '',
      rePassword: '',
      userPwdPass: false
    }
  },
  methods: {
    submit () {
      let reg = /^[[0-9a-zA-Z_]{6,12}$/ig
      if (this.password !== '') {
        this.userPwdPass = this._checkStr(this.password, reg)
      }
      if (this.userPwdPass) {
        let userInfo = JSON.parse(localStorage.getItem('userInfo'))
        axios.post(config.changePasswordUrl, {
          userId: userInfo.id,
          oldPwd: cipher('aes192', '123', this.oldPassword),
          newPwd: cipher('aes192', '123', this.password)
        }).then((res) => {
          if (res.data.code === 0) {
            this.$alert(`${res.data.msg},即将跳转到登陆页面`, '提示', {
              confirmButtonText: '确定'
            })
            this.$router.push('/login')
            this.$destroy()
          } else {
            this.$alert(res.data.msg, '提示', {
              confirmButtonText: '确定'
            })
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
          this.$alert('输入的新密码过于简单！（至少包含数字字母下划线中的两种）', '提示', {
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
  .changePwd
    position: fixed
    top: 0
    width: 100%
    bottom: 0
    z-index: 50
    background : $color-background
    .wrapper
      width: 85%
      overflow : hidden
      margin: 60px auto
      color: $color-text-ll
      span
        color: $color-theme
        display: inline-block
        width:100%
        padding: 5px 0
      div
        border-bottom:1px solid $color-theme-d
        padding-bottom: 10px
        margin: 10px
        input
          width: 100%
          background :transparent
          outline: none
      button
        display: block
        width: 90%
        height: 35px
        margin: 25px auto
        outline: none
        background-color: $color-theme-d
        border: 1px solid $color-theme
        border-radius: 35px
</style>
