<template>
  <arc-remote ref="remote">
    <div class="column">
      <p class="paragraph">
        Use your arrow keys, or the WASD keys, to navigate in the VR experience on you phone.
      </p>
      <div class="keyboard-hints">
        <div class="key-row">
          <div
            :class="{'pressed': keys.hasOwnProperty('w') || keys.hasOwnProperty('ArrowUp')}"
            class="key key-w"
          >
            W&nbsp;/&nbsp;&uparrow;
          </div>
        </div>
        <div class="key-row">
          <div
            :class="{'pressed': keys.hasOwnProperty('a') || keys.hasOwnProperty('ArrowLeft')}"
            class="key key-a"
          >
            A&nbsp;/&nbsp;&leftarrow;
          </div>
          <div
            :class="{'pressed': keys.hasOwnProperty('s') || keys.hasOwnProperty('ArrowDown')}"
            class="key key-s"
          >
            S&nbsp;/&nbsp;&downarrow;
          </div>
          <div
            :class="{'pressed': keys.hasOwnProperty('d') || keys.hasOwnProperty('ArrowRight')}"
            class="key key-d"
          >
            D&nbsp;/&nbsp;&rightarrow;
          </div>
        </div>
      </div>
    </div>
    <div class="column">
      <p class="paragraph">
        <strong v-if="pointerLocked">
          Press "Escape" to exit the mouse interaction mode.<br>
          Use The left and right mouse buttons to interact.
        </strong>
        <span v-else>
          Click into the square below and use your mouse to interact with the VR experience.
        </span>
      </p>
      <div
        :class="{'active': pointerLocked}"
        @click="lockPointer"
        class="mouse-hints"
        ref="pointerEventsBase"
        tabindex="1"
      >
        <div
          :class="clicks['0'] === true ? 'pressed' : ''"
          class="mouse-button key"
        >
          LEFT
        </div>
        <div
          :class="clicks['2'] === true ? 'pressed' : ''"
          class="mouse-button key"
        >
          RIGHT
        </div>
      </div>
    </div>
  </arc-remote>
</template>

<script lang="js">
  import Vue from 'vue'
  import ArcRemote from './ArcRemote.vue'

  export default {
    name: 'arc-desktop',

    components: {
      ArcRemote
    },

    data () {
      return {
        connected: false,
        pointerLocked: false,
        pointerVisual: false,
        keys: {},
        clicks: {}
      }
    },

    mounted () {
      this.bindEvents()
    },

    beforeDestroy () {
      this.unbindEvents()
    },

    methods: {

      /**
       * Bind event listeners
       */
      bindEvents () {
        this.$refs.remote.$el.addEventListener('keydown', this.keyListener)
        this.$refs.remote.$el.addEventListener('keyup', this.keyListener)
        this.$refs.pointerEventsBase.addEventListener('click', this.lockPointer)

        document.addEventListener('pointerlockchange', this.pointerLockChangeListener)
      },

      /**
       * Unbind event listeners
       */
      unbindEvents () {
        this.$refs.remote.$el.removeEventListener('keydown', this.keyListener)
        this.$refs.remote.$el.removeEventListener('keyup', this.keyListener)
        this.$refs.remote.$el.removeEventListener('click', this.lockPointer)

        this.$refs.pointerEventsBase.blur()
        document.exitPointerLock()
        document.removeEventListener('pointerlockchange', this.pointerLockChangeListener)
      },

      /**
       * Lock the pointer and focus the event base
       */
      lockPointer () {
        this.$refs.pointerEventsBase.focus()
        this.$refs.pointerEventsBase.requestPointerLock()
      },

      /**
       * Add or remove pointer event listeners
       */
      pointerLockChangeListener () {
        if (document.pointerLockElement === this.$refs.pointerEventsBase) {
          this.pointerLocked = true
          this.$refs.pointerEventsBase.addEventListener('click', this.pointerPublishListener)
          this.$refs.pointerEventsBase.addEventListener('mousedown', this.pointerPublishListener)
          this.$refs.pointerEventsBase.addEventListener('mouseup', this.pointerPublishListener)
          return
        }

        this.pointerLocked = false
        this.$refs.pointerEventsBase.removeEventListener('click', this.pointerPublishListener)
        this.$refs.pointerEventsBase.removeEventListener('mousedown', this.pointerPublishListener)
        this.$refs.pointerEventsBase.removeEventListener('mouseup', this.pointerPublishListener)
      },

      /**
       * Publish pointer events
       *
       * @param event
       */
      pointerPublishListener (event) {
        this.$refs.remote.publishInput(event)
        this.updateInputUI(event)
      },

      /**
       * Publish key events
       *
       * @param event
       */
      keyListener (event) {
        this.$refs.remote.publishInput(event)
        this.updateInputUI(event)
      },

      /**
       * Display key inputs
       *
       * @param event
       */
      updateInputUI (event) {
        switch (event.type) {
          case 'mousedown':
            Vue.set(this.clicks, event.button, true)
            break
          case 'mouseup':
            Vue.delete(this.clicks, event.button)
            break
          case 'keydown':
            Vue.set(this.keys, event.key.toLowerCase(), true)
            break
          case 'keyup':
            Vue.delete(this.keys, event.key.toLowerCase())
            break
        }
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

  $size: 25vmax;

  .column {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50%;
  }

  .paragraph {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    max-width: $size;
  }

  .mouse-hints,
  .keyboard-hints {
    height: $size;
    width: $size;
  }

  .keyboard-hints {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .key-row {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
  }

  .key {
    $key-primary: $theme-dark;
    $key-secondary: darken($theme-dark, 20%);
    align-items: center;
    background-color: $key-primary;
    border-radius: 0.8rem;
    box-shadow: inset 0.1em -0.2em 0 4px $key-secondary, inset -0.1em -0.2em 0 4px $key-secondary, inset 0.08em -0.18em 0 5px darken($key-secondary, 30%), inset -0.08em -0.18em 0 5px darken($key-secondary, 30%), 0 0.25em 0 0.15em rgba(0, 0, 0, .2);
    color: $theme-light;
    display: flex;
    font-size: 1.5rem;
    height: 6rem;
    justify-content: center;
    margin: 0.2rem;
    overflow: hidden;
    padding: 1rem;
    transform: translateY(-3px);
    transition: transform 90ms ease-in-out, box-shadow 90ms ease-in-out;
    width: 6rem;

    &.pressed {
      box-shadow: inset 0.05em -0.15em 0 4px $key-secondary, inset -0.05em -0.15em 0 4px $key-secondary, inset 0.03em -0.13em 0 5px darken($key-secondary, 30%), inset -0.03em -0.13em 0 5px darken($key-secondary, 30%), 0 0.25em 0 0.15em rgba(0, 0, 0, .2);
      transform: translateY(0);
    }
  }

  .mouse-hints {
    align-items: center;
    background: linear-gradient($theme-secondary, $theme-primary);
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    position: relative;

    &.active {
      outline-color: white;
      outline-style: solid;
    }

    .mouse-button {
      border-radius: 50%;
      color: white;
      height: 8rem;
      text-align: center;
      width: 8rem;

      &:first-of-type {
        margin-top: 2rem;
      }
    }
  }
</style>

<style lang="scss">
  @import "~arc-cd/src/reset";
</style>
