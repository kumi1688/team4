<template>
  <v-container>
    <base-material-chart-card
      :data="data"
      :options="options"
      hover-reveal
      :color="color"
      type="Line"
    >
      <v-row>
        <v-col>
          <h3 class="card-title display-3 font-weight-light mt-4 mr-0 ml-4">
            {{ nameInDialog[0] }}
          </h3>
        </v-col>
        <v-col
          cols="12"
          lg="4"
        >
          <v-badge
            :content="totalMessage"
            :value="totalMessage"
            color="red"
            overlap
          >
            <v-icon
              class="pt-5"
              :color="color"
              size="50"
              right
              @click="dialog = !dialog"
            >
              far fa-bell
            </v-icon>
          </v-badge>
        </v-col>
      </v-row>

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

    <v-dialog
      v-model="dialog"
      max-width="1000"
    >
      <v-card>
        <v-card-title class="display-3">
          {{ nameInDialog[0] }}  알람 설정
        </v-card-title>

        <v-row>
          <v-card
            elevation="15"
            class="mx-auto"
            max-width="700"
          >
            <v-list
              dense
            >
              <v-list-item-group color="primary">
                <v-list-item
                  v-for="(alert, index) in alertList"
                  :key="index"
                >
                  <v-list-item-icon>
                    <v-badge
                      :content="messages[index]"
                      :value="messages[index]"
                      color="red"
                    >
                      <v-icon color="green">
                        fas fa-exclamation
                      </v-icon>
                    </v-badge>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <h2 class="mx-auto">
                      <span id="name">{{ nameInDialog[0] }}</span>{{ nameInDialog[1] }} {{ alert.value }} {{ alert.criteria }} 일 때 <span id="notice">알림</span> 설정합니다
                    </h2>
                  </v-list-item-content>
                  <v-list-item-icon @click="removeAlert(index)">
                    <v-icon color="red">
                      fas fa-minus
                    </v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-row>
        <template>
          <v-form>
            <v-container>
              <v-row
                align="start"
                justify="start"
              >
                <v-col cols="3">
                  <h2 class="ml-3 mt-4">
                    <span id="name">{{ nameInDialog[0] }}</span>{{ nameInDialog[1] }}
                  </h2>
                </v-col>

                <v-col cols="2">
                  <v-text-field
                    v-model="alertValue[0]"
                  >
                    <v-icon
                      slot="append"
                      color="green"
                      @click="alertValue[0] += 1"
                    >
                      mdi-plus
                    </v-icon>
                    <v-icon
                      slot="prepend"
                      color="red"
                      @click="alertValue[0] -= 1"
                    >
                      mdi-minus
                    </v-icon>
                  </v-text-field>
                </v-col>

                <v-col cols="1.5">
                  <v-select
                    v-model="alertValue[1]"
                    :items="items"
                  />
                </v-col>

                <v-col cols="4">
                  <h2 class="mt-4">
                    일 때 <span id="notice">알림</span> 설정합니다
                  </h2>
                </v-col>
                <v-col>
                  <v-icon
                    v-if="!alertValue[1]"
                    size="30"
                    class="mt-4"
                    color="red"
                  >
                    fas fa-plus
                  </v-icon>
                  <v-icon
                    v-else
                    size="30"
                    class="mt-4"
                    color="green"
                    @click="addAlarm"
                  >
                    fas fa-plus
                  </v-icon>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </template>
        <v-card-text class="pb-6 pt-12 text-center">
          <v-btn
            color="success"
            text
            @click="dialog = false"
          >
            설정
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-container
      v-for="(alert,index) in alertList"
      :key="index"
    >
      <v-snackbar
        v-model="showAlert[index]"
        right
        bottom
        :color="color"
        :timeout="Number(5000)"
        @input="toggleAlert(index)"
      >
        <v-icon class="pl-0 ml-0">
          fas fa-exclamation-circle
        </v-icon>
        <h2 class="mx-auto">
          {{ nameInDialog[0] }}{{ nameInDialog[1] }} {{ alert.value }} {{ alert.criteria }}
        </h2>
      </v-snackbar>
    </v-container>
  </v-container>
</template>

<script>
  export default {
    props: {
      data: { type: Object, default: undefined },
      options: { type: Object, default: undefined },
      name: { type: String, default: undefined },
      color: { type: String, default: undefined },
    },
    data () {
      return {
        messages: [],
        totalMessage: 0,
        alertValue: [-1, null],
        showAlert: [],
        dialog: false,
        items: ['이상', '이하'],
        alertList: [],
        currentValue: null,
        rawData: null,
      }
    },
    computed: {
      nameInDialog () {
        switch (this.name) {
          case 'temperature': return ['온도', '가']
          case 'gas': return ['가스 농도', '가']
          case 'co' : return ['일산화탄소 농도', '가']
          case 'light': return ['조도', '가']
          case 'flame': return ['불꽃', '이']
          case 'dust': return ['미세먼지', '가']
          default: return null
        }
      },
    },
    watch: {
      rawData: {
        deep: true,
        handler () {
          if (this.alertList.length !== 0) {
            this.alertList.forEach((alert, index) => {
              const updatedValue = this.rawData[this.rawData.length - 1]
              if (alert.criteria === '이상' && alert.value < updatedValue && !this.showAlert[index]) {
                this.showAlert[index] = true
                this.messages[index] += 1
                this.totalMessage += 1
              } else if (alert.criteria === '이하' && alert.value > updatedValue) {
                this.showAlert[index] = true
                this.messages[index] += 1
                this.totalMessage += 1
              }
            })
          }
        },
      },
    },
    created () {
      this.rawData = this.data.series[0]
      this.alertValue[0] = (this.options.low + this.options.high) / 2
      this.currentValue = this.data.series[0][this.data.series.length - 1]
    },
    beforeUpdate () {
      this.rawData = this.data.series[0]
    },
    methods: {
      addAlarm () {
        const newAlarm = {
          value: this.alertValue[0],
          criteria: this.alertValue[1],
        }
        if (this.alertList.find(alert => alert.value === newAlarm.value && alert.criteria === newAlarm.criteria)) return

        this.alertList = [...this.alertList, newAlarm]
        this.showAlert = [...this.showAlert, false]
        this.messages = [...this.messages, 0]

        this.alertValue = [(this.options.high + this.options.low) / 2, null]
      },
      removeAlert (index) {
        this.totalMessage -= this.messages[index]

        this.alertList = [...this.alertList.slice(0, index), ...this.alertList.slice(index + 1)]
        this.showAlert = [...this.showAlert.slice(0, index), ...this.alertList.slice(index + 1)]
        this.messages = [...this.messages.slice(0, index), ...this.messages.slice(index + 1)]
      },
      toggleAlert (index) {
        console.log(this.alertList, this.showAlert[index])
      },
    },
  }
</script>

<style scoped>
  #name{
    color: green
  }
  #notice{
    color: red
  }
  #change{
    color: blue
  }
</style>
