import 'unfetch/polyfill'
import Vue from 'vue'
import CompositionApi from '@vue/composition-api'

import './use-composition-api'
import App from './app.vue'

Vue.config.productionTip = false

new Vue(App).$mount('#app')
