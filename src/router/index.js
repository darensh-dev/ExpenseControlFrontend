import { APP_KEY_SESSION } from "@/env-vars";
import AppLayout from "@/layout/AppLayout.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: AppLayout,
      name: "main-layout",
      meta: {
        requiredAuth: true,
      },
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("@/views/Dashboard.vue"),
        },
        {
          path: "monetary-fund",
          name: "monetary-fund",
          component: () => import("@/views/monetaryFund/Index.vue"),
        },
        {
          path: "deposit",
          name: "deposit",
          component: () => import("@/views/deposit/Index.vue"),
        },
        {
          path: "budget",
          name: "budget",
          component: () => import("@/views/budget/Index.vue"),
        },
        {
          path: "expense",
          name: "expense",
          component: () => import("@/views/expense/Index.vue"),
        },
        {
          path: "expense-type",
          name: "expenseType",
          component: () => import("@/views/expenseType/Index.vue"),
        },
        {
          path: "movements",
          name: "movements",
          component: () => import("@/views/movements/Index.vue"),
        },
      ],
    },
    {
      path: "/auth/login",
      name: "login",
      component: () => import("@/views/pages/auth/Login.vue"),
    },
    {
      path: "/:catchAll(.*)",
      name: "notfound",
      component: () => import("@/views/pages/NotFound.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem(APP_KEY_SESSION);

  if (!token && to.meta.requiredAuth) {
    return next({ name: "login" });
  }

  if (to.name === "login" && token) {
    return next({ name: "dashboard" });
  }

  if (to.meta.requiredAuth && !token) {
    return next({ name: "login" });
  }

  next();
});

export default router;
