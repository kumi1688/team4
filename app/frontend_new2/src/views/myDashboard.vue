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
          hover-reveal
          color="green"
          type="Line"
          @click="showData"
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
  const socketFlame = io('localhost:8080/flame')
  const socketGas = io('localhost:8080/gas')

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
            series: [[0]],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 500, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
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
        flameOption: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
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
        gasOption: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
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
        dustOption: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
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
        chartData: {},
        list: {
          0: false,
          1: false,
          2: false,
        },
        sensorList: ['dust', 'gas', 'flame'],
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
          series: [[0, 0, 0, 0, 0, 0, 0, 0]],
        },
        flameData: [],
        lightData: [],
        temperatureData: [],
        dustData: [],
        gasData: [],
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
      getChartOption (type) {
        let result = this.baseChartOption.options
        switch (type) {
          case 'gas':
            result = this.gasOption
            break
          case 'flame':
            result = this.flameOption
            break
          case 'temperature':
            result = this.baseChartOption.options
            break
          case 'dust':
            result = this.dustOption
            break
        }
        return result
      },
      showData () {},
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
        // if (type === 'flame') console.log('sadfsafasd', newData[type])
        // this.chartData[type].series[0] = [
        //   ...this.chartData[type].series[0].slice(1),
        //   parseInt(newData[type], 10),
        // ]
        // this.chartData[type].series[0].shift()
        // this.chartData[type].series[0].push(parseInt(newData[type]))
        }
        if (type === 'flame') {
          if (this.flameData.length < 8) {
            this.flameData = [...this.flameData, parseInt(newData[type], 10)]
          } else {
            this.flameData = [
              ...this.flameData.slice(1),
              parseInt(newData[type], 10),
            ]
          }
          this.chartData[type].series[0] = [...this.flameData]
        } else if (type === 'dust') {
          // console.log(newData[type])
          if (this.dustData.length < 8) {
            this.dustData = [...this.dustData, parseInt(newData[type], 10)]
          } else {
            this.dustData = [
              ...this.dustData.slice(1),
              parseInt(newData[type], 10),
            ]
          }
          this.chartData[type].series[0] = [...this.dustData]
        } else if (type === 'gas') {
          if (this.gasData.length < 8) {
            this.gasData = [...this.gasData, parseInt(newData[type], 10)]
          } else {
            this.gasData = [
              ...this.gasData.slice(1),
              parseInt(newData[type], 10),
            ]
          }
          this.chartData[type].series[0] = [...this.gasData]
        }

        // if (type === 'dust') console.log(this.dustData)
        this.loading = false
      },
      updateDataWS () {
        // socketTemp.on('update', data => {
        //   // console.log('[sys] temperature 업데이트 됨!')
        //   // console.log(JSON.parse(data))
        //   this.updateChartData(JSON.parse(data), 'temperature')
        // })
        socketDust.on('update', data => {
          console.log('[sys] dust 업데이트 됨!')
          const result = {
            dust: JSON.parse(data),
          }
          // console.log(JSON.parse(data))
          this.updateChartData(result, 'dust')
        })
        socketLight.on('update', data => {
          // console.log('[sys] light 업데이트 됨!')
          // console.log(JSON.parse(data))
          this.updateChartData(JSON.parse(data), 'light')
        })
        socketFlame.on('update', data => {
          console.log('[sys] flame 업데이트 됨!')
          // console.log(JSON.parse(data))
          this.updateChartData(JSON.parse(data), 'flame')
        })
        socketGas.on('update', data => {
          console.log('[sys] gas 업데이트 됨!')
          // console.log(JSON.parse(data))
          this.updateChartData(JSON.parse(data), 'gas')
        })
      },
    },
  }
</script>
