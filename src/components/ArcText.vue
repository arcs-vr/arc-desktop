<template>
  <component
    :is="tag"
    class="ArcText"
  >
    <slot/>
  </component>
</template>

<script lang="ts">
  export default {
    name: 'ArcText',

    props: {
      tag: {
        type: String,
        default: 'p'
      }
    }
  }
</script>

<style lang="scss">
  @import "../styles/variables";
  @import "~arc-cd/src/variables";

  .ArcText {
    font-size: 1.2rem;
    line-height: 1.1;
    text-align: center;

    &:is(h1, h2, h3) {
      font-size: 1.6rem;
    }

    strong {
      color: $theme-secondary;
      font-style: normal;
    }

    &:is(code) {
      border: 1px solid $theme-light;
      font-size: 3rem;
      letter-spacing: 4px;
      padding: .5rem;
    }
  }
</style>