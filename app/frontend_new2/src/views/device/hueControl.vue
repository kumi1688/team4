<template>
  <v-row
    v-if="!loading"
    justify="center"
  >
    <v-dialog
      v-model="dialog"
      persistent
      max-width="1000"
    >
      <v-row justify="center">
        <v-col>
          <v-card
            height="500"
            width="500"
          >
            <v-card-title class="headline">
              현재 상태
            </v-card-title>

            <template>
              <v-row justify="space-around">
                <v-list
                  color="#E3F2FD"
                  width="500"
                  min-height="100"
                  rounded
                  expand
                >
                  <v-list-item-group

                    color="primary"
                  >
                    <v-list-item
                      min-height="100"
                    >
                      <v-list-item-icon>
                        <v-icon
                          size="lg"
                          :color="huedata.on ? 'green' : 'red'"
                        >
                          fas fa-power-off
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title class="display-2">
                          전원 {{ huedata.on ? '켜짐' : '꺼짐' }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                      min-height="100"
                    >
                      <v-list-item-icon>
                        <v-icon
                          size="xl"
                          :color="temperature === '낮음'? 'red': 'green'"
                        >
                          fas fa-thermometer-three-quarters
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title class="display-2">
                          온도 {{ temperature }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                      min-height="100"
                    >
                      <v-list-item-icon>
                        <v-icon
                          size="lg"
                          :color="bright === '높음' ? 'red' : 'green'"
                        >
                          fas fa-sun
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title class="display-2">
                          밝기 {{ bright }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-row>
            </template>
            <v-card-actions>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col>
          <v-card
            height="600"
          >
            <v-col>
              <v-row>
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
                  @update:color="initColor"
                />
                <v-dialog
                  ref="dialog"
                  v-model="modal2"
                  :return-value.sync="time"
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
                  <card>
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
                        @click="$refs.dialog.save(time)"
                      >
                        설정
                      </v-btn>
                    </v-card-actions>
                  </card>
                </v-dialog>
              </v-row>

              <v-row class="mt-5">
                <hue-control-tool-tip
                  type="ct"
                  :ct="currentTemperature"
                  @requestChange="requestChange"
                />
              </v-row>

              <v-row class="mt-5">
                <hue-control-tool-tip
                  v-if="!colorLoading"
                  type="sat"
                  :sat="currentSaturation"
                  @requestChange="requestChange"
                />
              </v-row>

              <v-row class="mt-5">
                <hue-control-tool-tip
                  v-if="!colorLoading"
                  type="bri"
                  :bri="currentBrightness"
                  @requestChange="requestChange"
                />
              </v-row>

              <v-row justify="center">
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
        </v-col>
      </v-row>
    </v-dialog>
  </v-row>
</template>

<script>
  import axios from 'axios'
  import hueControlToolTip from './hueControltoolTip'
  import { rgbToHsvString, hsbToRgb } from './rgbToHsv'

  export default {
    components: {
      'hue-control-tool-tip': hueControlToolTip,
    },
    props: {
      open: {
        type: Boolean,
        default: undefined,
      },
      huedata: {
        type: Object,
        default: undefined,
      },
    },
    data () {
      return {
        loading: false,
        colorLoading: false,
        time: null,
        modal2: false,
        currentHSB: null,
        currentRGB: null,
        currentPower: null,
        currentTemperature: 2000,
        currentSaturation: 0,
        currentBrightness: 0,

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
    computed: {
      temperature () {
        if (this.huedata.ct > 350) { return '차가움' } else if (this.huedata.ct > 200) return '중간'
        else return '따뜻함'
      },
      bright () {
        if (this.huedata.bri > 150) return '밝음'
        else if (this.huedata.bri > 50) return '중간'
        else return '어두움'
      },

    },
    watch: {
      currentRGB () {

      },
      // currentTemperature () {
      //   const value = (this.currentTemperature - 2000) / 13 + 153
      //   this.requestChange('ct', value)
      // },
      // currentSaturation () {
      //   const value = this.currentSaturation * 2.5
      //   this.requestChange('sat', value)
      // },
      // currentBrightness () {
      //   const value = this.currentBrightness * 2.5
      //   this.requestChange('bri', value)
      // },

    },
    created () {
      this.loading = true
      this.dialog = this.open

      this.currentHSB = {
        hue: this.huedata.hue,
        sat: this.huedata.sat,
        bri: this.huedata.bri,
      }
      this.initColor()

      console.log(this.huedata)
      this.currentPower = this.huedata.on

      this.currentTemperature = (this.huedata.ct - 153) * 13 + 2000
      this.currentSaturation = this.huedata.sat / (2.5)
      this.currentBrightness = this.huedata.bri / (2.5)
      this.loading = false
    },
    methods: {
      initColor () {
        const result = hsbToRgb(this.huedata.hue, this.huedata.sat, this.huedata.bri)
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
      setValue (type, value) {
        this[type] += value
      },
      closeDialog () {
        this.dialog = false
        this.$emit('closeDialog')
      },
      setColor () {
        this.colorLoading = true
        console.log(this.currentRGB)
        this.currentHSB = rgbToHsvString(this.currentRGB)
        this.currentSaturation = this.currentHSB.sat / (2.5)
        this.currentBrightness = this.currentHSB.bri / (2.5)
        this.reqeustHueChange()
        this.colorLoading = false
      },
      async reqeustHueChange () {
        await axios.put(`/api/hue/${this.huedata.number}`, {
          on: this.currentPower,
          hue: this.currentHSB.hue,
          sat: this.currentHSB.sat,
          bri: this.currentHSB.bri,
        })
        console.log('요청 반영됨')
      },
      async requestChange (type, value) {
        const data = { on: this.currentPower }
        data[type] = Math.floor(value)
        await axios.put(`/api/hue/${this.huedata.number}`, data)

        console.log('요청 반영됨2')
      },
      switchPower () {
        this.currentPower = !this.currentPower
        axios.put(`/api/hue/${this.huedata.number}`, {
          on: this.currentPower,
        })
      },
    },

  }
</script>
