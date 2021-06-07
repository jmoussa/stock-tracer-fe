<template>
  <div class="d3-chart" @click="onClick">
    <h2>{{ ticker }}</h2>
    <div class="chart">
      {{ticker_info}}

      <div v-if="historicals != undefined">
        {{historicals}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "D3Chart",
  computed: {
    ticker_info: function() { return this.$store.getters.getSelectedTickerInfo },
    historicals: function() { return this.$store.getters.getSelectedTickerHistoricalData }
  }, 
  props: {
    ticker: String
  },
  methods: {
    onClick(){
      console.log("Clicked"); 
    }
  },
  data() {
    return { 
      data: []

    }
  },
  mounted() {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.d3-chart {
  position: fixed;
  height: 750px;
  width: 70%;
  margin: 0; 
  /*border: 2px solid #42b983;*/
  /*border-radius: 10px;*/
}

h2 {
  margin: 1rem;
  font-size: 2rem;
  color: #42b983;
}

</style>
