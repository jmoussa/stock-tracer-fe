<template>
  <button @click="onClick()" :style="style" class="btn" type="{type}">{{text}}</button> 
</template>

<script>
export default {
  name: "Button",
  props: {
    text: String,
    color: {
      type:String,
      default: "#00A1E4"
    },
    variant: {
      type: String,
      default: "solid"
    },
    type: {
      type: String,
      default: "button"
    },
    buttonClicked: Function
  },
  computed: {
    style () {
      if(this.variant != "outline"){
        return 'background-color: ' + this.color;
      }else{
        return "background-color: #fff; border: 2px solid " + this.color + ";color:#000;";
      }
    }
  },
  methods: {
    onClick(){
      this.$emit('buttonClicked'); 
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
