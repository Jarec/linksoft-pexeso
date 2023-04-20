import MainMenu from "@/MainMenu.vue";
import PexesoGame from "@/PexesoGame.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: MainMenu,
    props: ({ query: { pexesoId, error } }) => ({ pexesoId, error }),
  },
  { path: "/pexeso", component: PexesoGame },
  { path: "/pexeso/:pexesoId", component: PexesoGame, props: true },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
