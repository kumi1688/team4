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
          :options="baseChartOption.options"
          :name="type"
          hover-reveal
          color="green"
          type="Line"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import chartContainer from './chart/chartContainer'
  import io from 'socket.io-client'
  const socketTemp = io('localhost:8080/temperature')
  const socketDust = io('localhost:8080/dust')
  const socketLight = io('localhost:8080/light')

  export default {
    name: 'MyDashboardDashboard',
    components: {
      'chart-container': chartContainer,
    },

    data () {
      return {
        baseChartOption: {
          data: {
            labels: ['0초', '2초', '4초', '6초', '8초', '10초', '12초', '14초'],
            series: [[50, 60, 70, 80, 90, 10, 20, 99]],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 101, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
            events: [
              {
                event: 'update',
                fn: () => {
                  this.data.series = [30, 96, 50, 20, 30, 50, 40, 50]
                },
              },
            ],
          },
        },
        chartData: {},
        list: {
          0: false,
          1: false,
          2: false,
        },
        sensorList: ['temperature', 'light', 'dust'],
        loading: false,
        updateDataTemperature: null,
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
          series: [[50, 60, 70, 80, 90, 10, 20, 99]],
        },
      }
    },
    created () {
      this.connectWebSocket()

      this.sensorList.map(element => {
        this.chartData[element] = { ...this.baseData }
      })

      this.updateDataWS()
    },
    methods: {
      complete (index) {
        this.list[index] = !this.list[index]
      },
      connectWebSocket () {
        socketTemp.on('connection', () => {
          console.log('[sys] temperature 네임 스페이스 연결됨 !')
        })
        socketDust.on('connection', () => {
          console.log('[sys] dust 네임 스페이스 연결됨 !')
        })
        socketLight.on('connection', () => {
          console.log('[sys] light 네임 스페이스 연결됨 !')
        })
      },
      updateChartData (newData, type) {
        this.loading = true

        this.chartData[type] = { ...this.chartData[type] }
        if (!isNaN(newData[type])) {
          this.chartData[type].series[0] = [
            ...this.chartData[type].series[0].slice(1),
            parseInt(newData[type], 10),
          ]
        }
        console.log(this.chartData)

        this.loading = false
      },
      updateDataWS () {
        socketTemp.on('update', data => {
          console.log('[sys] temperature 업데이트 됨!')
          // console.log(JSON.parse(data))
          this.updateChartData(JSON.parse(data), 'temperature')
        })
        socketDust.on('update', data => {
          // console.log('[sys] dust 업데이트 됨!')
          console.log(JSON.parse(data))
          this.updateChartData(JSON.parse(data), 'dust')
        })
        socketLight.on('update', data => {
          // console.log('[sys] light 업데이트 됨!')
          console.log(JSON.parse(data))
          this.updateChartData(JSON.parse(data), 'light')
        })
      },
    },
  }
</script>
