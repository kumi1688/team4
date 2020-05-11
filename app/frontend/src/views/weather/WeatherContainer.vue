<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row>
      <v-col>
        <v-select
          v-model="currentProvince"
          :items="this.location.provinceList"
          label="1단계"
        />
      </v-col>
      <v-col>
        <v-select
          v-model="currentCity"
          :items="cityList"
          label="2단계"
        />
      </v-col>
      <v-col>
        <v-select
          v-model="currentTown"
          :items="this.location.townList"
          label="3단계"
        />
      </v-col>
    </v-row>

    <v-content v-if="!loading">
      <weather-component
        :weather-data="weatherData"
        :province="currentProvince"
        :city="currentCity"
        :town="currentTown"
      />
      <v-progress-circular
        v-if="loading"
        :size="300"
        color="primary"
        indeterminate
      />
    </v-content>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import WeatherComponent from './WeatherComponent.vue'

  import weatherStaion from '../../../public/weather/weatherStation.json'

  export default {
    components: {
      'weather-component': WeatherComponent,
    },
    data () {
      return {
        loading: true,
        weatherData: null,
        dustData: null,
        location: {},
        cityList: null,
        townList: null,
        currentProvince: '서울특별시',
        currentCity: '',
        currentTown: '',
      }
    },
    watch: {
      currentProvince () {
        const index = this.location.provinceList.indexOf(this.currentProvince)
        this.cityList = this.location.cityList[index]
        this.currentCity = null
        this.currentTown = null
      },
      currentCity () {
        this.getTown_Weather()
      },
      async currentTown () {
        this.loading = true
        await this.getWeatherData()
        this.loading = false
      },
      weatherData () {
      // console.log(this.weatherData);
      },
    },
    async created () {
      this.getStation_Weather()
      this.currentProvince = this.location.provinceList[0]
      this.currentCity = this.location.cityList[0][0]
      this.currentTown = weatherStaion[0]['3단계']

      await this.getWeatherData()
      await this.getDustData()

      this.cityList = this.location.cityList[0]
      console.log(this.weatherData)
      this.loading = false
    },
    methods: {
      async getWeatherData () {
        // console.log(this.currentProvince, this.currentCity, this.currentTown);
        const result = await axios.get(
          `/api/weather/weather?province=${this.currentProvince}&city=${this.currentCity}&town=${this.currentTown}`,
        )
        this.weatherData = result
      },
      async getDustData () {
        const result = await axios.get('/api/weather/dust', {
          params: {
            station: '기흥',
          },
        })
        this.dustData = result.data
      },
      getProvince_Weather () {
        const provinceList = weatherStaion.map(ws => ws['1단계'])
        this.location.provinceList = [...new Set(provinceList)]
      },
      getCity_Weather () {
        let cityList = []
        this.location.provinceList.forEach(pr => {
          const result = weatherStaion
            .filter(ws => ws['1단계'] === pr)
            .map(ws => ws['2단계'])
          cityList = [...cityList, [...new Set(result)]]
        })
        this.location.cityList = cityList
      },
      getTown_Weather () {
        let town = []
        weatherStaion.forEach(ws => {
          if (
            ws['1단계'] === this.currentProvince &&
            ws['2단계'] === this.currentCity
          ) {
            town = [...town, ws['3단계']]
          }
        })
        this.location.townList = town
      },
      getStation_Weather () {
        this.getProvince_Weather()
        this.getCity_Weather()
      },
    },
  }
</script>

<style scoped>
.wc {
  margin-left: auto;
  margin-right: auto;
  align-items: center;
}
</style>
