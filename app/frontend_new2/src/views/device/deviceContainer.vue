<template>
  <v-container
    v-if="!loading"
    id="dashboard"
    fluid
    tag="section"
  >
    <hue-dialog
      v-if="dialog[0]"
      :open="dialog[0]"
      :index="0"
      :property="property.hue"
      :prlist="roomList"
      :palist="assignList.hue"
      @closeDialog="closeDialogRoom"
    />
    <buzzer-dialog
      v-if="dialog[1]"
      :open="dialog[1]"
      :index="1"
      :property="property.buzzer"
      :prlist="roomList"
      :palist="assignList.buzzer"
      @closeDialog="closeDialogRoom"
    />
    <hue-property
      v-if="dialog[2]"
      :open="dialog[2]"
      :index="2"
      :property="property.hue"
      @closeDialog="closeDialog"
    />
    <carousels
      v-if="dialog[3]"
      :open="dialog[3]"
      :index="3"
      @closeDialog="closeDialog"
    />
    <v-row>
      <v-col
        v-for="(item, index) in headers"
        :key="index"
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :color="item.color"
          :icon="item.icon"
          :title="item.title"
          :index="index"
          @openDialog="openDialog(index)"
        />
      </v-col>

      <v-col
        v-for="room in roomSet"
        :key="room"
      >
        <device-list
          :huelist="sortedRoomList.hue[room]"
          :buzzerlist="sortedRoomList.buzzer[room]"
          :room="room"
          :huedata="filteredHueData[room]"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import hueProperty from './hueProperty'
  import buzzerDialog from './buzzerDialog'
  import hueDialog from './hueDialog'
  import carousels from './carousels'
  import deviceList from './deviceList'
  import axios from 'axios'
  import io from 'socket.io-client'
  const socket = io(`${process.env.VUE_APP_BACKEND_URL}/hue`)

  export default {
    name: 'DeviceContainer',
    components: {
      'device-list': deviceList,
      'hue-dialog': hueDialog,
      'hue-property': hueProperty,
      'buzzer-dialog': buzzerDialog,
      carousels: carousels,
    },
    data () {
      return {
        headers: [
          {
            color: 'info',
            title: 'Hue 배치',
            icon: 'mdi-folder-settings-outline',
          },
          { color: 'info', title: '부저 배치', icon: 'mdi-alarm-light' },
          { color: 'info', title: 'Hue 속성', icon: 'mdi-information-outline' },
          { color: 'info', title: 'Hue 사용법', icon: 'mdi-bookshelf' },
        ],
        list: {
          0: false,
          1: false,
          2: false,
        },
        property: {},
        dialog: {
          0: false,
          1: false,
          2: false,
          3: false,
        },
        assignList: {},
        roomList: [],
        sortedRoomList: { hue: {}, buzzer: {} },
        roomSet: [],
        deviceList: null,
        hueDataAll: null,
        filteredHueData: {},
        filterdBuzzerData: {},
        loading: false,
      }
    },

    async created () {
      this.loading = true
      await this.getDeviceList()
      await this.getDeviceProperty()

      await this.getHueStatus()

      this.initRooms()
      this.initAssignList()

      this.connectWebSocket()
      this.updateHueState()
      this.loading = false
    },
    beforeDestroy () {
      this.$store.commit('SET_ASSIGN_INFO', {
        roomList: this.sortedRoomList,
        assignList: this.assignList,
      })
      this.$store.commit('SET_ROOMS', this.roomSet)
    },
    methods: {
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
        console.log(data)
        return data
      },
      closeDialogRoom (data) {
        console.log(data)
        this.dialog[data.index] = false
        this.assignList[data.type] = [...data.assignList]
        this.roomList = [...data.roomList]

        // 각 방마다 전구 파악 후 배분
        const arr = {}
        this.roomList.forEach(element => {
          arr[element] = this.assignList[data.type].map((al, index) => {
            if (al === element) return index
          })
        })

        Object.keys(arr).forEach(element => {
          arr[element] = arr[element].filter(item => item !== undefined)
          arr[element] = arr[element].map(
            item => this.property[data.type].number[item],
          )
        })

        this.sortedRoomList[data.type] = arr

        if (data.type === 'hue') this.filteredHueData = this.filterHueData()
        console.log(this.sortedRoomList)
        this.roomSet = new Set([
          ...Object.keys(this.sortedRoomList.hue),
          ...Object.keys(this.sortedRoomList.buzzer),
        ])
        this.roomSet = [...this.roomSet]
      },
      closeDialog (index) {
        this.dialog[index] = false
      },
      openDialog (index) {
        this.dialog[index] = true
      },
      async getDeviceList () {
        const result = await axios.get('/api/deviceList')
        this.deviceList = result.data
      },
      async getDeviceProperty () {
        const result = await Promise.all(
          this.deviceList.map(device => {
            return axios.get(`/api/${device}/property`)
          }),
        )
        result.map((data, index) => {
          this.property[this.deviceList[index]] = data.data
        })
      },
      initAssignList () {
        Object.keys(this.property).map(device => {
          if (!this.assignList[device]) {
            this.assignList[device] = new Array(
              this.property[device].number.length,
            )
          }
        })
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
      compareState (updateData) {
        this.isUpdate = false
        this.hueDataAll.map(element => {
          if (element.number === updateData.number) {
            element.ct = updateData.ct
            element.bri = updateData.bri
            element.sat = updateData.sat
            element.hue = updateData.hue
            element.on = updateData.on

            const { hue, bri, sat } = element

            let arr = []
            if (hue < 16) arr = [...arr, '0' + hue.toString(16)]
            else arr = [...arr, hue.toString(16)]

            if (sat < 16) arr = [...arr, '0' + sat.toString(16)]
            else arr = [...arr, sat.toString(16)]

            if (bri < 16) arr = [...arr, '0' + bri.toString(16)]
            else arr = [...arr, bri.toString(16)]

            element.colorToString = '#' + arr.join('')
          }
        })

        this.isUpdate = true
      },
      connectWebSocket () {
        socket.on('connection', () => {
          console.log('[sys] hue 웹소켓 연결됨')
        })
      },
      updateHueState () {
        socket.on('update', data => {
          console.log('업데이트 됨', JSON.parse(data))
          this.compareState(JSON.parse(data))
        })
      },
    },
  }
</script>
