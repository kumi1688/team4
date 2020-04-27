<template>
  <div
    ref="chartNode"
    class="chart-container"
  />
</template>

<script>
  import Chartist from 'chartist'

  export default {
    // data is an object containing Chart X and Y axes data
    // Options is your Chartist chart customization options
    props: {
      data: { type: Object, default: undefined },
      options: { type: Object, default: undefined },
    },
    // IMPORTANT: Vue.js is Reactive framework.
    // Hence watch for prop changes here
    watch: {
      data (newData, oldDate) {
        this.chartInstance.update(newData, this.options)
      },

      options (newOpts) {
        this.chartInstance.update(this.data, newOpts)
      },
    },

    // Use of mounted is important.
    // Otherwise $refs will not work
    mounted () {
      if (this.data && this.options) {
        // Reference to DOM Node where you will render chart using Chartist
        const divNode = this.$refs.chartNode

        // Example of drawing Line chart
        this.chartInstance = new Chartist.Line(divNode, this.data, this.options)
      }
    },
  }
</script>
