<template>
  <div class="about">
    <h1>About Stock Tracer</h1>
    <div class="generic-container">
      <div class="element"> 
        <h2>What is Stock Tracer?</h2> 
        <p>
          This stock tracer is meant to serve as an extention to your conventional brokerage app.
          Currently we're basing it off of Robinhood but I later hope to include additional brokerages.
        </p>
      </div>
      <div class="element"> 
        <h2>What can Stock Tracer do for me?</h2> 
        <p>
          Stock Tracer adds additional views and metrics for you to visualize your portfolio.
        </p>
        <p>
          Some of these features include:
        </p>
        <ul>
          <li>Visualizing market entrypoints and exitpoints along the historical ticker chart</li>
          <li>The ability to overlay the MACD and other various signal lines over the historical ticker chart</li>
          <li>Yahoo Finance based charts with Robinhood personalized portfolio (more brokers coming soon)</li>
        </ul>
      </div>
    </div> 
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "About",
  methods: {
    onClick(){
      console.log("onClick in Parent Component")
    }
  }
};
</script>

<style lang="scss" scoped>
.generic-container {
  border: 2px solid #42b983;
  border-radius: 2rem;

  margin: 0 16rem;
  padding: 2rem;
  text-align: left;
  .element {
    margin: 2rem;
    padding: 5px 2rem;
    p {
      margin: 5px 2rem;
    }
    ul {
      margin: 0 4rem;
    }
    
  }
}
.about{
  margin: 5rem;
}
</style>