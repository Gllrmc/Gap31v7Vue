import Vue from 'vue';
import './plugins/vuetify';
import MultiFiltersPlugin from './plugins/MultiFilters';
import moment from 'moment';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import vueXlsxTable from 'vue-xlsx-table';
import excel from 'vue-excel-export'

axios.defaults.baseURL = 'http://localhost:53400';
Vue.config.productionTip = false;
Vue.use(MultiFiltersPlugin);
Vue.prototype.moment = moment;
Vue.use(excel);
Vue.use(vueXlsxTable, { rABS: false });

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');