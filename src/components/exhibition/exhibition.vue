<template>
  <div class="exhibition-wrapper">
    <m-header mTitle="主题画展"></m-header>
    <scroll v-if="data.length" ref="scroll" class="scroll-wrapper" :data="data">
      <div class="exhibitions">
        <table></table>
        <div class="title">正在进行</div>
        <div class="now exhibitionList">
          <div @click="toExhibitionDetail(item.id, item.past)" v-for="(item, index) in nowExhibitionList" :key="index" class="listItem">
            <div class="name">{{item.name}}</div>
            <div class="thumb">
              <img @load="refreshScroll" v-lazy="base + item.poster" alt="">
            </div>
            <div class="time">
              {{item.start}}  -  {{item.end}}
            </div>
          </div>
        </div>
        <div class="title">往期一览</div>
        <div class="past exhibitionList">
          <div @click="toExhibitionDetail(item.id, item.past)" v-for="(item, index) in pastExhibitionList" :key="index" class="listItem">
            <div class="name">{{item.name}}</div>
            <div class="thumb">
              <img @load="refreshScroll" v-lazy="base + item.poster" alt="">
            </div>
            <div class="time">
              {{item.start}}  -  {{item.end}}
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <loading v-else></loading>
  </div>
</template>

<script>
import axios from 'axios'
import {config} from 'api/config'
import MHeader from 'components/m-header/m-header'
import NoMore from 'components/no-more/no-more'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
export default {
  name: '',
  data () {
    return {
      base: config.base,
      nowExhibitionList: [],
      pastExhibitionList: [],
      data: []
    }
  },
  mounted () {
    // 获取画展列表
    this._initExhibitionList()
  },
  methods: {
    // 一些方法
    refreshScroll () {
      this.$refs.scroll.refresh()
    },
    toExhibitionDetail (exhibitionId, past) {
      this.$router.push(`exhibitionDetail?exhibitionId=${exhibitionId}&past=${past}`)
    },
    _initExhibitionList () {
      axios.get(config.exhibitionList, {
        params: {
          current: 1,
          size: 20
        }
      })
        .then(res => {
          // console.log(res.data)
          if (res.data.code === 0) {
            this.nowExhibitionList = res.data.list.now
            this.pastExhibitionList = res.data.list.past
            this.data = this.nowExhibitionList.concat(this.pastExhibitionList)
          }
        }).catch(err => {
          console.log(err)
        })
    }
  },
  components: {
    MHeader,
    Loading,
    Scroll,
    NoMore
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .exhibition-wrapper
    position: fixed
    top: 0
    bottom: 0
    background-color : $color-background-white
    width: 100%
    z-index: 50
    .scroll-wrapper
      position : absolute
      width: 100%
      top: 49px
      bottom: 0px
      overflow : hidden
      .exhibitions
        position: relative
        .title
          width: 130px
          height: 30px
          line-height: 30px
          font-size: $font-size-medium
          font-weight : bold
          color: $color-text-white
          background-image: url("./title-bg.png")
          background-size : contain
          background-repeat : no-repeat
          left: 0
          margin-top: 15px
          padding-left: 15px
        .exhibitionList
          min-height: 50px
          display : flex
          flex-wrap : wrap
          justify-content : space-around
          .listItem
            margin-top: 15px
            position: relative
            border: 1px solid $color-theme
            box-sizing: border-box
            border-radius: 15px
            width: 45%
            background-color : $color-background-white
            overflow: hidden
            .name
              padding: 8px 15px 5px
              text-align: center
            .thumb
              img
                width: 100%
            .time
              position : absolute
              width: 100%
              padding: 13px 0
              bottom: 0
              background-color : rgba(255, 255, 255, 0.6)
              font-size: $font-size-small
              text-align: center
</style>
