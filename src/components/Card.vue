<template>
  <div v-if="title" class="portfolio-card">
    <h3>{{ title }}</h3>
    <h4>{{ body.name }}</h4>
    <ul>
      <li v-for="(value, key) in body" :key="key" class="rh-portfolio-card-info">
        <div class="ticker-info" v-if="visible_fields.includes(key)">
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
    zIndex: {
      type: Number,
      default: 1,
    },
    initialBody: Object,
    initialTitle: String,
    visible_fields: {
      type: Array,
      default: function () {
        return ['price', 'quantity', 'percent_change', 'equity', 'equity_change'];
      }
    }
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
<style>
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
