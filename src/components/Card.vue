<template>
  <div v-if="title" class="portfolio-card">
    <h3>{{ title }}</h3>
    <ul>
      <li v-for="(value, key) in body" :key="key" class="rh-portfolio-card-info">
        <div v-if="key != 'id'">
          <strong>{{ key }}</strong>: {{ value }}
        </div> 
      </li>
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
  margin: 1rem;
  color: #42b983;
}
ul {
  padding: 1rem 1.5rem;
  text-align: left;
  list-style-type: none;
}
</style>
