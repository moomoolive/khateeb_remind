<template>
      <div class="topnav">
        <router-link to="/" exact>Home</router-link>
        <router-link :to="{ name: 'announcements' }">Announcements</router-link>
        <a class="currentDate" style="float: right; ">
          {{ abbreviatedDayOfWeek }} {{ abbreviatedMonthName }} {{ currentDate }}, {{ abbreviatedYear }}
        </a>
      </div>
</template>

<script>
export default {
    name: 'Header',
    data() {
      return {
        currentDate: '',
        abbreviatedMonthName: '',
        abbreviatedDayOfWeek: '',
        abbreviatedYear: '',
      }
    },
    created() {
      const x = new Date()
      this.currentDate = x.getDate()
      this.abbreviatedMonthName = x.toLocaleString('default', { month: 'short' })
      this.abbreviatedDayOfWeek = x.toLocaleString('default', { weekday: 'short' })
      this.abbreviatedYear = `'${x.getFullYear() - 2_000}`
    }
}
</script>

<style lang="scss" scoped>
.topnav {
  background-color: lighten(getColor("grey"), 5%);
  overflow: hidden;
  position: fixed;
  top: 0;
  height: 4.5vh;
  width: 100vw;
  left: 0;
  z-index: 2;
}

.currentDate {
    background-color: #ddd; 
    color: black !important;
    cursor: auto;
}

.router-link-active {
    background-color: getColor("green");
    color: white;
    padding: 0;
}

.topnav a {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 1.87vh 2vw 0.9vh 2vw;
  text-decoration: none;
  font-size: 1.8vh;
  font-weight: bold;
}

.topnav a:hover {
  background-color: #ddd;
  color: black;
}
</style>