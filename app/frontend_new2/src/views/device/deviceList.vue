<template>
  <v-container>
    <timer-container
      v-if="hueTimerDialog"
      :huedata="selectedData"
      :numlist="numlist"
      @closeDialog="closeDialog"
    />
    <hue-control
      v-if="dialog"
      :open="dialog"
      :huedata="selectedData"
      :sensor="sensor"
      @addLink="addLink"
      @closeDialog="closeDialog"
    />
    <hue-control-all
      v-if="dialogAll"
      :open="dialogAll"
      :numlist="numlist"
      :sensor="sensor"
      @closeDialog="closeDialog"
    />
    <v-card
      max-width="500"
      class="mx-auto"
    >
      <v-toolbar
        color="deep-purple accent-4"
        dark
      >
        <v-app-bar-nav-icon />

        <v-toolbar-title>{{ room }}</v-toolbar-title>

        <v-spacer />

        <v-btn icon>
          <v-icon
            class="mr-2"
            @click="openHueTimerDialog(-1)"
          >
            far fa-clock
          </v-icon>
          <v-icon
            class="mr-6"
            @click="openHueDialog(-1)"
          >
            fas fa-cog
          </v-icon>
        </v-btn>
      </v-toolbar>

      <v-list>
        <v-list-item
          v-for="(hue, index) in huelist"
          :key="index"
        >
          <v-list-item-avatar>
            <v-icon
              v-if="isLink[index]"
              color="blue"
            >
              fas fa-link
            </v-icon>
            <v-badge
              dot
              :color="getHuePowerIconColor(hue)"
            >
              <v-icon :color="getHueStatusIconColor(hue)">
                far fa-lightbulb
              </v-icon>
            </v-badge>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="display-2">
              {{ hue }}번 전구
            </v-list-item-title>
          </v-list-item-content>

          <v-icon
            :color="sensor ? 'red' : 'none'"
            @click="openHueTimerDialog(hue)"
          >
            far fa-clock
          </v-icon>

          <v-icon
            class="ml-2"
            @click="openHueDialog(hue)"
          >
            fas fa-cog
          </v-icon>
        </v-list-item>

        <v-list-item
          v-for="buzzer in buzzerlist"
          :key="buzzer"
        >
          <v-list-item-avatar>
            <v-icon color="green">
              fas fa-bullhorn
            </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="display-2">
              {{ buzzer }}번 부저
            </v-list-item-title>
          </v-list-item-content>

          <v-icon
            v-if="buzzerCheck"
            color="blue"
            @click="setBuzzerLink(buzzer)"
          >
            fas fa-link
          </v-icon>
          <v-icon
            v-else
            @click="setBuzzerLink(buzzer)"
          >
            fas fa-cog
          </v-icon>
        </v-list-item>
      </v-list>
      <v-divider />
    </v-card>
  </v-container>
</template>

<script>
  import hueControl from './hueControl'
  import hueControlAll from './hueControlAll'
  import timerContainer from './timerContainer'
  import { hsbToRgb } from './rgbToHsv'

  export default {
    components: {
      'hue-control': hueControl,
      'hue-control-all': hueControlAll,
      'timer-container': timerContainer,
    },
    props: {
      huelist: {
        type: Array,
        default: undefined,
      },
      room: {
        type: String,
        default: undefined,
      },
      huedata: {
        type: Array,
        default: undefined,
      },
      buzzerlist: {
        type: Array,
        default: undefined,
      },
      sensor: {
        type: String,
        default: undefined,
      },
    },
    data: () => ({
      isLink: [],
      hueIconColor: 'green',
      dialog: false,
      hueTimerDialog: false,
      selectedData: null,
      dialogAll: false,
      numlist: null,
      buzzerCheck: false,
    }),
    created () {
      this.huelist.map((hue, index) => {
        this.isLink[index] = false
      })
    },
    beforeDestroy () {
      if (this.sensor && this.buzzerCheck) {
        const data = {
          deviceInfo: { device: 'buzzer', number: 1 },
          valueInfo: { type: 'buzzer', value: 'on' },
        }
        this.$store.commit('SET_LINK_DATA', data)
        this.$store.commit('ADD_LINK', this.sensor)
        this.$store.commit('CHECK_NEW_LINK', true)
      }
    },
    methods: {
      getHuePowerIconColor (hue) {
        const result = this.huedata.find(hd => hd.number === hue)
        if (result && result.on) return 'green'
        else return 'red'
      },
      getHueStatusIconColor (hue) {
        const target = this.huedata.find(hd => hd.number === hue)

        if (!target.on) return 'black'
        const currentColor = hsbToRgb(target.hue, target.sat, target.bri)
        return `rgba(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}, 1)`
      },
      openHueTimerDialog (hue) {
        if (this.sensorlink) return
        if (hue !== -1) {
          this.selectedData = this.huedata.find(hd => hd.number === hue)
          this.numlist = null
          this.hueTimerDialog = true
        } else {
          this.numlist = this.huedata.map(hd => hd.number)
          this.hueTimerDialog = true
        }
      },
      closeDialog () {
        this.dialog = false
        this.dialogAll = false
        this.hueTimerDialog = false
      },
      setBuzzerLink (buzzer) {
        if (this.sensor && !this.buzzerCheck) {
          this.buzzerCheck = true
        } else this.buzzerCheck = false
      },
      openHueDialog (hue) {
        if (hue === -1) {
          this.dialogAll = true
          this.numlist = this.huedata.map(hd => hd.number)
        } else {
          this.selectedData = this.huedata.find(hd => hd.number === hue)
          this.dialog = true
        }
      },
      addLink (number) {
        const index = this.huedata.findIndex(hue => hue.number === number)
        this.isLink[index] = true
      },
    },
  }
</script>
