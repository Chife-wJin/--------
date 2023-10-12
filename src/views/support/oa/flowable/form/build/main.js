import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/assets/styles/formConfig/index.scss'
import '@/assets/icons'
import axios from 'axios'
import Tinymce from '@/views/support/oa/components/tinymce/index.vue'

Vue.component('tinymce', Tinymce)

Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
