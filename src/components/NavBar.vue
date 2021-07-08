<template>
  <div id="nav">
    <div id="nav-left">
      <h2 v-if="account_profile['extended_hours_equity']">Investing: <b>{{ formatter().format(account_profile['extended_hours_equity']) }}</b></h2>
      <h2 v-else>Stock Tracer</h2>
    </div>
    <div id="nav-right">
      <span v-if="!isLoggedIn"><router-link to="/login" class="nav-element">Login</router-link></span>
      <router-link to="/" class="nav-element"> Home </router-link>
      <router-link to="/about" class="nav-element"> About </router-link>
      <span v-if="isLoggedIn"><a class="nav-element" @click="logout">Logout</a></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  computed : {
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn},
    account_profile: function() { return this.$store.getters.getAccountProfile }
  },
  watch: {
    account_profile: function() { return this.$store.getters.getAccountProfile }
  },
  methods: {
    formatter() { 
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    },
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
  z-index: 10;
  position: fixed;
  top: 0; 
  padding: 1.5rem;
  width: 100%;
  margin: auto;
  display: block;
  font-size: 2rem;
  height: 7rem;
  background: #2c3e50;
}

#nav-left {
  float: left;
}
#nav-right {
  float: right;
  padding: 1rem 0;
}
.nav-element {
  padding-left: 1rem;
}
#nav a {
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
  color: #42b983;
}
#nav a:hover {
  color: #fff; 
}
#nav a.router-link-exact-active {
  color: #fff;
}
h2 {
  color: #42b983;
}

</style>
