import _ from 'lodash'

export function showRightPanel() {
  $('.panel-main').removeClass('col-md-12').addClass('col-md-9');
  $('.panel-right').removeClass('hide');
}

export function hideRightPanel() {
  $('.panel-main').removeClass('col-md-9').addClass('col-md-12');
  $('.panel-right').addClass('hide');
}

export function hideEditForm() {
  hideRightPanel();
}

// shallow copy of object
export function cloneObject(item) {
    var result = {};
    for (var property in item) {
      result[property] = item[property];
    }
    return result;
}

export function toNumber(input) {
  var result = 0;
  try {
    if (typeof input !== 'undefined') {
      result = input && parseFloat(input);
    }
  } catch (e) {
    result = 0;
  }
  return result;
}

// get matching item in array
export function getArrayItemByProperty(items, property, value) {
  return _.find(items, _.matchesProperty(property, value));
}

// get matching items in array using condition for matching
export function getArrayItemsByCondition(items, condition) {
  return _.filter(items, _.matches(condition));
}

export function getPropertyValuesFromArray(items, property) {
  return _.map(items, property);
}

//list_fields: ['category', 'name', 'value', 'create_by', 'create_date'],
export function getSheetColumnsFromModel(model, option) {
  var result = [];
  var listFields = option['list_fields'];
  for (var i = 0; i < listFields.length; i++) {
    var listField = listFields[i];
    result.push({
      name:listField,
      display:listField,
      data_type:model[listField].type,
      field_type:'view'
    });
  }
  return result;
}

//edit_fields: ['category', 'name', 'value'],
export function getEditColumnsFromModel(model, option) {
  var result = [];
  var editFields = option['edit_fields'];
  for (var i = 0; i < editFields.length; i++) {
    var editField = editFields[i];
    result.push({
      name: editField,
      display: editField,
      field_type: getFormFieldTypeFromModel(editField, model[editField])
    });
  }
  return result;
}

export function getFormFieldTypeFromModel(fieldName, fieldModel) {
  var fieldType = '';
  switch (fieldModel.type) {
    case 'file':
      fieldType = 'file';
      break;
    default:
      fieldType = 'input';
  }
  //console.log('>>> getFormFieldTypeFromModel:', fieldName, fieldModel, fieldType);
  return fieldType;
}

//filter_fields: ['category', 'name']
export function getFilterColumnsFromModel(model, option) {
  var result = [];
  var filterFields = option['filter_fields'];
  for (var i = 0; i < filterFields.length; i++) {
    var filterField = filterFields[i];
    result.push({
      name:filterField,
      display:filterField,
      field_type:'input',
      data_type: 'string'
    });
  }
  return result;
}

// columnsToggleMode value: 'show'/'hide'
export function getToggledColumnShowData(columnModel, columnsToggleMode) {
  var columnShowData = {};
  for (var i = 0; i < columnModel.length; i++) {
    var column = columnModel[i];
    if (columnsToggleMode === 'hide') {
      columnShowData[column.name] = !(column.hide === true);
    } else {
      columnShowData[column.name] = true;
    }
  }
  return columnShowData;
}

