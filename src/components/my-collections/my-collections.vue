<template>
  <div class="collection-wrapper">
    <m-header mTitle="我的收藏"></m-header>
    <scroll v-if="collectList.length" :data="collectList">
      <div class="scroll-wrapper">
        <div @click="toWorkDetail(item.workId, item.userId)" v-for="(item,index) in collectList" :key="index" class="collectItem">
          <i class="icon icon-gibbous-moon"></i>
          <div class="pic">
            <img v-lazy="base + (item.thumb ? item.thumb : item.source)" alt="">
          </div>
          <div class="text">
            {{item.content}}
          </div>
        </div>
        <div @click="findMoreWorks" v-if="collectList.length%2 ===1" class="collectItem">
          <div class="pic">
            <img v-lazy="avatarDefault" alt="">
          </div>
          <div class="text">
            <i class="el-icon-circle-plus-outline"></i> 关注更多...
          </div>
        </div>
      </div>
    </scroll>
    <no-more text="您尚未收藏任何作品" v-if="!collectList.length"></no-more>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import {config} from 'api/config'
import axios from 'axios'
import avatarDefault from 'common/image/avatar-default.jpg'
import Scroll from 'base/scroll/scroll'
import NoMore from 'components/no-more/no-more'
export default {
  name: '',
  data () {
    return {
      userInfo: localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')),
      base: config.base,
      collectList: [],
      avatarDefault: avatarDefault
    }
  },
  beforeMount () {
    if (!localStorage.getItem('userInfo')) {
      this.$router.push('login')
    }
  },
  mounted () {
    // 做意外情况的优化（如：突然清空了localStorage）
    if (!localStorage.getItem('userInfo')) {
      return
    }
    this._getCollectionList()
  },
  methods: {
    toWorkDetail (workId, authorId) {
      this.$router.push(`workDetail?workId=${workId}&authorId=${authorId}`)
    },
    findMoreWorks () {
      this.$router.push('study/allWorks')
    },
    _getCollectionList () {
      axios.get(config.myCollect, {
        params: {
          'userId': this.userInfo.id
        }
      }).then((res) => {
        if (res.data.code === 0) {
          // console.log(res.data.data)
          this.collectList = res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  components: {
    MHeader,
    Scroll,
    NoMore
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .collection-wrapper
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index : 50
    background-color : $color-background-white
    .wrapper
      position : absolute
      top: 49px
      bottom: 0
      width: 100%
      overflow: hidden
      .scroll-wrapper
        display: flex
        width: 100%
        justify-content : space-around
        flex-wrap : wrap
        .collectItem
          width: 45%
          margin-top: 10px
          padding-top: 5px
          border: 1px solid $color-theme-d
          border-radius: 5px
          position: relative
          .icon
            font-size: $font-size-large
            color: $color-sub-theme
            position: absolute
            border-radius: 5px
            top: 12px
            left: 12px
            z-index: 20
          .pic
            width: 140px
            height: 140px
            padding: 5px
            margin: 0 auto
            border: 1px solid $color-border-gray
            border-radius: 5px
            overflow : hidden
            position: relative
            img
              width: 100%
              line-height: 140px
              margin-top: 50%
              transform: translateY(-50%)
          .text
            padding:0 10px
            font-size : $font-size-medium
            color: $color-text-gray
            line-height: 26px
            no-wrap()
</style>
