<template>
  <div class="login-container">
    <form class="login login100-form validate-form" @submit.prevent="onLogin">
      <h1>Sign-in to Stock Tracer</h1>
      <span class="login100-form-title p-b-48">
        <i class="zmdi zmdi-font"></i>
      </span>
      <div class="wrap-input100 validate-input" data-validate="Valid email is: a@b.c">
        <input class="input100" v-model="email" type="email" placeholder="Email">
        <span class="focus-input100" data-placeholder="Email"></span>
      </div>
      <div class="wrap-input100 validate-input" data-validate="Enter password">
        <span class="btn-show-pass">
          <i class="zmdi zmdi-eye"></i>
        </span>
        <input class="input100" v-model="password" type="password" placeholder="Password">
        <span class="focus-input100" data-placeholder="Password"></span>
      </div>
      <div class="button-group-1">
        <div class="container-login100-form-btn">
          <div class="wrap-login100-form-btn">
            <Button color="#42b983" type="submit" text="Login"/>
            <Button color="#2c3e50" variant="outline" text="Sign Up" @buttonClicked="onRegister"/>
          </div>
        </div>
      </div>
    </form>
  </div> 
</template>

<script>
import Button from '@/components/Button';

export default {
  name: "Login",
  methods: {
    onLogin(){
      let email = this.email
      let password = this.password
      this.$store.dispatch('login', { "username": email, "password": password })
        .then(() => {
          this.$store.dispatch('rhGetPortfolio')
          this.$router.push('/')
        })
        .catch(err => console.error(err))
    },
    onRegister(){
      let email = this.email
      let password = this.password
      this.$store.dispatch('register', { "username": email, "password": password })
        .then(() => {
          this.$store.dispatch('rhGetPortfolio')
          this.$router.push('/')
        })
        .catch(err => console.error(err))
    }
  },
  components: {
    Button
  },
  data(){
    return {
      email : "",
      password : ""
    }
  },
};
</script>

<style scroped>
* {
  color: #fff;
}
h1 {
  margin: 2rem 0;
}
.wrap-input100 > input {
  color: #000;
}
.login-container {
  padding: 1rem;
  margin: 2rem auto;
  width: 50%;
  overflow: auto;
  min-height: 200px;
  border: 1px solid  #42b983;
  padding: 20px;
  border-radius: 10px;
}
input {
  margin: .5rem;
  font-size: 1.2rem;
  border: 3px solid #555;
  padding: 10px;
  border-radius: 10px;
}
.button-group-1 {
  margin: 1rem;
}
</style>
