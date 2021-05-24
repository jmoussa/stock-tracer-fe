<template>
  <div class="container">
  <form class="login login100-form validate-form" @submit.prevent="onLogin">
    <h1>Sign-in</h1>
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
    <div class="container-login100-form-btn">
      <div class="wrap-login100-form-btn">
        <Button type="submit" text="Login"/>
        <Button text="Sign Up" @buttonClicked="onRegister"/>
      </div>
    </div>
    <div class="text-center p-t-115">
      <span class="txt1">Don’t have an account?</span>
      <a class="txt2">Sign Up</a>
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
     .then(() => this.$router.push('/'))
     .catch(err => console.error(err))
    },
    onRegister(){
      let email = this.email
      let password = this.password
      this.$store.dispatch('register', { "username": email, "password": password })
     .then(() => this.$router.push('/'))
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
.wrap-input100 > input {
  color: #000;
}

</style>
