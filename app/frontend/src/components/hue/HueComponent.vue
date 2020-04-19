<template>
  <v-container v-if="!loading">
    <v-row justify="space-around">
      <v-col cols="6">
        <v-row>
          <v-col>
            <h2>{{ hueData.number }}번 전구 설정</h2>
          </v-col>
          <v-col>
            <v-btn @click="switchPower">{{
              this.currentPower ? "켜기" : "끄기"
            }}</v-btn>
          </v-col>
        </v-row>
        <v-color-picker
          @input="setColor"
          canvas-height="200"
          width="600"
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
          label="색 온도"
        ></v-slider>
      </v-col>
      <v-col>
        <h2>현재 정보</h2>

        <v-btn @click="switchPower">{{
          this.currentPower ? "켜기" : "끄기"
        }}</v-btn>

        <h2>hue : {{ currentHSB.hue }}</h2>
        <h2>saturation : {{ currentHSB.sat }}</h2>
        <h2>brightness : {{ currentHSB.bri }}</h2>
        <h2>온도 : {{ currentTemperature }}</h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { rgbToHsvString } from "./rgbToHsv";
import axios from "axios";

export default {
  props: ["hueData"],
  created() {
    this.currentPower = this.hueData.on;
    this.currentTemperature = this.hueData.ct;
    this.currentHSB = {
      hue: this.hueData.hue,
      sat: this.hueData.sat,
      bri: this.hueData.bri,
    };

    // console.log(this.currentRGB);
    this.loading = false;
  },
  watch: {
    currentRGB() {
      // console.dir(this.currentRGB)
      console.log(this.currentRGB);
      // console.log(this.currentRGB.rgba())
    },
    currentPower() {
      this.reqeustHueChange();
    },
  },
  methods: {
    setColor() {
      // console.log(this.currentRGB);
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
    };
  },
};
</script>

<style scoped></style>
