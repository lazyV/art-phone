<template>
<div class="rankList-wrapper">
  <scroll class="scroll-wrapper" :data="userList" v-if="userList.length">
    <div class="rankList">
      <table></table>
      <div class="list" v-for="(item, index) in userList" :key="index">
        <div class="left">
          <div class="ranking">{{index+1}}</div>
          <div class="avatar">
            <img ref="img" @load="dealImage(index)" :src="(item.avatar && base+item.avatar) || avatarDefault" alt="">
          </div>
          <div class="userInfo">
            <div>
          <span class="nickName">
            {{item.nickName}}
          </span>
            </div>
            <div>
              <div  class="num">
                <i class="icon-award"></i>
                <span>{{item.count}}</span>
              </div>
            </div>
          </div>
        </div>
        <div @click="toAuthorCenter(item.id,item.avatar,item.nickName)" class="right">
          <i class="el-icon-d-arrow-right"></i>
        </div>
      </div>
      <no-more></no-more>
    </div>
  </scroll>
  <loading v-if="!userList.length"></loading>
</div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import NoMore from 'components/no-more/no-more'
import {config} from 'api/config'
import axios from 'axios'
import avatarDefault from 'common/image/avatar-default.jpg'
export default {
  name: '',
  data () {
    return {
      base: config.base,
      current: 1,
      size: 20,
      userList: [],
      avatarDefault: avatarDefault
    }
  },
  mounted () {
    this._getUserList()
  },
  methods: {
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
    _getUserList () {
      axios.get(config.userList, {
        params: {
          current: this.current,
          size: this.size
        }
      }).then(res => {
        // console.log(res.data)
        if (res.data.code === 0) {
          this.userList = res.data.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    toAuthorCenter (userId, avatar, nickName) {
      this.$router.push(`authorCenter?userId=${userId}&avatar=${avatar}&nickName=${nickName}`)
    }
  },
  components: {
    MHeader,
    Scroll,
    Loading,
    NoMore
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .rankList-wrapper
    position: fixed
    top: 79px
    bottom: $bottom
    width: 100%
    .scroll-wrapper
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      overflow : hidden
      .rankList
        .list
          display: flex
          flex-wrap: nowrap
          justify-content space-between
          width: 90%
          margin: 10px auto
          border-bottom: 1px dotted $color-theme-d
          padding: 5px 0
          .left
            width: 70%
            display: flex
            flex-wrap: nowrap
            .ranking
              width: 40px
              line-height: 50px
              text-align: center
            .avatar
              width: 50px
              height: 50px
              overflow: hidden
              border-radius: 10px
              box-sizing : border-box
              border:1px solid $color-theme
            .userInfo
              width: 40%
              margin: 0 10px
              display: flex
              flex-wrap: wrap
              justify-content space-between
              font-size: $font-size-small
              div
                width: 100%
                line-height: 25px
                position: relative
              .nickName
                position: absolute
                font-size: $font-size-medium
                top: 3px
              .num
                position: absolute
                top: 0px
          .right
            width: 20%
            text-align : center
            line-height: 50px
            font-size: $font-size-medium
            font-weight: bold
            color: $color-theme
</style>
