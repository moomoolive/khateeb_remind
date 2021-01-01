<template>
    <div>
        <div class="topnav">
          <router-link :to="{ name: 'login' }" v-if="!isLoggedIn">
            Admin Login
          </router-link>
          <router-link :to="`/admin/${this.$store.state.institution}/dashboard`" v-if="isLoggedIn">
            Admin Dashboard
          </router-link>
          <a
          @click="logout()" 
          v-if="isLoggedIn">
            Logout
          </a>
          <img 
            class="logo" 
            :src="require('@/assets/logos/khateebRemindLogo.svg')"
          >
        </div>
    </div>
</template>

<script>
export default {
    name: 'Footer',
    methods: {
      logout() {
        this.$store.dispatch('logout')
        this.$router.push('/')
      }
    },
    computed: {
      isLoggedIn() {
        return this.$store.getters.isJWTValid
      }
    }
}
</script>

<style lang="scss" scoped>
.logo {
  width: 3.3vh;
  float: right; 
  padding: 1vh;
}

.topnav {
    background-color: lighten(getColor("grey"), 5%);
    margin-top: 30px;
    overflow: hidden;
    left: 0;
    height: 5.1vh;
    width: 98.2vw;
    margin: 0;
    padding-left: 0.8vw;
    overflow: hidden;
}

.router-link-active {
    background-color: getColor("green");
    color: white;
}

.topnav a {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 1.8vh 16px;
  text-decoration: none;
  font-size: 1.8vh;
  font-weight: bold;
}

.topnav a:hover {
  background-color: #ddd;
  color: black;
}
</style>