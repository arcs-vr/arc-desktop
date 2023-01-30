<template v-once>
  <div class="ArcIntro">
    <ArcContentSection>
      <img
        alt="The lettering ARCS stylized in isometric design"
        class="logo-image"
        src="~arc-cd/images/arc-logo-large.jpg"
        title="ARCS: A-Frame Remote Controls System"
      >

      <ArcText tag="h1">Remote Controls</ArcText>
    </ArcContentSection>

    <ArcContentSection>
      <ArcText>Start interacting with the experience on your smartphone or computer from this device.</ArcText>
    </ArcContentSection>

    <ArcContentSection>
      <ArcText>
        <strong>1:</strong> Open the app here:

        <router-link
          :to="{ name: $arcOptions.routeApp }"
          v-text="appUrl"
        />
      </ArcText>
    </ArcContentSection>
    <ArcContentSection>
      <ArcText>
        <strong>2:</strong> Open the remote settings

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
        and enter this code:
      </ArcText>

      <ArcText tag="code">
        {{ deviceName }}
      </ArcText>
    </ArcContentSection>
  </div>
</template>

<script>
  import ThemeColors from 'arc-cd/src/_variables.scss?module'
  import ArcContentSection from './ArcContentSection'
  import ArcText from './ArcText'

  export default {
    name: 'arc-intro',
    components: { ArcText, ArcContentSection },
    props: {
      deviceName: {
        type: String,
        required: true
      },

      themeColors: {
        type: Object,
        default () {
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

  .ArcIntro {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 2rem;
    text-align: center;
    width: 100%;

    .logo-image {
      margin-top: -28px;
      max-height: 20vmin;
      max-width: 20vmin;
    }

    .icon {
      display: inline;
      vertical-align: middle;
    }
  }
</style>
