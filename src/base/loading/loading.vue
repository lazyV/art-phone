<template>
  <div class="loading">
    <i class="el-icon-loading"></i>
    <span class="desc">{{title}}</span>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"

  .loading
    width: 100%
    line-height :20px
    text-align:center
  .desc
    font-size: $font-size-small
    color:$color-text-l
</style>
