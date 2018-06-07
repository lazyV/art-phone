<template>
  <div class="user-center">
    <div class="user-logout" v-if="!isUserLogin">
      <div class="info">
        <span @click="changeLogState">╮（╯＿╰）╭</span>
        <span>您尚未登录</span>
        <span>快去
        <router-link tag="a" to="/login">登录</router-link>
        /
        <router-link tag="a" to="/register">注册</router-link>
        吧！</span>
      </div>
    </div>
    <div class="user-detail" v-if="isUserLogin">
      <div class="bg">
        <div class="content">
          <div class="signIn">
            <span class="el-icon-date" style="color: #123"></span>
          </div>
          <div @click="toUserDetail" class="avatar">
            <img @load="dealSquareImg" ref="squareImg" v-if="avatar" v-lazy="avatar" @error="imgError(avatar)" alt="">
          </div>
          <div class="baseItem">
            <div class="item">
              <span class="icon icon-username" style="font-size:19px; color: #00dcbf"></span>
              <span class="text">{{userName}}</span>
            </div>
            <router-link tag="div" to="userDetail" class="item">
              <span class="icon icon-nickname" style="font-size:20px; color: #d42b88"></span>
              <span class="text">{{nickName}}</span>
            </router-link>
            <router-link tag="div" to="myWorks" class="item">
              <span class="icon icon-myworks" style="font-size:19px; color: #e03bdb"></span>
              <span class="text">我的作品</span>
            </router-link>
          </div>
        </div>
        <scroll>
          <div class="otherItem">
            <div @click="toMyExhibition" class="item">
              <span class="left icon-libra" style="font-size:19px; color: #00bbdc"></span>
              <div class="right">
                <span class="text">我的画展</span>
                <span class="icon el-icon-arrow-right"></span>
              </div>
            </div>
            <div @click="toMyCollection" class="item">
              <span class="left icon-collection" style="color: #ff695c"></span>
              <div class="right">
                <span class="text">我的收藏</span>
                <span class="icon el-icon-arrow-right"></span>
              </div>
            </div>
            <div @click="toMyAttention" class="item">
              <span class="left icon-focus" style="color: #ffb60c"></span>
              <div class="right">
                <span class="text">我的关注</span>
                <span class="icon el-icon-arrow-right"></span>
              </div>
            </div>
            <div class="item">
              <span class="left icon-question" style="color: #b670ff"></span>
              <div class="right">
                <span class="text">问题反馈</span>
                <span class="icon el-icon-arrow-right"></span>
              </div>
            </div>
            <div @click="changePwd" class="item">
              <span class="left icon-changepwd" style="color: #2be883"></span>
              <div class="right">
                <span class="text">修改密码</span>
                <span class="icon el-icon-arrow-right"></span>
              </div>
            </div>
            <div @click="logout" class="item">
              <span class="left icon-logout" style="font-size:19px;color: #9c9cad"></span>
              <div class="right last">
                <span class="text">退出登录</span>
              </div>
            </div>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import avatarDefault from 'common/image/avatar-default.jpg'
import {config} from 'api/config'
export default {
  name: '',
  data () {
    return {
      isUserLogin: false,
      userName: '',
      nickName: '',
      avatar: ''
    }
  },
  mounted () {
    // 获取用户登录状态
    if (localStorage.getItem('userInfo')) {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.isUserLogin = true
      this.userName = userInfo.userName
      this.nickName = userInfo.nickName
      this.avatar = userInfo.avatar && config.base + userInfo.avatar
      this.avatar = this.avatar || avatarDefault
    }
  },
  methods: {
    dealSquareImg () {
      let el = this.$refs.squareImg
      const width = el.width
      const height = el.height
      if (width > height) {
        el.style.height = '100%'
      } else {
        el.style.width = '100%'
      }
    },
    changeLogState () {
      this.isUserLogin = !this.isUserLogin
    },
    logout () {
      this.$confirm('即将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.setItem('userInfo', '')
        this.isUserLogin = false
        this.$router.push('/homepage')
        this.$destroy()
      }).catch(() => {
      })
    },
    changePwd () {
      this.$router.push('changePassword')
    },
    toUserDetail () {
      this.$router.push('userDetail')
      this.$destroy()
    },
    toMyExhibition () {
      this.$router.push('myExhibition')
    },
    imgError () {
      this.avatar = require('../../common/image/avatar-default.jpg')
    },
    toMyCollection () {
      this.$router.push('myCollections')
    },
    toMyAttention () {
      this.$router.push('myAttentions')
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .user-center
    position: absolute
    top: 0
    right: 0
    bottom: $bottom
    left: 0
    width: 100%
    .user-logout
      position: absolute
      top: 49px
      width: 100%
      bottom: 0
      background: $color-background
      .info
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        span
          display: block
          padding: 10px 0
          width: 100%
          text-align: center
    .user-detail
      position: absolute
      top: 0
      width: 100%
      bottom: 0
      .bg
        width: 100%
        height: 100%
        background-image: url('./user-center.png')
        background-repeat: no-repeat
        background-size: contain
        .content
          width: 100%
          height: 250px
          position:fixed
          top: 0
          border-bottom: 2px solid $color-theme-d
          .signIn
            position: absolute
            right: 30px
            top: 20px
            font-size: $font-size-large-x
          .avatar
            width: 100px
            height: 100px
            box-sizing: border-box
            border: 2px solid $color-theme
            border-radius: 50%
            overflow : hidden
            position: absolute
            left: 50%
            transform: translateX(-50%)
            top: 28%
        .baseItem
          position:absolute
          width: 100%
          bottom: 0
          display : flex
          justify-content : space-around
          .item
            text-align : center
            padding: 12px 0
            span
              display : block
            .icon
              font-size: $font-size-large-x
            .text
              padding: 8px 0
              color: $color-text-l
              font-size: $font-size-small
        .wrapper
          position: fixed
          width: 100%
          top: 250px
          bottom: 66px
          overflow: hidden
          .otherItem
            width: 100%
            position: relative
            .item
              display: flex
              align-items : center
              .left
                width: 14%
                text-align: center
                font-size: $font-size-large-x
              .right.last
                border-bottom : none
              .right
                width: 80%
                padding: 18px 0
                border-bottom : 1px solid $color-theme-d
                span
                  line-height : 21px
                  font-size : $font-size-medium
                .icon
                  float: right
                  font-size: $font-size-large
                  font-weight: bold
                  color: $color-theme
</style>
