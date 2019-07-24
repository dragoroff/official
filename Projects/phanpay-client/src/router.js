import Vue from "vue";
import Router from "vue-router";
import MainPage from "./views/MainPage.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "main",
      component: MainPage
    },
    {
      path: "/signup",
      name: "signup",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "signup" */ "./views/SignUp.vue")
    },
    {
      path: "/signin",
      name: "signin",
      component: () =>
        import(/* webpackChunkName: "signin" */ "./views/SignIn.vue")
    },
    {
      path: "/admin",
      name: "admin",
      beforeEnter(to, from, next) {
        const status = localStorage.getItem("status");
        if (status !== "admin") {
          next("/signin");
        } else {
          next();
        }
      },
      component: () =>
        import(/* webpackChunkName: "admin" */ "./views/Admin.vue"),
      children: [
        {
          path: "/admin",
          name: "admin-child",
          component: () =>
            import(
              /* webpackChunkName: "admin-child" */ "./components/AdminComponent.vue"
            )
        },
        {
          path: "/admin-reports",
          name: "admin-reports",
          component: () =>
            import(
              /* webpackChunkName: "admin-reports" */ "./components/AdminReports.vue"
            )
        }
      ]
    },
    {
      path: "/dashboard",
      name: "dashboard",
      beforeEnter(to, from, next) {
        const token = localStorage.getItem("token");
        if (token !== "secret_token") {
          next("/signin");
        } else {
          next();
        }
      },
      component: () =>
        import(/* webpackChunkName: "main_dashboard" */ "./views/UserMenu.vue"),
      children: [
        {
          path: "/dashboard",
          name: "dashboard-child",
          component: () =>
            import(
              /* webpackChunkName: "dashboard" */ "./components/Dashboard.vue"
            )
        },
        {
          path: "/deposit",
          name: "deposit",
          component: () =>
            import(/* webpackChunkName: "deposit" */ "./components/Deposit.vue")
        },
        {
          path: "/withdrawal",
          name: "withdrawal",
          component: () =>
            import(
              /* webpackChunkName: "withdrawal" */ "./components/Withdrawal.vue"
            )
        },
        {
          path: "/reports",
          name: "reports",
          component: () =>
            import(/* webpackChunkName: "reports" */ "./components/Reports.vue")
        }
      ]
    },
    {
      path: "*",
      name: "notfound",
      component: () =>
        import(/* webpackChunkName: "notfound" */ "./views/NotFound.vue")
    }
  ]
});

export default router;
