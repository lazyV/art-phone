<template>
  <div class="work-detail">
    <m-header mTitle="作品详情" :destroy="true"></m-header>
    <scroll ref="scroll" :data="initComment">
      <div>
        <div class="userInfo">
          <div class="avatar">
            <img ref="avatar" @load="dealAvatar"  :src="avatar" alt="">
          </div>
          <div class="nickName">{{nickName}}</div>
          <div class="uploadTime">{{uploadDate}}</div>
          <div v-if="showBtn">
            <div v-if="!followed" class="follow" @click="submitAttention">
              <i class="el-icon-plus"></i>
              关注
            </div>
            <div v-else class="follow" @click="cancelAttention">已关注</div>
          </div>
        </div>
        <p class="text">
          {{content}}
        </p>
        <div class="work">
          <video-player v-if="thumb"
                         class="video-player-box"
                         ref="videoPlayer"
                         :options="playerOptions"
                         :playsinline="true"
                         @play="onPlayerPlay($event)"
                         @pause="onPlayerPause($event)">
          </video-player>
          <img v-else @load="refreshScroll" :src="source" alt="">
        </div>
        <div class="workInfo">
          <div>
            <i class="icon-visible"></i>
            <span>{{views}}</span>
          </div>
          <div @click="handelCollect">
            <i :class="collected ? 'icon-collection2' : 'icon-collection'"></i>
            <span>{{collect}}</span>
          </div>
          <div @click="handelLikes">
            <i :class="liked ? 'icon-like2' : 'icon-like'"></i>
            <span>{{likes}}</span>
          </div>
          <div @click="delMyWork" v-if="userInfo.id === authorId">
            <i class="icon-delete" style="font-size: 19px"></i>
          </div>
          <div @click="showCommentInput=true">
            评论
          </div>
        </div>
        <div class="comment">
          <el-input v-if="showCommentInput" ref="commentInput" v-model="comment" size="medium" placeholder="输入评论内容">
            <el-button @click="commentInfo" slot="append">发送</el-button>
          </el-input>
          <el-input v-if="!showCommentInput" autofocus clearable ref="replyInput" v-model="comment" size="medium" :placeholder="placeholder">
            <el-button @click="replyInfo" slot="append">发送</el-button>
          </el-input>
        </div>
        <div class="commentList">
          <div v-for="(item,index) in initComment" :key="index" >
            <p class="item" @click="reply(item.id,item.userId,item.nickName,item.content)">
              <span class="nickName">{{item.nickName}}</span>
              <span>:</span>
              <span class="commentText">
                {{item.content}}
                <i @click="deleteComment(item.id)" v-if="userInfo.id === item.userId" class="icon icon-delete" style="font-size: 18px"></i>
              </span>
            </p>
            <p @click="reply(item.id,innerItem.fromId,innerItem.fromNickName,innerItem.content,replyType=1)" v-for="(innerItem,index) in item.reply" :key="index">
              <span class="nickName">{{innerItem.fromNickName}}</span>
              <span class="textReply">回复</span>
              <span class="nickName">{{innerItem.toNickName}}</span>
              <span>:</span>
              <span class="commentText">
                {{innerItem.content}}
                <i @click="deleteReply(innerItem.id)" v-if="userInfo.id === innerItem.fromId" class="icon icon-trash-can"></i>
              </span>
            </p>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Scroll from 'base/scroll/scroll'
import avatarDefault from 'common/image/avatar-default.jpg'
import axios from 'axios'
import {config} from 'api/config'
import {videoPlayer} from 'vue-video-player'

