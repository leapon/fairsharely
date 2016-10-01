import Vue from 'vue'
import Vuex from 'vuex'
import { updateItem } from '../service/support.js'

Vue.use(Vuex)

// app initial state
const state = {
  moduleName: '', // moduleName is used in ajax query
  columnsCol: {
    main: { sort:{}, show:{} },
    item_sheet: { sort:{}, show:{} }
  },
  columnsCol: {
    main: [],
    item_sheet: []
  },
  itemsCol: {
    main: [],
    item_sheet: []
  },
  formCol: {
    item_filter: {},
    item_form: {}
  }
}

// define possible mutations
const mutations = {
  SETMODULENAME(state, moduleName) {
    state.moduleName = moduleName;
  },
  SETFORMBYNAME(state, name, form) {
    state.formCol[name] = form;
  },
  SETITEMS(state, name, items) {
    state.itemsCol[name] = items;
  },
  SETCVITEMS(state, name, items) {
    state.cvCol[name] = items;
  },
  SETCOLUMNSOPTION(state, sheetName, optionName, columnsOption) {
    state.columnsCol[sheetName][optionName] = columnsOption;
  },
  SETSHEETROWBYNAME(state, name, field, value, row) {
    var sheet = state.itemsCol[name];
    // use $set to change array content. exampple: demo.items.$set(0, { childMsg: 'Changed!'})
    for (var i = 0; i < sheet.length; i++) {
      if (sheet[i][field] == value) {
        sheet.$set(i, row);
      }
    }
  }
}

// create the store
export default new Vuex.Store({
  state,
  mutations
})
