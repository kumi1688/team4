<template>
  <v-app id="inspire">
    <common-header />
    <common-drawer />
    <router-view></router-view>
  </v-app>
</template>

<script>
import Header from "./components/common/Header";
import Drawer from "./components/common/drawer";

export default {
  components: {
    "common-header": Header,
    "common-drawer": Drawer,
  },
};
</script>
