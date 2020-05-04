<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="800"
  >
    <v-card>
      <v-dialog
        v-model="dialog"
        max-width="1000"
      >
        <v-card>
          <v-card-title class="display-3">
            알람 설정
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
                      <v-icon color="green">
                        fas fa-exclamation
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <h2 class="mx-auto">
                        <span class="value">{{ alert.value }}</span> <span id="timeUnit">{{ alert.timeUnit }}</span> 후에 <span class="typeUnit"> {{ alert.typeUnit }} </span> <span class="commandUnit"> {{ alert.commandUnit }} </span>
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
          <v-row>
            <v-col>
              <v-text-field
                v-model="currentTimeValue"
              >
                <v-icon
                  slot="append"
                  color="green"
                  @click="currentTimeValue += 1"
                >
                  mdi-plus
                </v-icon>
                <v-icon
                  slot="prepend"
                  color="red"
                  @click="currentTimeValue -= 1"
                >
                  mdi-minus
                </v-icon>
              </v-text-field>
            </v-col>
            <v-col>
              <h2 class="pt-4 mr-0 pr-0">
                <span
                  class="timeUnit"
                  @click="toggleTime"
                >{{ currentTimeUnit }}</span> 후에
              </h2>
            </v-col>
            <v-col>
              <h2 class="pt-4 ml-0 mr-0">
                전구의 <span
                  class="typeUnit"
                  @click="toggleType"
                >{{ currentTypeUnit }}</span>{{ currentTypeUnit === '전원' || currentTypeUnit === '색' ? '을' : '를' }}
              </h2>
            </v-col>
            <v-col>
              <h2
                class="pt-4 mr-0 ml-0"
                @click="toggleCommand"
              >
                <span class="commandUnit">{{ currentCommandUnit }}</span>
              </h2>
            </v-col>
            <v-col>
              <v-icon
                v-if="valid"
                class="pt-5"
                color="green"
                @click="addAlert"
              >
                fas fa-plus
              </v-icon>
              <v-icon
                v-else
                class="pt-5"
                color="red"
              >
                fas fa-plus
              </v-icon>
            </v-col>
          </v-row>

          <v-card-text class="pb-6 pt-12 text-center">
            <v-btn
              color="red"
            >
              초기화
            </v-btn>
            <v-btn
              color="success"
              @click="closeDialog"
            >
              닫기
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="6"
          md="2"
        >
          <h2 class="ml-5 pl-5">
            <span>타이머</span>
          </h2>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-dialog
            ref="startTimeDialog"
            v-model="startTimeDialog"
            :return-value.sync="time"
            persistent
            width="400px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="startTime"
                label="시작 시간"
                prepend-icon="mdi-av-timer"
                readonly
                v-on="on"
              />
            </template>
            <v-time-picker
              v-if="startTimeDialog"
              v-model="startTime"
              full-width

              use-seconds
            >
              <v-spacer />
              <v-btn
                text
                color="primary"
                @click="startTimeDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.startTimeDialog.save(time)"
              >
                OK
              </v-btn>
            </v-time-picker>
          </v-dialog>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-dialog
            ref="endTimeDialog"
            v-model="endTimeDialog"
            :return-value.sync="time"
            persistent
            width="400px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="endTime"
                label="종료 시간"
                prepend-icon="mdi-av-timer"
                readonly
                v-on="on"
              />
            </template>
            <v-time-picker
              v-if="endTimeDialog"
              v-model="endTime"
              full-width
              use-seconds
            >
              <v-spacer />
              <v-btn
                text
                color="primary"
                @click="endTimeDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.endTimeDialog.save(time)"
              >
                OK
              </v-btn>
            </v-time-picker>
          </v-dialog>
        </v-col>
      </v-row> -->
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from 'axios'

  export default {
    props: {
      huedata: { type: Object, default: undefined },
    },
    data () {
      return {
        dialog: false,
        startTime: null,
        endTime: null,
        startTimeDialog: false,
        endTimeDialog: false,
        currentTimeValue: 10,
        currentTimeUnit: '초',
        currentTypeUnit: '전원',
        currentCommandUnit: '끕니다',
        valid: false,
        alertList: [],
      }
    },
    computed: {

    },
    watch: {

      currentTypeUnit: {
        immediate: true,
        handler () {
          this.toggleCommand()
          if (this.currentTypeUnit === '전원') this.valid = true
          else this.valid = false
        },

      },
    },
    created () {
      this.dialog = true
      this.renewAlertTime()
    },
    methods: {
      renewAlertTime () {
        setInterval(() => {
          this.alertList.forEach(alert => {
            if (alert.timeUnit === '초' && alert.value > 0) alert.value -= 1
            else if (alert.value === 0 && alert.valid) {
              alert.valid = false
            }
          })
        }, 1000)
      },
      closeDialog () {
        this.dialog = false
        this.$emit('closeDialog')
      },
      toggleTime () {
        const times = ['초', '분', '시간']
        this.currentTimeUnit = times[(times.indexOf(this.currentTimeUnit) + 1) % 3]
      },
      toggleType () {
        const types = ['전원', '색', '밝기', '온도']
        this.currentTypeUnit = types[(types.indexOf(this.currentTypeUnit) + 1) % 4]
      },
      toggleCommand () {
        if (this.currentTypeUnit === '전원') {
          this.currentCommandUnit = this.currentCommandUnit === '켭니다' ? '끕니다' : '켭니다'
        } else this.currentCommandUnit = '변경합니다'
      },
      checkCondition () {
        if (this.currentTypeUnit === '전원') {
          return true
        }
        return false
      },
      addAlert () {
        const newAlert = {
          value: this.currentTimeValue,
          timeUnit: this.currentTimeUnit,
          typeUnit: this.currentTypeUnit,
          commandUnit: this.currentCommandUnit,
          valid: true,
        }
        if (!this.alertList.find(element =>
          element.value === newAlert.value && element.timeUnit === newAlert.timeUnit &&
          element.typeUnit === newAlert.typeUnit && element.commandUnit === newAlert.commandUnit,
        )) {
          this.alertList = [...this.alertList, newAlert]
          axios.post(`/api/hue/${this.huedata.number}`, {
            on: newAlert.commandUnit === '켭니다',
            value: newAlert.value,
          })
        }
      },
      removeAlert (index) {
        this.alertList = [...this.alertList.slice(0, index), ...this.alertList.slice(index + 1)]
      },
    },
  }
</script>

<style scoped>
    .timeUnit{
        color: green
    }
    .typeUnit{
        color: blue
    }
    .commandUnit{
        color: red
    }
    .value{
        color: coral
    }
</style>
