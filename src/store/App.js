import { defineStore } from "pinia";
export const useAppStore = defineStore("App", {
  state: () => ({
    loading: false,
    employee: {
      JsonExperience: [],
      JsonCertification: [],
    },
    hashModules: [],
    modules: [
      { label: "Home", icon: "pi pi-fw pi-home", to: "/", name: "Home" },
      {
        label: "Actualizar Datos",
        icon: "pi pi-fw pi-user-edit",
        to: "/profile",
        name: "profile",
      },
      {
        label: "Correo de empresas",
        icon: "pi pi-fw pi-envelope",
        to: "/mail/inbox",
        name: "mail",
      },
      {
        label: "Recompensas",
        icon: "pi pi-gift",
        to: "/rewards",
        name: "mail",
      },
    ],
    moduleFormation: [
      {
        label: "Mi Formación",
        icon: "pi pi-fw pi-user-edit",
        to: "/formation",
        name: "formation",
      },
    ],
    moduleEst: [
      {
        label: "Temporales",
        icon: "pi pi-fw pi-user-edit",
        to: "/est",
        items: [
          {
            label: "Asistencias",
            icon: "pi pi-list",
            to: "/est/asistencias",
            name: "asistencias",
          },
          {
            label: "Permisos",
            icon: "pi pi-fw pi-list",
            to: "/est/permisos",
            name: "permisos",
          },
          {
            label: "Incapacidades",
            icon: "pi pi-list",
            to: "/est/incapacidades",
            name: "incapacidades",
          },
        ],
      },
    ],
  }),
});
