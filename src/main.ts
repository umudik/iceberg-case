/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Store
import store from "./store";

// Styles
import "unfonts.css";

const app = createApp(App);

app.use(store);
registerPlugins(app);

app.mount("#app");
