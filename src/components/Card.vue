<template>
  <div v-if="title" class="portfolio-card">
    <h3>{{ title }}</h3>
    <h4>{{ body.name }}</h4>
    <ul>
      <li v-for="(value, key) in body" :key="key" class="rh-portfolio-card-info">
        <div v-if="left_pill == key" class="left-pill">
          <span>$ {{ Math.round(100*value)/100 }}</span>
        </div> 
        <div v-if="right_pill == key" class="right-pill">
          <span>{{ Math.round(100*value)/100 }}%</span>
        </div>
        <!-- 
        <div class="ticker-info" v-if="visible_fields.includes(key)">
          <strong>{{ key }}</strong>: {{ value }}
        </div> 
        -->
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
    },
    left_pill: {
      type: String,
      default: "equity_change"
    },
    right_pill: {
      type: String,
      default: "percent_change"
    },
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
.portfolio-card {
  height: 20rem;
}
h3 {
  margin: 1rem;
  color: #42b983;
}
ul {
  padding: 1rem 1.5rem;
  text-align: left;
  list-style-type: none;
}
.left-pill {
  z-index: 5;
  float: left;
  font-size: 1rem;
  text-align: center;
  width: 50%;
  margin: auto;
  padding: 1rem;
  border: 3px solid #42b983;
  height: 3.5rem;
  border-radius: 20px 0px 0px 20px;
}
.right-pill {
  z-index: 5;
  float: right;
  font-size: 1rem;
  text-align: center;
  width: 50%;
  margin: auto;
  padding: 1rem;
  border: 3px solid #42b983;
  height: 3.5rem;
  border-radius: 0px 20px 20px 0px;
}
.rh-portfolio-card-info {
  z-index: 5;
  width: 100%;
}
</style>
