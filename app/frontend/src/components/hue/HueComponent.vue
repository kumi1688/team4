<template>
  <v-container v-if="!loading">
    <v-row justify="space-around">
      <v-col>
        <h2>{{ hueData.number }}번 전구</h2>
        <v-color-picker
          @input="setColor"
          class="ma-2"
          hide-mode-switch
          v-model="currentRGB"
        />
      </v-col>
      <v-col>
        <v-switch
          v-model="currentPower"
          :label="currentPower ? '켜짐' : '꺼짐'"
        ></v-switch>
        <v-slider
          v-model="currentTemperature"
          min="153"
          max="500"
          label="색 온도"
        ></v-slider>
            
        <h2>hue : {{ currentHSB.hue }}</h2>
        <h2>saturation : {{ currentHSB.sat }}</h2>
        <h2>brightness : {{ currentHSB.bri }}</h2>
        <h2>온도 : {{ currentTemperature }}</h2>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import { rgbToHsvString } from './rgbToHsv';
import axios from 'axios';

export default {
    props: ['hueData'],
    created(){
        this.currentPower = this.hueData.on;
        this.currentTemperature = this.hueData.ct;
        this.currentHSB = {
            hue: this.hueData.hue,
            sat: this.hueData.sat,
            bri: this.hueData.bri
        };
        
        console.log(this.currentRGB);
        this.loading = false;
    },
    watch:{
        currentRGB(){
            // console.dir(this.currentRGB)
            // console.log(this.currentRGB);
            // console.log(this.currentRGB.rgba())
        },
        currentPower(){
            this.reqeustHueChange();
        }
    },
    methods:{
        
        setColor() {
            console.log(this.currentRGB);
            this.currentHSB = rgbToHsvString(this.currentRGB);
            this.reqeustHueChange();
        },
        reqeustHueChange(){
            axios.put(`/api/light/${this.hueData.number}`, {
                on: this.currentPower,
                hue: this.currentHSB.hue,
                sat: this.currentHSB.sat,
                bri: this.currentHSB.bri,
                ct: this.currentTemperature
            });
        },
        
    },
    data(){
        return{
            loading: true,
            currentTemperature: null,
            currentHSB: null,
            currentRGB: '',
            currentPower: null
        }
    },
    
}
</script>