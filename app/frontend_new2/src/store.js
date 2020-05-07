import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage:
      'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
    rooms: [],
    devices: [],
    assignInfo: {},
    alerts: {},
    links: {},
    isNewLink: false,
    messages: {},
    linkData: {},
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    SET_ROOMS (state, payload) {
      state.rooms = payload
    },
    SET_DEVICES (state, payload) {
      state.devices = payload
    },
    SET_ALERTS (state, payload) {
      const { type, value } = payload
      state.alerts[type] = [...value]
    },
    SET_ASSIGN_INFO (state, payload) {
      state.assignInfo = payload
    },
    SET_LINK_DATA (state, payload) {
        state.linkData = {
          deviceInfo: { ...payload.deviceInfo },
          valueInfo: { ...payload.valueInfo },
        }
    },
    SET_LINK_LIST (state, payload) {
      state.links[payload.type] = payload.value
    },
    ADD_LINK (state, sensor) {
      const newLink = {
        deviceInfo: { ...state.linkData.deviceInfo },
        valueInfo: { ...state.linkData.valueInfo },
      }
      state.linkData = {}
      if (!state.links[sensor]) state.links[sensor] = []
       state.links[sensor] = [...state.links[sensor], newLink]
    },
    INIT_LINK_LIST (state) {
      state.links = {}
    },
    CHECK_NEW_LINK (state, payload) {
      state.isNewLink = payload
    },
    SET_MESSAGES (state, payload) {
      const { type, value } = payload
      state.messages[type] = [...value]
    },
    INCREASE_MESSAGE (state, payload) {
      state.messages[payload] += 1
    },
  },
  getters: {
    rooms (state) {
      return state.rooms
    },
    devices (state) {
      return state.devices
    },
    alerts (state) {
      return state.alerts
    },
    links (state) {
      return state.links
    },
  },
  actions: {},
})

// function checkLinks (state, sensor, newLink) {
//   const result = state.links[sensor].find(link =>
//     link.deviceInfo.number === newLink.deviceInfo.number &&
//     link.valueInfo.type === newLink.valueInfo.type &&
//     link.valueInfo.value === newLink.valueInfo.value,
//   )
//   return result
// }
