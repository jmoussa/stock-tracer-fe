<template>
  <div class="login">
    <h1>This is an about page</h1>
    <Button text="Login" @buttonClicked="onLogin"/>
    <Button text="Register" @buttonClicked="onRegister"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Button from '@/components/Button';

export default {
  name: "Login",
  methods: {
    onLogin(){
      console.log("Dispatch Login")
    },
    onRegister(){
      console.log("Dispatch Register")
    }
  },
  components: {
    Button
  }
};
</script>

<style scoped>

</style>
