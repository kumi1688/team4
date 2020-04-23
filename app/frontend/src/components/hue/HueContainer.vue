<template>
  <v-container v-if="!loading">
    <v-row>
      <v-content v-for="(hueData, index) in hueDataAll" :key="index">
        <hue-component :hueData="hueData" v-if="isUpdate"
          >hue container</hue-component
        >
      </v-content>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import io from "socket.io-client";
const socket = io("13.125.207.178:8080/hue");

import HueComponent from "./HueComponent";

export default {
  components: {
    "hue-component": HueComponent,
  },
  async created() {
    await this.getHueProperty();
    await this.getHueStatus();
    this.connectWebSocket();
    this.updateHueState();
    this.loading = false;
    console.log(this.hueDataAll);
  },
  methods: {
    connectWebSocket() {
      socket.on("connection", () => {
        console.log("[sys] hue 웹소켓 연결됨");
      });
    },
    updateHueState() {
      socket.on("update", (data) => {
        console.log("업데이트 됨", JSON.parse(data));
        this.compareState(JSON.parse(data));
      });
    },
    async getHueProperty() {
      const result = await axios.get("/api/light/property");
      this.property = result.data;
      console.log("[sys] hue property 설정 완료");
    },
    async getHueStatus() {
      const result = await axios.get("/api/light/status");
      this.hueDataAll = result.data;
      this.hueDataAll.forEach(function(element) {
        const { hue, bri, sat } = element;

        let arr = [];
        if (hue < 16) arr = [...arr, "0" + hue.toString(16)];
        else arr = [...arr, hue.toString(16)];

        if (sat < 16) arr = [...arr, "0" + sat.toString(16)];
        else arr = [...arr, sat.toString(16)];

        if (bri < 16) arr = [...arr, "0" + bri.toString(16)];
        else arr = [...arr, bri.toString(16)];

        element.colorToString = "#" + arr.join("");
      });
      console.log("[sys] hue status 초기 설정 완료");
    },
    compareState(updateData) {
      this.isUpdate = false;
      this.hueDataAll.map((element) => {
        if (element.number === updateData.number) {
          element.ct = updateData.ct;
          element.bri = updateData.bri;
          element.sat = updateData.sat;
          element.hue = updateData.hue;
          element.on = updateData.on;

          const { hue, bri, sat } = element;

          let arr = [];
          if (hue < 16) arr = [...arr, "0" + hue.toString(16)];
          else arr = [...arr, hue.toString(16)];

          if (sat < 16) arr = [...arr, "0" + sat.toString(16)];
          else arr = [...arr, sat.toString(16)];

          if (bri < 16) arr = [...arr, "0" + bri.toString(16)];
          else arr = [...arr, bri.toString(16)];

          element.colorToString = "#" + arr.join("");
        }
      });
      //   console.log(this.hueDataAll);
      this.isUpdate = true;
    },
  },
  data() {
    return {
      loading: true,
      property: null,
      hueDataAll: [],
      isUpdate: true,
    };
  },
};
</script>
