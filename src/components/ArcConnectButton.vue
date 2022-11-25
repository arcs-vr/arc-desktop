<template
  functional
  v-once
>
  <button
    @click="listeners['arc-connect']"
    class="arc-connect-button"
    type="button"
  >
    <img
      src="~arc-cd/images/videogame_asset-24px.svg"
      alt="Game controller symbol"
      class="icon"
      title="Connect remote controller"
    >
  </button>
</template>

<script>
  /**
   * Button that displays next to the Google enter-VR button and that calls a callback attached to 'arc-connect'
   */
  export default {
    name: 'arc-connect-button'
  }
</script>

<style
  lang="scss"
  scoped
>
  @import '~arc-cd/src/variables';

  $arc-enter-vr-button-padding: 20px;
  $arc-enter-vr-button-width: 58px;
  $arc-enter-vr-button-height: 34px;

  .arc-connect-button {
    background-color: rgba(0, 0, 0, 0.35);
    border: 0;
    border-radius: 8px;
    bottom: $arc-enter-vr-button-padding;
    cursor: pointer;
    min-height: $arc-enter-vr-button-height;
    min-width: $arc-enter-vr-button-width;
    position: absolute;
    right: calc(#{2 * $arc-enter-vr-button-padding} + #{$arc-enter-vr-button-width});
    transition: background-color .05s ease;
    z-index: 999;

    &:hover {
      background-color: darken($theme-secondary, 20%);
    }
  }

  .icon {
    bottom: 0;
    display: block;
    height: 100%;
    left: 0;
    object-fit: cover;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
  }
</style>

<style lang="scss">
  @import '~arc-cd/src/variables';

  .a-enter-vr-button:hover {
    background-color: darken($theme-primary, 20%) !important;
  }
</style>
