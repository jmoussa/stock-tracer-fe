<template>
  <NavBar/> 
  <div class="container">
    <router-view />
  </div>
</template>


<script>
import NavBar from '@/components/NavBar';

export default {
  name: "App",
  components: {
    NavBar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #F5F5F5;
}



@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: #2c3e50;
}

.container {
  margin: 2rem auto;
  width: 100%;
  overflow: visible;
  padding: 20px;
  border-radius: 10px;
}

.btn {
  display: inline-block;
  background: #000;
  color: #F5F5F5;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}

.btn:focus {
  outline: none;
}

.btn:active {
  transform: scale(0.98);
}

.btn-block {
  display: block;
  width: 100%;
}

</style>
