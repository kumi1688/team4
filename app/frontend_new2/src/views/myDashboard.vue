<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <chart
      :v-if="!loading"
      :data="updateData"
      :options="temperatureChart.options"
    />

    <v-row>
      <v-col
        v-if="!update"
        cols="12"
        lg="4"
      >
        <base-material-chart-card
          :eventhandlers="temperatureChart.options.events"
          :data="temperatureChart.data"
          :options="temperatureChart.options"
          hover-reveal
          color="info"
          type="Line"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  color="info"
                  icon
                  v-on="on"
                >
                  <v-icon
                    color="info"
                  >
                    mdi-refresh
                  </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  light
                  icon
                  v-on="on"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h3 class="card-title display-4 font-weight-light mt-2 ml-2">
            온도
          </h3>

          <template v-slot:actions>
            <v-icon
              class="mr-1"
              small
              @click="onClick"
            >
              mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light">campaign sent 26 minutes ago</span>
          </template>
        </base-material-chart-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import chart from './temperature/chart'
  import io from 'socket.io-client'
  const socket = io('localhost:8080/temperature')

  export default {
    name: 'MyDashboardDashboard',
    components: {
      chart,
    },
    data () {
      return {
        temperatureChart: {
          data: {
            labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
            series: [
              [50, 60, 70, 80, 90, 10, 20, 99],

            ],
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
            events: [{
              event: 'update',
              fn: () => { this.data.series = [30, 96, 50, 20, 30, 50, 40, 50] },
            }],
          },
        },

        list: {
          0: false,
          1: false,
          2: false,
        },
        loading: false,
        updateData: null,
      }
    },
    created () {
      this.connectWebSocket()
      this.updateTemperatureWS()
      this.updateData = {
        labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
        series: [
          [50, 60, 70, 80, 90, 10, 20, 99],
        ],
      }
    },
    methods: {
      onClick () {
        this.temperatureChart.data.series[2] = [30, 96, 50, 20, 30, 50, 40, 50]
      },
      complete (index) {
        this.list[index] = !this.list[index]
      },
      connectWebSocket () {
        socket.on('connection', () => {
          console.log('[sys] temperature 네임 스페이스 연결됨 !')
        })
      },
      setUpdateData (newData) {
        this.loading = true
        this.updateData = { ...this.updateData }
        console.log(this.updateData)
        this.updateData.series[0] = [...this.updateData.series[0].slice(1), newData.temperature]
        console.log(this.updateData)
        this.loading = false
      },
      updateTemperatureWS () {
        socket.on('update', (data) => {
          console.log('[sys] temperature 업데이트 됨!')
          console.log(JSON.parse(data))
          this.setUpdateData(JSON.parse(data))
        })
      },
    },
  }
</script>
