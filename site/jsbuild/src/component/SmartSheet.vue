<template>
  <table class="table table-bordered table-smartsheet">
    <caption>
      {{ config.caption }}
    </caption>
    <!-- header row -->
    <tr>
      <th v-if="config.selection == 'single' || config.selection == 'multi'"></th>
      <th class="smartsheet-cell" v-for="column in columns"
        v-if="columnShowData[column.name]"
        v-bind:style="getColumnStyle(column)">
        {{ column.display }}
        <div class="column-head-icon-set">
          <i class="glyphicon {{ columnSortClass[column.name] }}"
            data-column-name="{{ column.name }}"
            v-on:click="columnHeaderClick"
          ></i>
        </div>
      </th>
    </tr>

    <!-- row for summation on numeric columns -->
    <tr class="smartsheet-row" data-item-id="{{ item._id || item.id }}"
      v-for="(index, item) in itemsPaged"
      v-on:click="rowClick"
      v-on:dblclick="rowDoubleClick">
      <td class="smartsheet-cell" v-if="config.selection == 'single' || config.selection == 'multi'">
        <input type="checkbox" v-if="config.selection == 'multi'" v-model="item['_selected']"/>
        <input type="radio" v-if="config.selection == 'single'"  v-model="item['_selected']"/>
      </td>
      <td class="smartsheet-cell" v-for="column in columns" v-if="columnShowData[column.name]">
        <template v-if="column && column['field_type'] == 'input'">
          <template v-if="column['values']">
            <select
              class="form-control"
              data-row-index="{{ index }}"
              data-column="{{ column.name }}"
              v-model="item[column.name]"
              @change="cellChange"
              >
              <option value="" disabled selected v-if="column.placeholder">
                <span class="text-muted">{{ column.placeholder }}</span>
              </option>
              <option v-for="value in column.values">
                <template v-if="column.key">{{ value[column.key] }}</template>
                <template v-else></template>
              </option>
            </select>
          </template>
          <template v-else>
            <input class="smartsheet-input"
              data-row-index="{{ index }}"
              data-column="{{ column.name }}"
              v-model="item[column.name]"
              @change="cellChange"/>
          </template>
        </template>
        <template v-if="column && column['field_type'] == 'date'">
          <input class="smartsheet-input"
            data-row-index="{{ index }}"
            data-column="{{ column.name }}"
            v-model="item[column.name]"
            @change="cellChange"/>
        </template>
        <template v-if="column && column['field_type'] == 'select-one'">
          <select
            class="form-control"
            data-column="{{ column.name }}"
            v-model="item[column.name]"
            @change="cellChange">
            <option v-for="value in column.values">{{ value }}</option>
          </select>
        </template>
        <template v-if="column && column['field_type'] == 'select-multi'">
          <select
            class="form-control"
            data-column="{{ column.name }}"
            v-model="item[column.name]"
            @change="cellChange"
            multiple>
            <option v-for="value in column.values">{{ value }}</option>
          </select>
        </template>
        <template v-if="column && column['field_type'] == 'view'">
          <span
            data-row-index="{{ index }}"
            data-column="{{ column.name }}"
          >{{ item[column.name] }}</span>
        </template>
        <template v-if="column && column['field_type'] == 'template'">
          <span
            data-row-index="{{ index }}"
            data-column="{{ column.name }}"
          >{{{ getTemplateValue(column.template, item) }}}</span>
        </template>
      </td>
    </tr>
  </table>
  <paging-bar v-if="config.paging" :config="config.paging" :records_count="items.length"></paging-bar>
</template>

<script>
import _ from 'lodash';
import PagingBar from './PagingBar.vue';
import store from '../vuex/store.js';
import { editItem, setColumnsOption, sendSheetCellChange } from '../vuex/actions';

