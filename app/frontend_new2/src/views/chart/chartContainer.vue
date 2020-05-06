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
      max-width="1200"
    >
      <v-card>
        <v-card-title class="display-3">
          {{ nameInDialog[0] }} 알람 설정
        </v-card-title>

        <v-row>
          <v-card
            elevation="15"
            class="mx-auto"
            max-width="700"
          >
            <v-list dense>
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
                      <span id="name">{{ nameInDialog[0] }}</span>{{ nameInDialog[1] }}
                      <span id="value">{{ alert.value }}</span>
                      <span id="criteria">{{ alert.criteria }}</span> 일 때 알림
                      설정합니다
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
          <v-card
            elevation="15"
            class="mx-auto"
            max-width="700"
          >
            <v-list dense>
              <v-list-item-group color="primary">
                <v-list-item
                  v-for="(link, index) in linkList"
                  :key="index"
                >
                  <v-list-item-icon>
                    <v-icon color="green">
                      fas fa-exclamation
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-container
                      v-for="(el, index) in link"
                      :key="index"
                      class="mx-auto"
                    >
                      <h2>
                        {{ linkToString(el) }}
                      </h2>
                    </v-container>
                  </v-list-item-content>
                  <v-list-item-icon @click="removeLink(index)">
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
                justify="center"
                align="center"
              >
                <h2 class="ml-5">
                  <span id="name">{{ nameInDialog[0] }}</span>{{ nameInDialog[1] }}
                </h2>

                <v-col cols="2">
                  <v-text-field
                    v-if="name !== 'pir'"
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
                  <v-select
                    v-else
                    v-model="alertValue[0]"
                    :items="pirItems"
                  />
                </v-col>

                <v-col
                  v-if="name !== 'pir'"
                  cols="2"
                >
                  <v-select
                    v-model="alertValue[1]"
                    :items="items"
                  />
                </v-col>

                <h2 class="mr-0">
                  일 때
                  <span
                    v-if="!alertType"
                    id="alert"
                    @click="toggleAlertType"
                  >알림</span>
                  <span
                    v-if="alertType"
                    id="link"
                    @click="toggleAlertType"
                  >연동</span>
                  설정합니다
                </h2>

                <v-icon
                  v-if="!alertValue[1] && name !== 'pir'"
                  size="30"
                  class="ml-4"
                  color="red"
                >
                  fas fa-plus
                </v-icon>

                <v-icon
                  v-else-if="alertType"
                  size="30"
                  class="ml-4"
                  color="blue"
                  @click="openLinkDialog"
                >
                  fas fa-link
                </v-icon>
                <v-icon
                  v-else-if="name === 'pir' && alertValue[0]"
                  size="30"
                  class="ml-4"
                  color="green"
                  @click="addAlarm"
                >
                  fas fa-plus
                </v-icon>
                <v-icon
                  v-else
                  size="30"
                  class="ml-4"
                  color="green"
                  @click="addAlarm"
                >
                  fas fa-plus
                </v-icon>
              </v-row>
            </v-container>
          </v-form>
        </template>
        <v-card-text class="pb-6 pt-12 text-center">
          <v-btn
            color="red"
            @click="removeAllAlert"
          >
            초기화
          </v-btn>
          <v-btn
            color="success"
            @click="dialog = false"
          >
            닫기
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-container
      v-for="(alert, index) in alertList"
      :key="index"
    >
      <v-snackbar
        v-model="showAlert[index]"
        right
        bottom
        :color="color"
        :timeout="Number(5000)"
      >
        <v-icon class="pl-0 ml-0">
          fas fa-exclamation-circle
        </v-icon>
        <h2 class="mx-auto">
          {{ nameInDialog[0] }}{{ nameInDialog[1] }} {{ alert.value }}
          {{ alert.criteria }}
        </h2>
      </v-snackbar>
    </v-container>
    <chart-link-container
      v-if="linkDialog"
      :sensor="name"
      @linkDialogClose="linkDialogClose"
    />
  </v-container>
</template>

