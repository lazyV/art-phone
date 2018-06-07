<template>
  <div class="tab">
    <router-link tag="div" class="item" to="/homepage">
      <div class="icon">
        <i class="icon-homepage"></i>
      </div>
      <div class="text">首页</div>
    </router-link>
    <router-link tag="div" class="item" to="/study">
      <div class="icon">
        <i class="icon-circle"></i>
      </div>
      <div class="text">学习</div>
    </router-link>
    <router-link tag="div" class="item" to="/share">
      <div class="icon">
        <i class="icon-share"></i>
      </div>
      <div class="text">分享</div>
    </router-link>
    <router-link tag="div" class="item" to="/mine">
      <div class="icon">
        <i class="icon-usercenter"></i>
      </div>
      <div class="text">我的</div>
    </router-link>
  </div>
</template>

<script>
export default{
  name: 'tab'
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .tab
    width: 100%
    height: 50px
    border-top: 2px solid $color-theme
    display: flex
    flex-direction: row
    justify-content: space-around
    position: fixed
    background: $color-background
    bottom: 0
    box-sizing : border-box
    .item
      padding: 6.4px 0
      flex-flow: column
      display: flex
      flex-grow: 1
      text-align: center
      font-size: $font-size-small
      color :$color-text-l
      .icon
        font-size: $font-size-large-x
        padding-bottom: 2px
      &.router-link-active
        color: $color-theme
</style>
