<template>
  <main
    :class="{'connected': connected, 'info-active': infoActive}"
    class="arc-remote"
  >
    <div class="top">
      <arc-intro
        v-if="deviceName !== null"
        :device-name="deviceName"
        :route-app="$arcOptions.routeApp"
      />
      <transition
        appear
        mode="out-in"
        name="fade"
      >
        <div
          v-if="connected"
          class="button-bar"
        >
          <button
            class="button button-info"
            @click="toggleInfo"
          >
            <img
              alt="Info symbol"
              class="icon"
              src="~arc-cd/images/info-24px.svg"
              title="Show/Hide info screen"
            >
          </button>
          <span class="status">
            Status:&nbsp;
            <strong
              v-if="connected"
              class="connected"
            >Connected</strong>
            <strong
              v-else
              class="not-connected"
            >Not Connected</strong>
          </span>
          <button
            class="button button-fullscreen"
            @click="toggleFullscreen"
          >
            <transition
              appear
              mode="out-in"
              name="fade"
            >
              <img
                v-if="fullscreen"
                alt="Exit fullscreen symbol"
                class="icon"
                src="~arc-cd/images/fullscreen_exit-24px.svg"
                title="Exit fullscreen"
              >
              <img
                v-else
                alt="Enter fullscreen symbol"
                class="icon"
                src="~arc-cd/images/fullscreen-24px.svg"
                title="Enter fullscreen"
              >
            </transition>
          </button>
        </div>
      </transition>
    </div>
    <div
      class="bottom"
      tabindex="0"
    >
      <transition
        appear
        mode="out-in"
        name="fade"
      >
        <div class="connected-container">
          <slot/>
        </div>
      </transition>
    </div>
  </main>
</template>

