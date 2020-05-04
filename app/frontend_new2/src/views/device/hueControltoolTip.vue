<template>
  <v-tooltip
    v-model="tooltip"
    left
  >
    <template>
      <h2
        slot="activator"
        class="display-2 mt-5"
        @mouseover="tooltip = true"
        @mouseout="tooltip = false"
      >
        {{ tooltipName }}
      </h2>
      <v-icon
        slot="activator"
        size="50"
        color="blue"
        @click="setValue('btn', type, step)"
      >
        mdi-plus
      </v-icon>
      <v-slider
        slot="activator"
        v-model="sliderValue"
        class="mt-5"
        thumb-label="always"
        :min="min"
        :max="max"
        @mouseup="setValue('slider', type, step)"
      />
      <!-- 153 (6500K) to 500 (2000K). -->
      <v-icon
        slot="activator"
        size="50"
        color="red"
        @click="setValue('btn', type, -step,)"
      >
        mdi-minus
      </v-icon>
      <v-img
        :src="tooltipImage"
      />
    </template>
  </v-tooltip>
</template>

<script>
  import ctPicture from '../../../public/hue/ct.jpg'
  import satPicture from '../../../public/hue/sat.png'
  import briPicture from '../../../public/hue/bri.png'

  export default {
    props: {
      type: { type: String, default: undefined },
      ct: { type: Number, default: 2000 },
      sat: { type: Number, default: 0 },
      bri: { type: Number, default: 1 },
    },
    data () {
      return {
        tooltip: false,
        tooltipImage: null,
        sliderValue: 2000,
        ctPicture,
        satPicture,
        briPicture,
        min: 0,
        max: 0,
        step: 0,
      }
    },
    computed: {
      updateValue () {
        return this[this.type]
      },
      tooltipName () {
        switch (this.type) {
          case 'ct': return '온도'
          case 'bri': return '밝기'
          case 'sat': return '채도'
          default: return null
        }
      },
    },
    watch: {
      updateValue () {
        this.sliderValue = this.updateValue
      },
    },
    created () {
      this.getMinMax()
      this.getStep()
      this.initData()
      this.setToolTipImage()
    },
    methods: {
      setToolTipImage () {
        switch (this.type) {
          case 'ct': this.tooltipImage = ctPicture; return
          case 'bri': this.tooltipImage = briPicture; return
          case 'sat': this.tooltipImage = satPicture; return
          default: return null
        }
      },
      initData () {
        this.sliderValue = this[this.type]
      },
      setValue (inputType, type, value) {
        if (inputType === 'btn') { this.sliderValue += value }
        if (type === 'ct') {
          const ctValue = (this.sliderValue - 2000) / 13 + 153
          this.$emit('requestChange', 'ct', ctValue)
        } else if (type === 'bri') {
          const briValue = this.sliderValue * 2.5
          this.$emit('requestChange', 'bri', briValue)
        } else if (type === 'sat') {
          const satValue = this.sliderValue * 2.5
          this.$emit('requestChange', 'sat', satValue)
        }
      },
      getMinMax () {
        switch (this.type) {
          case 'ct': this.min = 2000; this.max = 6500; return
          case 'bri': this.min = 1; this.max = 100; return
          case 'sat': this.min = 0; this.max = 100; return
          default: this.min = 0; this.max = 0
        }
      },
      getStep () {
        switch (this.type) {
          case 'ct': this.step = 250; return
          case 'sat':
          case 'bri': this.step = 10; return
          default: this.step = 0
        }
      },
    },
  }
</script>
