<template>
  <v-container>
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
          <v-icon @click="openDialog(-1)">
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
              color="green"
            >
              far fa-lightbulb
            </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="display-2">
              {{ hue }}번 전구
            </v-list-item-title>
          </v-list-item-content>

          <v-icon @click="openDialog(hue)">
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

  export default {
    components: {
      'hue-control': hueControl,
      'hue-control-all': hueControlAll,
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

      dialog: false,
      hue: -1,
      selectedData: null,
      dialogAll: false,
      numlist: null,
    }),

    created () {
      console.log(this.buzzerlist, this.huelist)
    },
    methods: {
      closeDialog () {
        this.dialog = false
        this.dialogAll = false
      },
      openDialog (hue) {
        this.hue = hue
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
