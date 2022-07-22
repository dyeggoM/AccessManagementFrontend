import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //NOTA: Authentication
    app_token:null,
    refresh_token:null,
  },
  mutations: {
    mutate(state, payload) {
      state[payload.property] = payload.with;
    },
  },
  actions: {
    setMutation({commit},{property:prop, with:data}){
      // console.log(prop,data)
      commit('mutate', {property:prop, with:data})
    },
    logout({commit}){
      commit('mutate', {property:'app_token', with:null})
      commit('mutate', {property:'refresh_token', with:null})
    }
  },
  modules: {
  }
})
