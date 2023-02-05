<template>
  <div class="ArcConnectModal">
    <div class="ArcConnectModal__header">
      <button
        class="ArcConnectModal__closeButton"
        type="button"
        @click="$emit('close')"
      >
        Close
      </button>
    </div>
    <div class="ArcConnectModal__body">
      <img
        alt="The lettering ARCS stylized in isometric design"
        class="ArcConnectModal__logo"
        src="~arc-cd/images/arc-logo-small.jpg"
        title="ARCS: A-Frame Remote Controls System"
      >
      <h1 class="title">Remote Controlling this VR Experience</h1>

      <p>
        Control this experience from another smartphone, tablet or pc.<br>
        Follow these two easy steps:
      </p>

      <p>
        <i>1)</i>&nbsp;On your second device, open the remote control website:
        <RouterLink
          :to="{name: $arcOptions.routeRemote}"
          v-text="remoteUrl"
        />
      </p>

      <p>
        <i>2)</i>&nbsp;Enter the code shown on the other device.
      </p>

      <form
        class="device-name"
        @submit.prevent="connect"
      >
        <input
          id="deviceName"
          v-model="deviceName"
          autofocus
          class="device-name__input"
          name="deviceName"
          placeholder="e.g. x17aB"
          type="text"
          @keydown.enter="connect"
        />
        <button
          class="device-name__button"
          type="submit"
        >Connect
        </button>
      </form>
    </div>
  </div>
</template>

<script>
  import ThemeColors from 'arc-cd/src/_variables.scss?module'

  /**
   * Displays a modal with connection instructions and triggers a 'arc-remote-name' event with the scanned device name.
   */
  export default {
    name: 'arc-connect-modal',

    props: {
      themeColors: {
        type: Object,
        default () {
          return ThemeColors
        }
      }
    },

    data () {
      return {
        deviceName: null,
        showInfo: false
      }
    },

    methods: {
      connect () {
        this.$emit('arc-remote-name', this.deviceName)
      }
    },

    computed: {
      /**
       * Get the remote URL from the current host
       * @return {string}
       */
      remoteUrl () {
        const path = this.$router.resolve({ name: this.$arcOptions.routeRemote }).href
        return `${window.location.host}${path === '/' ? '' : path}`
      }
    }
  }
</script>

<style
  lang="scss"
  scoped
>
  @use "sass:math";
  @import "~arc-cd/src/variables";
  @import "~arc-cd/src/fonts";
  @import "~arc-cd/src/typography";

  .ArcConnectModal {
    align-items: center;
    background-color: $theme-dark;
    color: $theme-light;
    display: flex;
    flex-direction: column;
    font-family: sans-serif, monospace;
    height: 100%;
    justify-content: center;
    left: 50%;
    overflow-x: hidden;
    overflow-y: scroll;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    z-index: 11000;

    &__header {
      position: absolute;
      right: 1rem;
      top: 1rem;
    }

    .device-name {
      align-items: center;
      display: flex;
      flex-direction: row;
      gap: 1rem;

      @media screen and (max-width: $desktop) {
        flex-direction: column;
      }

      &__input {
        border: 1px solid $theme-light;
        color: $theme-light;
        display: flex;
        flex-grow: 1;
        flex-shrink: 1;
        font-family: monospace;
        font-size: 1.5rem;
        height: 2.5rem;
        letter-spacing: 4px;
        padding: 1rem;

        @media screen and (max-width: $desktop) {
          text-align: center;
        }
      }

      &__button {
        align-items: center;
        background-color: $theme-primary;
        border: 0;
        color: $theme-light;
        cursor: pointer;
        display: flex;
        flex-grow: 0;
        flex-shrink: 0;
        font-size: 2rem;
        height: 2.5rem;
        padding: 1rem;
      }
    }

    &__body {
      align-items: center;
      display: flex;
      flex-direction: column;
      font-size: 1.2rem;
      gap: 1rem;
      justify-content: space-between;
      max-width: math.div($desktop, 2);
      padding: 1rem;
      text-align: center;
      width: 100%;
    }

    &__logo {
      margin-top: -28px;
      max-height: 20vmin;
      max-width: 20vmin;
    }

    .title {
      font-size: 1.6rem;
      margin: 0;
    }

    &__closeButton {
      background: transparent;
      border: 0;
      color: $theme-light;
      cursor: pointer;
      font-size: 1rem;
      margin-left: auto;
    }

    a {
      color: $theme-secondary;
    }

    i {
      color: $theme-secondary;
      font-style: normal;
    }

    img {
      // A-Frame hides all images for assets by default
      display: initial !important;
    }
  }
</style>
