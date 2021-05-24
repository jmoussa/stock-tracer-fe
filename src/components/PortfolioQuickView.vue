<template>
  <div class="portfolio-quick-view" id="portfolio-quick-view">
    <div v-if="loggedIn" class="cards" id="rh-personal-portfolio">
      <Card class="card" v-for="(body, ticker) in portfolio" :key="ticker" :initialTitle="body.name" :initialBody="body"/>  
    </div>
    <div v-else id="rh-portfolio-login">
      <form class="login login100-form validate-form" @submit.prevent="onRHLogin">
        <h1>Sign-in to Robinhood</h1>
        <span class="login100-form-title p-b-48">
          <i class="zmdi zmdi-font"></i>
        </span>
        <div class="wrap-input100 validate-input" data-validate="Valid email is: a@b.c">
          <input class="input100" v-model="username" type="text" placeholder="Email">
          <span class="focus-input100" data-placeholder="Email"></span>
        </div>
        <div class="wrap-input100 validate-input" data-validate="Enter password">
          <span class="btn-show-pass">
            <i class="zmdi zmdi-eye"></i>
          </span>
          <input class="input100" v-model="password" type="password" placeholder="Password">
          <span class="focus-input100" data-placeholder="Password"></span>
        </div>
        <div class="container-login100-form-btn">
          <div class="wrap-login100-form-btn">
            <Button type="submit" text="Login"/>
          </div>
        </div> 
      </form>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card'
import Button from '@/components/Button'

export default {
  name: "PortfolioQuickView",
  computed : {
    loggedIn : function(){ return this.$store.getters.commonLoggedIn},
    portfolio: function(){ return this.$store.getters.getPortfolioCards}
  },
  components: {
    Card,
    Button,
  },
  methods: {
    open_stock_modal: function () {
      console.log('open a stock modal with all info on stock + graph') 
    },
    onRHLogin: function () {
      let username= this.username
      let password = this.password
      this.$store.dispatch('rhLogin', { "username": username, "password": password })
     .then((resp) => console.log(resp))
     .catch(err => console.error(err))
    },
  },
  data(){
    return {
      username: "",
      password : "",
    }
  },
};
</script>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
  grid-gap: 1.5rem;
  padding: .5rem;
}
 
.card {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  border: 2px solid #42b983;
  border-radius: 5px;
  padding: .5rem;
}
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.7);
  color: #fff
}
.portfolio-quick-view {
  background-color: ##2c3e50;
  margin: 5px;
  overflow: auto;
  border: 2px solid #42b983;
  padding: 15px;
  border-radius: 10px;
  max-height: 500px;
}
</style>
