<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="500"
  >
    <v-card
      max-width="500"
    >
      <v-color-picker
        v-if="type==='color'"
        v-model="currentRGB"
        class="ma-2"
        show-swatches
        hide-canvas
        hide-inputs
        hide-mode-switch
        swatches-max-height="300px"
        width="450"
      />

      <slider-tooltip
        v-else-if="type==='ct'"
        class="mx-auto mt-10"
        :type="type"
        :ct="huedata.ct"
        @requestChange="requestChange"
      />
      <slider-tooltip
        v-else-if="type==='bri'"
        class="mx-auto mt-10"
        :type="type"
        :bri="huedata.bri"
        @requestChange="requestChange"
      />
      <slider-tooltip
        v-else-if="type==='sat'"
        class="mx-auto mt-10"
        :type="type"
        :sat="huedata.sat"
        @requestChange="requestChange"
      />
      <v-card-actions>
        <v-btn @click="closeDialog">
          닫기
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import hueToolTip from './hueControltoolTip'
  import { hsbToRgb, rgbToHsvString } from './rgbToHsv'
  export default {
    components: {
      'slider-tooltip': hueToolTip,
    },
    props: {
      type: { type: String, default: undefined },
      huedata: { type: Object, default: undefined },
    },
    data () {
      return {
        dialog: false,
        currentRGB: null,
        currentHSB: null,
      }
    },
    watch: {
      currentRGB () {
        // console.log(this.currentRGB)
        this.currentHSB = rgbToHsvString(this.currentRGB)
        console.log(this.currentHSB)
        this.$emit('setOptionValue', this.currentHSB)
      },
    },
    created () {
      this.dialog = true
      this.currentHSB = {
        hue: this.huedata.hue,
        sat: this.huedata.sat,
        bri: this.huedata.bri,
      }
    },
    methods: {
      closeDialog () {
        this.$emit('closeOptionDialog', this.type)
        this.dialog = false
      },

      requestChange (type, value) {
        this.$emit('setOptionValue', value)
      },
      getHueColor () {
        const currentColor = hsbToRgb(this.huedata.hue, this.huedata.sat, this.huedata.bri)
        return `rgba(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}, 1)`
      },
      initColor () {
        const result = hsbToRgb(this.currentHSB.hue, this.currentHSB.sat, this.currentHSB.bri)
        this.currentRGB = {
          ...this.currentRGB,
          rgba: {
            a: 1,
            b: result[2],
            g: result[1],
            r: result[0],
          },
        }
      },
    },
  }
</script>
