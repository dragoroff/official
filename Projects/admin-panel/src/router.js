import Vue from "vue";
import Router from "vue-router";
import NotFound from "./views/NotFound.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/signin",
      name: "signin",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Login.vue")
    },
    {
      path: "/dashboard",
      component: () =>
        import(/* webpackChunkName: "dashboard" */ "./views/Dashboard.vue"),
      children: [
        {
          path: "",
          name: "dashboard-main",
          component: () =>
            import(/* webpackChunkName: "dashboard-main" */ "./components/dashboard/Main.vue")
        },
        {
          path: "balance",
          name: "dashboard-balance",
          component: () =>
            import(/* webpackChunkName: "dashboard-balance" */ "./components/dashboard/Balance.vue")
        },
        {
          path: "transactions",
          name: "dashboard-transactions",
          component: () =>
            import(/* webpackChunkName: "dashboard-transactions" */ "./components/dashboard/Transactions.vue")
        },
        {
          path: "history",
          name: "balance-history",
          component: () =>
            import(/* webpackChunkName: "balance-history" */ "./components/dashboard/History.vue")
        }
      ]
    },
    {
      path: "/**",
      component: NotFound
    }
  ]
});
