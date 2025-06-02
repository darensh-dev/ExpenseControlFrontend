import ExpandableText from "@/components/custom/ExpandableText.vue";
import CardSkeleton from "@/components/custom/CardSkeleton.vue";
import EmptyData from "@/components/custom/EmptyData.vue";
import Loading from "@/components/custom/Loading.vue";

import Aura from "@primeuix/themes/aura";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import BadgeDirective from "primevue/badgedirective";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import Ripple from "primevue/ripple";
import StyleClass from "primevue/styleclass";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";
import Chart from "primevue/chart";

import "@/assets/styles.scss";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);

app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".app-dark",
    },
  },
});
app.use(ToastService);
app.use(ConfirmationService);

app.directive("tooltip", Tooltip);
app.directive("badge", BadgeDirective);
app.directive("ripple", Ripple);
app.directive("styleclass", StyleClass);

app.component("Loading", Loading);
app.component("EmptyData", EmptyData);
app.component("ExpandableText", ExpandableText);
app.component("CardSkeleton", CardSkeleton);
app.component("Chart", Chart);

app.mount("#app");

export default app;
