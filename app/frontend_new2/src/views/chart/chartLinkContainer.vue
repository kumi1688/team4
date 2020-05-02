<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline">
        센서 연동하기
      </v-card-title>

      <v-tabs
        v-model="tab"
        centered
        grow
      >
        <v-tabs-slider />

        <v-tab
          v-for="actuator in tabs"
          :key="actuator"
          :href="`#tab-${actuator}`"
        >
          {{ actuator }}
        </v-tab>

        <v-tab-item
          v-for="actuator in tabs"
          :key="actuator"
          :value="'tab-' + actuator"
        >
          <v-card
            flat
            tile
          >
            <v-card-text>{{ actuator }}</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="green darken-1"
          text
          @click="dialogClose"
        >
          Disagree
        </v-btn>

        <v-btn
          color="green darken-1"
          text
          @click="dialogClose"
        >
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        tab: null,
        tabs: ['Hue', '부저'],
        icons: true,
      }
    },
    created () {
      this.dialog = true
    },
    methods: {
      dialogClose () {
        this.dialog = false
        this.$emit('linkDialogClose')
      },
    },
  }
</script>