<script>
  import { connectAsync } from 'async-mqtt'
  import { ArcTopics, createPayload, eventNameToType } from 'arc-events'
  import { exitFullscreen, requestFullscreen } from '../utils/PrefixedFullscreen.js'

  import ArcIntro from './ArcIntro.vue'
  import { getOrGenerateName } from '../utils/getOrGenerateName'

  export default {
    name: 'arc-remote',

    components: {
      ArcIntro
    },

    data () {
      return {
        deviceName: getOrGenerateName(),
        paircode: null,
        connected: false,
        infoActive: false,
        fullscreen: false,
        connecting: false,
        activeListeners: new Set()
      }
    },

    /**
     * Get a device name and create the paircode out of it.
     */
    async mounted () {
      this.paircode = this.$arcOptions.app + '/' + this.deviceName.replace(' ', '-').toLowerCase()
      await this.connect()
    },

    methods: {

      /**
       * Open or close the info screen
       */
      toggleInfo () {
        this.infoActive = !this.infoActive
      },

      /**
       * Request or exit fullscreen and update the boolean flag
       */
      async toggleFullscreen () {
        if (document.fullscreenElement !== null) {

          try {
            await exitFullscreen()
            this.fullscreen = false
          } catch (e) {
            alert('Could not exit fullscreen')
          }

          return
        }

        try {
          await requestFullscreen(document.documentElement)
          this.fullscreen = true
        } catch (e) {
          alert('Fullscreen is not available on the device.')
        }
      },

      /**
       * Start the connection to the MQTT Server
       *
       * @return {Promise<void>}
       */
      async connect () {
        try {
          this.connecting = true
          this.mqttClient = await connectAsync(`${this.$arcOptions.protocol}://${this.$arcOptions.host}:${this.$arcOptions.port}${this.$arcOptions.path}`)
          this.mqttClient.on('message', this.messageListener)
          await this.mqttClient.subscribe(this.paircode + '/' + ArcTopics.STATUS)
          await this.mqttClient.subscribe(this.paircode + '/' + ArcTopics.ADD_EVENT_LISTENER)
          await this.mqttClient.subscribe(this.paircode + '/' + ArcTopics.REMOVE_EVENT_LISTENER)
        } catch (e) {
          this.connecting = false
          console.error(e)
        }
      },

      /**
       * Bind and unbind events depending on the connection state
       *
       * @param topic
       * @param payload
       * @return {Promise<void>}
       */
      async messageListener (topic, payload) {
        const topicPath = topic.split('/')
        const subTopic = topicPath[topicPath.length - 1]

        const message = JSON.parse(payload.toString())

        switch (subTopic) {
          case ArcTopics.STATUS:
            if (message.type === 'vr') {
              this.connecting = false

              if (message.connected) {
                this.connected = true

                await this.mqttClient.publish(
                  this.paircode + '/' + ArcTopics.STATUS,
                  JSON.stringify({
                    type: 'remote',
                    connected: true
                  }),
                  {
                    qos: 2
                  }
                )

                this.$emit('arcs-connected')

                if (navigator.vibrate) {
                  navigator.vibrate([100, 50, 100])
                }

                return
              }

              if (navigator.vibrate) {
                navigator.vibrate([150, 50, 50])
              }

              this.connected = false
              this.$emit('arcs-disconnected')
            }
            return
          case ArcTopics.ADD_EVENT_LISTENER:
            this.activeListeners.add(message.type)
            return
          case ArcTopics.REMOVE_EVENT_LISTENER:
            this.activeListeners.delete(message.type)
            return
        }
      },

      /**
       * publish events
       *
       * @param {Event} event
       * @return {Promise<void>}
       */
      async publishInput (event) {
        if (!this.mqttClient) {
          return
        }

        if (!this.activeListeners.has(event.type)) {
          return
        }

        const type = eventNameToType(event.type)
        const payload = createPayload(event, type)

        if (!payload) {
          return
        }

        await this.mqttClient.publish(
          this.paircode + '/' + ArcTopics.DATA,
          JSON.stringify(payload),
          {
            qos: 0
          }
        )
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

  $button-bar-height: .75 * $arc-inner-padding;

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity $arc-duration ease;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .arc-remote {
    color: $theme-light;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    font-family: $font-paragraph;
    height: 100%;
    overflow: hidden;
    position: relative;
    width: 100%;

    &.connected {
      .top {
        padding-bottom: $arc-inner-padding;
      }
    }

    &.connected:not(.info-active) {
      .top {
        transform: translateY(calc(-100% + #{$button-bar-height}));
      }
    }
  }

  .top,
  .bottom {
    display: flex;
    height: 100%;
    transition: transform $arc-duration ease, padding $arc-duration ease;
    width: 100%;
  }

  .top {
    background-color: $theme-dark;
    box-shadow: 0 0 20px #000;
    position: relative;
    z-index: 10;

    .button-bar {
      background-color: $theme-dark;
      bottom: 0;
      display: flex;
      flex-direction: row;
      height: $button-bar-height;
      justify-content: space-between;
      left: 0;
      padding: 0 1rem;
      position: absolute;
      right: 0;
      width: 100%;
    }

    .button {
      background: transparent;
      border: 0;
      color: $theme-light;
      cursor: pointer;
      font-size: 1.6rem;
      height: $button-bar-height;
      line-height: $button-bar-height;
      outline: 0;

      &:focus {
        background-color: transparentize($theme-light, .75);
      }

      &:active {
        background-color: transparentize($theme-light, .5);
      }
    }

    .icon {
      height: 100%;
      width: 100%;
    }

    .status {
      height: $button-bar-height;
      line-height: $button-bar-height;

      .connected {
        color: $theme-secondary;
      }

      .not-connected {
        color: $theme-primary;
      }
    }
  }

  .bottom {
    align-items: center;
    background: linear-gradient($theme-primary, $theme-secondary);
    bottom: 0;
    height: calc(100% - #{$button-bar-height});
    position: absolute;
    top: $button-bar-height;
    z-index: 0;

    .connected-container {
      align-items: center;
      display: flex;
      flex-direction: row;
      height: 100%;
      justify-content: center;
      margin: auto;
      position: relative;
      text-align: center;
      width: 100%;
    }
  }
</style>
