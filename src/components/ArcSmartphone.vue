<template>
  <arc-remote ref="remote">
    <div class="portrait-hint">
      <h2>Please rotate your Phone</h2>
      <p>
        This control interface is based on old-school gaming controllers and is only usable in landscape
        mode.
      </p>
    </div>
    <div class="column left">
      <div class="interaction-area">
        <ArcJoystick
          id="joyL"
          label="Touch and drag to navigate."
          @update="(x, y) => updateJoystick(0, x, y)"
        />
      </div>
    </div>
    <div
      ref="buttonBase"
      class="column right"
    >
      <div class="buttons">
        <div
          class="interaction-area right-click-area"
          @click="publishMouseEvent('click', 2)"
          @touchEnd="publishMouseEvent('mouseup', 2)"
          @touchstart="publishMouseEvent('mousedown', 2)"
        >
        <span class="label">
          Secondary Click
        </span>
        </div>
        <div
          class="interaction-area left-click-area"
          @click="publishMouseEvent('click', 0)"
          @touchEnd="publishMouseEvent('mouseup', 0)"
          @touchstart="publishMouseEvent('mousedown', 0)"
        >
        <span class="label">
          Main Click
        </span>
        </div>
      </div>
      <div class="joystick-right">
        <ArcJoystick
          id="joyR"
          label="Touch and drag to look."
          @update="(x, y) => updateJoystick(1, x, y)"
        />
      </div>
    </div>
  </arc-remote>
</template>

<script
  lang="js"
  type="application/ecmascript"
>
  import ArcRemote from './ArcRemote.vue'
  import ArcJoystick from './ArcJoystick.vue'

  export default {
    name: 'arc-smartphone',

    components: { ArcJoystick, ArcRemote },

    methods: {

      /**
       * Recreate the key map and publish the appropriate keyup/keydown events
       *
       * @param {Number} side, 0 = 'left', 1 = 'right'
       * @param {Number} x
       * @param {Number} y
       */
      updateJoystick (side, x, y) {
        const customEvent = new CustomEvent('stickmove', {
          detail: {
            side,
            x,
            y
          }
        })

        this.$refs.remote.publishInput(customEvent)
      },

      /**
       *
       * @param {'mousemove'|'click'|'mouseup'|'mousedown'} type
       * @param {Number} button
       */
      publishMouseEvent (type, button) {
        if (type === 'mousedown') {
          if (navigator.vibrate) {
            navigator.vibrate(button === 0 ? 100 : 50)
          }

          if (this.currentStart !== null) {
            this.publishMouseEvent('click', button)
          }
        }

        const customEvent = new CustomEvent(type)
        customEvent.button = button

        this.$refs.remote.publishInput(customEvent)
      }
    }
  }
</script>

<style
  lang="scss"
  scoped
>
  @import "../styles/variables";
  @import "~arc-cd/src/variables";
  @import "~arc-cd/src/fonts";
  @import "~arc-cd/src/typography";

  .portrait-hint {
    align-items: center;
    background-color: $theme-dark;
    color: $theme-light;
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1030;

    @media (orientation: landscape) {
      display: none;
    }
  }

  .column {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    width: 50%;

    &.left {
      border-right: 1px solid $theme-light;
    }

    &.right {
      border-left: 1px solid $theme-light;
      overflow: hidden;
    }
  }

  .interaction-area {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    width: 100%;

    &.left-click-area,
    &.right-click-area {
      height: 100%;
      transform-origin: center;
      transition: background-color .2s ease;
      width: 50%;

      .label {
        font-size: 1.5rem;
        margin: 0 1rem;
        pointer-events: none;
        user-select: none;
      }
    }

    &.left-click-area {
      background-color: transparentize($theme-secondary, .5);
      border-left: 1px solid $theme-light;
      color: $theme-dark;

      &:active {
        background-color: transparentize($theme-secondary, .25);
      }
    }

    &.right-click-area {
      background-color: transparentize($theme-primary, .5);
      border-right: 1px solid $theme-light;
      color: $theme-dark;

      &:active {
        background-color: transparentize($theme-primary, .25);
      }
    }

    .label {
      transform: translateY(-50%);
    }
  }

  .buttons {
    border-bottom: 1px solid $theme-light;
    display: flex;
    flex-direction: row;
    height: 30%;
    width: 100%;
  }

  .joystick-right {
    border-top: 1px solid $theme-light;
    height: 70%;
    position: relative;
  }
</style>
