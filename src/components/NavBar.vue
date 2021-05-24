<template>
  <div id="nav">
    <span v-if="isLoggedIn"><router-link to="/login">Login</router-link></span> |
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <span v-if="isLoggedIn"><a @click="logout">Logout</a></span>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  computed : {
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
  },
  methods: {
    logout: function () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/login')
      })
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#nav {
  padding: 30px;
}

#nav a {
  text-decoration: underline;
  font-weight: bold;
  color: #42b983;
}

#nav a.router-link-exact-active {
  text-decoration: underline;
  color: #42b983;
}
</style>
