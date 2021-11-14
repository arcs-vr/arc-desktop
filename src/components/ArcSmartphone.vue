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
      <div
        class="interaction-area"
        ref="cursorBoundary"
      >
        <div class="cursor-wrapper">
          <span class="cursor-root"/>
          <span class="label">
            Touch and drag to navigate.
          </span>
        </div>
        <div class="cursor-wrapper">
          <span
            :class="{'animated': cursorX === 0 && cursorY === 0}"
            :style="cursorTransform"
            class="cursor"
            ref="cursor"
          />
        </div>
      </div>
    </div>
    <div
      class="column right"
      ref="buttonBase"
    >
      <div
        @click="publishMouseEvent('click', 2)"
        @touchEnd="publishMouseEvent('mouseup', 2)"
        @touchstart="publishMouseEvent('mousedown', 2)"
        class="interaction-area right-click-area"
      >
        <span class="label">
          Secondary Click
        </span>
      </div>
      <div
        @click="publishMouseEvent('click', 0)"
        @touchEnd="publishMouseEvent('mouseup', 0)"
        @touchstart="publishMouseEvent('mousedown', 0)"
        class="interaction-area left-click-area"
      >
        <span class="label">
          Main Click
        </span>
      </div>
    </div>
  </arc-remote>
</template>

<script
  lang="js"
  type="application/ecmascript"
>
  import ArcRemote from './ArcRemote.vue'

  export default {
    name: 'arc-smartphone',

    components: { ArcRemote },

    data () {
      return {
        currentStart: null,
        currentHold: null,
        cursorX: 0,
        cursorY: 0,
        keys: new Set()
      }
    },

    async mounted () {
      await this.$nextTick()

      this.$refs.cursor.addEventListener('touchstart', this.startMovement, { passive: false })
      this.$refs.cursor.addEventListener('touchmove', this.updateMovement, { passive: false })
      this.$refs.cursor.addEventListener('touchend', this.stopMovement, { passive: false })
    },

    beforeDestroy () {
      this.$refs.cursor.removeEventListener('touchstart', this.startMovement)
      this.$refs.cursor.removeEventListener('touchmove', this.updateMovement)
      this.$refs.cursor.removeEventListener('touchend', this.stopMovement)
    },

    methods: {

      /**
       * Start all fake key presses
       */
      startMovement () {
        if (navigator.vibrate) {
          navigator.vibrate([50])
        }

        const cursorRect = this.$refs.cursor.getBoundingClientRect()
        const boundaryRect = this.$refs.cursorBoundary.getBoundingClientRect()

        this.currentStart = {
          clientX: cursorRect.left + (cursorRect.width / 2),
          clientY: cursorRect.top + (cursorRect.height / 2)
        }

        this.currentBound = {
          width: boundaryRect.width / 2,
          height: boundaryRect.height / 2
        }
      },

      /**
       * Update all fake key presses
       * @param {TouchEvent} event
       */
      updateMovement (event) {
        event.preventDefault()
        this.currentHold = event.touches[0]

        this.cursorX = this.absMin(this.currentHold.clientX - this.currentStart.clientX, this.currentBound.width)
        this.cursorY = this.absMin(this.currentHold.clientY - this.currentStart.clientY, this.currentBound.height)

        const distance = Math.sqrt(Math.pow(this.cursorX, 2) + Math.pow(this.cursorY, 2))

        if (distance > 3) {
          const radians = -.25 * Math.PI + this.mapRadians(this.cursorY, this.cursorX)
          const normalizedForce = distance / Math.min(this.currentBound.height, this.currentBound.width)

          this.updateJoystick(-radians, normalizedForce)
        }
      },

      mapRadians (y, x) {
        const radians = Math.atan2(y, x)

        if (radians >= 0) { // Angle is between 0 and pi, no offset needed
          return radians
        }

        if (radians < 0) { // Angle is between -pi and 0, needs to be offset 2pi
          return radians + (2 * Math.PI)
        }
      },

      /**
       * Clear all fake key presses
       * @param {TouchEvent} event
       */
      stopMovement (event) {
        this.cursorX = 0
        this.cursorY = 0
        this.currentStart = null
        this.currentHold = null

        this.updateJoystick(0, 0)
      },

      /**
       * Recreate the key map and publish the appropriate keyup/keydown events
       *
       * @param {Number} radians
       * @param {Number} force
       */
      updateJoystick (radians, force) {
        const customEvent = new CustomEvent('stickmove', {
          detail: {
            radians: radians,
            force: force
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
      },

      absMin (first, second) {
        const negation = (first < 0 || second < 0) ? -1 : 1
        const min = Math.min(Math.abs(first), Math.abs(second))

        return negation * min
      }
    },

    computed: {

      /**
       * The "joystick"'s transformation
       * @return {string}
       */
      cursorTransform () {
        return `transform: translate(${this.cursorX}px, ${this.cursorY}px)`
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
      flex-direction: row;
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

  .cursor-wrapper {
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);

    .label {
      color: darken($theme-primary, 50%);
      left: 50%;
      position: absolute;
      text-transform: uppercase;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 40vmin;
    }
  }

  .cursor-root,
  .cursor {
    border-radius: 50%;
    display: block;
  }

  $cursor-base: 4rem;

  .cursor-root {
    background-color: transparentize($theme-light, .75);
    height: $cursor-base;
    width: $cursor-base;
  }

  .cursor {
    background-color: transparentize($theme-light, .5);
    background-image: url("~arc-cd/images/joystick_arrows.svg");
    border: 2px solid transparentize($theme-light, .25);
    height: 4 * $cursor-base;
    max-height: 60vmin;
    max-width: 60vmin;
    width: 4 * $cursor-base;

    &.animated {
      transition: transform .2s ease;
    }
  }
</style>

<style lang="scss">
  @import "~arc-cd/src/reset";
</style>
