<template>
  <div id="app">
    <Header />
    <router-view/>
  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
  components: {
    Header
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

div {
  height: 100%;
  width: 100%;
}

img {
  min-width: 0px;
  min-height: 0px;
}

table, th, td {
  border: 1px solid black;
}

table {
    margin-left: auto;
    margin-right: auto;
}
</style>
