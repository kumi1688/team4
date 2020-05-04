<template>
  <v-container>
    <timer-container
      v-if="hueTimerDialog"
      :huedata="selectedData"
      @closeDialog="closeDialog"
    />
    <hue-control
      v-if="dialog"
      :open="dialog"
      :huedata="selectedData"
      @closeDialog="closeDialog"
    />

    <hue-control-all
      v-if="dialogAll"
      :open="dialogAll"
      :numlist="numlist"
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
            @click="openHueDialog(-1)"
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
          v-for="hue in huelist"
          :key="hue"
        >
          <v-list-item-avatar>
            <v-icon
              :color="getHueIconColor(hue)"
            >
              far fa-lightbulb
            </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="display-2">
              {{ hue }}번 전구
            </v-list-item-title>
          </v-list-item-content>

          <v-icon @click="openHueTimerDialog(hue)">
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
            <v-icon
              color="green"
            >
              fas fa-bullhorn
            </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="display-2">
              {{ buzzer }}번 부저
            </v-list-item-title>
          </v-list-item-content>

          <v-icon @click="openBuzzerDialog(buzzer)">
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
    },
    data: () => ({
      hueIconColor: 'green',
      dialog: false,
      hueTimerDialog: false,
      selectedData: null,
      dialogAll: false,
      numlist: null,
    }),
    watch: {
      hueTimerDialog () {
        console.log(this.hueTimerDialog)
      },
    },
    created () {
      console.log(this.buzzerlist, this.huelist)
      this.getHueIconColor()
    },
    methods: {
      getHueIconColor (hue) {
        const result = this.huedata.find(hd => hd.number === hue)
        // console.log(result)
        if (result && result.on) return 'green'
        else return 'red'
        // setInterval(() => {
        //   if (this.hueIconColor === 'green') this.hueIconColor = 'red'
        //   else this.hueIconColor = 'green'
        // }, 500)
      },
      openHueTimerDialog (hue) {
        if (hue !== -1) {
          this.selectedData = this.huedata.find(hd => hd.number === hue)
          this.hueTimerDialog = true
        }
      },
      closeDialog () {
        this.dialog = false
        this.dialogAll = false
        this.hueTimerDialog = false
      },
      openBuzzerDialog (buzzer) {

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
    },
  }
</script>
