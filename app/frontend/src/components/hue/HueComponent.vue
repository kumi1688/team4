<template>
  <v-container class="ct" v-if="!loading">
    <v-card class="mx-auto" max-width="250">
      <v-card-text>
        <h2>Hue {{ hueData.number }}</h2>
        <v-avatar color="green" size="200">
          <span class="white--text headline"></span>
        </v-avatar>
        <h2>{{ hueData.on ? "켜짐" : "꺼짐" }}</h2>
      </v-card-text>

      <v-card-actions class="btn">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="200"
          left
        >
          <template v-slot:activator="{ on }">
            <v-btn color="indigo" dark v-on="on">
              조작
            </v-btn>
          </template>

          <v-card>
            <v-color-picker
              @input="setColor"
              canvas-height="200"
              width="300"
              class="ma-2"
              hide-mode-switch
              hide-inputs
              light
              v-model="currentRGB"
            />
            <v-slider
              sm="3"
              v-model="currentTemperature"
              min="153"
              max="500"
              thumb-label="always"
              prepend-icon="mdi-alarm-light"
              append-icon='mdi-alarm-light-outline'
            ></v-slider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="switchPower">{{
                this.currentPower ? "끄기" : "켜기"
              }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-menu
          v-model="menu2"
          :close-on-content-click="true"
          :close-on-click="false"
          :nudge-width="200"
          right
        >
          <template v-slot:activator="{ on }">
            <v-btn color="indigo" dark v-on="on">
              <v-badge color="green" dot v-if="updateStatus">
                현재 상태
              </v-badge>
              <v-badge color="red" dot v-if="!updateStatus">
                현재 상태
              </v-badge>
            </v-btn>
          </template>

          <v-card>
            <h2>hue : {{ hueData.hue }}</h2>
            <h2>saturation : {{ hueData.sat }}</h2>
            <h2>brightness : {{ hueData.bri }}</h2>
            <h2>온도 : {{ hueData.ct }}</h2>
          </v-card>
        </v-menu>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { rgbToHsvString } from "./rgbToHsv";
import axios from "axios";

export default {
  props: ["hueData", "num"],
  created() {
    console.log(this.hueData);
    this.currentPower = this.hueData.on;
    this.currentTemperature = this.hueData.ct;
    this.currentHSB = {
      hue: this.hueData.hue,
      sat: this.hueData.sat,
      bri: this.hueData.bri,
    };
    this.loading = false;
  },
  watch: {
    currentHSB() {
      // const rgb = hsbToRgb(
      //   this.currentHSB.hue,
      //   this.currentHSB.sat,
      //   this.currentHSB.bri
      // );
      // console.log(rgb);
      // this.updateStatus = false;
    },
    currentPower() {
      this.reqeustHueChange();
      // this.updateStatus = false;
    },
    currentTemperature() {
      // this.updateStatus = false;
    },
  },
  methods: {
    setColor() {
      this.currentHSB = rgbToHsvString(this.currentRGB);
      this.reqeustHueChange();
    },
    reqeustHueChange() {
      axios.put(`/api/light/${this.hueData.number}`, {
        on: this.currentPower,
        hue: this.currentHSB.hue,
        sat: this.currentHSB.sat,
        bri: this.currentHSB.bri,
        ct: this.currentTemperature,
      });
    },
    switchPower() {
      this.currentPower = !this.currentPower;
    },
  },
  data() {
    return {
      loading: true,
      currentTemperature: null,
      currentHSB: null,
      currentRGB: null,
      currentPower: null,
      updateStatus: true,
      menu: false,
      menu2: false,
      color: '#033'
    };
  },
};
</script>

<style scoped>
.ct {
  text-align: center;
}
h2 {
  padding-top: 10px;
  margin: 10px;
}
.btn {
  align-items: center;
  justify-content: center;
  align-content: center;
}
</style>
