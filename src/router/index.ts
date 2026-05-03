import { createRouter, createWebHistory } from "vue-router";
const TheHome = () => import("@/pages/home/TheHome.vue");

const routes = [
  {
    path: "/",
    name: "TheHome",
    component: TheHome
  },

  {
    //404ページ ＝ 上記のいずれにもマッチしないもの
    path: "/:pathMatch(.*)*",
    name: "Error404",
    meta: { title: "ページが見つかりません (404)" },
    component: () => import("../pages/error/PageError404.vue")
  }
];

const router = createRouter({
  history: createWebHistory("/"),
  routes
});

export default router;
