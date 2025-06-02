import { authAxios } from "@/composables/useAxios";
import { useNotify } from "@/composables/useNotify";
import { apiV1 } from "@/config/endpoints";
import { ref } from "vue";

const toast = useNotify();

const useCreateExpenseType = () => {
  const saving = ref(false);

  const createExpenseType = async (deposit) => {
    try {
      saving.value = true;
      const { data } = await authAxios.post(apiV1.expenseTypes, deposit);
      toast.notify({
        severity: "success",
        summary: "Exito",
        detail: "Tipo de gasto registrado con exito",
      });
      return data;
    } catch {
      toast.notify({ severity: "error", summary: "Error", detail: "Error al registrar el tipo de gasto" });
      return null;
    } finally {
      saving.value = false;
    }
  };

  return { createExpenseType, saving };
};

export { useCreateExpenseType };
