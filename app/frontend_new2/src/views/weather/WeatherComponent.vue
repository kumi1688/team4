<template>
  <v-card
    class="mx-auto"
    max-width="450"
  >
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline">
          {{ province }} {{ city }} {{ town }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ currentDate }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <v-row align="center">
        <v-col
          class="display-3"
          cols="6"
        >
          {{ currentTemperature }}&deg;C
        </v-col>
        <v-col cols="6">
          <v-icon
            v-if="items.find(item=>item.name === '하늘상태' && item.value === '맑음')"
            size="150"
            color="green"
          >
            far fa-sun
          </v-icon>
          <v-icon
            v-else-if="items.find(item=>item.name === '하늘상태' && item.value === '구름많음')"
            size="150"
            color="gray"
          >
            fas fa-cloud-sun
          </v-icon>
          <v-icon
            v-else
            size="150"
            color="black"
          >
            fas fa-cloud
          </v-icon>
        </v-col>
      </v-row>
    </v-card-text>

    <v-container class="mx-auto">
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-subtitle>{{ item.name }}</v-list-item-subtitle>
        <v-list-item-subtitle>{{ item.value }}{{ item.unit }}</v-list-item-subtitle>
      </v-list-item>
    </v-container>

    <v-slider
      v-model="selectedTime"
      :max="7"
      :tick-labels="timeData.timeListToString"
      class="mx-6"
      ticks
    />
    <v-divider />

    <v-card-actions>
      <v-btn text>
        상세 정보
      </v-btn>
    </v-card-actions>
    <!-- <v-btn @click="()=>{this.loading = !this.loading}">전환</v-btn> -->
  </v-card>
</template>

<script>
  export default {
    components: {},
    props: {
      weatherData: { type: Object, default: undefined },
      province: { type: String, default: undefined },
      city: { type: String, default: undefined },
      town: { type: String, default: undefined },
    },
    data () {
      return {
        loading: false,
        timeData: null,
        selectedTime: 0,
        selectedData: [],
      }
    },
    computed: {
      currentTemperature () {
        const target = this.items.find(element => element.name === '기온')
        return target.value
      },
      currentDate () {
        return new Date()
      },
    },
    watch: {
      selectedTime () {
        this.setData()
        let items = []
        this.selectedData.map(data => {
          items = [
            ...items,
            {
              name: this.getName(data[0].toLowerCase()),
              unit: this.getUnit(data[0].toLowerCase()),
              icon: this.getIcon(data[0].toLowerCase()),
              value: this.getValue(data[0].toLowerCase(), data[1]),
            },
          ]
        })
        this.items = items.filter(item => item.name !== undefined)

      // console.log(this.items)
      },
      selectedData () {
      // console.log(this.selectedData)
      },
    },
    items () {
      console.log(this.items)
    },
    created () {
      // console.log(this.weatherData)
      const timeList = this.weatherData.data.map(dl => [
        dl.item[0].baseDate,
        dl.item[0].baseTime,
      ])
      timeList.sort(function (a, b) {
        // 오름차순 정렬
        return a[0] - b[0]
      })
      this.timeData = {
        olderDate: timeList[0][0],
        newDate: timeList[timeList.length - 1][0],
        timeList: timeList.map(time => time[1]),
        timeListToString: timeList.map(
          time =>
            time[1]
              .split('')
              .splice(0, 2)
              .join('') + '시',
        ),
      }
      this.setData()
      let items = []
      // console.log(this.selectedData)
      this.selectedData.map(data => {
        items = [
          ...items,
          {
            name: this.getName(data[0].toLowerCase()),
            unit: this.getUnit(data[0].toLowerCase()),
            icon: this.getIcon(data[0].toLowerCase()),
            value: this.getValue(data[0].toLowerCase(), data[1]),
          },
        ]
      })

      this.items = items.filter(item => item.name !== undefined)
      console.log(this.items)
    },
    methods: {
      setData () {
        const result = this.weatherData.data.find(
          wd => wd.item[0].baseTime === this.timeData.timeList[this.selectedTime],
        )
        const result2 = result.item.map(element => [
          element.category,
          element.fcstValue,
        ])
        this.selectedData = result2.splice(0, 9)
      },
      getValue (code, value) {
        if (code === 'sky') {
          console.log(code, value)
          if (value === '1') return '맑음'
          else if (value === '3') return '구름 많음'
          else return '흐림'
        } else if (code === 'pty') {
          if (value === '0') return '눈/비 없음'
          else if (value === '1') return '비 내림'
          else if (value === '3') return '눈'
          else return '소나기'
        } else return value
      },

      getName (code) {
        switch (code) {
          case 'pop':
            return '강수확률'
          case 'pty':
            return '강수형태'
          case 'reh':
            return '습도'
          case 's06':
            return '적설량'
          case 'sky':
            return '하늘상태'
          case 't3h':
            return '기온'
          case 'tmn':
            return '아침 최저기온'
          case 'tmx':
            return '낮 최고기온'
          case 'uuu':
            return '풍속(동서)'
          case 'vvv':
            return '풍속(남북)'
          case 'wav':
            return '파고'
          case 'vec':
            return '풍향'
          case 'wsd':
            return '풍속'
        }
      },

      getUnit (code) {
        switch (code) {
          case 'r06':
            return 'mm'
          case 'pop':
          case 'reh':
            return '%'
          case 'pty':
          case 'sky':
          case 'vec':
            return null
          case 't3h':
          case 'tmn':
          case 'tmx':
            return '℃'
          case 'wav':
            return 'm'
          case 'uuu':
          case 'vvv':
          case 'wsd':
            return 'm/s'
        }
      },
      getIcon (code) {
        switch (code) {
          case 'pop':
            return 'mdi-weather-pouring'
          case 'pty':
            return 'mdi-weather-partly-snowy-rainy'
          case 'reh':
            return 'mdi-water'
          case 's06':
            return 'mdi-snowflake'
          case 'sky':
            return 'mdi-weather-snowy-rainy'
          case 't3h':
            return 'mdi-temperature-celsius'
          case 'tmn':
          case 'tmx':
            return 'mdi-temperature-celsius'
          case 'uuu':
          case 'wsd':
          case 'vec':
          case 'vvv':
            return 'mdi-weather-windy'
          case 'wav':
            return 'mdi-waves'
        }
      },
    },
  }
</script>
