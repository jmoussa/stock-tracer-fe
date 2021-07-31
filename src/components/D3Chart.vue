<template>
  <div class="d3-chart">
    <h2 v-if="ticker_info">{{ ticker_info['Name'] }}</h2>
    <div class="chart">
      <div id="plot" v-if="historicals">
        <!--<h1>{{ ticker }} {{ OHLC_VAR }}s (day-over-day)</h1>-->
        <div class="macd-checkbox">
          <h3>{{ chart_view }}</h3>
          <input type="checkbox" id="toggle" v-on:click="toggleMACD(this)"/>
          <label for="toggle"></label>
        </div>
      </div>
      <div class="progress-6" v-else></div> 
      <div class="generic-container">
        <div class="wrapper" v-if="ticker_info">
          <div class="grid-info-item" v-for="(item, key, index) in ticker_info" :key="index"><li v-if="key !== 'Name'"><strong class="bold-accent">{{ key }}</strong>: {{ item }}</li></div> 
        </div>
        <div class="progress-6" v-else></div> 
      </div>
      <div class="earnings" v-if="earnings[ticker].length > 0">
        <h1 class="left">Earnings</h1>
        <div class="wrapper" v-if="earnings">
          <div class="grid-info-item" v-for="item in earnings[ticker]" :key="item">
            <div class="grid-info-item" v-for="(val, key, index) in item" :key="index">
              <li v-if="key !== 'Name'">
                <strong class="bold-accent">{{ key }}</strong>: {{ val }}
              </li>
            </div>
            <br>
          </div> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
