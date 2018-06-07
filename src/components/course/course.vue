<template>
  <div class="course-wrapper">
    <m-header mTitle="教程中心"></m-header>
    <div class="classify">
      <el-row>
        <el-button @click="getType(item.id)" type="primary" plain v-for="(item, index) in classifyList" :key="index" size="mini">{{item.typeName}}</el-button>
      </el-row>
    </div>
    <scroll :pullup="true" @scrollToEnd="pullup" ref="scroll" v-if="courseList.length" :data="courseList" class="scroll-wrapper">
      <div class="courseList">
        <a class="course" :href="item.url" v-for="(item, index) in courseList" :key="index">
          <div class="left">
            <img @load="refreshScroll" v-lazy="base + item.thumb" alt="">
          </div>
          <div class="right">
            <div class="type">{{item.typeName}}</div>
            <div class="des">{{item.title}}</div>
          </div>
        </a>
        <no-more  :text="text"></no-more>
      </div>
    </scroll>
    <loading v-if="!courseList.length"></loading>
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
      courseList: [],
      classifyList: [],
      classifyId: 1,
      page: 1,
      count: null,
      size: 8,
      text: '上拉能查看更多教程哟！'
    }
  },
  mounted () {
    this.getClassifyList()
    this._initCourseList(this.page, this.size)
  },
  watch: {
    'classifyId' () {
      this._initCourseList(this.page, this.size)
    }
  },
  methods: {
    refreshScroll () {
      this.$refs.scroll.refresh()
    },
    getClassifyList () {
      axios.get(config.getType)
        .then((res) => {
          if (res.data.code === 0) {
            this.classifyList = res.data.data
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getType (index) {
      this.classifyId = index
      this.page = 1
    },
    pullup () {
      this.page = this.page + 1
      this._require(this.page, this.size).then(res => {
        if (res.data.code === 0) {
          res.data.courseList.forEach((item, index) => {
            this.courseList.push(item)
          })
          this.count = res.data.count
          if (res.data.count <= this.size) {
            this.text = '已经加载完所有的教程啦'
          } else {
            this.text = '上拉能查看更多教程哟！'
          }
        } else {
          this.text = '已经加载完所有的教程啦！'
        }
      })
    },
    _initCourseList (current, size) {
      this._require(current, size).then((res) => {
        // console.log(res.data)
        if (res.data.code === 0) {
          this.courseList = res.data.courseList
          this.count = res.data.count
          if (res.data.count < size) {
            this.text = '已经加载完所有的教程啦'
          } else {
            this.text = '上拉能查看更多教程哟！'
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    _require (current, size) {
      return axios.get(config.courseList, {
        params: {
          current: current,
          size: size,
          typeId: this.classifyId
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
  .course-wrapper
    position: fixed
    top: 0
    bottom: 0
    background-color : $color-background-white
    width: 100%
    z-index: 50
    .classify
      display: flex
      position: fixed
      top: 49px
      width:100%
      flex-wrap: wrap
      button
        margin: 5px
        padding: 5px 10px
    .scroll-wrapper
      position: absolute
      top: 83px
      bottom: 0
      width: 100%
      overflow : hidden
      .courseList
        width: 95%
        margin: 0 auto
        min-height: 500px
        .course
          padding: 5px
          display : flex
          flex-wrap : nowrap
          .left
            padding: 0 10px
            width: 60px
            img
              border-radius : 5px
              width: 60px
              height: 60px
          .right
            height: 60px
            display : flex
            flex-direction : column
            .type
              padding: 5px 0
              font-size : $font-size-small
              color : $color-theme
            .des
              font-size: $font-size-small
              line-height:18px
</style>
