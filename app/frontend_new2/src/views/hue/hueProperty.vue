<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Hue 데이터 속성
        </v-card-title>
        <v-card-text>{{ property }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="onClose"
          >
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    props: {
      property: {
        type: Object,
        default: undefined,
      },
      open: {
        type: Boolean,
        default: undefined,
      },
    },
    data () {
      return {
        dialog: false,
      }
    },
    created () {
      this.dialog = this.open
    },
    methods: {
      onClose () {
        this.dialog = false
        this.$emit('closeDialog')
      },
    },
  }
</script>
