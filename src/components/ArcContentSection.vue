<template>
  <div class="ArcContentSection">
    <slot/>
  </div>
</template>

<script lang="js">

  export default {
    name: 'ArcContentSection'
  }
</script>

<style lang="scss">
  @use "sass:math";
  @import "../styles/variables";
  @import "~arc-cd/src/variables";

  .ArcContentSection {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: math.div($desktop, 2);
    text-align: center;
  }
</style>
