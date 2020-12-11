<template>
    <div>
        <div class="topnav">
          <router-link to="/about" exact v-if="!isLoggedIn">
            About
          </router-link>
          <router-link :to="{ name: 'login' }" v-if="!isLoggedIn">
            Admin Login
          </router-link>
          <a
          @click="logout()" 
          v-if="isLoggedIn">
            Logout
          </a>
          <router-link :to="`/admin/${this.$store.state.institution}/dashboard`" v-if="isLoggedIn">
            Admin Dashboard
          </router-link>
          <img style="width: 20px; float: right; padding: 1vh;" :src="logo">
        </div>
    </div>
</template>

<script>
export default {
    name: 'Footer',
    data() {
      return {
        logo: require('../assets/paper-plane-solid.svg')
      }
    },
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
.topnav {
    margin-top: 30px;
    overflow: hidden;
    left: 0;
    height: 5.1vh;
    width: 100vw;
    margin: 0;
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