import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

Vue.config.productionTip = false

var taskData = {}

if (!localStorage.getItem("taskData")) {
  localStorage.setItem("taskData", taskData)
} else {
  taskData = localStorage.getItem("taskData")
}

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