export default {
  name: "D3Chart",
  computed: {
    ticker_info: function() { 
      const ti = this.$store.getters.getSelectedTickerInfo;
      let _ticker_info = {};
      for(let key in ti){
        if(key == "type"){
          if(ti[key] == "stock"){
            _ticker_info[this.toTitleCase(key.replaceAll("_", " "))] = this.toTitleCase(ti[key].replaceAll("_", " "));
          }else{
            _ticker_info[this.toTitleCase(key.replaceAll("_", " "))] = ti[key].toUpperCase();
          }
        }else if(key == "id"){
          continue;
        }else if(key == "pe_ratio"){
          _ticker_info["P/E Ratio"] = ti[key];
        }else if(key == "percentage"){
          _ticker_info[this.toTitleCase(key.replaceAll("_", " "))] = Math.round(ti[key] * 100) / 100 + "%";
        }else if(key == "quantity"){
          _ticker_info[this.toTitleCase(key.replaceAll("_", " "))] = Math.round(ti[key] * 100) / 100;
        }else{
          if( isNaN(parseFloat(ti[key]))){
            _ticker_info[this.toTitleCase(key.replaceAll("_", " "))] = ti[key];
          }else{
            _ticker_info[this.toTitleCase(key.replaceAll("_", " "))] = formatter.format(parseFloat(ti[key]));
          }
        }
      } 
      return _ticker_info;
    },
    chart_view: function() { 
      if(this.macd_toggle){
        return "MACD";
      }else{
        return "Historical";
      }
    },
    historicals: function() { return this.$store.getters.getSelectedTickerHistoricalData },
    transactions: function() { return this.$store.getters.getTransactions },
    account_profile: function() { return this.$store.getters.getAccountProfile },
    earnings: function() { return this.$store.getters.getEarnings },
    macd_data: function() { return this.$store.getters.getSelectedMACD },
    dividends: function() { return this.$store.getters.getDividends }
  }, 
  props: {
    ticker: String,
    OHLC_VAR: {
      type: String,
      default: "Close"
    },
  },
  mounted() {
    this.formatHistoricalChart(this.macd_toggle);
  },
  data: function() {
    return {
      macd_toggle: false
    }
  },
  watch: {
    ticker: function() {
      this.formatHistoricalChart(this.macd_toggle);
    },
    macd_data: function() { return this.$store.getters.getSelectedMACD },
    dividends: function() { return this.$store.getters.getDividends },
    transactions: function() { return this.$store.getters.getTransactions },
    account_profile: function() { return this.$store.getters.getAccountProfile },
    earnings: function() { return this.$store.getters.getEarnings },
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
        }else if(key == "percentage"){
          _ticker_info[this.toTitleCase(key.replaceAll("_", " "))] = Math.round(ti[key] * 100) / 100 + "%";
        }else{
          if( isNaN(parseFloat(ti[key]))){
            _ticker_info[this.toTitleCase(key.replaceAll("_", " "))] = ti[key];
          }else{
            _ticker_info[this.toTitleCase(key.replaceAll("_", " "))] = formatter.format(parseFloat(ti[key]));
          }
        }
      } 
      return _ticker_info;
    },
  },
  methods: {
    toggleMACD() {
      let _new = !this.macd_toggle;
      this.formatHistoricalChart(_new);
      this.macd_toggle = _new;
    },
    formatter() { 
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    },
    formatHistoricalChart(show_macd = false) {
      var OHLC_VAR = this.OHLC_VAR;
      var d3_rows = this.historicals;
      var dividends = this.dividends;
      var timeParse = d3.timeParse("%Y-%m-%d")
      
      // Parse Dividend Rows
      var dividend_rows = [];
      for(const i in dividends) {
        dividend_rows.push(dividends[i]) 
      }
      console.log("Dividends")
      console.log(dividend_rows)
      
      // D3 Code
      // set the dimensions and margins of the graph
      const margin = { top: 30, right: 25, bottom: 25, left: 25 };
      const width = 1200 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

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

      var x;
      var y;
      var min_y_val = 0;
      var min_x_val;
      var max_y_val; 
      var macd_rows = [];
      var signal_line_rows = [];
      // IF HISTORICAL DATA EXISTS
      if (d3_rows && d3_rows !== {}) {
        if (show_macd) {
          // IF SHOWING MACD---------------------------------------------------
          // Format MACD and Signal Lines
          var _rows = this.macd_data; // 'date' (x), 'macd' (y), 'signal' (y)
          for(const i in _rows){
            let row = _rows[i];
            let formatted_date = timeParse(row['date'].split("T")[0])
            let macd_row = {}
            let signal_line_row = {}
            macd_row['x'] = formatted_date
            signal_line_row['x'] = formatted_date
            if (!isNaN(row['macd'])) {
              macd_row['y'] = row['macd'];
              macd_rows.push(macd_row)
            }
            if (!isNaN(row['signal'])) {
              signal_line_row['y'] = row['signal'];
              signal_line_rows.push(signal_line_row); 
            }
          }
          
          // Add X axis --> it is a date format
          let x_range = d3.extent(macd_rows, function (d) {
            return d.x;
          })
          min_x_val = x_range[0]
          x = d3.scaleTime()
            .domain(
              d3.extent(macd_rows, function (d) {
                return d.x;
              })
            )
            .range([0, width]);
          
          // X axis
          svg
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

          // Add Y axis
          min_y_val = d3.min(macd_rows, function (d) {
            return d.y;
          });
          max_y_val = d3.max(macd_rows, function (d) {
            return d.y;
          });
          y = d3.scaleLinear()
            .domain([
              min_y_val - 1,
              max_y_val + 1,
            ])
            .range([height, 0]);
          
          // Y axis
          svg
            .append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));
          
          // Add the MACD line
          svg
            .append("path")
            .datum(macd_rows)
            .transition()
            .duration(200) 
            .attr("fill", "none")
            .attr("stroke", "#42b983")
            .attr("stroke-width", 2)
            .attr("d", d3.line()
              .x(function(d) { return x(d.x) })
              .y(function(d) { return y(d.y) })
            )
          
          // Add the Signal line
          svg
            .append("path")
            .datum(signal_line_rows)
            .transition()
            .duration(200)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("d", d3.line()
              .x(function(d) { return x(d.x) })
              .y(function(d) { return y(d.y) })
            )
        }else{
          // IF SHOWING HISTORICALS---------------------------------------------------
          // Format historical data 
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
          var data = d3_formatted_data;
          // Add X axis --> it is a date format
          let x_range = d3.extent(data, function (d) {
            return d.x;
          })
          min_x_val = x_range[0]
          x = d3.scaleTime()
            .domain(
              d3.extent(data, function (d) {
                return d.x;
              })
            )
            .range([0, width]);
          // X axis
          svg
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
          // Add Y axis
          max_y_val = d3.max(data, function (d) {
            return d.y;
          })
          y = d3.scaleLinear()
            .domain([
              0,
              max_y_val,
            ])
            .range([height, 0]);
          // Y axis
          svg
            .append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));
          
          // Add the stock history line 
          svg.append("path")
            .datum(data)
            .transition()
            .duration(200)
            .attr("fill", "none")
            .attr("stroke", "#42b983")
            .attr("stroke-width", 1)
            .attr(
              "d", d3.line()
                .x(function (d) { return x(d.x) })
                .y(function (d) { return y(d.y) })
            )
        }
        
        // This allows to find the closest X index of the mouse:
        var bisect = d3.bisector(function(d) { return d.x; }).left;
        
        // this is the vertical line to follow mouse
        var black_line = svg
          .append('g') 
          .append("line") 
            .attr("class", "mouse-line")
            .style("fill", "#2c0e37")
            .attr('stroke-width', '1px')
            .style("stroke", "#2c0e37")
            .style("opacity", 0);

        // Create the circle that travels along the curve of chart
        var focus = svg
          .append('g')
          .append('circle')
            .style("fill", "#42b983")
            .attr("stroke", "#42b983")
            .attr('r', 3)
            .style("opacity", 0)
        
        var focusLine =  svg
          .append('g') 
          .append("line") 
            .attr("class", "mouse-line")
            .style("fill", "#42b983")
            .attr('stroke-width', '1px')
            .style("stroke", "#42b983")
            .style("opacity", 0);

        var focusSecondary = svg
          .append('g')
          .append('circle')
            .style("fill", "red")
            .attr("stroke", "red")
            .attr('r', 3)
            .style("opacity", 0)

        var focusSecondaryLine =  svg
          .append('g') 
          .append("line") 
            .attr("class", "mouse-line")
            .style("fill", "#2c0e37")
            .attr('stroke-width', '1px')
            .style("stroke", "red")
            .style("opacity", 0);


        // Create the text that travels along the curve of chart
        var focusText = svg 
          .append('g')
          .append('text')
            .style("opacity", 0)
            .style("border", "2px solid white")
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        svg
          .append('rect')
          .style("fill", "none")
          .style("pointer-events", "all")
          .attr('width', width)
          .attr('height', height)
          .on('mouseover', () => {
            focus.style("opacity", 1)
            focusLine.style("opacity", 1)
            if (show_macd){
              focusSecondary.style("opacity", 1)
              focusSecondaryLine.style("opacity", 1)
            }
            focusText.style("opacity", 1)
            black_line.style("opacity", 1)
          })
          .on('mousemove', (event) => {
            // recover coordinate we need
            var x0 = x.invert(d3.pointer( event )[0]);
            var i; 
            var j;
            var selectedData;
            var selectedSignalLine;
            if(show_macd) {
              i = bisect(macd_rows, x0, 1);
              selectedData = macd_rows[i];
              j = bisect(signal_line_rows, x0, 1);
              selectedSignalLine = signal_line_rows[j];
            }else{
              i = bisect(data, x0, 1);
              selectedData = data[i];
            }
            
            focus
              .attr("cx", x(selectedData.x))
              .attr("cy", y(selectedData.y))
            focusLine
              .attr('x1', x(min_x_val))
              .attr('y1', y(selectedData.y))
              .attr('x2', x(selectedData.x))
              .attr('y2', y(selectedData.y))

            if(show_macd){
              focusSecondary
                .attr("cx", x(selectedSignalLine.x))
                .attr("cy", y(selectedSignalLine.y))
              focusSecondaryLine
                .attr('x1', x(min_x_val))
                .attr('y1', y(selectedSignalLine.y))
                .attr('x2', x(selectedSignalLine.x))
                .attr('y2', y(selectedSignalLine.y))
              black_line
                .attr('x1', x(selectedData.x))
                .attr('y1', y(min_y_val - 1))
                .attr('x2', x(selectedData.x))
                .attr('y2', y(max_y_val + 0.5))
                .attr('height', y(selectedData.y))
              
              focusText
                .html(
                  new Date(selectedData.x).toLocaleString('en-US', {
                    weekday: 'short', // long, short, narrow
                    day: 'numeric', // numeric, 2-digit
                    year: 'numeric', // numeric, 2-digit
                    month: 'long',
                  }) + 
                  "  -  MACD: " + 
                  Math.round(selectedData.y * 100) / 100 + 
                  "  -  Signal Line: " + 
                  Math.round(selectedSignalLine.y * 100) / 100
                )
                .attr("x", 15)
                .attr("y", y(max_y_val + 1) + 20)
                .style("fill", "white")
                .style("font-size", "2rem")


            }else{
              focusText
                .html(
                  new Date(selectedData.x).toLocaleString('en-US', {
                    weekday: 'short', // long, short, narrow
                    day: 'numeric', // numeric, 2-digit
                    year: 'numeric', // numeric, 2-digit
                    month: 'long',
                  }) + 
                  "  -  " + 
                  formatter.format(Math.round(selectedData.y * 100) / 100)
                )
                .attr("x", 15)
                .attr("y", y(min_y_val) - 20)
                .style("fill", "white")
                .style("font-size", "2rem")

              black_line
                .attr('x1', x(selectedData.x))
                .attr('y1', y(min_y_val))
                .attr('x2', x(selectedData.x))
                .attr('y2', y(max_y_val))
                .attr('height', y(selectedData.y))
            }

            
              //.attr('height', y(selectedData.y))
          })
          .on('mouseout', () => {
            focus.style("opacity", 0.8)
            focusLine.style("opacity", 0.8)
            if (show_macd){
              focusSecondary.style("opacity", 0.8)
              focusSecondaryLine.style("opacity", 0.8)
            }
            focusText.style("opacity", 0.8)
            black_line.style("opacity", 0.8)
          })
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

