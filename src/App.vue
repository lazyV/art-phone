<template>
  <div id="app">
    <div class="header">
      <span>少儿美术馆</span>
    </div>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <tab></tab>
  </div>
</template>

<script>
import Tab from 'components/tab/tab'
import MHeader from 'components/m-header/m-header'
export default {
  name: 'App',
  components: {
    Tab,
    MHeader
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .header
    position:relative
    text-align: center
    padding: 16.5px 0
    background : $color-theme
    font-size : $font-size-medium-x
    span
      font-weight : bold
</style>
