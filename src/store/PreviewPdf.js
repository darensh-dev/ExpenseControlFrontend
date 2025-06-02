import { defineStore } from "pinia";

export const usePreviewPdfStore = defineStore("usePreviewPdfStore", {
  state: () => ({
    url: null,
    show: false,
  }),
  getters: {},
  actions: {
    showPreviewPdf(url) {
      this.url = url;
      this.show = true;
    },
    closePreviewPdf() {
      this.url = null;
      this.show = false;
    },
  },
});
