<template>
      <div class="topnav">
        <img 
            class="logo" 
            :src="require('@/assets/logos/khateebRemindLogo.svg')"
        >
        <div>
          <button class="blue">Sign Up <u>(It's FREE)</u></button>
        </div>
        <!-- <a class="currentDate" style="float: right; ">
          {{ abbreviatedDayOfWeek }} {{ abbreviatedMonthName }} {{ currentDate }}, {{ abbreviatedYear }}
        </a> -->
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
img {
  width: 3.3vh;
  float: left;
  padding: 1vh;
}

button {
  float: right;
  font-size: 1vh;
  font-weight: bold;
  border-radius: 0;
  color: black;
}

.topnav {
  background-color: themeRGBA("grey", 0.4);
  top: 0;
  height: 4.5vh;
  width: 100vw;
  left: 0;
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