<script>
  import chartLinkContainer from './chartLinkContainer'

  export default {
    components: {
      'chart-link-container': chartLinkContainer,
    },
    props: {
      data: { type: Object, default: undefined },
      options: { type: Object, default: undefined },
      name: { type: String, default: undefined },
      color: { type: String, default: undefined },
      socket: { type: Object, default: undefined },
    },
    data () {
      return {
        messages: [],
        totalMessage: 0,
        alertValue: [-1, null],
        showAlert: [],
        dialog: false,
        items: ['이상', '이하'],
        pirItems: ['HIGH', 'LOW'],
        alertList: [],
        currentValue: null,
        rawData: null,
        alertType: false,
        linkList: [],
        linkDialog: false,
        linkData: [],
        linkDataCondition: [],
        linkId: 0,
      }
    },
    computed: {
      isNewLink () {
        return this.$store.state.isNewLink
      },
      nameInDialog () {
        switch (this.name) {
          case 'temperature':
            return ['온도', '가']
          case 'gas':
            return ['가스 농도', '가']
          case 'co':
            return ['일산화탄소 농도', '가']
          case 'light':
            return ['조도', '가']
          case 'flame':
            return ['불꽃', '이']
          case 'dust':
            return ['미세먼지', '가']
          case 'pir':
            return ['적외선 센서', '가']
          default:
            return null
        }
      },
    },
    watch: {
      alertValue: {
        deep: true,
        handler () {
          console.log(this.alertValue)
        },
      },
      isNewLink () {
        if (this.isNewLink) {
          this.linkData = this.$store.state.links[this.name]
          this.$store.commit('CHECK_NEW_LINK', false)
        }
      },
      rawData: {
        deep: true,
        handler () {
          if (this.alertList.length !== 0) {
            this.alertList.forEach((alert, index) => {
              const updatedValue = this.rawData[this.rawData.length - 1]
              if (
                this.name === 'pir' &&
                alert.value === 'HIGH' &&
                updatedValue === 1 &&
                !this.showAlert[index]
              ) {
                this.showAlert[index] = true
                this.messages[index] += 1
                this.totalMessage += 1
              } else if (
                this.name === 'pir' &&
                alert.value === 'LOW' &&
                updatedValue === 0 &&
                !this.showAlert[index]
              ) {
                this.showAlert[index] = true
                this.messages[index] += 1
                this.totalMessage += 1
              }
              if (
                alert.criteria === '이상' &&
                alert.value < updatedValue &&
                !this.showAlert[index]
              ) {
                this.showAlert[index] = true
                this.messages[index] += 1
                this.totalMessage += 1
              } else if (
                alert.criteria === '이하' &&
                alert.value > updatedValue
              ) {
                this.showAlert[index] = true
                this.messages[index] += 1
                this.totalMessage += 1
              }
            })
          }
        },
      },
    },
    beforeDestroy () {
      this.$store.commit('SET_ALERTS', {
        type: this.name,
        value: this.alertList,
      })
      this.$store.commit('SET_MESSAGES', {
        type: this.name,
        value: this.messages,
      })
      this.$store.commit('SET_LINK_LIST', {
        type: this.name,
        value: this.linkList,
      })
    },
    created () {
      this.rawData = this.data.series[0]
      this.alertValue[0] = (this.options.low + this.options.high) / 2
      if (this.name === 'pir') this.alertValue[0] = 'HIGH'
      this.currentValue = this.data.series[0][this.data.series.length - 1]

      if (this.$store.state.alerts[this.name] === undefined) {
        this.alertList = []
      } else {
        this.alertList = this.$store.state.alerts[this.name]
      }
      if (this.$store.state.messages[this.name] === undefined) {
        this.messages = []
      } else {
        this.messages = this.$store.state.messages[this.name]
      }
      if (this.$store.state.links[this.name] === undefined) {
        this.linkList = []
      } else {
        this.linkList = this.$store.state.links[this.name]
      }

      this.messages.map(msg => {
        this.totalMessage += msg
      })
    },
    beforeUpdate () {
      this.rawData = this.data.series[0]
    },
    methods: {
      linkToString (link) {
        return `${link[0]} ${link[1]} ${link[2]} ${link[3]} ${link[4]} ${link[5]}`
      },
      linkInfo (link) {
        console.log(this.linkList)
        const name = link.deviceInfo.device === 'hue' ? '전구' : '부저'
        const number = link.deviceInfo.number
        let type = ''
        let prefix = ''
        switch (link.valueInfo.type) {
          case 'color':
            type = '색'
            prefix = '을'
            break
          case 'ct':
            type = '온도'
            prefix = '를'
            break
          case 'bri':
            type = '밝기'
            prefix = '를'
            break
          case 'sat':
            type = '채도'
            prefix = '를'
            break
        }
        const [conditionName, conditionPrefix] = this.getName()

        // 10번 전구의 색을 변경합니다
        const result = [
          `${conditionName}${conditionPrefix}`,
          `${this.alertValue[0]}`,
          `${this.alertValue[1]} 일 때`,
          `${number}번 ${name}`,
          `${type}${prefix}`,
          '변경합니다',
          this.linkId,
        ]
        console.log(result)
        return result
      },
      toggleAlertType () {
        this.alertType = !this.alertType
      },
      openLinkDialog () {
        this.linkDialog = true
      },
      addAlarm () {
        const newAlarm = {
          value: this.alertValue[0],
          criteria: this.alertValue[1],
        }
        if (this.name === 'pir') {
          newAlarm.criteria = null
        }

        if (
          this.alertList.find(
            alert =>
              alert.value === newAlarm.value &&
              alert.criteria === newAlarm.criteria,
          )
        ) {
          return
        }

        this.alertList = [...this.alertList, newAlarm]
        this.showAlert = [...this.showAlert, false]
        this.messages = [...this.messages, 0]

        this.alertValue = [(this.options.high + this.options.low) / 2, '이상']
      },
      removeAlert (index) {
        this.totalMessage -= this.messages[index]

        this.alertList = [
          ...this.alertList.slice(0, index),
          ...this.alertList.slice(index + 1),
        ]
        this.showAlert = [
          ...this.showAlert.slice(0, index),
          ...this.alertList.slice(index + 1),
        ]
        this.messages = [
          ...this.messages.slice(0, index),
          ...this.messages.slice(index + 1),
        ]
      },
      removeLink (index) {
        const id = this.linkList[index][0][6]
        console.log(this.linkList[index][0][6])
        this.socket.emit('removeLink', id)
        this.linkList = [
          ...this.linkList.slice(0, index),
          ...this.linkList.slice(index + 1),
        ]
      },
      removeAllAlert () {
        this.totalMessage = 0
        this.alertList = []
        this.messages = []
        this.showAlert = []
      },
      linkDialogClose () {
        console.log('sssssss', this.linkData)
        if (this.linkData.length !== 0) {
          this.linkList = [
            ...this.linkList,
            this.linkData.map(link => this.linkInfo(link)),
          ]

          this.addLinkWS({
            data: this.linkData,
            id: this.linkId++,
            condition: {
              sensor: this.name,
              value: this.alertValue[0],
              criteria: this.alertValue[1],
            },
          })
          this.alertValue = [(this.options.high + this.options.low) / 2, null]
        }
        console.log('sdfgsdg', this.linkList)
        this.$store.commit('INIT_LINK_LIST')

        this.linkDialog = false
      },
      getName () {
        switch (this.name) {
          case 'temperature':
            return ['온도', '가']
          case 'gas':
            return ['가스 농도', '가']
          case 'co':
            return ['일산화탄소 농도', '가']
          case 'light':
            return ['조도', '가']
          case 'flame':
            return ['불꽃', '이']
          case 'dust':
            return ['미세먼지', '가']
          case 'pir':
            return ['적외선 센서', '가']
          default:
            return null
        }
      },
      addLinkWS (data) {
        console.log('링크 추가됨')
        this.socket.emit('addAlert', JSON.stringify(data))
      },
    },
  }
</script>

<style scoped>
#name {
  color: green;
}
#criteria {
  color: skyblue;
}
#value {
  color: brown;
}
#change {
  color: blue;
}
#alert {
  color: red;
}
#link {
  color: teal;
}
</style>
