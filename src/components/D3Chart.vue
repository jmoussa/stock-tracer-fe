<template>
  <div class="d3-chart">
    <h2>{{ ticker }}</h2>
    <div class="chart">
      <div class="generic-container">
        <div class="wrapper" v-if="ticker_info">
          <div class="grid-info-item" v-for="(item, key, index) in ticker_info" :key="index"><li><strong>{{ key }}</strong>: {{ item }}</li></div> 
        </div>
        <div class="progress-6" v-else></div>
      </div>
      <div id="plot" v-if="historicals">
        <h1>{{ ticker }} Historicals</h1>
      </div>
      <div class="progress-6" v-else></div> 
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "D3Chart",
  computed: {
    ticker_info: function() { 
      const ti = this.$store.getters.getSelectedTickerInfo;
      let _ticker_info = {};
      for(let key in ti){
        if(key == "type"){
          _ticker_info[this.toTitleCase(key.replaceAll("_", " "))] = ti[key].toUpperCase();
        }else if(key == "id"){
          continue;
        }else if(key == "pe_ratio"){
          _ticker_info["P/E Ratio"] = ti[key];
        }else{
          _ticker_info[this.toTitleCase(key.replaceAll("_", " "))] = ti[key];
        }
      } 
      return _ticker_info;
    },
    historicals: function() { return this.$store.getters.getSelectedTickerHistoricalData }
  }, 
  props: {
    ticker: String
  },
  mounted() {
    this.formatHistoricalChart("High");
  },
  watch: {
    ticker: function() {
      this.formatHistoricalChart();
    },
    ticker_info: function() { 
      const ti = this.$store.getters.getSelectedTickerInfo;
      let _ticker_info = {};
      for(let key in ti){
        if(key == "type"){
          _ticker_info[key] = ti[key].toUpperCase();
        }else if(key == "id"){
          continue; 
        }else if(key == "pe ratio"){
          _ticker_info["P/E Ratio"] = ti[key];
        }else{
          _ticker_info[key] = ti[key];
        }
      } 
      return _ticker_info;
    }
  },
  methods: {
    formatHistoricalChart(OHLC_VAR = "High") {
      var d3_rows = this.historicals;
      var timeParse = d3.timeParse("%Y-%m-%d")
      
      if (d3_rows && d3_rows !== {}) {
        let d3_formatted_data = [];
        for (const time_key in d3_rows) {
          let formatted_date = timeParse(time_key.split(" ")[0]);
          let formatted_row = d3_rows[time_key];
          let row = {};
          if  (!isNaN(formatted_row[OHLC_VAR])) {
            row["x"] = formatted_date;
            row["y"] = formatted_row[OHLC_VAR];
            d3_formatted_data.push(row);
          }
        }
        console.log("D3 Formatted Data") 
        console.log(d3_formatted_data);
        
        // D3 Code
        // set the dimensions and margins of the graph
        const margin = { top: 10, right: 25, bottom: 25, left: 25 };
        const width = 1200 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        // Clear Charts
        d3.select("#plot").selectAll("svg").remove();

        // append the svg object to the body of the page
        const svg = d3.select("#plot")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

        const data = d3_formatted_data;

        // Add X axis --> it is a date format
        const x = d3.scaleTime()
          .domain(
            d3.extent(data, function (d) {
              return d.x;
            })
          )
          .range([0, width]);
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
          .domain([
            0,
            d3.max(data, function (d) {
              return d.y;
            }),
          ])
          .range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));

        // Add the line
        svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 2)
          .attr(
            "d",
            d3
              .line()
              .x(function (d) {
                return x(d.x);
              })
              .y(function (d) {
                return y(d.y);
              })
          );
      } else {
        console.error(this.ticker + " has no rows. No ticker was selected.");
      } 
    },
    toTitleCase(str) {
      return str.replace(/\w\S*/g, function(txt){
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    },
    
  },
};
</script>

<style scoped>
li {
  list-style: none;
  text-align: left;
}
.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 2px solid rgba(66, 185, 131, 0.5);
  border-radius: 2rem;
  padding: 2rem;
  grid-auto-rows: minmax(10px, auto);
  margin-bottom: 5rem;
}
.grid-info-item {
  margin: 2px;
  padding: 1px;
}

.progress-6 {
  width:100%;
  height:300px;
  border-radius: 20px;
  margin: auto;
  color: rgba(66, 185, 131, 1);
  border:2px solid;
  position: relative;
}
.progress-6::before {
  content:"";
  position: absolute;
  margin:2px;
  inset:0 100% 0 0;
  border-radius: inherit;
  background:currentColor;
  animation:p6 1.5s infinite;
}
@keyframes p6 {
    100% {inset:0}
}
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
