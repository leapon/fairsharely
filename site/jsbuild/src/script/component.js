import Vue from 'vue'
import store from '../vuex/store'
import Clock from '../component/clock.vue'
import Hello from '../component/hello.vue'

new Vue({
  el: '#component1',
  store,
  data: {
    name: 'guest'
  },
  components: {
    Hello
  }
});

new Vue({
  el: '#component2',
  store,
  data: {
    timezone: 'America/New_York'
  },
  components: {
    Clock
  }
});
