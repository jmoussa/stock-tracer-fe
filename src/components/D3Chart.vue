<template>
  <div class="d3-chart">
    <h2>D3 Charts {{ ticker }}</h2>

  </div>
</template>

<script>
export default {
  name: "D3Chart",
  props: {
    ticker: String
  },
  methods: {
    onClick(){
      console.log("portfolioButtonClicked"); 
    }
  },
  data() {
    return { 
      data: []
    }
  },
  created() {
    // Fetch data for d3 chart

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.d3-chart {
  position: fixed;
  height: 750px;
  width: 100%;
  margin: 0; 
  border: 2px solid #42b983;
  border-radius: 10px;
}
h2 {
  margin: 1rem;
  font-size: 2rem;
  color: #42b983;
}

</style>
