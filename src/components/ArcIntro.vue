<template v-once>
  <div class="intro">
    <div class="column">
      <div class="section">
        <img
          alt="The lettering ARCS stylized in isometric design"
          class="logo-image"
          src="~arc-cd/images/arc-logo-small.jpg"
          title="ARCS: A-Frame Remote Controls System"
        >
        <h1 class="title">Remote Controls</h1>
      </div>
      <div class="section">
        <p class="paragraph">
          <strong>Start interacting</strong>
          with the experience on your smartphone or computer
          <strong>from this device</strong>.
        </p>
      </div>
    </div>
    <div class="column">
      <div class="section">
        <p>
          <i>1:</i> Open the app here:
          <router-link
            :to="{ name: $arcOptions.routeApp }"
            v-text="appUrl"
          />
        </p>
      </div>
      <div class="section">
        <p>
          <i>2:</i> <strong>Open the remote settings</strong>
          <span>
            (
            <img
              alt="Game controller symbol"
              class="icon"
              src="~arc-cd/images/videogame_asset-24px.svg"
              title="Connect remote controller"
            >
            )
          </span>
          and <i>scan this QR code</i>.
        </p>
        <qr-code
          :options="{ color: {dark: themeColors['dark'], light: themeColors['secondary']}, width: 300}"
          :value="deviceName"
          class="qr-code"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import VueQrcode from '@chenfengyuan/vue-qrcode/src/index.js'
  import ThemeColors from 'arc-cd/src/_exports.scss?module'

  export default {
    name: 'arc-intro',
    components: { 'qr-code': VueQrcode },

    props: {
      deviceName: {
        type: String,
        required: true
      },

      themeColors: {
        type: Object,
        default () {
          console.info(ThemeColors)
          return ThemeColors
        }
      }
    },

    computed: {
      /**
       * Get the remote URL from the current host
       * @return {string}
       */
      appUrl () {
        const path = this.$router.resolve({ name: this.$arcOptions.routeApp }).href
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
  @import "../styles/variables";
  @import "~arc-cd/src/variables";
  @import "~arc-cd/src/fonts";
  @import "~arc-cd/src/typography";

  .intro {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 2rem;
    text-align: center;
    width: 100%;

    .logo-image {
      margin-top: -28px;
      max-height: 20vmin;
      max-width: 20vmin;
    }

    .title {
      font-size: 1.6rem;
      line-height: 1;
      margin-top: 0;
    }

    .paragraph {
      font-size: 1.2rem;
      text-align: center;
    }

    .section {
      margin: auto;
      max-width: math.div($desktop, 2);
    }

    i {
      color: $theme-secondary;
      font-style: normal;
    }

    .icon {
      display: inline;
      vertical-align: middle;
    }

    @media (orientation: landscape) {
      flex-direction: row;
    }

    .column {
      width: 100%;

      @media (orientation: landscape) {
        width: 50%;
      }
    }

    .qr-code {
      max-height: 30vh;
      max-width: 30vh;

      @media (orientation: landscape) {
        max-height: 40vh;
        max-width: 40vh;
      }
    }
  }
</style>
