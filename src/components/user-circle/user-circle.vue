<template>
  <div class="relationWork-wrapper">
    <scroll v-if="workList.length" ref="scroll" :refreshDelay="20" :pulldown="true" @pulldown="pulldown" :data="workList" class="scroll-wrapper">
      <div class="workList">
        <div v-if="pull" ref="loading" class="loading" style="text-align: center">
          <i class="el-icon-loading"></i>
        </div>
        <div class="listItem" v-for="(item, index) in workList" :key="index">
          <div class="userInfo">
            <div class="avatar">
              <img ref="img" @load="dealImage(index)" v-lazy="item.avatar && base + item.avatar" alt="">
            </div>
            <div class="nickName">{{item.nickName}}</div>
            <!--<div class="time">{{item.createdAt}}</div>-->
            <div class="time">{{dateDiff(item.createdAt)}}</div>
          </div>
          <div class="work-content">
            <p class="text">{{item.content}}</p>
            <div class="work">
              <img @load="refreshScroll" v-lazy="base + (item.thumb ? item.thumb:item.source)" alt="">
            </div>
          </div>
          <div class="workInfo">
          <span class="content">
            <i class="icon-like"></i>
            <span>{{item.likes}}</span>
          </span>
            <span class="content">
            <i class="icon-collection"></i>
            <span>{{item.collect}}</span>
          </span>
          </div>
        </div>
      </div>
    </scroll>
    <no-more v-else :text="text" icon="icon-face-missing-moth"></no-more>
  </div>
</template>

<script>
import {config} from 'api/config'
import axios from 'axios'
import Scroll from 'base/scroll/scroll'
import NoMore from 'components/no-more/no-more'

export default {
  name: '',
  data () {
    return {
      base: config.base,
      text: '您尚未关注其他用户', // 用户未登录以及登录的用户为关注任何其他用户时的提示文字
      workList: [], // 获取的作品列表
      showNomore: false,
      pull: false,
      userInfo: localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo'))
    }
  },
  mounted () {
    if (this.userInfo) {
      this._getRelationWork()
    } else {
      this.text = '您尚未登录'
    }
  },
  watch: {
    '$route' (from, to) {
      this.$destroy()
    }
  },
  methods: {
    dateDiff (time) {
      let timestamp = new Date(time).getTime()
      var minute = 1000 * 60
      var hour = minute * 60
      var day = hour * 24
      var month = day * 30
      var now = new Date().getTime()
      var diffValue = now - timestamp
      // 如果本地时间反而小于变量时间
      if (diffValue < 0) {
        return '不久前'
      }
      // 计算差异时间的量级
      var monthC = diffValue / month
      var weekC = diffValue / (7 * day)
      var dayC = diffValue / day
      var hourC = diffValue / hour
      var minC = diffValue / minute
      // 数值补0方法
      var zero = function (value) {
        if (value < 10) {
          return '0' + value
        }
        return value
      }
      // 使用
      if (monthC > 12) {
        // 超过1年，直接显示年月日
        return (function () {
          var date = new Date(timestamp)
          return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日'
        })()
      } else if (monthC >= 1) {
        return parseInt(monthC) + '月前'
      } else if (weekC >= 1) {
        return parseInt(weekC) + '周前'
      } else if (dayC >= 1) {
        return parseInt(dayC) + '天前'
      } else if (hourC >= 1) {
        return parseInt(hourC) + '小时前'
      } else if (minC >= 1) {
        return parseInt(minC) + '分钟前'
      }
      return '刚刚'
    },
    dealImage (index) {
      let img = this.$refs.img[index]
      const width = img.width
      const height = img.height
      if (width > height) {
        img.style.height = '100%'
      } else {
        img.style.width = '100%'
      }
    },
    pulldown () {
      this.pull = true
      this._getRelationWork()
    },
    refreshScroll () {
      this.$refs.scroll.refresh()
    },
    _getRelationWork () {
      return axios.get(config.relationWork, {
        params: {
          userId: this.userInfo.id
        }
      }).then(res => {
        // console.log(res.data.lists[0])
        if (res.data.code === 0) {
          this.workList = res.data.lists
          setTimeout(() => {
            this.pull = false
          }, 500)
          if (res.data.lists.length === 0) {
            this.showNomore = true
          }
        }
      }).catch((err) => {
        console.log(err)
        this.$alert('网络错误请刷新试试！', '提示')
      })
    }
  },
  components: {
    Scroll,
    NoMore
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .relationWork-wrapper
    position: fixed
    top: 79px
    bottom: $bottom
    width: 100%
    z-index: 50
    .scroll-wrapper
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      overflow: hidden
      .workList
        position: relative
        rtansition: all .2s linear
        .listItem
          margin: 0 0 15px
          width: 100%
          border-bottom: 1px solid $color-theme-d
          .userInfo
            display: flex
            justify-content: space-between
            flex-wrap: nowrap
            padding: 3px 15px
            font-size : $font-size-medium
            border-bottom: 1px solid $color-border-gray
            .avatar
              width: 40px
              height: 40px
              box-sizing: border-box
              border-radius: 40px
              overflow: hidden
              border: 1px solid $color-theme
              img
                width: 100%
            .nickName
              line-height: 40px
            .time
              line-height: 40px
          .work-content
            margin: 0px 15px 0
            .text
              padding: 8px 10px
            .work
              border-radius: 10px
              overflow: hidden
              img
                width: 100%
          .workInfo
            position: relative
            text-align: right
            padding: 8px 15px
            .content
              margin: 0 5px
              i
                font-size : $font-size-large
              span
                color: $color-text-gray
</style>
