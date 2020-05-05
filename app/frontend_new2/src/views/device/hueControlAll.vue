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
        <v-col>
          <v-row
            align="center"
            justify="center"
          >
            <h2 class="display-2">
              색 설정
            </h2>
            <v-color-picker
              v-model="currentRGB"
              class="ml-10"
              hide-canvas
              hide-inputs
              hide-mode-switch
              swatches-max-height="300px"
              width="450"
            />
            <v-dialog
              ref="dialog"
              v-model="modal2"
              persistent
              width="290px"
            >
              <template
                v-slot:activator="{ on }"
              >
                <v-btn
                  class="ml-10"
                  color="indigo"
                  v-on="on"
                >
                  색 설정
                </v-btn>
              </template>
              <v-card>
                <v-color-picker
                  v-model="currentRGB"
                  class="ma-2"
                  show-swatches
                  hide-canvas
                  hide-inputs
                  hide-mode-switch
                  swatches-max-height="300px"
                  width="450"
                  @input="setColor"
                />
                <v-card-actions>
                  <v-btn
                    color="green"
                    @click="modal2 = false"
                  >
                    닫기
                  </v-btn>
                  <v-btn
                    color="green"
                  >
                    설정
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>

          <v-row
            class="mt-5 ml-5 mr-5"
            justify="center"
          >
            <hue-control-tool-tip
              type="ct"
              :ct="currentTemperature"
              @requestChange="requestAll"
            />
          </v-row>

          <v-row
            class="mt-5 ml-5 mr-5"
            justify="center"
          >
            <hue-control-tool-tip

              type="sat"
              :sat="currentSaturation"
              @requestChange="requestAll"
            />
          </v-row>

          <v-row
            class="mt-5 ml-5 mr-5"
            justify="center"
          >
            <hue-control-tool-tip
              type="bri"
              :bri="currentBrightness"
              @requestChange="requestAll"
            />
          </v-row>

          <v-row

            justify="center"
          >
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
                @click="closeDialog"
              >
                닫기
              </v-btn>
            </v-card-actions>
          </v-row>
        </v-col>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import axios from 'axios'
  import { rgbToHsvString } from './rgbToHsv'
  import hueControlToolTip from './hueControltoolTip'

  export default {
    components: {
      'hue-control-tool-tip': hueControlToolTip,
    },
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
        currentTemperature: 2000,
        currentSaturation: 0,
        currentBrightness: 0,
        dialog: false,
        modal2: false,
        swatches: [
          ['#FF0000', '#AA0000', '#550000'],
          ['#FFFF00', '#AAAA00', '#555500'],
          ['#00FF00', '#00AA00', '#005500'],
          ['#00FFFF', '#00AAAA', '#005555'],
          ['#0000FF', '#0000AA', '#000055'],
        ],

      }
    },
    created () {
      this.dialog = this.open
      console.log(this.numlist)
    },
    methods: {
      closeDialog () {
        this.dialog = false
        this.$emit('closeDialog')
      },
      setColor () {
        this.currentHSB = rgbToHsvString(this.currentRGB)
        this.requestAll('color')
      },
      async requestAll (type, value) {
        if (type === 'color') {
          const data = {
            on: this.currentPower,
            hue: this.currentHSB.hue,
            sat: this.currentHSB.sat,
            bri: this.currentHSB.bri,
            numlist: this.numlist,
          }
          await axios.put('/api/hue/changeAll', data)
        } else {
          const data = { on: this.currentPower, numlist: this.numlist }
          if (type) data[type] = Math.floor(value)
          await axios.put('/api/hue/changeAll', data)
        }

        console.log('요청 일괄 반영')
      },
      switchPower () {
        this.currentPower = !this.currentPower
        this.requestAll()
      },

    },
  }
</script>
