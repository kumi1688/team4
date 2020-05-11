<template>
  <base-material-chart-card
    :data="data"
    :options="options"
    hover-reveal
    color="info"
    type="Line"
  >
    <template v-slot:reveal-actions>
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            v-bind="attrs"
            color="info"
            icon
            v-on="on"
          >
            <v-icon color="info">
              mdi-refresh
            </v-icon>
          </v-btn>
        </template>

        <span>Refresh</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            v-bind="attrs"
            light
            icon
            v-on="on"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>

        <span>Change Date</span>
      </v-tooltip>
    </template>

    <h3 class="card-title display-4 font-weight-light mt-2 ml-2">
      {{ name }}
    </h3>

    <template v-slot:actions>
      <v-icon
        class="mr-1"
        small
      >
        mdi-clock-outline
      </v-icon>
      <span
        class="caption grey--text font-weight-light"
      >campaign sent 26 minutes ago</span>
    </template>
  </base-material-chart-card>
</template>

<script>
  export default {
    props: {
      data: { type: Object, default: undefined },
      options: { type: Object, default: undefined },
      name: { type: String, default: undefined },
    },
    created () {
      console.log(this.data, this.options)
    },
  }
</script>
