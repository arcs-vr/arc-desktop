<template>
  <div class="ArcJoystick">
    <div class="ArcJoystick__root">
      <span class="ArcJoystick__center"/>
      <div
        :id="id"
        ref="cursor"
        :data-animated="(cursorX === 0 && cursorY === 0) || undefined"
        :style="cursorTransform"
        class="ArcJoystick__cursor"
      />
    </div>
    <span class="ArcJoystick__label">{{ label }}</span>
  </div>
</template>

<script>
  export default {
    name: 'ArcJoystick',

    props: {
      label: {
        type: String,
        required: true
      },
      id: {
        type: String,
        required: true
      }
    },

    data () {
      return {
        currentStart: null,
        currentHold: null,
        cursorX: 0,
        cursorY: 0
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
        const boundaryRect = this.$el.getBoundingClientRect()

        this.currentStart = {
          clientX: Math.round(cursorRect.left + (cursorRect.width / 2)),
          clientY: Math.round(cursorRect.top + (cursorRect.height / 2))
        }

        this.currentBound = {
          width: Math.floor(boundaryRect.width / 2) - 20,
          height: Math.floor(boundaryRect.height / 2) - 20
        }
      },

      absMin (first, second) {
        const negation = (first < 0 || second < 0) ? -1 : 1
        const min = Math.min(Math.abs(first), Math.abs(second))

        return negation * min
      },

      /**
       * Update all fake key presses
       * @param {TouchEvent} event
       */
      updateMovement (event) {
        event.preventDefault()
        this.currentHold = Array.from(event.touches).find(event => event.target.id === this.id)
        this.cursorX = this.absMin(this.currentHold.clientX - this.currentStart.clientX, this.currentBound.width)
        this.cursorY = this.absMin(this.currentHold.clientY - this.currentStart.clientY, this.currentBound.height)

        this.$emit(
          'update',
          this.cursorX / this.currentBound.width,
          this.cursorY / this.currentBound.height
        )
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

        this.$emit('update', 0, 0)
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

<style lang="scss">
  @import "../styles/variables";
  @import "~arc-cd/src/variables";

  .ArcJoystick {
    $cursor-base: 8rem;

    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    position: relative;
    width: 100%;

    &__layer {
      height: 100%;
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
    }

    &__root {
      display: block;
      height: $cursor-base;
      position: relative;
      width: $cursor-base;
    }

    &__center {
      background-color: transparentize($theme-light, .75);
      border-radius: 50%;
      height: $cursor-base / 3;
      left: 50%;
      pointer-events: none;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: $cursor-base / 3;
    }

    &__cursor {
      background-color: transparentize($theme-light, .5);
      background-image: url("~arc-cd/images/joystick_arrows.svg");
      border: 2px solid transparentize($theme-light, .25);
      border-radius: 50%;
      display: block;
      height: $cursor-base;
      width: $cursor-base;

      &[data-animated] {
        transition: transform .2s ease;
      }
    }

    &__label {
      color: darken($theme-primary, 50%);
      left: 50%;
      pointer-events: none;
      position: absolute;
      text-transform: uppercase;
      top: 1rem;
      transform: translateX(-50%);
      width: 90%;
    }
  }
</style>