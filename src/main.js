import 'unfetch/polyfill'
import Vue from 'vue'

import './use-composition-api'
import App from './app.vue'

Vue.config.productionTip = false

new Vue({render: h => h(App)}).$mount('#app')