<style lang="scss" scoped>

input[type="checkbox"] {
	visibility: hidden;
  display:none;
	&:checked + label {
		//transform: rotate(360deg);
		background-color: #42b983;
		&:before {
			transform: translateX(200%);
			background-color: #000;
		}
	}
}

label {
	display: flex;
  width: 83px;
	height: 40px;
  border: 2px solid #42b983;
	border-radius: 99em;
  margin: auto;
	position: relative;
	transition: transform .5s ease-in-out;
	transform-origin: 50% 50%;
	cursor: pointer;
	
	&:before {
		transition: transform .5s ease;
		content: "";
		display: block;
		position: absolute;
		width: 20px;
		height: 20px;
		background-color: #FFF;
		border-radius: 50%;
		top: 9px;
		left: 9px;
	}
}

.generic-container {
  border: 2px solid #42b983;
  border-radius: 2rem;
  margin: 4rem 0;
  width: 100%;
  text-align: center;
  padding: 0;
}
li {
  list-style: none;
  text-align: left;
}
.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 2rem;
  grid-auto-rows: minmax(10px, auto);
}
.grid-info-item {
  margin: 0 4px;
  padding: 0 2px;
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
  margin: 2px;
  inset: 0 100% 0 0;
  border-radius: inherit;
  background:currentColor;
  animation:p6 1.5s infinite;
}
@keyframes p6 {
    100% {inset:0}
}
.d3-chart {
  height: 750px;
  width: 100%;
  margin: 0; 
  text-align: center;
  h3 {
    color: #fff;
  }
}

h2 {
  font-size: 2rem;
  color: #42b983;
}
.bold-accent {
  color: #42b983;
}
.left {
  text-align: left;
}
.macd-checkbox {
  width: 250px;
  margin: auto;
  float: left;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
