<template>
  <div class="noMore-wrapper">
    <i :class=icon></i>
    <span>{{text}}</span>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    text: {
      type: String,
      default: '再也没有啦'
    },
    icon: {
      type: String,
      default: 'icon-smirking-face-sunglasses'
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .noMore-wrapper
    text-align: center
    color : $color-text-gray
    padding: 20px
    i
      font-size: $font-size-large
    span
      font-size : $font-size-medium
</style>
