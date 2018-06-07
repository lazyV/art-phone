<template>
  <div class="authorCenter-wrapper">
    <m-header mTitle="用户主页"></m-header>
    <div class="authorCenter-bg">
      <img src="./author-center.png" alt="">
      <div class="authorInfo">
        <div class="avatar">
          <img ref="avatar" @load="dealAvatar" :src="avatar" alt="">
        </div>
        <div class="info">
          <div class="center">
            <div>{{nickName}}</div>
            <attention ref="btn"  v-if="showBtn" :fromUserId="userInfo.id" :toUserId="userId"></attention>
          </div>
        </div>
      </div>
    </div>
    <scroll class="scroll-wrapper" v-if="workList.length" :data="workList">
      <div class="work-list">
        <div @click="toWorkDetail(item.id)" v-for="(item,index) in workList" :key="index" class="pic">
          <img ref="img" @load="dealImage(index)" :src="base + (item.thumb?item.thumb:item.source)" alt="">
        </div>
        <div style="clear: both"></div>
      </div>
    </scroll>
    <loading v-if="loading"></loading>
    <div v-if="!loading && !workList.length" class="nothing-wrapper">
      <p>(..•˘_˘•..)</p>
      <p>该用户尚未发布任何作品</p>
    </div>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Attention from 'components/attention/attention'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import axios from 'axios'
import {config} from 'api/config'
import avatarDefault from 'common/image/avatar-default.jpg'
import {addClass, removeClass, hasClass} from 'common/js/dom'
export default {
  name: '',
  data () {
    return {
      base: config.base,
      userInfo: localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')),
      mTitle: '',
      userId: '',
      avatar: '',
      nickName: '',
      showBtn: false,
      workList: [],
      loading: true
    }
  },
  watch: {
    '$route' (to, from) {
      this.$destroy()
    }
  },
  mounted () {
    let query = this.$route.query
    this.userId = Number(query.userId)
    this.avatar = (query.avatar && (config.base + query.avatar)) || avatarDefault
    this.nickName = query.nickName
    this._getWorkList(this.userId)
    // 判断是否显示 关注按钮
    if (this.userInfo && this.userId !== this.userInfo.id) {
      // do
      this.showBtn = true
      setTimeout(() => {
        this.$refs.btn.checkAttention()
      }, 20)
    }
  },
  methods: {
    dealImage (index) {
      let img = this.$refs.img[index]
      const width = img.width && img.width
      const height = img.height && img.height
      if (width > height) {
        hasClass(img, 'verticalCenter') && removeClass(img, 'verticalCenter')
        addClass(img, 'horizontalCenter')
      } else {
        hasClass(img, 'horizontalCenter') && removeClass(img, 'horizontalCenter')
        addClass(img, 'verticalCenter')
      }
    },
    dealAvatar () {
      let el = this.$refs.avatar
      const width = el.width
      const height = el.height
      if (width > height) {
        el.style.height = '100%'
      } else {
        el.style.width = '100%'
      }
    },
    toWorkDetail (workId) {
      this.$router.push(`/workDetail?workId=${workId}&authorId=${this.userId}`)
    },
    _getWorkList (userId) {
      axios.get(config.userWork, {
        params: {
          'userId': userId
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.code === 0) {
          this.workList = res.data.data
          this.loading = false
        } else {
          // 用户尚未发布任何作品
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  components: {
    MHeader,
    Attention,
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .authorCenter-wrapper
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    width: 100%
    z-index: 50
    background: $color-background-white
    .authorCenter-bg
      width: 100%
      height: 165px
      position : relative
      img
        width: 100%
      .authorInfo
        position : absolute
        top: 20px
        display : flex
        .avatar
          width: 80px
          height: 80px
          overflow : hidden
          border-radius : 60px
          border: 2px solid $color-background
          margin-left: 15px
        .info
          padding-left: 15px
          position: relative
          .center
            z-index: 20
            width: 160px
            position: absolute
            top: 50%
            transform : translateY(-50%)
            div
              margin: 10px 0
    .scroll-wrapper
      position: absolute
      top: 214px
      bottom: 0
      width: 100%
      overflow : hidden
      .work-list
        width: 320px
        margin: 0 auto
        .pic
          float: left
          width: 70px
          height: 70px
          background-color : $color-background
          position : relative
          border-radius: 8px
          overflow: hidden
          margin: 5px
          .verticalCenter
            width: 100%
            position: absolute
            top: 50%
            transform : translateY(-50%)
          .horizontalCenter
            height: 100%
            position: absolute
            left: 50%
            transform : translateX(-50%)
    .nothing-wrapper
      width: 100%
      line-height: 40px
      text-align : center
      bottom: 0
      height: 80px
      font-size: $font-size-medium
      color: $color-text-gray
</style>
