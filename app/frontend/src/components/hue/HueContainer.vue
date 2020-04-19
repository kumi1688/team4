<template>
  <v-container v-if="!loading">
    <v-content v-for="(hueData, index) in hueDataAll" :key="index">
      <hue-component :hueData="hueData">hue container</hue-component>
    </v-content>
  </v-container>
</template>

<script>
import axios from "axios";
import io from "socket.io-client";
const socket = io("localhost:8080/hue");

import HueComponent from "./HueComponent";

export default {
  components: {
    "hue-component": HueComponent,
  },
  async created() {
    await this.getHueProperty();
    await this.getHueStatus();
    this.loading = false;
    console.log(this.hueDataAll);
    this.connectWebSocket();
    this.updateHueState();
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
        // this.bulbState = data.on ? "켜짐" : "꺼짐";
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
      // console.log(this.hueDataAll);
      console.log("[sys] hue status 초기 설정 완료");
    },
  },
  data() {
    return {
      loading: true,
      property: null,
      hueDataAll: null,
    };
  },
};
</script>
