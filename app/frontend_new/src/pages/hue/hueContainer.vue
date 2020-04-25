<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <!-- Widgets-->
      <v-flex d-flex lg3 sm6 xs12>
        <widget icon="fas fa-list" title='전구 분류' color='#AED581'/>
      </v-flex>
      <v-flex d-flex lg3 sm6 xs12>
        <widget icon="fas fa-wifi" title='연결 상태' color="#dc3545"/>
      </v-flex>
      <v-flex d-flex lg3 sm6 xs12>
        <widget icon="fas fa-info" title="속성 확인" color="#0866C6"/>
      </v-flex>
      <v-flex d-flex lg3 sm6 xs12>
        <widget icon="fas fa-book" title="Hue 사용법" color="#1D2939"/>
      </v-flex>
      <!-- Widgets Ends -->
      <v-flex d-flex lg3 sm6 xs12>
        <hue-card/>
      </v-flex>
      
    
    </v-layout>
  </v-container>
</template>

<script>
import hueCard from './hueCard.vue';

export default {
  components:{
    'hue-card': hueCard
  },
  data() {
    return {
      lorem: `Lorem ipsum dolor sit amet, mel at clita quando.`
    }
  }
}
</script>

<style>

</style>
