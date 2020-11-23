import Vue from 'vue'
import App from './App'
import request from './request' //测试用数据
import store from './store'
Vue.prototype.$store = store;
Vue.prototype.$api = request;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
