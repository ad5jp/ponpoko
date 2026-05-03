import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import { store } from "@/store";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./scss/app.scss";

createApp(App).use(store).use(router).mount("#app");
