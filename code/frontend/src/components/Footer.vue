<template>
    <div>
        <div class="topnav">
          <router-link to="/about" exact>About</router-link>
          <router-link :to="{ name: 'login' }">Login</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Header',
    data() {
      return {
        currentDate: this.$store.state.date.currentDate.date,
        abbreviatedMonthName: this.$store.state.date.currentDate.month.slice(0,3),
        abbreviatedDayOfWeek: this.$store.state.date.currentDate.dayOfTheWeek.slice(0,3),
        abbreviatedYear: `'${this.$store.state.date.currentDate.year - 2_000}`,
      }
    }
}
</script>

<style lang="scss" scoped>
/* Add a black background color to the top navigation */
.topnav {
    margin-top: 30px;
    background-color: #333;
    overflow: hidden;
    left: 0;
    height: 5.1vh;
    width: 100vw;
}

.router-link-active {
    background-color: #4CAF50;
    color: white;
}

/* Style the links inside the navigation bar */
.topnav a {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 1.8vh 16px;
  text-decoration: none;
  font-size: 1.8vh;
  font-weight: bold;
}

/* Change the color of links on hover */
.topnav a:hover {
  background-color: #ddd;
  color: black;
}
</style>