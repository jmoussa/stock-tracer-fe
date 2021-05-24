<template>
  <div id="nav">
    <div id="nav-left">
      <h2>Stock Tracer</h2>
    </div>
    <div id="nav-right">
      <span v-if="isLoggedIn"><router-link to="/login" class="nav-element">Login</router-link></span>
      <router-link to="/" class="nav-element"> Home </router-link>
      <router-link to="/about" class="nav-element"> About </router-link>
      <span v-if="isLoggedIn"><a  class="nav-element" @click="logout">Logout</a></span>
    </div>
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
  padding: 2rem;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  font-size: 2rem;
  height: 6rem;
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
  text-decoration: none;
  font-weight: bold;
  color: #42b983;
}
#nav a:hover {
  color: #fff; 
}
#nav a.router-link-exact-active {
  text-decoration: underline;
  color: #42b983;
}
h2 {
  color: #42b983;
}

</style>
