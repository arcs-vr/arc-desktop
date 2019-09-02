<template>
    <div class="arc-connect-modal">
        <div class="modal-header">
            <button @click="$emit('close')"
                    class="close-button"
                    type="button"
            >
                Close
            </button>
        </div>
        <div class="modal-body">
            <div class="section">
                <img alt="The lettering ARCS stylized in isometric design"
                     class="logo-image"
                     src="~arc-cd/images/arc-logo-small.jpg"
                     title="ARCS: A-Frame Remote Controls System"
                >
                <h1 class="title">Remote Controlling this VR Experience</h1>
            </div>
            <div class="section">
                <p>
                    Control this experience from another smartphone, tablet or pc.<br>
                    Follow these two easy steps:
                </p>
            </div>

            <div class="section">
                <p>
                    <i>1)</i>&nbsp;On your second device, pen the remote control website:
                    <router-link :to="{name: $arcOptions.routeRemote}"
                                 v-text="remoteUrl"
                    />
                </p>
            </div>

            <div class="section">
                <p>
                    <i>2)</i>&nbsp;Scan the QR code shown on the other device.
                </p>
                <div class="video-wrapper">
                    <video class="video"
                           crossorigin="anonymous"
                           muted
                           playsinline
                           ref="video"
                    />
                    <p @click="startCamera"
                       class="camera-permission-info"
                       v-if="showInfo"
                    >
                        You need to grant this website permission to access the camera in order to scan a QR code.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import QrScanner           from 'qr-scanner'
  import QrScannerWorkerPath from 'qr-scanner/qr-scanner-worker.min.js'

  QrScanner.WORKER_PATH = QrScannerWorkerPath

  /**
   * Displays a modal with connection instructions and triggers a 'arc-remote-name' event with the scanned device name.
   */
  export default {
    name: 'arc-connect-modal',

    data () {
      return {
        deviceName: null,
        showInfo: false
      }
    },

    props: {
      visible: {
        type: Boolean,
        required: true,
      }
    },

    created () {
      this.qrScanner = null
    },

    methods: {
      handleQRCodeValue (result) {
        this.$emit('arc-remote-name', result)
        this.stopCamera()
      },

      async startCamera () {
        if (this.qrScanner) {
          this.stopCamera()
        }

        this.qrScanner = new QrScanner(
          this.$refs.video,
          this.handleQRCodeValue,
          300
        )

        this.qrScanner.setInversionMode('invert')
        await this.qrScanner.start()

        this.showInfo = !Boolean(this.$refs.video.srcObject)
      },

      stopCamera () {
        if (this.qrScanner) {
          this.qrScanner.destroy()
        }

        this.qrScanner = null
        this.showInfo  = false
      }
    },

    computed: {
      /**
       * Get the remote URL from the current host
       * @return {string}
       */
      remoteUrl () {
        const path = this.$router.resolve({name: this.$arcOptions.routeRemote}).href
        return `${window.location.host}${path === '/' ? '' : path}`
      },
    },

    activated () {
      this.startCamera()
    },

    deactivated () {
      this.stopCamera()
    }
  }
</script>

<style lang="scss"
       scoped
>
    @import '~arc-cd/src/variables';
    @import '~arc-cd/src/fonts';
    @import '~arc-cd/src/typography';

    .arc-connect-modal {
        align-items: flex-start;
        background-color: $theme-dark;
        color: $theme-light;
        display: flex;
        flex-direction: column;
        font-family: sans-serif, monospace;
        height: 100%;
        left: 50%;
        overflow-x: hidden;
        overflow-y: scroll;
        padding: 2rem;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        z-index: 11000;

        .modal-header {
            position: absolute;
            right: 1rem;
            top: 1rem;
        }

        .modal-body {
            align-items: center;
            display: flex;
            flex-direction: column;
            font-size: 1.2rem;
            justify-content: space-between;
            text-align: center;
            width: 100%;
        }

        .logo-image {
            margin-top: -28px;
            max-height: 20vmin;
            max-width: 20vmin;
        }

        .title {
            font-size: 1.6rem;
            margin: 0;
        }

        .close-button {
            background: transparent;
            border: 0;
            color: $theme-light;
            cursor: pointer;
            font-size: 1rem;
            margin-left: auto;
        }

        .camera-permission-info {
            color: $theme-light;
            display: block;
            font-size: 1rem;
            left: 0;
            padding: 1rem;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
        }

        .section {
            max-width: $desktop / 2;
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

        .video,
        .video-wrapper {
            height: 300px;
            margin: auto;
            position: relative;
            width: 300px;
        }

        .video {
            // A-Frame hides all videos for assets by default
            background-color: lighten($theme-dark, 30%);
            border-radius: .5rem;
            display: block !important;
            object-fit: cover;
            object-position: center;
        }
    }
</style>
