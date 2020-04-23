import Vue from "vue";
import VueRouter from "vue-router";
import HueConatiner from "../hue/HueContainer.vue";
import WeatherContainer from "../weather/WeatherContainer.vue";

Vue.use(VueRouter);

export const router = new VueRouter({
  routes: [
    {
      path: "/hue",
      component: HueConatiner,
    },
    {
      path: "/weather",
      component: WeatherContainer,
    },
  ],
});
