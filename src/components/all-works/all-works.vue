<template>
  <div class="allWorks-wrapper">
    <scroll class="scroll-wrapper" @scroll="scroll(pos)" :pulldown="true" @pulldown="pulldown" v-if="workList.length"  ref="scroll" :data="workList">
      <div class="allWorks">
        <div v-if="showClassify" class="classify">
          <el-row>
            <el-button @click="_getAllWorks()" type="primary" plain size="mini">全部</el-button>
            <el-button @click="loadTypeList(item.id)" type="primary" plain v-for="(item, index) in classifyList" :key="index" size="mini">{{item.typeName}}</el-button>
          </el-row>
        </div>
        <div class="grid">
          <div ref="work"
               @click="toWorkDetail(item.id,item.userId)"
               v-for="(item, index) in workList"
               :key="index"
               class="work">
            <img class="workImg" ref="workImg" @load="refreshScroll"  v-lazy="getWorkImg(item)" alt="">
            <div class="avatar">
              <img ref="img" @load="dealImage(index)" :src="(item.avatar && baseUrl+item.avatar) || avatarDefault" alt="">
            </div>
          </div>
        </div>
        </div>
    </scroll>
    <loading v-if="!workList.length"></loading>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {config} from 'api/config'
import avatarDefault from 'common/image/avatar-default.jpg'
import axios from 'axios'
export default {
  name: '',
  data () {
    return {
      workList: [],
      classifyList: [],
      baseUrl: config.base,
      showClassify: false,
      checkId: null,
      avatarDefault: avatarDefault
    }
  },
  mounted () {
    this._getAllWorks()
    this.getClassifyList()
  },
  watch: {
    '$route' () {
      this._getAllWorks()
    }
  },
  methods: {
    pulldown () {
      this.showClassify = true
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
    refreshScroll () {
      this.$refs.scroll.refresh()
    },
    getWorkImg (item) {
      if (item.thumb) {
        return this.baseUrl + item.thumb
      } else {
        return this.baseUrl + item.source
      }
    },
    toWorkDetail (workId, userId) {
      this.$router.push(`workDetail?workId=${workId}&authorId=${userId}`)
    },
    loadTypeList (id) {
      this.checkId = id
      this.getWorkTypeList(id)
    },
    getWorkTypeList (id) {
      axios.get(config.workTypeList, {
        params: {
          current: 1,
          size: 10,
          typeId: id
        }
      })
        .then((res) => {
          // console.log(res.data)
          if (res.data.code === 0) {
            this.workList = res.data.data
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    _getAllWorks () {
      axios.get(config.getAllWorks)
        .then((res) => {
          // console.log(res.data)
          if (res.data.code === 0) {
            this.workList = res.data.workList
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .allWorks-wrapper
    .scroll-wrapper
      position: fixed
      top: 79px
      bottom: $bottom
      width: 100%
      overflow : hidden
      .allWorks
        width: 100%
        position: relative
        .classify
          display: flex
          width:100%
          flex-wrap: wrap
          button
            margin: 0 0 5px 5px
            padding: 5px 10px
        .grid
          column-count: 2
          column-gap: 0
          .work
            width: 100%
            margin-bottom: 5px
            position: relative
            box-sizing : border-box
            border-radius: 5px
            overflow : hidden
            break-inside: avoid
            padding: 7px 8px
            .workImg
              width: 100%
              border: 1px solid $color-theme-d
              border-radius: 8px
            .avatar
              width: 35px
              height: 35px
              position: absolute
              left: 5px
              bottom: 0
              border-radius: 35px
              border: 2px solid $color-background
              overflow: hidden
              img
                position: absolute
</style>
