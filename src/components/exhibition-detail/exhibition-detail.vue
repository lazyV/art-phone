<template>
  <div class="exhibition-detail-wrapper">
    <m-header mTitle="画展详情"></m-header>
    <div class="exhibitionInfo">
      <div v-if="!past" @click="joinExhibition()" class="join">
        <img src="./join.png" alt="">
      </div>
      <div class="left">
        <p class="markup">画展名:</p>
        <p class="text">&nbsp;&nbsp;&nbsp;&nbsp;{{name}}</p>
        <p class="markup">活动时间:</p>
        <p class="text">&nbsp;&nbsp;&nbsp;&nbsp;{{exhibitionTime}}</p>
        <p class="markup">描述:</p>
        <p class="text">&nbsp;&nbsp;&nbsp;&nbsp;{{introduction}}</p>
      </div>
      <div class="right">
        <img v-lazy="poster && (base + poster)" alt="">
      </div>
    </div>
    <scroll v-if="workList.length" :pulldown="true" @pulldown="pulldown" :pullup="true" @scrollToEnd="pullup" :data="workList" ref="scroll" class="scroll-wrapper">
      <div>
        <div class="exhibitionWorks">
          <div class="work" v-for="(item,index) in workList" :key="index">
            <div @click="showExhibitionWork(item.source)" class="img">
              <img @load="refreshScroll" v-lazy="base + item.source" alt="">
            </div>
            <div class="info">
              <span class="num">{{item.score}}</span>
              <i @click.prevent="_likeExhibitionWork(item.id, index)" class="icon icon-like"></i>
            </div>
          </div>
        </div>
        <no-more :text="text"></no-more>
      </div>
    </scroll>
    <no-more v-else style="margin-top: 30px" text="该画展暂时还没有人参加哦" icon="icon-face-missing-moth"></no-more>
    <el-dialog  title="上传您的作品"
                :visible.sync="dialogVisible"
                :modal-append-to-body="false"
                width="90%"
    >
      <el-upload
        class="join-uploader"
        :action="uploadJoin"
        name="join"
        :show-file-list="false"
        :on-success="handleJoinSuccess"
        :before-upload="beforeJoinUpload">
        <img v-if="imageUrl" :src="imageUrl" class="image">
        <i v-else class="icon icon-upload"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpload">取 消</el-button>
        <el-button type="primary" @click="uploadFile">上 传</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="showExhibitionSource" :modal-append-to-body="false" width="90%">
      <img :src="base + exhibitionSource" alt="" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import NoMore from 'components/no-more/no-more'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import axios from 'axios'
