<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="1000"
    >
      <v-row>
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
                          :color="temperature === '높음'? 'red': 'green'"
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
        </v-col>
      </v-row>
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
      huedata: {
        type: Object,
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
    computed: {
      temperature () {
        if (this.currentTemperature.ct > 350) { return '높음' } else if (this.currentTemperature.ct > 150) return '중간'
        else return '낮음'
      },
      bright () {
        if (this.huedata.bri > 150) return '높음'
        else if (this.huedata.bri > 50) return '중간'
        else return '낮음'
      },

    },
    watch: {

      currentTemperature () {
        this.reqeustHueChange()
      },
    },
    created () {
      this.dialog = this.open
      console.log(this.huedata)
      this.currentPower = this.huedata.on
      this.currentTemperature = this.huedata.ct
      this.currentHSB = {
        hue: this.huedata.hue,
        sat: this.huedata.sat,
        bri: this.huedata.bri,
      }
    },
    methods: {
      closeDialog () {
        this.dialog = false
        this.$emit('closeDialog')
      },
      setColor () {
        this.currentHSB = rgbToHsvString(this.currentRGB)
        this.reqeustHueChange()
      },
      reqeustHueChange () {
        axios.put(`/api/light/${this.huedata.number}`, {
          on: this.currentPower,
          hue: this.currentHSB.hue,
          sat: this.currentHSB.sat,
          bri: this.currentHSB.bri,
          ct: this.currentTemperature,
        })
        console.log('요청 반영됨')
      },
      switchPower () {
        this.currentPower = !this.currentPower
        // console.log(this.currentPower)
        this.reqeustHueChange()
      },
    },

  }
</script>
