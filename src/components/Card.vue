<template>
  <div v-if="title" class="portfolio-card">
    <h3>{{ title }}</h3>
    <h4>{{ initialBody.name }}</h4>
    <div v-for="(value, key) in body" :key="key" class="rh-portfolio-card-info">
      <div v-if="left_pill == key && value < 0" class="left-pill red-pill">
        <span>$ {{ Math.round(100*value)/100 }}</span>
      </div> 
      <div v-if="left_pill == key && value >= 0" class="left-pill green-pill">
        <span>$ +{{ Math.round(100*value)/100 }}</span>
      </div>
      <div v-if="right_pill == key && value < 0" class="right-pill red-pill">
        <span>{{ Math.round(100*value)/100 }}%</span>
      </div>
      <div v-if="right_pill == key && value >= 0" class="right-pill green-pill">
        <span>+{{ Math.round(100*value)/100 }}%</span>
      </div>
    </div>
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
        return ['percent_change', 'equity_change'];
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
      body: Object.keys(this.initialBody).filter(key => this.visible_fields.includes(key) ).reduce((obj, key) => {
        obj[key] = this.initialBody[key];
        return obj;
      }, {}),
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
  height: 15rem;
  width: 20rem;
  margin: 0;
  background: linear-gradient(355deg, rgba(2,0,36,1) 0%, rgba(0,0,0,1) 89%, rgba(255,255,255,1) 120%);
}

.portfolio-card:hover {
  background: linear-gradient(350deg, rgba(2,0,36,1) 0%, rgba(0,0,0,1) 89%, rgba(255,255,255,1) 110%);
}
h3 {
  margin: 1rem;
  color: #42b983;
}
.red-pill { 
  background: #DF2935;
}
.green-pill { 
  background: #42b983
}
.left-pill {
  z-index: 5;
  float: left;
  text-decoration: bold;
  font-size: 1.2rem;
  text-align: center;
  width: 50%;
  margin: auto;
  padding: 1rem;
  border-right: 1px solid black;
  border-radius: 20px 0px 0px 20px;
}
.right-pill {
  z-index: 5;
  float: right;
  font-size: 1.2rem;
  text-align: center;
  width: 50%;
  margin: auto;
  padding: 1rem;
  border-left: 1px solid black;
  border-radius: 0px 20px 20px 0px;
}
.rh-portfolio-card-info {
  z-index: 5;
  text-align: center;
  margin: auto;
  width: 80%;
  margin-top: 2rem;
}
</style>
