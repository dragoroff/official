import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en";
import myTable from "./reusable-components/Table.vue";

Vue.component("my-table", myTable);
Vue.use(ElementUI, { locale });

axios.defaults.baseURL = "http://localhost:8000/";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
