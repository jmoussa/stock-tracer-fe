<template>
  <div class="d3-chart">
    <h2>D3 Charts </h2>
  </div>
</template>

<script>
export default {
  name: "D3Chart",
  props: {
    chart_data: String,
    height: String,
    width: String,
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
.d3-chart {
  width: 100%;

}
h2 {
  margin: 1rem;
  font-size: 2rem;
  color: #42b983;
}

</style>