import {config} from 'api/config'
export default {
  name: '',
  data () {
    return {
      base: config.base,
      uploadJoin: config.uploadJoin,
      userInfo: localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')),
      past: false,
      exhibitionId: null,
      page: 1,
      size: 6,
      workList: [],
      name: '',
      exhibitionTime: '',
      introduction: '',
      poster: '',
      count: null,
      text: '上拉能查看更多作品哟！',
      dialogVisible: false,
      imagePath: '',
      imageUrl: '',
      tmpScore: 0,
      exhibitionSource: '',
      showExhibitionSource: false
    }
  },
  mounted () {
    let query = this.$route.query
    this.exhibitionId = Number(query.exhibitionId)
    this.past = query.past === 'true' ? 1 : 0
    this.getExhibitionWork()
    if (this.count <= this.size) {
      this.text = '已经加载完所有的作品啦！'
    }
  },
  watch: {
    '$route' (from, to) {
      this.$destroy()
    }
  },
  methods: {
    refreshScroll () {
      this.$refs.scroll.refresh()
    },
    joinExhibition () {
      // 判断用户是否登陆
      if (!this.userInfo) {
        this.$alert('您尚未登录！', '提示')
        return
      }
      // 实现弹框
      this.dialogVisible = true
      // 发送请求
    },
    beforeJoinUpload (file) {
      const fileType = ['image/jpeg', 'image/png', 'image/jpg']
      let uploadFileType = file.type.toLowerCase()
      if (fileType.indexOf(uploadFileType) === -1) {
        this.$message.error('上传文件格式不正确')
        this.dialogVisible = false
      }
    },
    handleJoinSuccess (res, file) {
      // console.log(res)
      if (res.code === 0) {
        this.imagePath = res.filePath
        this.imageUrl = config.base + res.filePath
      }
    },
    uploadFile () {
      if (!this.imageUrl) {
        return
      }
      this._uploadFile()
        .then(res => {
          // console.log(res)
          if (res.data.code === 0) {
            this.imageUrl = ''
            this.$message('上传成功')
            this.dialogVisible = false
            this.getExhibitionWork()
          } else {
            this.$message('上传失败，请稍候重试')
          }
        }).catch(err => {
          console.log(err)
        })
    },
    cancelUpload () {
      this.dialogVisible = false
      this.$message('已取消上传')
    },
    pulldown () {
      this.page = 1
      this.getExhibitionWork()
    },
    pullup () {
      this.page = this.page + 1
      if (this.page > Math.ceil(this.count / this.size)) {
        this.text = '已经加载完所有的作品啦！'
        return
      }
      axios.get(config.exhibitionWork, {
        params: {
          current: this.page,
          size: this.size,
          exhibitionId: this.exhibitionId
        }
      }).then(res => {
        // console.log(res.data)
        if (res.data.code === 0) {
          res.data.data.forEach((item, index) => {
            this.workList.push(item)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getExhibitionWork () {
      axios.get(config.exhibitionWork, {
        params: {
          current: this.page,
          size: this.size,
          exhibitionId: this.exhibitionId
        }
      }).then(res => {
        // console.log(res.data)
        if (res.data.code === 0) {
          this.workList = res.data.data
          this.count = res.data.count
          this.name = res.data.name
          this.exhibitionTime = res.data.exhibitionTime
          this.poster = res.data.poster
          this.introduction = res.data.introduction
        } else {
          this.name = res.data.name
          this.exhibitionTime = res.data.exhibitionTime
          this.poster = res.data.poster
          this.introduction = res.data.introduction
        }
      }).catch(err => {
        console.log(err)
      })
    },
    showExhibitionWork (source) {
      this.exhibitionSource = source
      this.showExhibitionSource = true
    },
    _uploadFile () {
      return axios.post(config.joinExhibition, {
        exhibitionId: this.exhibitionId,
        exhibitionName: this.name,
        userId: this.userInfo.id,
        nickName: this.userInfo.nickName,
        source: this.imagePath
      })
    },
    _likeExhibitionWork (id, index) {
      if (!this.userInfo) {
        this.$alert('您尚未登录！', '提示')
        return
      }
      this.workList[index].score++
      axios.post(config.likeExhibitionWork, {
        id: id
      }).then(res => {
        // console.log(res.data)
      }).catch(err => {
        console.log(err)
      })
    }
  },
  components: {
    Scroll,
    MHeader,
    Loading,
    NoMore
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .exhibition-detail-wrapper
    position: fixed
    top: 0
    bottom: 0
    background-color : $color-background-white
    width: 100%
    z-index: 50
    .exhibitionInfo
      padding: 10px
      height: 180px
      display: flex
      justify-content : space-between
      border-bottom : 1px solid $color-theme-d
      position: relative
      .join
        position: absolute
        width: 60px
        height: 60px
        bottom: -30px
        left: 50%
        transform : translateX(-50%)
        img
          width: 100%
          height: 100%
      .left
        padding: 5px 0
        overflow : hidden
        .markup
          font-size $font-size-medium
          color: $color-theme
          font-weight : bold
          padding: 10px 0 5px
        .text
          font-size $font-size-medium
          line-height: 25px
          border-bottom: 1px solid $color-border-gray
          no-wrap()
      .right
        width: 30%
        overflow: hidden
        img
          width: 100%
    .scroll-wrapper
      position: absolute
      top: 280px
      bottom: 0
      overflow : hidden
      width: 100%
      .exhibitionWorks
        padding: 0 10px
        display: flex
        flex-wrap : wrap
        justify-content : space-around
        .work
          position: relative
          min-height: 50px
          border: 1px solid $color-border-gray
          width: 45%
          border-radius: 8px
          overflow : hidden
          margin-bottom: 20px
          .img
            position: relative
            img
              width: 100%
          .info
            position: absolute
            bottom: 5px
            right: 8px
            .icon
              color: $color-sub-theme
              font-weight: bold
              font-size : $font-size-large
            .num
              font-size : $font-size-small
              color : $color-text-gray
    .join-uploader
      width: 80%
      min-height: 80px
      margin: 0 auto
      position: relative
      .image
        width: 100%
      .icon
        position: absolute
        color: $color-theme
        top: 50%
        left: 50%
        transform : translate(-50%, -50%)
        padding: 30px
</style>
