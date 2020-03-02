import Vue from "vue";
import iView from "iview"; // step 1:import iview
import "iview/dist/styles/iview.css";
import gcIView from "gc_iview"; // step 2:import gc_iview
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./libs/http";
Vue.config.productionTip = false;

Vue.use(iView); // step 3:use iview
Vue.use(gcIView); // step 4:use gc_iview

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
