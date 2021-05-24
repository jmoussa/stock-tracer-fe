<template>
  <div v-if="title" class="portfolio-card">
    <h2>{{ title }}</h2>
    <ul>
      <li v-for="(value, key) in body" :key="key" class="rh-portfolio-card-info">{{ key }} : {{ value }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    initialBody: Object,
    initialTitle: String
  },
  data: function () {
    return {
      body: this.initialBody,
      title: this.initialTitle,
    }
  },
  methods: {
    onClick(){
      console.log("portfolioButtonClicked"); 
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
  color: #42b983;
}
</style>
