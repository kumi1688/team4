<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500"
    >
      <v-card
        height="600"
      >
        <template>
          <v-row justify="space-around">
            <v-color-picker
              v-model="currentRGB"
              class="ma-2"
              hide-canvas
              hide-inputs
              show-swatches
              hide-mode-switch
              swatches-max-height="300px"
              width="450"
              @input="setColor"
            />
          </v-row>
        </template>
        <v-slider
          v-model="currentTemperature"
          sm="3"
          min="153"
          max="500"
          thumb-label="always"
          prepend-icon="mdi-alarm-light"
          append-icon="mdi-alarm-light-outline"
        />
        <v-card-actions>
          <v-spacer />
          <v-icon
            class="mr-10 pr-10"
            size="90"
            :color="currentPower ? 'green' : 'red'"
            @click="switchPower"
          >
            fas fa-power-off
          </v-icon>

          <v-btn
            color="green darken-1"
            text
            @click="closeDialog"
          >
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import axios from 'axios'
  import { rgbToHsvString } from './rgbToHsv'

  export default {
    props: {
      open: {
        type: Boolean,
        default: undefined,
      },
      numlist: {
        type: Array,
        default: undefined,
      },
    },
    data () {
      return {
        currentHSB: null,
        currentRGB: null,
        currentPower: null,
        currentTemperature: null,
        dialog: false,
        swatches: [
          ['#FF0000', '#AA0000', '#550000'],
          ['#FFFF00', '#AAAA00', '#555500'],
          ['#00FF00', '#00AA00', '#005500'],
          ['#00FFFF', '#00AAAA', '#005555'],
          ['#0000FF', '#0000AA', '#000055'],
        ],

      }
    },
    watch: {
      currentTemperature () {
        this.requestAll()
      },
    },
    created () {
      this.dialog = this.open
    },
    methods: {
      closeDialog () {
        this.dialog = false
        this.$emit('closeDialog')
      },
      setColor () {
        this.currentHSB = rgbToHsvString(this.currentRGB)
        this.requestAll()
      },
      async requestAll () {
        await Promise.all(this.numlist.map(el => this.reqeustHueChange(el)))
        console.log('요청 일괄 반영')
      },
      reqeustHueChange (hue) {
        return axios.put(`/api/light/${hue}`, {
          on: this.currentPower,
          hue: this.currentHSB.hue,
          sat: this.currentHSB.sat,
          bri: this.currentHSB.bri,
          ct: this.currentTemperature,
        })
      },
      switchPower () {
        this.currentPower = !this.currentPower
        this.requestAll()
      },
    },
  }
</script>
