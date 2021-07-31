<template>
  <div class="portfolio-quick-view" id="portfolio-quick-view">
    <div v-if="loggedIn && selected_ticker">
      <div class="cards" id="rh-personal-portfolio">
        <h2>Positions</h2>
        <Card class="card" v-for="(body, ticker, index) in portfolio" :key="ticker" :style="{zIndex: -(index)}" :zIndex="-(index)" :initialTitle="ticker" :initialBody="body" @mouseover="fetchTicker(ticker)"/>
      </div>
      <div class="d3-chart-container">
        <D3Chart :ticker="selected_ticker" v-if="selected_ticker != undefined"/>
        <div v-else class="progress-6"></div>
      </div>
    </div>
    <div v-else-if="status == 'loading'">
      <h1>Loading</h1>
      <div class="progress-6"></div> 
    </div>
    <div v-else id="rh-portfolio-login">
      <form class="login login100-form validate-form" @submit.prevent="onRHLogin">
        <h1>Sign-in to Robinhood</h1>
        <h3>(Requires Authentication app like Google Authenticator or Okta Verify)</h3>
        <br>
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
        <div class="wrap-input100 validate-input">
          <input class="input100" v-model="mfa_code" type="text" placeholder="MFA Code">
          <span class="focus-input100" data-placeholder="MFA Code (check authentication app)"></span>
        </div>
        <div class="container-login100-form-btn">
          <div class="wrap-login100-form-btn">
            <Button type="submit" text="Login"/>
          </div>
        </div> 
        <div class="error-message" v-if="display_error">
          <p>{{ error_message }}</p>
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
    status: function(){ return this.$store.getters.status },
    display_error: function(){ return this.$store.getters.isErrorDisplayed },
    error_message: function(){ return this.$store.getters.getErrorMessage },
    show_mfa: function(){ return this.$store.getters.getShowMFA },
    loggedIn : function(){ return this.$store.getters.commonLoggedIn},
    portfolio: function(){ return this.$store.getters.getPortfolioCards},
    selected_ticker: function(){ 
      if(this.$store.getters.getSelectedTicker == null || this.$store.getters.getSelectedTicker == undefined) {
        if (this.portfolio !== null && this.portfolio !== undefined){
          return Object.keys(this.portfolio)[0];
        }else{
          return null;
        }
      }else{
        return this.$store.getters.getSelectedTicker;
      }
    }
  },
  watch: {
    show_mfa: function(){ return this.$store.getters.getShowMFA },
    portfolio: function(){ return this.$store.getters.getPortfolioCards},
    display_error: function(){ return this.$store.getters.isErrorDisplayed },
    error_message: function(){ return this.$store.getters.getErrorMessage },
    selected_ticker: function(){ 
      if(this.$store.getters.getSelectedTicker == null || this.$store.getters.getSelectedTicker == undefined) {
        if (this.portfolio !== null && this.portfolio !== undefined){
          return Object.keys(this.portfolio)[0];
        }else{
          return null;
        }
      }else{
        return this.$store.getters.getSelectedTicker;
      }
    }
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
      this.$store.dispatch('getRobinhoodInfo', {"username": this.username, "password": this.password, "mfa_code": this.mfa_code})
        .then(data => {
          console.log("Robinhood Info")
          console.log(data)
          if (data !== false){
            this.$store.commit("set_show_mfa", false)
            this.$store.commit("remove_error_message")
          }else{
            let error_message = "Failed Login Info";
            this.$store.commit("display_error_message", error_message)
          }
        })
        .catch(() => this.$store.commit("set_show_mfa", false))
    },
    fetchTicker(ticker){
      this.$store.commit("set_selected_ticker", ticker);
      this.$store.commit('set_selected_ticker_info', this.portfolio[ticker]);
    }
  },
  data(){
    return {
      username: "",
      password : "",
      mfa_code: "",
    }
  }
};
</script>

<style lang="scss" scoped>
.error-message {
  p {
    color: red;
    font-size: 120%;
  }
  padding: 2rem;
  border: 2px solid rgba(66, 185, 131, 1);
  border-radius: 2rem;
}
.progress-6 {
  width:100%;
  height:300px;
  border-radius: 20px;
  margin: auto;
  color: rgba(66, 185, 131, 1);
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
  padding: .5rem;
  padding-bottom: 5rem;
}
.cards > h2 {
  text-align: left;
  font-size: 2rem;
  padding-bottom: 1rem;
}
.card {
  cursor: pointer;
  box-shadow: 0 .5rem .8rem 0 rgba(0,0,0,0.2);
  border-radius: 1rem;
  padding: .2rem;
  background-color: #050517;
  margin-bottom: -2rem;
  transition: transform .1s;
}
.card:hover {
  border: 2px solid #42b983;
  z-index: 1;
  transform: scale(1.07) translateX(10px);
  box-shadow: 0 1.3rem 1.3rem 0 rgba(0,0,0,0.7);
}
.portfolio-quick-view {
  background-color: #2c3e50;
  padding: 0;
  margin: 0;
  margin-top: 5rem;
  overflow: visible;
}
#rh-personal-portfolio {
  height: 85.6vh;
  width: 24%;
  overflow-x: visible;
  overflow-y: scroll;
  display: block;
}
.d3-chart-container {
  display: block;
  height: 85.6vh;
  padding: 0;
  margin: 0;
  overflow-x: visible;
  overflow-y: scroll;
  width: 76%; 
  float: right;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.d3-chart-container::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.d3-chart-container {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Hide scrollbar for Chrome, Safari and Opera */
#rh-personal-portfolio::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
#rh-personal-portfolio {  
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

</style>
