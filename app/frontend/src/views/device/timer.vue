<template>
  <v-dialog
    v-model="modal2"
    :return-value.sync="time"
    persistent
    width="290px"
  >
    <v-time-picker
      v-if="modal2"
      v-model="time"
      allowed-seconds
      full-width
    >
      <v-spacer />
      <v-btn
        text
        color="primary"
        @click="modal2 = false"
      >
        Cancel
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="$refs.dialog.save(time)"
      >
        OK
      </v-btn>
    </v-time-picker>
  </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        time: null,
        menu2: false,
        modal2: false,
      }
    },
    created () {
      this.modal2 = true
    },
  }
</script>
