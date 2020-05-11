<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row>
      <v-col
        v-for="(type, index) in Object.keys(chartData)"
        :key="index"
        cols="12"
        lg="4"
      >
        <chart-container
          v-if="!loading"
          :data="chartData[type]"
          :options="getChartOption(type)"
          :name="type"
          :color="randomColor(index)"
          hover-reveal
          type="Line"
          :socket="filterWS(type)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import chartContainer from './chart/chartContainer'
  import io from 'socket.io-client'
  const socketTemp = io(`${process.env.VUE_APP_BACKEND_URL}/temperature`)
  const socketDust = io(`${process.env.VUE_APP_BACKEND_URL}/dust`)
  const socketLight = io(`${process.env.VUE_APP_BACKEND_URL}/light`)
  const socketFlame = io(`${process.env.VUE_APP_BACKEND_URL}/flame`)
  const socketGas = io(`${process.env.VUE_APP_BACKEND_URL}/gas`)
  const socketCo = io(`${process.env.VUE_APP_BACKEND_URL}/co`)
  const socketPir = io(`${process.env.VUE_APP_BACKEND_URL}/pir`)

  const socketList = [
    socketTemp,
    socketDust,
    socketLight,
    socketFlame,
    socketGas,
    socketCo,
    socketPir,
  ]

  export default {
    name: 'MyDashboardDashboard',
    components: {
      'chart-container': chartContainer,
    },
    data () {
      return {
        socketList,
        baseChartOption: {
          data: {
            labels: ['0초', '2초', '4초', '6초', '8초', '10초', '12초', '14초'],
            series: [[0]],
          },
          options: {
            low: 0,
            high: 500, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          },
        },

        chartData: {},
        // sensorList: null,
        sensorList: ['dust', 'co', 'light', 'temperature', 'gas', 'flame', 'pir'],
        actuatorList: ['buzzer', 'hue'],
        loading: false,
        baseData: {
          labels: [
            '0초',
            '2초',
            '4초',
            '6초',
            '8초',
            '10초',
            '12초',
            '14초',
          ].reverse(),
          series: [[0, 0, 0, 0, 0, 0, 0, 0]],
        },
        properties: {},
        colors: [
          'amber',
          'brown',
          'orange',
          'grey',
          'info',
          'success',
          'warning',
          'error',
        ],
      }
    },
    async created () {
      this.loading = true
      this.getSensorList()
      this.getProperty()
      console.log(this.sensorList)
      console.log(this.properties)

      this.setBaseChartData()
      this.connectWebSocket()
      this.updateDataWS()

      this.loading = false
    },
    methods: {
      randomColor (index) {
        return this.colors[index]
      },
      async getSensorList () {
        const result = await axios.get('/api/sensorList')
        this.sensorList = result.data
      },
      async getProperty () {
        const result = await Promise.all(
          this.sensorList.map(sensor => {
            return axios.get(`/api/${sensor}/property`)
          }),
        )
        result.map((property, index) => {
          this.properties[this.sensorList[index]] = property.data
        })
      },
      setBaseChartData () {
        this.sensorList.map(sensor => {
          // shallow copy 때문에 series[0]은 분해해서 복사

          this.chartData[sensor] = {
            ...this.baseData,
            series: [...this.baseData.series],
          }
        })
      },
      getChartOption (sensor) {
        if (this.properties[sensor] !== undefined) {
          const options = {
            ...this.baseChartOption.options,
            low: this.properties[sensor].min,
            high: this.properties[sensor].max,
          }

          return options
        }
        return this.baseChartOption.options
      },
      filterWS (type) {
        const result = this.socketList.filter(
          socket => socket.nsp === '/' + type,
        )
        return result[0]
      },
      connectWebSocket () {
        socketList.map(socket => {
          socket.on('connection', () => {
            console.log(`[sys] ${socket} 네임 스페이스 연결됨 !`)
          })
        })
      },
      updateChartData (newData, type) {
        this.loading = true
        this.chartData[type].series[0] = [
          ...this.chartData[type].series[0].slice(1),
          newData[type],
        ]
        this.loading = false
      },

      updateDataWS () {
        socketList.map(socket => {
          socket.on('update', data => {
            // console.log(`[sys] ${socket.nsp} 업데이트 됨!`)
            this.updateChartData(
              JSON.parse(data),
              socket.nsp
                .split('')
                .slice(1)
                .join(''),
            )
          })
        })
      },
    },
  }
</script>
