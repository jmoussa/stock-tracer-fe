<template>
  <div class="portfolio-quick-view" id="portfolio-quick-view">
    <div v-if="loggedIn">
      <div class="cards" id="rh-personal-portfolio">
        <h2>Positions</h2>
        <Card class="card" v-for="(body, ticker, index) in portfolio" :key="ticker" :style="{zIndex: -(index)}" :zIndex="-(index)" :initialTitle="ticker" :initialBody="body" @mouseover="selected_ticker=ticker"/>
      </div>
      <div class="d3-chart-container">
        <D3Chart :ticker="selected_ticker"/>
      </div>
    </div>
    <div v-else-if="status == 'loading'">
      <h1>Loading</h1>
      <div class="progress-6"></div> 
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
import D3Chart from '@/components/D3Chart'

export default {
  name: "PortfolioQuickView",
  computed : {
    status: function(){return this.$store.state.status},
    loggedIn : function(){ return this.$store.getters.commonLoggedIn},
    portfolio: function(){ return this.$store.getters.getPortfolioCards}
  },
  components: {
    Card,
    Button,
    D3Chart,
  },
  methods: {
    open_stock_modal: function () {
      console.log('open a stock modal with all info on stock + graph') 
    },
    onRHLogin: function () {
      this.$store.dispatch('rhGetPortfolio')
     .then((resp) => console.log(resp))
     .catch(err => console.error(err))
    },
  },
  data(){
    return {
      username: "",
      password : "",
      selected_ticker: ""
    }
  }
};
</script>

<style scoped>
.progress-6 {
  width:120px;
  height:22px;
  border-radius: 20px;
  color:#514b82;
  border:2px solid;
  position: relative;
}
.progress-6::before {
  content:"";
  position: absolute;
  margin:2px;
  inset:0 100% 0 0;
  border-radius: inherit;
  background:currentColor;
  animation:p6 1.5s infinite;
}
@keyframes p6 {
    100% {inset:0}
}
.cards {
  float: left;
  width: 25%;
  /*display: grid;*/
  /*grid-template-columns: repeat(4, 1fr);*/
  /*grid-auto-rows: auto;*/
  /*grid-gap: 1.5rem;*/
  padding: .5rem;
}
.cards > h2 {
  text-align: left;
  font-size: 2rem;
  padding-bottom: 1rem;
}
.card {
  cursor: pointer;
  box-shadow: 0 .5rem .8rem 0 rgba(0,0,0,0.2);
  border-radius: 10px;
  padding: .3rem;
  background-color: #050517;
  margin-bottom: -1.5rem;
  transition: transform .1s;
}
.card:hover {
  border: 2px solid #42b983;
  z-index: 1;
  transform: translateX(10px);
  box-shadow: 0 1.3rem 1.3rem 0 rgba(0,0,0,0.7);
}
.portfolio-quick-view {
  background-color: #2c3e50;
  padding: 0;
  margin-top: 5rem;
  overflow: visible;
}
.d3-chart-container {
  width:75%; 
  float: right;
}
</style>
