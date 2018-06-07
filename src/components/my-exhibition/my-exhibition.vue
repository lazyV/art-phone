<template>
  <div class="my-exhibition-wrapper">
    <m-header mTitle="我的画展"></m-header>
    <scroll class="scroll-wrapper" :data="superData" v-if="superData.length">
      <div class="my-exhibition">
        <div class="exhibition" v-for="(exhibition, index) in superData" :key="index">
          <div @click="toExhibition(exhibition.exhibition.exhibitionId,exhibition.exhibition.end)" class="theme">
            {{exhibition.exhibition.name}}
            <span>查看详情 <i class="el-icon-d-arrow-right"></i></span>
          </div>
          <div class="works">
            <div class="work" v-for="(work, workIndex) in exhibition.works" :key="workIndex">
              <div @click="showExhibitionWork(work.source)" class="image" width="100px">
                <img width="100px" v-lazy="base + work.source" alt="">
              </div>
              <span><i class="icon-stars"></i>{{work.score}}<i class="icon-stars"></i></span>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <no-more v-else text="您还未参加过任何画展喔！"></no-more>
    <el-dialog :visible.sync="showDialog" :modal-append-to-body="false" width="90%">
      <img :src="base + exhibitionWork" alt="" width="100%">
    </el-dialog>
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
      userInfo: localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')),
      base: config.base,
      superData: [],
      exhibitionWork: '',
      showDialog: false
    }
  },
  mounted () {
    this._myExhibition()
  },
  methods: {
    toExhibition (id, end) {
      let now = new Date()
      let past = false
      if (now - new Date(end) < 0) {
        past = false
      } else {
        past = true
      }
      this.$router.push(`exhibitionDetail?exhibitionId=${id}&past=${past}`)
    },
    showExhibitionWork (source) {
      this.exhibitionWork = source
      this.showDialog = true
    },
    _myExhibition () {
      axios.get(config.myExhibition, {
        params: {
          'userId': this.userInfo.id
        }
      }).then(res => {
        // console.log(res.data)
        if (res.data.code === 0) {
          let myExhibition = res.data.data
          myExhibition.forEach((item, index) => {
            let obj = {'exhibition': item, 'works': []}
            this._myExhibitionWork(item.exhibitionId).then(res => {
              if (res.data.code === 0) {
                obj.works = res.data.data
              }
            }).catch(err => {
              console.log(err)
            })
            this.superData.push(obj)
          })
          // console.log(this.superData)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    _myExhibitionWork (exhibitionId) {
      return axios.get(config.myExhibitionWork, {
        params: {
          userId: this.userInfo.id,
          current: 1,
          size: 100,
          exhibitionId: exhibitionId
        }
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
  .my-exhibition-wrapper
    position: fixed
    top: 0
    bottom: 0
    background-color : $color-background-white
    width: 100%
    z-index: 50
    .scroll-wrapper
      position: absolute
      top: 49px
      bottom: 0
      width: 100%
      overflow : hidden
      .my-exhibition
        padding: 10px
        .exhibition
          padding-bottom: 10px
          .theme
            padding: 5px
            color: $color-theme
            line-height: 35px
            span
              font-size: $font-size-small
              float:right
              line-height: 35px
              i
                font-size : $font-size-large
        .works
          display: flex
          flex-wrap: wrap
          justify-content : space-around
          .work
            position: relative
            border: 1px solid $color-border-gray
            margin-bottom: 15px
            span
              display : inline-block
              width: 100px
              line-height: 30px
              text-align: center
              position : absolute
              background-color : rgba(255,255,255,0.6)
              color: $color-text-gray
              bottom: 0
              font-size: $font-size-small
              i
                font-size : $font-size-large
                color: $color-theme-d
</style>
