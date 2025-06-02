import app from "@/main";

export function useNotify() {
  const toast = app.config.globalProperties.$toast;

  function notify({
    severity = "success",
    summary = "Notificación",
    detail = null,
    life = 9000,
    position = "top-left",
  } = {}) {
    toast.add({
      severity,
      summary,
      detail,
      life,
      position,
    });
  }

  return { notify };
}
