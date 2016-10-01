import jquery from 'jquery'
import store from './store'
import {
  showRightPanel, hideRightPanel, cloneObject,
  getArrayItemByProperty, getArrayItemsByCondition,
  getPropertyValuesFromArray
} from '../service/support.js'

export const setModuleName = ({ dispatch, state }, moduleName) => {
  dispatch('SETMODULENAME', moduleName);
}

export const getItems = ({ dispatch, state }, name) => {
  var filter = {};
  var filterForm = state.formCol['item_filter'];
  for (var property in filterForm) {
    if (filterForm[property]) {
      filter[property] = filterForm[property];
    }
  }

  //var columnsOption = state.columnsOption;
  var columnsOption = state.columnsCol[name];
  for (var columnName in columnsOption) {
    var columnOption = columnsOption[columnName];
    // example - "sort": [['field1','asc'], ['field2','desc']]
    switch (columnOption) {
    case 'up':
        filter['sort'] = [[columnName, 'desc']];
      break;
    case 'down':
        filter['sort'] = [[columnName, 'asc']];
      break;
    }
  }

  if (state.moduleName) {
    var url = '/data/' + state.moduleName + '/get';
    jquery.get(url, filter, function(data) {
      console.log('getItems:', name, data);
      dispatch('SETITEMS', name, data.docs);
    });
  }
}

export const setItems = ({ dispatch, state }, name, items) => {
  dispatch('SETITEMS', name, items)
}

//setColumnsOption(store, 'item_sheet', 'show', columnShowData);
export const setColumnsOption = ({ dispatch, state }, sheetName, optionName, columnsOption) => {
  dispatch('SETCOLUMNSOPTION', sheetName, optionName, columnsOption);
  getItems({ dispatch, state }, sheetName);
}

export const setFormByName = ({ dispatch, state }, name, form) => {
  dispatch('SETFORMBYNAME', name, form)
}

export const sendFormChange = ({ dispatch, state }, source, target, field, value) => {
  //console.log('sendFormChange:', source, target, field, value);
  if (source == 'item_filter') {
    getItems({ dispatch, state }, target); // refresh target
  }
}

export const saveForm = ({ dispatch, state }, formName, cb) => {
  var url = '';
  var form = state.formCol[formName];
  var itemId = form['_id'] || form['id'];
  if (itemId) {
    url = '/data/' + state.moduleName + '/' + itemId + '/edit';
  } else {
    url = '/data/' + state.moduleName + '/add';
  }
  console.log('saveForm:', itemId, url, formName, JSON.stringify(form));
  jquery.post(url, form, function(data) {
    var formdata = data.docs && data.docs[0] || null;
    console.log('formdata:', formdata);
    if (formdata) {
      dispatch('SETFORMBYNAME', formName, formdata);
    }
    cb && cb(data.error, formdata, data.info);
  });
}

export const deleteForm = ({ dispatch, state }, formName, cb) => {
  var form = state.formCol[formName];
  var itemId = form['_id'] || form['id'];
  if (itemId) {
    var url = '/data/' + state.moduleName + '/' + itemId + '/delete';
    console.log('deleteForm:', itemId, url, formName, JSON.stringify(form));
    jquery.post(url, form, function(data) {
      console.log('deleteForm data:', data);
      cb && cb();
    });
  }
}

export const cancelForm = ({ dispatch, state }, formName, cb) => {
  console.log('cancelForm:', formName);
  /*
  var form = state['form'];
  console.log('cancelForm:', formName, JSON.stringify(form));
  for (var property in form) {
    form[property] = '';
  }
  dispatch('SETFORM', form);
  */
  cb && cb();
}

export const editItem = ({ dispatch, state }, name, itemId, cb) => {
  var formName = 'item_form';
  var items = state.itemsCol[name] || [];
  console.log('edit item:', itemId, ' in items ', name);
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item['_id'] == itemId || item['id'] == itemId) {
      dispatch('SETFORMBYNAME', formName, cloneObject(item));
    }
  }
  // todo: show error if item with itemId is not found
  showRightPanel();
  cb && cb();
}

export const sendSheetCellChange = ({ dispatch, state }, name, itemId, field, value) => {
  console.log('>>> sendSheetChange:', name, itemId, field, value);
}

export const setItemsStatus = ({ dispatch, state }, formName, fromStatus, toStatus, cb) => {
  console.log('>>> sendApproval', formName, fromStatus, toStatus);
  var items = state.itemsCol[formName];
  var selectedItems = getArrayItemsByCondition(items, { '_selected':true, status:fromStatus });
  console.log('>>> setItemsStatus items #:', items && items.length);
  console.log('>>> setItemsStatus selectedItems #:', selectedItems && selectedItems.length);
  console.log('>>> setItemsStatus selectedItems:', JSON.stringify(selectedItems));
  var selectedItemIds = getPropertyValuesFromArray(selectedItems, '_id');
  if (selectedItemIds && selectedItemIds.length > 0) {
    var url = '/data/' + state.moduleName + '/edit';
    var form = { ids:JSON.stringify(selectedItemIds), status:toStatus };
    console.log('setItemsStatus:', url, JSON.stringify(form));
    jquery.post(url, form, function(data) {
      console.log('setItemsStatus result:', data.error, data.docs, data.info);
      cb && cb(data.error, data.docs, data.info);
    });
  }
}

export const deleteItems = ({ dispatch, state }, formName, isAdmin, cb) => {
  console.log('deleteItems - formName:', formName, '; isAdmin:', isAdmin);
  var items = state.itemsCol[formName];
  var condition = { '_selected':true };
  var selectedItems = getArrayItemsByCondition(items, condition);
  var selectedItemIds = getPropertyValuesFromArray(selectedItems, '_id');
  if (selectedItemIds && selectedItemIds.length > 0) {
    var url = '/data/' + state.moduleName + '/delete';
    if (isAdmin) {
      url = '/data/admin/' + state.moduleName + '/delete';
    }
    var form = { ids:JSON.stringify(selectedItemIds) };
    console.log('deleteItems:', url, JSON.stringify(form));
    jquery.post(url, form, function(data) {
      console.log('deleteItems result:', data.error, data.docs, data.info);
      cb && cb(data.error, data.docs, data.info);
    });
  }
}

export const getData = ({ dispatch, state }, url, callback) => {
  var filter = {};
  filter = addRandomParameter(filter);
  jquery.get(url, filter, function(data) {
    console.log('getData:', url, data);
    callback && callback(data.docs);
  });
}

export const notifyMultiSelectChange = ({ dispatch, state }, item) => {
  console.log('notifyMultiSelectChange:', item);
  if (item && item['_class'] == 'vendor') {
    dispatch('SETFORMBYNAME', 'vendor_form', cloneObject(item));
  }
}


