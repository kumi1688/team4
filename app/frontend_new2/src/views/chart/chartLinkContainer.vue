<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="1000"
  >
    <v-card width="1000">
      <v-card-title class="headline">
        센서 연동하기
      </v-card-title>

      <v-tabs
        v-model="tab"
        centered
        grow
      >
        <v-tabs-slider />

        <v-tab
          v-for="actuator in tabs"
          :key="actuator"
          :href="`#tab-${actuator}`"
        >
          {{ actuator }}
        </v-tab>

        <v-tab-item value="tab-Hue">
          <v-card
            flat
            tile
          >
            <v-row>
              <v-col
                v-for="room in roomSet"
                :key="room"
              >
                <device-list
                  :huelist="sortedRoomList.hue[room]"
                  :buzzerlist="sortedRoomList.buzzer[room]"
                  :room="room"
                  :huedata="filteredHueData[room]"
                  :sensor="sensor"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-tab-item>

        <v-tab-item value="tab-부저">
          <v-card
            flat
            tile
          >
            <v-card-text>부저</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="green darken-1"
          text
          @click="dialogClose"
        >
          닫기
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from 'axios'
  import deviceList from '../device/deviceList'

  export default {
    components: {
      'device-list': deviceList,
    },
    props: {
      sensor: { type: String, default: undefined },
    },
    data () {
      return {
        dialog: false,
        tab: null,
        tabs: ['Hue', '부저'],
        icons: true,
        roomSet: null,
        sortedRoomList: null,
        filteredHueData: null,
        assignInfo: null,
        links: {},
      }
    },
    computed: {},
    watch: {},
    async created () {
      await this.getHueStatus()
      this.initRooms()

      console.log(this.sortedRoomList, this.roomSet, this.assignInfo)
      this.dialog = true
    },
    methods: {
      dialogClose () {
        console.log('닫기')
        this.dialog = false
        this.$emit('linkDialogClose')
      },
      initRooms () {
        this.sortedRoomList = this.$store.state.assignInfo.roomList || {
          hue: {},
          buzzer: {},
        }
        this.roomSet = this.$store.state.rooms || []
        this.assignList = this.$store.state.assignInfo.assignList || {}

        if (this.roomSet.length !== 0) {
          this.filteredHueData = this.filterHueData()
        }
      },
      filterHueData () {
        const data = {}
        Object.keys(this.sortedRoomList.hue).map(room => {
          data[room] = []

          this.sortedRoomList.hue[room].map(number => {
            // console.log(number, this.hueDataAll)
            const idata = this.hueDataAll.find(hda => hda.number === number)
            data[room] = [...data[room], idata]
          })
        })
        return data
      },
      async getHueStatus () {
        const result = await axios.get('/api/hue/status')
        this.hueDataAll = result.data
        this.hueDataAll.forEach(function (element) {
          const { hue, bri, sat } = element

          let arr = []
          if (hue < 16) arr = [...arr, '0' + hue.toString(16)]
          else arr = [...arr, hue.toString(16)]

          if (sat < 16) arr = [...arr, '0' + sat.toString(16)]
          else arr = [...arr, sat.toString(16)]

          if (bri < 16) arr = [...arr, '0' + bri.toString(16)]
          else arr = [...arr, bri.toString(16)]

          element.colorToString = '#' + arr.join('')
        })
        console.log('[sys] hue status 초기 설정 완료')
      },
    },
  }
</script>
