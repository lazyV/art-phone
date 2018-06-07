<template>
  <div class="content">
    <scroll
      v-if="sliderData.concat(workNewList,likesList,courseList).length"
      class="scroll-wrapper"
      :data="sliderData.concat(workNewList,likesList,courseList)"
      :pulldown="true"
      @pulldown="pulldown"
    >
      <div>
        <loading v-if="!sliderData.length"></loading>
        <div v-if="sliderData.length" class="slider-wrapper">
          <slider>
            <div v-for="(item, index) in sliderData" :key="index">
              <a :href="item.href" :title="item.title">
                <img :src="item.url" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="otherItem">
          <div @click="toExhibition" class="item">
            <span class="icon icon-myworks" style="color: #00bbdc"></span>
            <span class="text">主题画展</span>
          </div>
          <div @click="toCourse" class="item">
            <span class="icon icon-course" style="color: #e47836"></span>
            <span class="text">教程中心</span>
          </div>
          <div class="item">
            <span class="icon icon-paint" style="color: #08ce03"></span>
            <span class="text">绘画用品</span>
          </div>
          <div class="item">
            <span class="icon icon-nickname" style="color: #1a4dc1"></span>
            <span class="text">涂鸦软件</span>
          </div>
        </div>
        <div class="breviary">
          <div class="item new">
            <div @click="toAllworks" class="title">
              <i class="icon-new" style="font-size: 19px; color:#ff7fe0"></i>
              <span>最新</span>
              <span class="more">
              <span class="text">查看更多</span>
              <i class="el-arrow el-icon-d-arrow-right"></i>
            </span>
            </div>
            <scroll :scrollX="true" :data="workNewList" class="list-scroll">
              <div class="item-wrapper">
                <div @click="toWorkDetail(item.id,item.userId)" class="img" v-for="(item, index) in workNewList" :key="index">
                  <img ref="imgNew" @load="dealImageNew(index)" :src="base + (item.thumb?item.thumb:item.source)" alt="">
                </div>
              </div>
            </scroll>
          </div>
          <!--点赞次数最多-->
          <div class="item popularity">
            <div @click="toAllworks" class="title">
              <i class="icon-hot" style="font-size: 18px; color:#b4ff0d"></i>
              <span>人气</span>
              <span class="more">
                <span class="text">查看更多</span>
                <i class="el-arrow el-icon-d-arrow-right"></i>
              </span>
            </div>
            <scroll :scrollX="true" :data="likesList" class="list-scroll">
              <div class="item-wrapper">
                <div @click="toWorkDetail(item.id,item.userId)" class="img" v-for="(item, index) in likesList" :key="index">
                  <img ref="imgLikes" @load="dealImageLikes(index)" v-lazy="base + (item.thumb?item.thumb:item.source)" alt="">
                </div>
              </div>
            </scroll>
          </div>
          <div class="item course">
            <div @click="toCourse" class="title">
              <i class="icon-course1" style="font-size: 16px; color:#58c1ff"></i>
              <span>教程</span>
              <span class="more">
              <span class="text">查看更多</span>
              <i class="el-arrow el-icon-d-arrow-right"></i>
            </span>
            </div>
            <div class="course-wrapper">
              <div class="course" v-for="(item, index) in courseList" :key="index">
                <a :href="item.url">
                  <img v-lazy="base+item.thumb" alt="">
                  <br>
                  <p class="course-title">{{item.title}}</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <loading v-else></loading>
  </div>
</template>

<script>
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import axios from 'axios'
import {config} from 'api/config'

export default {
  name: 'HomePage',
  data () {
    return {
      base: config.base,
      sliderData: [],
      workNewList: [],
      likesList: [],
      courseList: []
    }
  },
  mounted () {
    this._getCarouselList()
    this._getWorkNewList()
    this._getLikesList()
    this._getCourseList()
  },
  methods: {
    toCourse () {
      this.$router.push('course')
    },
    toExhibition () {
      this.$router.push('exhibition')
    },
    toAllworks () {
      this.$router.push('study/allWorks')
    },
    toWorkDetail (workId, userId) {
      this.$router.push(`workDetail?workId=${workId}&authorId=${userId}`)
    },
    pulldown () {
      this._getLikesList()
      this._getCarouselList()
      this._getWorkNewList()
    },
    dealImageNew (index) {
      let img = this.$refs.imgNew[index]
      let per = 4 / 7
      const width = img.width
      const height = img.height
      if (width / height >= per) {
        img.style.height = '280px'
      } else {
        img.style.width = '160px'
      }
    },
    dealImageLikes (index) {
      let img = this.$refs.imgLikes[index]
      let per = 4 / 7
      const width = img.width
      const height = img.height
      if (width / height >= per) {
        img.style.height = '280px'
      } else {
        img.style.width = '160px'
      }
    },
    _getCarouselList () {
      axios.get(config.getCarouselList)
        .then((res) => {
          if (res.data.code === 0) {
            let data = res.data.carouselList
            for (let item in data) {
              data[item].url = config.base + data[item].url
            }
            this.sliderData = data
          } else {
            console.log(res)
          }
        }).catch((res) => {
          console.log(res)
        })
    },
    _getLikesList () {
      axios.get(config.likesList, {
        params: {
          current: 1,
          size: 6
        }
      }).then((res) => {
        // console.log(res.data.data)
        if (res.data.code === 0) {
          this.likesList = res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    _getWorkNewList () {
      axios.get(config.WorkNewList, {
        params: {
          current: 1,
          size: 6
        }
      }).then((res) => {
        // console.log(res.data)
        if (res.data.code === 0) {
          this.workNewList = res.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    _getCourseList () {
      axios.get(config.courseList, {
        params: {
          current: 1,
          size: 6,
          typeId: 2
        }
      }).then((res) => {
        // console.log(res.data.courseList)
        if (res.data.code === 0) {
          this.courseList = res.data.courseList
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  components: {
    Slider,
    Loading,
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .content
    position: fixed
    top: 46px
    width: 100%
    bottom: $bottom
    .scroll-wrapper
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      overflow : hidden
      .slider-wrapper
        position:relative
        width:100%
        overflow:hidden
      .otherItem
        width: 100%
        display : flex
        flex-wrap : nowrap
        justify-content : space-around
        border-bottom: 1px solid $color-theme-d
        .item
          padding: 10px 0
          font-size : $font-size-large-x
          .icon
            display: block
            text-align : center
          .text
            font-size : $font-size-small
      .breviary
        .item
          font-size : $font-size-medium
          padding: 10px
          .title
            border-bottom : 1px solid $color-background-white
            padding: 5px 0 12px
            i
              padding-right :5px
            span.more
              float : right
              .text
                font-size : $font-size-small
                color: $color-text-gray
              .el-arrow
                color: $color-theme
          .list-scroll
            width: 100%
            height: 280px
            .item-wrapper
              display: flex
              flex-wrap : nowrap
              width: 1000px
              .img
                width: 160px
                height: 280px
                overflow : hidden
                border-radius: 15px
                margin: 0 5px
          .course-wrapper
            display : flex
            flex-wrap : wrap
            justify-content : space-around
            .course
              padding-bottom: 10px
              img
                border-radius : 8px
                width: 110px
                height : 110px
              .course-title
                font-size : $font-size-small
                line-height : $font-size-large
                no-wrap()
                width: 110px
</style>
