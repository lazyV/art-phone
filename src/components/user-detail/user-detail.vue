<template>
  <div class="user-detail">
    <m-header mTitle="个人信息"></m-header>
    <div class="bg">
      <div class="avatar">
        <img @load="dealSquareImg" ref="squareImg" :src="avatar" alt="">
      </div>
    </div>
    <div class="changeAvatar">
      <el-upload
        name="avatar"
        :action="uploadAvatar"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess"
        :on-error="handleAvatarError">
        <span>更换头像</span>
      </el-upload>
    </div>
    <div class="details">
      <div class="item">
        <span class="name">用户名</span>
        <span class="msg">{{userName}}</span>
      </div>
      <div @click="nickNameVisible = true" class="item">
        <span class="name">昵称</span>
        <span class="msg">{{nickName}}</span>
        <span class="icon el-icon-arrow-right"></span>
      </div>
      <el-dialog :modal-append-to-body="false" width="80%" title="修改昵称" :visible.sync = 'nickNameVisible'>
        <el-input clearable autofocus :placeholder="nickName" v-model="tmp" auto-complete="off"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="button" @click="nickNameVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="nickNameConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <div class="item">
        <span class="name">ID</span>
        <span class="msg">{{userId}}</span>
      </div>
      <div @click="genderVisible = true" class="item">
        <span class="name">性别</span>
        <span class="msg">{{genderStr}}</span>
        <span class="icon el-icon-arrow-right"></span>
      </div>
      <el-dialog :modal-append-to-body="false" width="80%" title="修改性别" :visible.sync = 'genderVisible'>
        <el-select v-model="tmp" placeholder="请选择">
          <el-option value="男"></el-option>
          <el-option value="女"></el-option>
          <el-option value="隐藏"></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="button" @click="genderVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="genderConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <div @click="signatureVisible = true" class="item">
        <span class="name">签名</span>
        <span class="msg">{{signature}}</span>
        <span class="icon el-icon-arrow-right"></span>
      </div>
      <el-dialog :modal-append-to-body="false" width="80%" title="修改签名" :visible.sync = 'signatureVisible'>
        <el-input clearable autofocus autosize maxlength="88" :placeholder="signature" v-model="tmp" auto-complete="off"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="button" @click="nickNameVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="signatureConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <div class="button">
        <el-button size="medium" @click="userInfoCancel" type="info" round>取消</el-button>
        <el-button size="medium" @click="userInfoSubmit" type="primary" :disable="buttonDisabled" round>提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import avatarDefault from 'common/image/avatar-default.jpg'
import axios from 'axios'
import {config} from 'api/config'

