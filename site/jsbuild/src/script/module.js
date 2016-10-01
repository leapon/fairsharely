import Vue from 'vue'
import store from '../vuex/store'
import {
  setModuleName, getItems, setItems,
  setStoreItem, setFormByName, deleteItems,
  setColumnsOption
} from '../vuex/actions'
import {
  showRightPanel, hideRightPanel,
  getSheetColumnsFromModel, getEditColumnsFromModel,
  getFilterColumnsFromModel, getToggledColumnShowData
} from '../service/support.js'

import SmartForm from '../component/SmartForm.vue'
import SmartSheet from '../component/SmartSheet.vue'
import SmartSheetInfo from '../component/SmartSheetInfo.vue'

if (typeof app === 'undefined') {
  app = {};
}
app.ui = app.ui || {};
app.cb = app.cb || {};

// app.moduleName, app.moduleModel and app.moduleOption are set in module.html script tag
app.sheetColumnModel = getSheetColumnsFromModel(app.moduleModel, app.moduleOption);
//console.log('>>> sheetColumnModel:', JSON.stringify(app.sheetColumnModel));

function setupUI() {
  app.ui.itemSheet = new Vue({
    el: '#item_sheet',
    store,
    data: {
      name: 'item_sheet',
      columns: app.sheetColumnModel,
      config: {
        caption: '',
        selection: 'multi', // multi/single/none
        paging: {
          start_page: 1,
          page_size: 10,
          page_sizes: [10, 20, 'All'],
          show_paging_size: false
        },
        debug: false
      }
    },
    components: {
      SmartSheet
    }
  });

  app.ui.itemFilterForm = new Vue({
    el: '#item_filter',
    store,
    data: {
      name: 'item_filter',
      target: 'item_sheet',
      filter_config: {
        mode: 'inline',
        showbuttons: false
      },
      filter_columns: getFilterColumnsFromModel(app.moduleModel, app.moduleOption)
    },
    components: {
      SmartForm
    }
  });

  app.ui.itemEditForm = new Vue({
    el: '#editItem',
    store,
    data: {
      name: 'item_form',
      target: 'item_sheet',
      config: {
        mode: 'vertical',
        showbuttons: true
      },
      columns: getEditColumnsFromModel(app.moduleModel, app.moduleOption)
    },
    components: {
      SmartForm
    }
  });
}

app.cb.deleteItem = function() {
  //console.log('>>> deleteItem');
  deleteItems(store, 'item_sheet', true, function() {
    getItems(store, 'item_sheet');
  });
};

$().ready(function() {
  console.log('module page for ' + app.moduleName);
  setModuleName(store, app.moduleName);
  setTimeout(setupUI, 10);
  // button handlers
  //$('#addItem').click(addItem);
  $('#deleteItem').click(app.cb.deleteItem);
  $('#btnHidePanelRight').click(hideRightPanel);
  // set columnShowData
  var columnShowData = getToggledColumnShowData(app.sheetColumnModel, 'show');
  //console.log('>>> columnShowData:', JSON.stringify(columnShowData));
  setColumnsOption(store, 'item_sheet', 'show', columnShowData);
  //getItems(store, 'item_sheet');
});
