<template>
  <v-container class="mx-auto">
    <v-list-item v-for="(item, index) in items" :key="index">
      <v-list-item-icon>
        <v-icon>{{item.icon}}</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{item.name}}</v-list-item-subtitle>
      <v-list-item-subtitle>{{item.value}}{{item.unit}}</v-list-item-subtitle>
    </v-list-item>
  </v-container>
</template>

<script>
export default {
  props: ["selectedData"],
  created() {
    let items = [];
    this.selectedData.map(data => {
      items = [
        ...items,
        {
          name: this.getName(data[0].toLowerCase()),
          unit: this.getUnit(data[0].toLowerCase()),
          icon: this.getIcon(data[0].toLowerCase()),
          value: data[1]
        }
      ];
    });
    console.log(items);
    this.items = items;
  },
  updated() {
    console.log("updated");
  },
  methods: {
    getName(code) {
      switch (code) {
        case "pop":
          return "강수확률";
        case "pty":
          return "강수형태";
        case "reh":
          return "습도";
        case "s06":
          return "적설량";
        case "sky":
          return "하늘상태";
        case "t3h":
          return "기온";
        case "tmn":
          return "아침 최저기온";
        case "tmx":
          return "낮 최고기온";
        case "uuu":
          return "풍속(동서)";
        case "vvv":
          return "풍속(남북)";
        case "wav":
          return "파고";
        case "vec":
          return "풍향";
        case "wsd":
          return "풍속";
      }
    },

    getUnit(code) {
      switch (code) {
        case "r06":
          return "mm";
        case "pop":
        case "reh":
          return "%";
        case "pty":
        case "sky":
          return null;
        case "t3h":
        case "tmn":
        case "tmx":
          return "℃";
        case "wav":
          return "m";
        case "uuu":
        case "vvv":
        case "wsd":
        case "vec":
          return "m/s";
      }
    },
    getIcon(code) {
      switch (code) {
        case "pop":
          return "mdi-weather-pouring";
        case "pty":
          return "mdi-weather-partly-snowy-rainy";
        case "reh":
          return "mdi-water";
        case "s06":
          return "mdi-snowflake";
        case "sky":
          return "mdi-weather-snowy-rainy";
        case "t3h":
          return "mdi-temperature-celsius";
        case "tmn":
        case "tmx":
          return "mdi-temperature-celsius";
        case "uuu":
        case "wsd":
        case "vec":
        case "vvv":
          return "mdi-weather-windy";
        case "wav":
          return "mdi-waves";
      }
    }
  },
  data() {
    return {
      items: []
    };
  }
};
</script>