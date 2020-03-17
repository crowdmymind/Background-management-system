import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; 
import store from './store'
import echarts from 'echarts'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
