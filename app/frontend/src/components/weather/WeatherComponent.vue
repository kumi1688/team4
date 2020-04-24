<template>
  <v-card class="mx-auto" max-width="450">
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline">{{ this.province }} {{ this.city }}{{ this.town }}</v-list-item-title>
        <v-list-item-subtitle>{{ currentDate }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <v-row align="center">
        <v-col class="display-3" cols="6">23&deg;C</v-col>
        <v-col cols="6">
          <v-img src="https://cdn.vuetifyjs.com/images/cards/sun.png" alt="Sunny image" width="92"></v-img>
        </v-col>
      </v-row>
    </v-card-text>

    <v-content v-if="!loading">
      <weather-list-element :selectedData="selectedData" />
    </v-content>
    <v-content v-if="!loading">
      <h2>야호</h2>
    </v-content>

    <v-slider
      v-model="selectedTime"
      :max="7"
      :tick-labels="timeData.timeListToString"
      class="mx-6"
      ticks
    ></v-slider>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn text>상세 정보</v-btn>
    </v-card-actions>
    <!-- <v-btn @click="()=>{this.loading = !this.loading}">전환</v-btn> -->
  </v-card>
</template>

<script>
import WeatherListElement from "./weatherListElement";

export default {
  components: {
    "weather-list-element": WeatherListElement
  },
  props: ["weatherData", "province", "city", "town"],
  created() {
    console.log(this.weatherData);
    let timeList = this.weatherData.data.map(dl => [
      dl.item[0].baseDate,
      dl.item[0].baseTime
    ]);
    timeList.sort(function(a, b) {
      // 오름차순 정렬
      return a[0] - b[0];
    });
    this.timeData = {
      olderDate: timeList[0][0],
      newDate: timeList[timeList.length - 1][0],
      timeList: timeList.map(time => time[1]),
      timeListToString: timeList.map(
        time =>
          time[1]
            .split("")
            .splice(0, 2)
            .join("") + "시"
      )
    };
  },
  watch: {
    selectedTime() {
      this.loading = true;
      const result = this.weatherData.data.find(
        wd => wd.item[0].baseTime === this.timeData.timeList[this.selectedTime]
      );
      const result2 = result.item.map(element => [
        element.category,
        element.fcstValue
      ]);
      this.selectedData = result2.splice(0, 9);
      this.loading = false;
    },
    selectedData() {
      this.loading = true;
      console.log(this.selectedData);
      this.loading = false;
    }
  },
  computed: {
    currentDate() {
      return new Date();
    }
  },
  data() {
    return {
      timeData: null,
      selectedTime: 0,
      selectedData: [],
      loading: false,
      forecast: [
        {
          day: "Tuesday",
          icon: "mdi-white-balance-sunny",
          temp: "24\xB0/12\xB0"
        },
        {
          day: "Wednesday",
          icon: "mdi-white-balance-sunny",
          temp: "22\xB0/14\xB0"
        },
        { day: "Thursday", icon: "mdi-cloud", temp: "25\xB0/15\xB0" }
      ]
    };
  }
};
</script>