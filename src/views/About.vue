<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Button text="Hello World" @buttonClicked="onClick"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Button from '@/components/Button';

export default {
  name: "About",
  methods: {
    onClick(){
      console.log("onClick in Parent Component")
    }
  },
  components: {
    Button
  }
};
</script>
