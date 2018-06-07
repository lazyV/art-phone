<template>
  <div class="my-works">
    <m-header mTitle="我的作品"></m-header>
    <div class="bg">
      <div class="content">
        <div class="avatar">
          <img @load="dealSquareImg" ref="squareImg" :src="avatar" alt="">
        </div>
        <div class="userInfo">
          <div class="nickname">{{userInfo.nickName}}</div>
          <div class="autograph">{{userInfo.signature}}</div>
        </div>
      </div>
    </div>
    <scroll v-if="myWorks.length"  :data="myWorks">
      <div class="works">
        <div v-for="(item, index) in myWorks" :key="index" class="dailyWork">
          <div class="date">
            <span class="day">{{item.date.split('.')[1]}}</span>
            <span class="month">/{{item.date.split('.')[2]}}</span>
          </div>
          <div class="workList">
            <div @click="toWorkDetail(work.id)" v-for="(work, index) in item.works" :key="index" class="work">
            <span class="pic">
              <img v-lazy="base + (work.thumb ?  work.thumb : work.source)" alt="">
            </span>
              <span class="text">
              {{work.content}}
            </span>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <div v-else class="nothing-wrapper">
      <p>(..•˘_˘•..)</p>
      <p>您尚未发布任何作品</p>
    </div>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Scroll from 'base/scroll/scroll'
import avatarDefault from 'common/image/avatar-default.jpg'
import axios from 'axios'
import {config} from 'api/config'

export default {
  name: '',
  data () {
    return {
      base: config.base,
      userInfo: localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')),
      avatar: '',
      avatarPath: '',
      myWorks: []
    }
  },
  watch: {
    '$route' (to, from) {
      this.$destroy()
    }
  },
  mounted () {
    this.avatar = (this.userInfo.avatar && (config.base + this.userInfo.avatar)) || avatarDefault
    this._getAllMyWorks()
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
    loadDetail (id) {
      this.$router.push(id)
    },
    toWorkDetail (workId) {
      this.$router.push(`workDetail?workId=${workId}&authorId=${this.userInfo.id}`)
    },
    _getAllMyWorks () {
      axios.get(config.myWork, {
        params: {
          'userId': this.userInfo.id
        }
      }).then((res) => {
        if (res.data.code === 0) {
          // 处理数据
          let works = res.data.data
          let date = []
          for (let work of works) {
            let year = new Date(work.createdAt).getFullYear()
            let month = new Date(work.createdAt).getMonth() + 1
            let day = new Date(work.createdAt).getDate()
            let initDate = year + '.' + month + '.' + day
            work.createdAt = initDate
            date.indexOf(initDate) === -1 && date.push(year + '.' + month + '.' + day)
          }
          for (let i of date) {
            let dailyWork = []
            for (let work of works) {
              if (work.createdAt === i) {
                dailyWork.push(work)
              }
            }
            this.myWorks.push({'date': i, 'works': dailyWork})
          }
          // console.log(this.myWorks)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  components: {
    MHeader,
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .my-works
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    width: 100%
    z-index: 50
    background: $color-background-white
    .bg
      width: 100%
      height: 171px
      position:relative
      background-image: url('./my-works.png')
      background-repeat: no-repeat
      background-size: contain
      .content
        padding-top: 10%
        display: flex
        align-items : center
        justify-content: space-around
        .avatar
          width: 80px
          height: 80px
          border-radius: 50%
          overflow : hidden
          margin-left: 15px
        .userInfo
          width: 68%
          margin-top: 10px
          .nickname
            font-size : $font-size-large
          .autograph
            no-wrap()
            font-size : $font-size-medium
            color: $color-text-gray
            line-height : 28px
    .wrapper
      position: absolute
      width: 100%
      bottom: 0
      top: 220px
      overflow: hidden
      .works
        display: flex
        align-items : top
        width: 100%
        justify-content : space-around
        flex-wrap : wrap
        .dailyWork
          display: flex
          flex-wrap : wrap
          width: 90%
          .date
            width: 12%
            .day
              font-size : $font-size-medium
            .month
              font-size : $font-size-small
              color: $color-text-gray
          .workList
            width: 80%
            font-size : $font-size-medium
            .work
              height: auto
              padding: 10px 0
              border-bottom:1px solid $color-theme-d
              display : flex
              align-items : center
              justify-content : space-between
              .pic
                display : inline-block
                width: 60px
                height: 60px
                border-radius: 10px
                overflow : hidden
                text-align: center
                background : $color-background
                img
                  height: 100%
              .text
                width: 75%
                line-height: 30px
                no-wrap()
    .nothing-wrapper
      width: 100%
      line-height: 40px
      text-align : center
      bottom: 0
      height: 80px
      font-size: $font-size-medium
      color: $color-text-gray
</style>
