<template>
  <div class="attention-wrapper">
    <m-header mTitle="我的关注"></m-header>
    <scroll v-if="collectList.length" :data="collectList">
      <div class="wrapper">
        <div v-for="(item,index) in collectList" :key="index" class="collectItem">
          <div class="avatar">
            <img v-lazy="(item.avatar && (base + item.avatar)) || avatarDefault" alt="">
          </div>
          <div class="nickName">
            {{item.nickName}}
          </div>
          <div class="btn">
            <el-button @click="cancelAttention(item.toUserId, item.nickName)" type="danger" plain size="mini" icon="el-icon-delete" circle></el-button>
          </div>
        </div>
      </div>
    </scroll>
    <no-more text="您尚未关注任何用户" v-if="!collectList.length"></no-more>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
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
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      collectList: [],
      avatarDefault: avatarDefault
    }
  },
  mounted () {
    // 获取关注列表
    this._initAttentionList()
  },
  methods: {
    cancelAttention (toUserId, toNickName) {
      this.$confirm(`确定取消关注 ${toNickName} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._cancelAttention(toUserId)
      }).catch(() => {})
    },
    _initAttentionList () {
      axios.get(config.myRelation, {
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
    },
    // 取消关注用户
    _cancelAttention (toUserId) {
      axios.post(config.cancelAttention, {
        'fromUserId': this.userInfo.id,
        'toUserId': toUserId
      }).then((res) => {
        if (res.data.code === 0) {
          // 取消关注成功后
          this.$message({
            message: '已取消关注该用户'
          })
          this._initAttentionList()
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
  .attention-wrapper
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index : 50
    background-color : $color-background-white
    .wrapper
      top: 49px
      bottom: 0
      width: 100%
      overflow : hidden
      .collectItem
        display: flex
        justify-content : space-between
        width: 90%
        margin: 10px auto
        border-bottom: 1px dashed $color-theme-d
        div
          line-height : 50px
        .avatar
          width: 50px
          height: 50px
          box-sizing : border-box
          border-radius: 50px
          overflow : hidden
          border: 2px solid $color-theme-d
          img
            width: 100%
</style>
