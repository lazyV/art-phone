<template>
  <div class="header">
    <i @click.prevent="back" class="icon el-icon-arrow-left"></i>
    <span>{{mTitle}}</span>
  </div>
</template>

<script>
export default{
  name: 'MHeader',
  props: {
    mTitle: {
      type: String,
      default: ''
    }
  },
  methods: {
    back () {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .header
    position:relative
    padding: 16.5px 0
    background : $color-theme
    font-size : $font-size-medium-x
    .icon
      font-size : $font-size-large-x
      position: absolute
      left: 15px
      top: 13px
      font-weight : bold
    span
      display: block
      text-align: center
      font-weight : bold
</style>
