<template>
<div class="share">
  <textarea v-model="text" class="textarea"  maxlength="500"  placeholder="分享您的作品，最大500字..."></textarea>
  <el-upload
    class="avatar-uploader"
    :action="fileUploadUrl"
    name="file"
    :limit="1"
    :show-file-list="true"
    :on-success="handleFileSuccess"
    :before-upload="beforeFileUpload"
    :on-error="handelFileError">
    <img v-if="imgUrl" v-lazy="imgUrl" class="work">
    <i v-if="!imgUrl" class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
  <div class="classifyPicker">
    <el-select size="small" v-model="classifyId" placeholder="请选择作品类别">
      <el-option
        v-for="item in classifyList"
        :key="item.id"
        :label="item.typeName"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
  <div class="visiable">
    <el-checkbox v-model="open">仅自己可见</el-checkbox>
  </div>
  <el-button size="mini" ref="button" @click="upload" type="warning">上传</el-button>
</div>
</template>

<script>
import {config} from 'api/config'
import axios from 'axios'
export default {
  name: '',
  data () {
    return {
      userInfo: '',
      text: '',
      fileType: 0,
      open: 0,
      classifyList: [],
      classifyId: '',
      fileUploadUrl: config.fileUploadUrl, // 文件上传路径
      filePath: '', // 作品返回的服务器相对路径
      thumbPath: '', // 视频缩略图务器相对路径
      imgUrl: '' // 作品或者视频缩略图路径
    }
  },
  mounted () {
    if (localStorage.getItem('userInfo')) {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    }
    this.getClassifyList()
  },
  methods: {
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
    handleFileSuccess (res, file) {
      if (file.raw.type.indexOf('image') !== -1) {
        this.fileType = 0
      } else {
        this.fileType = 1
      }
      this.filePath = res.filePath
      if (res.thumbnail) {
        this.thumbPath = res.thumbnail
        setTimeout(() => {
          this.imgUrl = config.base + res.thumbnail
        }, 500)
      } else {
        setTimeout(() => {
          this.imgUrl = config.base + res.filePath
        }, 500)
      }
    },
    beforeFileUpload (file) {
      const fileType = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/gif', 'video/avi']
      let uploadFileType = file.type.toLowerCase()
      if (fileType.indexOf(uploadFileType) === -1) {
        this.$message.error('上传文件格式不正确')
      }
    },
    handelFileError (err) {
      console.log(err)
    },
    upload () {
      if (!this.userInfo) {
        this.$alert('您尚未登录，登陆后就可以分享作品啦！')
        return
      }
      if (!(this.filePath && this.classifyId)) {
        return
      }
      axios.post(config.createWork, {
        userId: this.userInfo.id,
        source: this.filePath,
        type: this.fileType,
        thumb: this.thumbPath,
        content: this.text,
        typeId: this.classifyId,
        visible: +this.open
      }).then((res) => {
        console.log(res.data)
        if (res.data.code === 0) {
          this.$confirm(res.data.msg, '提示', {
            showCancelButton: false
          }).then(() => {
            this.$destroy()
            this.$router.push('study/allWorks')
          })
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
  .share
    position: fixed
    top: 49px
    width: 100%
    bottom: 66px
    .textarea
      resize: none
      font-size : $font-size-medium
      line-height: $font-size-large
      display: block
      background: transparent
      border: 1px solid $color-theme-d
      border-radius: 8px
      width: 85%
      height: 20%
      margin: 15px auto
      padding:  15px
      outline: none
      transition: border-color .2s cubic-bezier(.645,.045,.355,1)
      &:focus
        border: 1px solid $color-theme
        border-radius: 8px
    .avatar-uploader
      border: 1px dashed $color-theme
      border-radius: 6px
      cursor: pointer
      position: relative
      overflow: hidden
      width: 120px
      margin-left: 10px
      .work
        height: 120px
        display: block
      .avatar-uploader-icon
        font-size: 28px
        color: $color-theme
        width: 120px
        height: 120px
        line-height: 120px
        text-align: center
    .classifyPicker
      padding: 15px 0 0 10px
      .el-input__inner
        background-color : transparent
    .visiable
      padding: 15px 10px
    .el-button--warning
      background-color: $color-theme-d
      border-color: $color-theme
      padding:12px 50px
      margin-left: 10px
</style>
