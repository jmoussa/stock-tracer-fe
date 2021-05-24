<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <PortfolioQuickView/> 
  </div>
</template>

<script>
import PortfolioQuickView from '@/components/PortfolioQuickView'

export default {
  name: "Home",
  components: {
    PortfolioQuickView,
  },
};
</script>
