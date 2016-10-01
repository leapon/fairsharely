<template>
  <div class="paging-bar">
    <div class="btn-group btn-group-nav" role="group">
      <button type="button" class="btn btn-default"
        data-value="<"
        v-on:click="pageChange">
        <
      </button>
      <button type="button" class="btn btn-default"
        data-value="{{ display_page_value }}"
        v-bind:class="{ 'active': isCurrentPage(display_page_value) }"
        v-on:click="pageChange"
        v-for="(index, display_page_value) in display_pages">
        {{ display_page_value }}
      </button>
      <button type="button" class="btn btn-default"
        data-value=">"
        v-on:click="pageChange">
        >
      </button>
    </div>
    <div class="btn-group btn-group-pagesize" role="group" v-if="show_paging_size">
      <button type="button" class="btn btn-default"
        data-value="{{ page_size_value }}"
        v-bind:class="{ 'active': isCurrentPageSize(page_size_value) }"
        v-on:click="pagesizeChange"
        v-for="(index, page_size_value) in current_paging_sizes">
        {{ page_size_value }}
      </button>
    </div>
    <div class="paging-info hidden">
      records: {{ records_count }}
    </div>
  </div>
</template>

<script>
import store from '../vuex/store.js';

export default {
  props: ['name', 'config', 'records_count'],
  data: function() {
    var result = {
      current_page: this.config.start_page || 1,
      current_paging_size: this.config.page_size || 5,
      current_paging_sizes: this.config.page_sizes || [5, 10, 20, 'All'],
      page_range: this.config.page_range || 5,
      show_paging_size: this.config.show_paging_size || false
    };
    return result;
  },
  vuex: {
    getters: {
    },
    actions: {
    }
  },
  computed: {
    display_pages: function() {
      // if current_page = 1, return [1, 2, 3 , 4, 5]
      // if current_page = 8, return [6, 7, 8 , 9, 10]
      var page = this.current_page; // example current_page = 8
      var pageSize = this.current_paging_size;
      var pageRange = 5;
      var rangeStart = Math.floor((this.current_page - 1)/this.page_range);  // floor of 8/5 = 1
      var rangePageStart = (rangeStart * this.page_range) + 1; // 1 * 5 + 1 = 6
      var result = [];
      for (var i = 0; i < this.page_range; i++) {
        var pageNumber = rangePageStart + i;
        if (pageNumber <= this.max_page_number) {
          result.push(pageNumber);
        }
      } // result push 6, 7, 8, 9 10
      return result;
    },
    max_page_number: function() {
      return Math.ceil(this.records_count/this.current_paging_size);
    }
    //items: function() {
    //  return store.state.itemsCol[this.name];
    //},
  },
  activate: function (done) {
    // fire initial page_change event
    this.pageChange();
    done();
  },
  methods: {
    pageChange: function(event) {
      var value = this.current_page;
      if (event) {
        value = $(event.srcElement) && $(event.srcElement).attr('data-value');
      }
      console.log('pageChange:', value);
      switch (value) {
        case '<':
          this.current_page = this.current_page - 1;
          if (this.current_page <= 0) {
            this.current_page = 1;
          }
          break;
        case '>':
          this.current_page = this.current_page + 1;
          if (this.current_page > this.max_page_number) {
            this.current_page = this.max_page_number;
          }
          break;
        default:
          this.current_page = parseInt(value);
      }
      var record_start = (this.current_page - 1) * this.current_paging_size + 1;
      var record_end = record_start + this.current_paging_size - 1;
      if (record_end > this.record_number) {
        record_end = this.record_number;
      }
      console.log('>>> record_start:', record_start, ';record_end:', record_end);
      this.$dispatch('page_change', {
        page:this.current_page,
        page_size:this.current_paging_size,
        paging_record_start: record_start,
        paging_record_end: record_end
      });
    },
    pagesizeChange: function(event) {
      var value = $(event.srcElement).attr('data-value');
      console.log('pagesizeChange:', value);
    },
    isCurrentPage: function(value) {
      return value == this.current_page;
    },
    isCurrentPageSize: function(value) {
      return value == this.current_paging_size;
    }
  }
}
</script>

<style>
.paging-bar {
  margin-top: 10px;
  margin-bottom: 10px;
}
.paging-bar .btn-group-pagesize {
  margin-left: 30px;
}
.paging-bar .paging-info {
  margin-left: 30px;
  display: inline;
}
</style>
