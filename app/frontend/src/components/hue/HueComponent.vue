<template>
  <v-container class="ct" v-if="!loading">
    <v-card class="mx-auto" max-width="250">
      <v-card-text>
        <h2>Hue {{ hueData.number }}</h2>
        <v-avatar color="blue" size="200">
          <span class="white--text headline"></span>
        </v-avatar>
        <h2>{{ currentPower ? "켜짐" : "꺼짐" }}</h2>
      </v-card-text>

      <v-card-actions class="btn">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
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
              label="색 온도"
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
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
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
            <h2>hue : {{ currentHSB.hue }}</h2>
            <h2>saturation : {{ currentHSB.sat }}</h2>
            <h2>brightness : {{ currentHSB.bri }}</h2>
            <h2>온도 : {{ currentTemperature }}</h2>
          </v-card>
        </v-menu>
      </v-card-actions>
    </v-card>

    <!-- <v-row justify="space-around">
      <v-col cols="6">
        <v-row>
          <v-col>
            <h2>{{ hueData.number }}번 전구 설정</h2>
          </v-col>
          <v-col>
            <v-btn @click="switchPower">{{
              this.currentPower ? "켜기" : "끄기"
            }}</v-btn>
            <v-avatar color="blue" size="size">
              <span class="white--text headline">62</span>
            </v-avatar>
          </v-col>
        </v-row>
        <v-color-picker
          @input="setColor"
          canvas-height="200"
          width="600"
          class="ma-2"
          hide-mode-switch
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
    </v-row> -->
  </v-container>
</template>

<script>
import { rgbToHsvString } from "./rgbToHsv";
import axios from "axios";

export default {
  props: ["hueData", "num"],
  created() {
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