export default {
  name: '',
  data () {
    return {
      userName: '',
      userId: '',
      nickName: '',
      gender: 2,
      signature: '',
      genderStr: '',
      nickNameVisible: false,
      genderVisible: false,
      signatureVisible: false,
      tmp: '',
      avatar: '',
      uploadAvatar: config.uploadAvatar,
      avatarPath: '',
      buttonDisabled: false,
      userInfo: {}
    }
  },
  mounted () {
    this.userInfo = localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo'))
    this._getUserInfo()
    this.avatar = this.userInfo.avatar ? config.base + this.userInfo.avatar : avatarDefault
  },
  watch: {
    '$route' () {
      this.$destroy()
    }
  },
  methods: {
    dealSquareImg () {
      let el = this.$refs.squareImg
      const width = el.width
      const height = el.height
      if (width > height) {
        el.style.height = '100%'
      } else {
        el.style.width = '100%'
      }
    },
    nickNameConfirm () {
      this.nickNameVisible = false
      if (this.tmp) {
        this.nickName = this.tmp
      }
      this.tmp = ''
    },
    genderConfirm () {
      this.genderVisible = false
      if (this.tmp) {
        this.genderStr = this.tmp
      }
      this.gender = this._genderNum(this.genderStr)
      this.tmp = ''
    },
    signatureConfirm () {
      this.signatureVisible = false
      if (this.tmp) {
        this.signature = this.tmp
      }
      this.tmp = ''
    },
    beforeAvatarUpload (file) {
      console.log('限制文件类型')
    },
    handleAvatarSuccess (res, file) {
      // console.log(res)
      this.avatarPath = res.filePath
      this.avatar = config.base + res.filePath
      // console.log(this.avatar)
    },
    handleAvatarError () {
      this.$alert('网络错误,请稍后重试')
    },
    userInfoCancel () {
      this._getUserInfo()
      setTimeout(() => {
        this.$router.push('/mine')
        this.$destroy()
      }, 200)
    },
    userInfoSubmit () {
      // 判断用户有么有修改任何信息
      if (this.avatarPath === this.userInfo.avatar && this.nickName === this.userInfo.nickName && this.gender === this.userInfo.gender && this.signature === this.userInfo.signature) {
        return
      }
      this.buttonDisabled = true
      axios.post(config.updateUserInfo, {
        userId: this.userId,
        nickName: this.nickName,
        avatar: this.avatarPath,
        signature: this.signature,
        gender: this.gender
      }).then((res) => {
        if (res.data.code === 0) {
          this.buttonDisabled = false
          // 将修改后的信息保存到localStorage
          let updateUserInfo = {
            'id': this.userId,
            'userName': this.userName,
            'nickName': this.nickName,
            'avatar': this.avatarPath,
            'gender': this.gender,
            'signature': this.signature
          }
          localStorage.setItem('userInfo', JSON.stringify(updateUserInfo))
          this.userInfo = updateUserInfo
          this.$confirm('修改成功，即将返回用户中心', '提示', {
            confirmButtonText: '确定'
          }).then(() => {
            this.$router.push('/mine')
            this.$destroy()
          }).catch(() => {})
        }
      }).catch((res) => {
        this.$alert('网络错误,请稍后重试')
        console.log(res)
      })
    },
    _gender () {
      return this.userInfo.gender === 0 ? '男' : this.userInfo.gender === 1 ? '女' : '隐藏'
    },
    _genderNum (str) {
      return str === '男' ? 0 : str === '女' ? 1 : 2
    },
    _getUserInfo () {
      this.userName = this.userInfo.userName
      this.userId = this.userInfo.id
      this.nickName = this.userInfo.nickName
      this.gender = this.userInfo.gender
      this.signature = this.userInfo.signature
      this.avatarPath = this.userInfo.avatar
      this.genderStr = this._gender(this.gender)
    }
  },
  components: {
    MHeader
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .user-detail
    position: absolute
    top: 0
    width: 100%
    bottom: 0
    background : $color-background
    z-index: 50
    .bg
      width: 100%
      height: 150px
      position:relative
      background-image: url('./user-detail.png')
      background-repeat: no-repeat
      background-size: contain
      .avatar
        width: 100px
        height: 100px
        overflow: hidden
        box-sizing: border-box
        border: 2px solid $color-theme
        border-radius: 50%
        position: absolute
        left: 50%
        transform: translateX(-50%)
        top: 22%
        background-repeat: no-repeat
        background-size: cover
    .changeAvatar
      width: 100%
      text-align : center
      span
        display : inline-block
        font-size : $font-size-medium
        background-color :$color-background-d
        border:1px solid $color-theme
        padding: 8px 18px
        border-radius: 30px
        color: $color-text-gray
    .details
      width: 80%
      margin: 0 auto
      .item
        position: relative
        line-height : 40px
        margin: 8px 0
        border-bottom: 1px solid $color-theme-d
        span
          display: inline-block
        .name
          width: 20%
          color: $color-theme
          font-size : $font-size-medium
          font-weight : bold
        .msg
          width: 68%
          color: $color-text-gray
          font-size : $font-size-medium
          no-wrap()
          position: absolute
          bottom: 0
        .icon
          font-size: $font-size-large
          font-weight : bold
          color: $color-theme
          position: absolute
          right: 0
          line-height : 40px
      .button
        margin-top: 25px
        display: flex
        justify-content: space-around
        button
          padding: 8px 26px
</style>
