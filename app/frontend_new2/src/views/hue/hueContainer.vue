<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <hue-dialog
      v-if="dialog[0]"
      :open="dialog[0]"
      :property="property"
      :prlist="roomList"
      :palist="assignList"
      @closeDialog="closeDialogRoom"
    />
    <hue-property
      v-if="dialog[2]"
      :open="dialog[2]"
      :property="property"
      @closeDialog="closeDialogProperty"
    />
    <carousels
      v-if="dialog[3]"
      :open="dialog[3]"
      @closeDialog="closeDialogManual"
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
        v-for="(room) in Object.keys(sortedRoomList)"
        :key="room"
      >
        <hue-list
          :huelist="sortedRoomList[room]"
          :room="room"
          :huedata="filteredHueData[room]"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import hueProperty from './hueProperty'
  import hueDialog from './hueDialog'
  import carousels from './carousels'
  import hueList from './hueList'
  import axios from 'axios'
  import io from 'socket.io-client'
  const socket = io(`${process.env.VUE_APP_BACKEND_URL}/hue`)

  export default {
    name: 'HueContainer',
    components: {
      'hue-list': hueList,
      'hue-dialog': hueDialog,
      'hue-property': hueProperty,
      carousels: carousels,
    },
    data () {
      return {
        headers: [
          { color: 'info', title: '전구 분류', icon: 'mdi-folder-settings-outline' },
          { color: 'info', title: '연결 상태', icon: 'mdi-wifi' },
          { color: 'info', title: 'Hue 속성', icon: 'mdi-information-outline' },
          { color: 'info', title: 'Hue 사용법', icon: 'mdi-bookshelf' },
        ],
        list: {
          0: false,
          1: false,
          2: false,
        },
        property: null,
        dialog: {
          0: false,
          1: false,
          2: false,
          3: false,
        },
        assignList: [],
        roomList: [],
        sortedRoomList: {},
        hueDataAll: null,
        filteredHueData: null,
      }
    },

    async created () {
      await this.getHueProperty()
      this.assignList = new Array(this.property.number.length)
      for (let i = 0; i < this.assignList.length; i++) {
        this.assignList[i] = null
      }
      await this.getHueStatus()
      console.log(this.hueDataAll)
      this.connectWebSocket()
      this.updateHueState()
    },
    methods: {
      filterHueData () {
        const data = {}
        console.log(this.sortedRoomList)
        Object.keys(this.sortedRoomList).map(room => {
          data[room] = []
          this.sortedRoomList[room].map(number => {
            const idata = this.hueDataAll.find(hda => hda.number === number)
            data[room] = [...data[room], idata]
          })
        })
        return data
      },
      complete (index) {
        this.list[index] = !this.list[index]
      },
      closeDialogRoom (data) {
        this.dialog[0] = false
        this.assignList = [...data.assignList]
        this.roomList = [...data.roomList]
        console.log(this.assignList, this.roomList)

        // 각 방마다 전구 파악 후 배분
        const arr = {}
        this.roomList.forEach(element => {
          arr[element] = this.assignList.map((al, index) => {
            if (al === element) return index
          })
        })
        Object.keys(arr).forEach(element => {
          arr[element] = arr[element].filter(item => item !== undefined)
          arr[element] = arr[element].map(item => this.property.number[item])
        })
        console.log(arr)
        this.sortedRoomList = arr
        this.filteredHueData = this.filterHueData()
      },
      closeDialogProperty () {
        this.dialog[2] = false
      },
      closeDialogManual () {
        this.dialog[3] = false
      },
      openDialog (index) {
        this.dialog[index] = true
      },

      async getHueProperty () {
        const result = await axios.get('/api/hue/property')
        this.property = result.data
        console.log('[sys] hue property 설정 완료')
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
        //   console.log(this.hueDataAll);
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
        // socket.on('test', data => {
        //   console.log('웹소켓 테스트', JSON.parse(data))
        // })
      },

    },

  }
</script>
