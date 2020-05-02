<template>
  <v-dialog
    v-model="dialog"
    persistent
    height="1500px"
    max-width="1500"
  >
    <v-card height="auto">
      <v-carousel>
        <v-carousel-item
          v-for="(item,i) in items"
          :key="i"
          :src="item"
          reverse-transition="fade-transition"
          transition="fade-transition"
          hide-delimiters
          hide-delimiter-background
          continuous="true"
          height="1500px"
          max-width="1500"
        />
      </v-carousel>
      <v-card-actions>
        <v-spacer />

        <v-btn
          color="green darken-1"

          @click="onClose"
        >
          끄기
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import color from '../../../public/hue/color.jpg'
  import comment from '../../../public/hue/comment.png'
  import hue from '../../../public/hue/hue.jpg'
  import hue2 from '../../../public/hue/hue2.jpg'
  import hue3 from '../../../public/hue/hue3.jpg'
  import hue4 from '../../../public/hue/hue4.jpg'
  import hue5 from '../../../public/hue/hue5.jpg'

  export default {
    props: {
      open: {
        type: Boolean,
        default: undefined,
      },
      index: {
        type: Number,
        default: undefined,
      },
    },
    data () {
      return {
        dialog: false,
        items: [color, comment, hue, hue2, hue3, hue4, hue5],
      }
    },
    created () {
      this.dialog = this.open
    },
    methods: {
      onClose () {
        this.dialog = false
        this.$emit('closeDialog', this.index)
      },
    },
  }
</script>