export default {
  props: ['name', 'columns', 'config'],
  components: {
    PagingBar
  },
  data: function() {
    var result = {
      columnSortData: {},
      columnSortClass: {},
      pagingData: {
        start: -1,
        end: -1
      }
    };
    for (var i = 0; i < this.columns.length; i++) {
      var column = this.columns[i];
      result.columnSortData[column.name] = '';
      result.columnSortClass[column.name] = 'glyphicon-sort';
    }
    return result;
  },
  vuex: {
    getters: {
    },
    actions: {
    }
  },
  computed: {
    items: function() {
      return store.state.itemsCol[this.name];
    },
    itemsPaged: function() {
      var records = store.state.itemsCol[this.name];
      var selectedRecords = [];
      if (this.pagingData.start < 0) {
        selectedRecords = records;
      } else {
        for (var i = 0; i < records.length; i++) {
          var count = i + 1;
          if (count >= this.pagingData.start && count <= this.pagingData.end) {
            selectedRecords.push(records[i]);
          }
        }
      }
      return selectedRecords;
    },
    columnShowData: function() {
      var columnsCol = store.state.columnsCol[this.name];
      var showData = columnsCol && columnsCol['show'] || {};
      console.log('>>> computed columnShowData:', JSON.stringify(showData));
      return showData;
    },
    summation_items: function() {
      //todo - return summation of numeric columns
      return store.state.itemsCol[this.name];
    }
  },
  activate: function (done) {
    // set columnsOption in store
    setColumnsOption(store, this.name, 'sort', this.columnSortData);
    done();
  },
  methods: {
    columnHeaderClick: function(event) {
      var selectedColumnName = $(event.srcElement).attr('data-column-name');
      // clear other column sort data
      var currentColumnSort = this.columnSortData[selectedColumnName] || '';
      // reset column sort info
      for (var columnName in this.columnSortData) {
        this.columnSortData[columnName] = '';
        this.columnSortClass[columnName] = 'glyphicon-sort';
      }
      // set column sort with selected column name
      switch (currentColumnSort) {
        case '':
          this.columnSortData[selectedColumnName] = 'down';
          this.columnSortClass[selectedColumnName] = 'glyphicon-arrow-down';
          break;
        case 'up':
          this.columnSortData[selectedColumnName] = 'down';
          this.columnSortClass[selectedColumnName] = 'glyphicon-arrow-down';
          break;
        case 'down':
          this.columnSortData[selectedColumnName] = 'up';
          this.columnSortClass[selectedColumnName] = 'glyphicon-arrow-up';
          break;
      }
      // update columnsOption in store
      setColumnsOption(store, this.name, 'sort', this.columnSortData);
    },
    getColumnStyle: function(column) {
      var style = '';
      if (column.width) {
        style="min-width:" + column.width;
      }
      return style;
    },
    cellChange: function(event) {
      var index = $(event.srcElement).attr('data-row-index');
      var field = $(event.srcElement).attr('data-column');
      var parentRow = $(event.srcElement).parents('tr');
      var itemId = $(parentRow).attr('data-item-id');
      var value = event.srcElement.value;
      //console.log('SmartSheet cellChange:', this.name, itemId, index, field, value);
      sendSheetCellChange(store, this.name, itemId, field, value);
    },
    rowClick: function(event) {
      //var itemId = $(event.srcElement).parent().attr('data-item-id');
      //console.log('rowClick itemId:', itemId);
    },
    rowDoubleClick: function(event) {
      var itemId = $(event.srcElement).parent().attr('data-item-id');
      console.log('rowDoubleClick itemId:', itemId);
      editItem(store, this.name, itemId);
    },
    isObject: function(input) {
      return typeof input == "object";
    },
    getTemplateValue: function(template, item) {
      var compiled = _.template(template);
      return compiled(item);
    }
  },
  events: {
    'page_change': function(data) {
      console.log('page_change event - data:', data);
      this.pagingData.start = data.paging_record_start;
      this.pagingData.end = data.paging_record_end;
    }
  }
}
</script>

<style>
.table-smartsheet {
  margin-bottom: 10px;
}
.table-smartsheet tr.smartsheet-row:hover {
  /* background-color: #f2f2f2; */
}
.table-smartsheet th.smartsheet-cell {
  padding: 3px 8px 3px 8px;
}
.table-smartsheet td.smartsheet-cell {
  padding: 3px 8px 3px 8px;
}
.smartsheet-input {
  width: 100%;
  background: transparent;
  font-size: 14px;
  box-sizing: border-box;
  border: solid 2px #fff;
  padding-top: 3px;
  padding-bottom: 1px;
}
.smartsheet-input:focus {
  outline: none;
}
.column-head-icon-set {
  float: right;
}
.column-head-icon-set:hover {
  cursor:pointer;
}
.column-head-icon-set .glyphicon-sort {
  color: #f2f2f2;
}
.smartsheet-cell select.form-control {
  box-shadow: none;
  border: none;
}
.table-smartsheet .smartsheet-paging {
  margin-top: 0px;
}
</style>
