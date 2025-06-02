<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <AppMenuItem v-if="!item.separator" :item="item" :index="i" />
      <li v-if="item.separator" class="menu-separator" />
    </template>
  </ul>
</template>
<script setup>
import { ref } from "vue";

import AppMenuItem from "./AppMenuItem.vue";

const model = ref([
  {
    label: "",
    items: [
      { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" },
      { label: "Fondos Monetarios", icon: "pi pi-fw pi-check-square", to: "/monetary-fund" },
      { label: "Depositos", icon: "pi pi-fw pi-id-card", to: "/deposit" },
      { label: "Presupuestos", icon: "pi pi-fw pi-id-card", to: "/budget" },
      { label: "Tipo de Gastos", icon: "pi pi-fw pi-mobile", to: "/expense-type", class: "rotated-icon" },
      { label: "Gastos", icon: "pi pi-fw pi-mobile", to: "/expense", class: "rotated-icon" },
      { label: "Moviminentos", icon: "pi pi-fw pi-money-bill", to: "/movements" },
    ],
  },
]);
</script>
<style lang="scss" scoped></style>
