import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import { store } from "@/store";
import { registerSW } from "virtual:pwa-register";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./scss/app.scss";

registerSW({ immediate: true });

createApp(App).use(store).use(router).mount("#app");
