<template>
<div class="world">
  <div class="worldTab">
    <router-link tag="div" to="/study/allWorks">最新</router-link>
    <router-link tag="div" to="/study/circle">圈子</router-link>
    <router-link tag="div" to="/study/rank">排行</router-link>
  </div>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
export default {
  name: '',
  data () {
    return {
    }
  },
  components: {
    MHeader
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .world
    position: absolute
    top: 49px
    bottom: $bottom
    width: 100%
    .router-link-active
      box-sizing : border-box
      color: $color-sub-theme
      border-radius: 5px
      background-color : rgba(255, 255, 255, 0.61)
    .worldTab
      font-size : $font-size-small
      width: 100%
      height: 30px
      line-height: 30px
      display: flex
      justify-content : flex-start
      color: $color-text-gray
      div
        padding:0 20px
    .wrapper
      width: 100%
      position: fixed
      top: 76px
      bottom: 66px
      overflow: hidden
</style>
