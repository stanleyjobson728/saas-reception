<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang='scss'>
@import './style/global.inline';
#app {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
