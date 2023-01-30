<template v-once>
  <main
    v-if="show"
    class="ArcRemoteSelector"
  >
    <ArcText tag="h1">Remote Control Selection</ArcText>

    <ArcText>
      Select the second device type you want to use, to control the virtual reality experience.
    </ArcText>

    <div class="ArcRemoteSelector__columns">
      <router-link
        :to="{name: routeDesktop}"
        class="ArcRemoteSelector__button"
      >
        <img
          alt="Desktop/Laptop device symbol"
          class="icon"
          src="~arc-cd/images/computer-24px.svg"
        />
        <span>Desktop&nbsp;/&nbsp;Laptop</span>
      </router-link>
      <router-link
        :to="{name: routeSmartphone}"
        class="ArcRemoteSelector__button"
      >
        <img
          alt="Handheld device symbol"
          class="icon"
          src="~arc-cd/images/phone_android-24px.svg"
        />
        <span>Handheld</span>
      </router-link>
    </div>
  </main>
</template>

<script>
  import ArcText from './ArcText'

  export default {
    name: 'arc-remote-selector',
    components: { ArcText },
    props: {
      routeDesktop: {
        type: String,
        required: true
      },
      routeSmartphone: {
        type: String,
        required: true
      }
    },

    data () {
      return {
        show: false
      }
    },

    beforeRouteEnter (to, from, next) {
      const isTouch = window.matchMedia('(pointer: coarse)').matches

      next(function (vm) {
        if (isTouch) {
          vm.$router.push({ name: vm.routeSmartphone })
        }

        vm.show = true
      })
    }
  }
</script>

<style
  lang="scss"
  scoped
>
  @import "~arc-cd/src/variables";
  @import "~arc-cd/src/fonts";
  @import "~arc-cd/src/typography";

  .ArcRemoteSelector {
    align-items: center;
    background-color: $theme-dark;
    color: $theme-light;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    justify-content: center;
    padding: 1rem;
    text-align: center;
    width: 100%;

    &__columns {
      align-items: center;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-content: center;

      @media all and (min-width: $desktop) {
        flex-direction: row;
      }
    }

    &__button {
      align-items: center;
      border: 1px solid $theme-light;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-shrink: 0;
      font-size: 1.5rem;
      gap: 1rem;
      height: 100%;
      padding: 1rem;
      text-decoration: none;
      width: 100%;

      .icon {
        height: 2rem;
        width: 2rem;
      }
    }
  }
</style>