export default {
  name: '',
  data () {
    return {
      avatar: '',
      source: '',
      nickName: '',
      content: '',
      views: 0,
      likes: 0,
      collect: 0,
      uploadDate: '',
      workId: null,
      authorId: null,
      userInfo: localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')),
      showBtn: false, // 是否显示关注/取消关注按钮
      followed: false, // 用户未关注作者
      comment: '',
      initComment: [],
      showCommentInput: true,
      placeholder: '',
      commentId: null, // 回复的评论对应的id
      userId: null, // 回复对象的id
      replyType: 0,
      collected: false, // 用户已收藏
      liked: false, // 用户点赞
      thumb: '',
      playerOptions: {
        // videojs options
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: ''
        }],
        poster: ''
      }
    }
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  mounted () {
    this.workId = Number(this.$route.query.workId) // 作品id
    this.authorId = Number(this.$route.query.authorId) // 用户id
    this._getWorkDetail()
    this._initComment() // 初始化评论
    // 用户已经登陆 并且 看的不是自己的作品时显示按钮
    if (this.userInfo && this.userInfo.id !== this.authorId) {
      this.showBtn = true
      this._checkAttention()
      // 判断是否已经收藏
      this._isCollected()
    }
    this.userInfo && this._isLiked()
  },
  watch: {
    '$route' (to, from) {
      this.$destroy()
    }
  },
  methods: {
    refreshScroll () {
      this.$refs.scroll.refresh()
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
    // 关注
    submitAttention () {
      this._submitAttention()
    },
    // 取消关注
    cancelAttention () {
      this._cancelAttention()
    },
    // 发表评论
    commentInfo () {
      if (!this.userInfo && this.comment) {
        return
      }
      axios.post(config.comment, {
        workId: this.workId,
        content: this.comment,
        userId: this.userInfo.id
      }).then((res) => {
        if (res.data.code === 0) {
          this.comment = null
          this._initComment()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 发送评论之前的处理
    reply (commentId, userId, nickName, content, replyType) {
      if (this.userInfo.id === userId) {
        return
      }
      this.showCommentInput = false
      this.placeholder = `回复${nickName}(${content})`
      // let str = `${this.userInfo.id}(${this.userInfo.nickName})回复${userId}(${nickName})的评论${commentId}(${content}) `
      // console.log(str, replyType)
      this.commentId = commentId
      this.userId = userId
      this.replyType = replyType
    },
    // 回复评论
    replyInfo () {
      if (!this.comment) {
        return
      }
      axios.post(config.reply, {
        commentId: this.commentId,
        replyId: null,
        replyType: this.replyType,
        content: this.comment,
        fromId: this.userInfo.id,
        toId: this.userId
      }).then((res) => {
        // console.log(res)
        if (res.data.code === 0) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
          this._initComment()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 删除回复
    deleteReply (replyId) {
      this.$confirm('确定删除这条回复？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post(config.deleteReply, {
          id: replyId, // 回复id
          fromId: this.userInfo.id
        }).then((res) => {
          // console.log(res.data)
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this._initComment()
          }
        }).catch((err) => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除评论
    deleteComment (commentId) {
      this.$confirm('确定删除评论？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post(config.deleteComment, {
          id: commentId, // 评论id
          userId: this.userInfo.id // 用户id
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this._initComment()
          }
        }).catch((err) => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除作品
    delMyWork () {
      axios.post(config.deleteWork, {
        id: this.workId
      }).then((res) => {
        if (res.data.code === 0) {
          this.$router.push('mine')
        } else {
          this.$alert('网络出了问题，请稍候重试', '提示')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handelCollect () {
      if (!this.userInfo) {
        this.$message('登录后才可以收藏哟！')
        return
      }
      if (this.userInfo.id === this.authorId) {
        this.$message('请不要收藏自己的作品')
        return
      }
      if (this.collected) {
        this._cancelCollect()
      } else {
        this._addCollect()
      }
    },
    // 收藏
    _addCollect () {
      axios.post(config.addCollect, {
        userId: this.userInfo.id,
        workId: Number(this.workId)
      }).then((res) => {
        // console.log(res.data)
        if (res.data.code === 0) {
          this.collect += 1
          this.collected = true
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 取消收藏
    _cancelCollect () {
      axios.post(config.cancelCollect, {
        userId: this.userInfo.id,
        workId: Number(this.workId)
      }).then((res) => {
        // console.log(res.data)
        if (res.data.code === 0) {
          this.collect -= 1
          this.collected = false
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 判断是否已经收藏
    _isCollected () {
      axios.get(config.judgeCollect, {
        params: {
          'userId': this.userInfo.id,
          'workId': this.workId
        }
      }).then((res) => {
        if (res.data.code === 0) {
          this.collected = true
        } else {
          this.collected = false
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handelLikes () {
      if (!this.userInfo) {
        this.$message('登录后才可以点赞哟！')
        return
      }
      if (this.liked) {
        this._cancelLikes()
      } else {
        this._addLikes()
      }
    },
    // 判断是否已经点赞
    _isLiked () {
      axios.get(config.judgeLike, {
        params: {
          'userId': this.userInfo.id,
          'workId': this.workId
        }
      }).then((res) => {
        // console.log(res.data)
        if (res.data.code === 0) {
          this.liked = true
        } else {
          this.liked = false
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 点赞
    _addLikes () {
      axios.post(config.addLikes, {
        'userId': this.userInfo.id,
        'workId': this.workId
      }).then((res) => {
        // console.log(res.data)
        if (res.data.code === 0) {
          this.likes += 1
          this.liked = true
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 取消点赞
    _cancelLikes () {
      axios.post(config.cancelLikes, {
        userId: this.userInfo.id,
        workId: Number(this.workId)
      }).then((res) => {
        // console.log(res.data)
        if (res.data.code === 0) {
          this.likes -= 1
          this.liked = false
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取作品详情
    _getWorkDetail () {
      axios.get(`${config.getWorkDetail}?workId=${this.workId}`).then((res) => {
        // console.log(res.data.workDetail)
        if (res.data.code === 0) {
          let workDetail = res.data.workDetail
          this.avatar = (workDetail.avatar && (config.base + workDetail.avatar)) || avatarDefault
          this.source = config.base + workDetail.source
          this.content = workDetail.content
          this.nickName = workDetail.nickName
          this.uploadDate = workDetail.uploadDate
          this.likes = workDetail.likes
          this.collect = workDetail.collect
          this.views = workDetail.views
          this.thumb = workDetail.thumb
          if (this.thumb) {
            this.playerOptions.sources[0].src = this.source
            this.playerOptions.poster = config.base + this.thumb
          }
        } else {
          console.log(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取所有评论
    _initComment () {
      axios.get(`${config.initWorkComment}?workId=${this.workId}`).then((res) => {
        // console.log(res.data.data)
        if (res.data.code === 0) {
          this.initComment = res.data.data
        } else {
          // 无评论
          // console.log(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 判断用户是否已经关注作品作者
    _checkAttention () {
      axios.post(config.searchAttention, {
        'fromUserId': this.userInfo.id,
        'toUserId': this.authorId
      }).then((res) => {
        // ('checkAttention', res.data)
        if (res.data.code === 0) {
          this.followed = true
        } else {
          this.followed = false
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 关注用户
    _submitAttention () {
      axios.post(config.submitAttention, {
        'fromUserId': this.userInfo.id,
        'toUserId': this.authorId
      }).then((res) => {
        // console.log(res)
        if (res.data.code === 0) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
          this.followed = true
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 取消关注的请求
    _cancelAttention () {
      axios.post(config.cancelAttention, {
        'fromUserId': this.userInfo.id,
        'toUserId': this.authorId
      }).then((res) => {
        if (res.data.code === 0) {
          // 取消关注成功后
          this.$message({
            message: res.data.msg
          })
          this.followed = false
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 播放器
    onPlayerPlay (player) {
      // console.log('player play!', player)
    },
    onPlayerPause (player) {
      // console.log('player pause!', player)
    }
  },
  components: {
    MHeader,
    Scroll,
    videoPlayer
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .work-detail
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 60
    background-color: $color-background-white
    .wrapper
      position: absolute
      top: 49px
      bottom: 0
      overflow: hidden
      width: 100%
      .userInfo
        padding: 10px 20px
        height: 40px
        display : flex
        justify-content : space-between
        border-bottom: 1px solid $color-theme-d
        div
          line-height: 40px
        .avatar
          width: 40px
          height: 40px
          border: 2px solid $color-theme
          border-radius: 45px
          box-sizing : content-box
          overflow : hidden
        .nickName
          position: relative
          font-size: $font-size-large
          color: $color-theme
          font-weight : bold
        .uploadTime
          font-size : $font-size-small
          color: $color-text-gray
        .follow
          font-size: $font-size-small
          padding: 0 15px
          height: 25px
          line-height: 25px
          border: 1px solid $color-theme
          box-sizing: border-box
          border-radius : 25px
          background-color : $color-theme-d
          margin-top: 7.5px
      .text
        padding : 10px 10px 0px
        text-indent : 2em
      .work
        margin: 10px
        border-radius : 10px
        overflow : hidden
        img
          width: 100%
      .workInfo
        padding: 10px
        display: flex
        justify-content: space-around
        border-bottom: 1px solid $color-theme-d
        font-size : $font-size-medium
        div
          line-height: 28px
          i
            color: $color-theme
            font-size : $font-size-large-x
            &.icon-star2
              color: $color-sub-theme
            &.icon-thumb-up2
              color: $color-sub-theme
          span
            font-size : $font-size-small
            color: $color-text-gray
      .comment
        padding: 10px 10px 0 10px
        display : flex
        flex-wrap : wrap
      .commentList
        padding: 0px 10px 20px 10px
        .item
          margin-top: 8px
        p
          line-height: 22px
        .nickName
          color: $color-text-gray
          font-size : $font-size-medium
        .textReply
          font-size : $font-size-medium
        .icon
          color : $color-sub-theme
          float : right
</style>
