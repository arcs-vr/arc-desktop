<template v-once>
    <main class="remote-selector"
          v-if="show"
    >
        <h1>Remote Control Selection</h1>
        <p class="paragraph">
            Select the second device type you want to use, to control the virtual reality experience.
        </p>
        <div class="columns">
            <div class="left">
                <router-link :to="{name: routeDesktop}"
                             class="button font-heading"
                >
                    <img alt="Desktop/Laptop device symbol"
                         class="icon"
                         src="~arc-cd/images/computer-24px.svg"
                    />
                    Desktop&nbsp;/&nbsp;Laptop<br>
                    <small>(With a keyboard and a mouse/trackpad)</small>
                </router-link>
            </div>
            <div class="right">
                <router-link :to="{name: routeSmartphone}"
                             class="button font-heading"
                >
                    <img alt="Handheld device symbol"
                         class="icon"
                         src="~arc-cd/images/phone_android-24px.svg"
                    />
                    Handheld<br>
                    <small>(Smartphone, Tablet, …)</small>
                </router-link>
            </div>
        </div>
    </main>
</template>

<script>

  export default {
    name: 'arc-remote-selector',

    props: {
      routeDesktop: {
        type: String,
        required: true
      },
      routeSmartphone: {
        type: String,
        required: true
      },
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
          vm.$router.push({name: vm.routeSmartphone})
        }

        vm.show = true
      })
    }
  }
</script>

<style lang="scss"
       scoped
>
    @import '~arc-cd/src/variables';
    @import '~arc-cd/src/fonts';
    @import '~arc-cd/src/typography';

    .remote-selector {
        align-items: center;
        background-color: $theme-dark;
        color: $theme-light;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        padding: 1rem;
        text-align: center;
        width: 100%;
    }

    .paragraph {
        font-size: 1.2rem;
    }

    .columns {
        display: flex;
        flex-direction: column;
        margin-top: 1rem;


        @media all and (min-width: $desktop) {
            flex-direction: row;
        }

        .left,
        .right {
            width: 100%;

            @media all and (min-width: $desktop) {
                width: 50%;
            }
        }
    }

    .button {
        align-items: center;
        display: flex;
        flex-direction: column;
        font-size: 1.5rem;
        height: 100%;
        padding: 1rem;
        text-align: center;
        text-decoration: none;

        small {
            color: $theme-light;
            display: block;
            font-size: 1rem;
        }

        .icon {
            height: 2rem;
            margin-bottom: .5rem;
            width: 2rem;
        }
    }
</style>

<style lang="scss">
    @import '~arc-cd/src/reset';
</style>
