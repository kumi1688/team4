<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="650px"
    >
      <v-card>
        <v-card-title class="display-4 CONDENSED">
          Hue 위치 설정
        </v-card-title>

        <v-row>
          <v-col>
            <v-list
              elevation="20"
              class="mx-2 pa-2"
            >
              <h2

                class="display-2 font-weight-light"
              >
                방 목록
              </h2>
              <v-list-item-group
                color="primary"
              >
                <v-list-item
                  v-for="(item, i) in rooms"
                  :key="i"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      class="display-2"
                      @click="setCurrentRoom(item)"
                      v-text="item"
                    />
                  </v-list-item-content>
                  <v-list-item-icon @click="removeRoom(i)">
                    <v-icon>
                      fas fa-minus
                    </v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
          <v-col>
            <v-list
              elevation="20"
              class="mx-2 pa-2"
            >
              <h2
                class="display-2 font-weight-light"
              >
                Hue 목록
              </h2>
              <v-list-item-group
                color="primary"
              >
                <v-list-item
                  v-for="(item, i) in property.number"
                  :key="i"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      class="display-2"
                      v-text="item"
                    />
                  </v-list-item-content>
                  <v-checkbox
                    v-model="checkBox[i]"
                    class="mb-6"
                    :label="assignList[i]"
                    :disabled="checkDisable(i)"
                    color="red darken-3"

                    hide-details
                  />
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="roomInput"
                  label="위치 추가"
                  append-icon="mdi-plus"
                  @click:append="addRoom"
                  @keypress.enter="addRoom"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="resetData"
          >
            초기화
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="onClose"
          >
            저장
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import { faPlusSquare } from '@fortawesome/free-regular-svg-icons'

  export default {
    props: {
      open: {
        type: Boolean,
        default: undefined,
      },
      property: {
        type: Object,
        default: undefined,
      },
      prlist: {
        type: Array,
        default: undefined,
      },
      palist: {
        type: Array,
        default: undefined,
      },
    },
    data: () => ({
      dialog: false,
      faPlusSquare,
      currentRoom: null,
      roomInput: '',
      assignList: [],
      checkBox: [],
      rooms: null,
    }),
    watch: {
      checkBox () {
        this.checkBox.map((element, index) => {
          if (element === true && this.assignList[index] === null) {
            this.assignList[index] = this.currentRoom
          } else if (element === false) {
            this.assignList[index] = null
          }
        })
      },
    },
    created () {
      this.dialog = this.open

      // 방 생성
      const baseRooms = ['거실', '주방', '방1', '방2']
      this.rooms = this.prlist.length === 0 ? [...baseRooms] : [...this.prlist]

      this.checkBox = new Array(this.rooms.length)
      this.assignList = new Array(this.palist.length)

      for (let i = 0; i < this.assignList.length; i++) {
        if (this.palist[i] !== undefined && this.palist[i] !== null) {
          this.checkBox[i] = true
          this.assignList[i] = this.palist[i]
        } else {
          this.checkBox[i] = false
          this.assignList[i] = null
        }
      }
      console.log(this.checkBox, this.assignList)
    },
    methods: {
      onClose () {
        this.$emit('closeDialog', {
          assignList: this.assignList,
          roomList: this.rooms,
        })
        this.dialog = false
      },
      addRoom () {
        if (!this.rooms.includes(this.roomInput)) {
          this.rooms = [...this.rooms, this.roomInput]
        }
        this.roomInput = ''
      },
      removeRoom (index) {
        for (let i = 0; i < this.assignList.length; i++) {
          if (this.assignList[i] === this.rooms[index]) {
            this.assignList[i] = null
            this.checkBox[i] = false
          }
        }
        console.log(this.assignList, this.checkBox)
        this.rooms = [...this.rooms.slice(0, index), ...this.rooms.slice(index + 1)]
      },
      setCurrentRoom (item) {
        this.currentRoom = item
      },
      assignHueToRoom (hue, index) {
        this.checkBox[index] = true
      },
      checkDisable (index) {
        // 선택되었고 현재 방 이름과 할당 리스트가 다른 경우
        if (this.currentRoom === null) return true
        else if (this.checkBox[index] && this.currentRoom !== this.assignList[index]) return true
        else return false
      },
      resetData () {
        this.checkBox = this.checkBox.map(() => { return false })
        this.assignList = this.assignList.map(() => { return null })
      },
    },
  }
</script>

<style scoped>
    #room{
        border: solid;
    }
</style>
