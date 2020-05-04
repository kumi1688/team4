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
    messages: {},
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
    SET_LINKS (state, payload) {
      state.links = payload
    },
    SET_ASSIGN_INFO (state, payload) {
      state.assignInfo = payload
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
