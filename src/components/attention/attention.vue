<template>
  <div>
    <div v-if="!followed" class="btn addBtn" @click="submitAttention">
      <i class="el-icon-plus"></i>
      关注
    </div>
    <div v-else class="btn cancelBtn" @click="cancelAttention">已关注</div>
  </div>
</template>

<script>
import axios from 'axios'
import {config} from 'api/config'

export default {
  name: '',
  data () {
    return {
      followed: false
    }
  },
  props: {
    fromUserId: null,
    toUserId: null
  },
  watch: {
    '$route' () {
      if (this.fromUserId && this.fromUserId !== this.toUserId) {
        this.showBtn = true
        this.checkAttention()
      }
      this.$destroy()
    }
  },
  methods: {
    submitAttention () {
      this._submitAttention()
    },
    cancelAttention () {
      this._cancelAttention()
    },
    checkAttention () {
      axios.post(config.searchAttention, {
        'fromUserId': this.fromUserId,
        'toUserId': this.toUserId
      }).then((res) => {
        // console.log('checkAttention', res.data)
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
        'fromUserId': this.fromUserId,
        'toUserId': this.toUserId
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
        'fromUserId': this.fromUserId,
        'toUserId': this.toUserId
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
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .btn
    font-size: $font-size-small
    width: 75px
    height: 25px
    line-height: 25px
    text-align: center
    border: 1px solid $color-background-white
    box-sizing: border-box
    border-radius : 25px
    color: $color-text-white
  .addBtn
    background-color : $color-btn-follow
  .cancelBtn
    background-color : $color-btn-cancel
</style>
