import { authAxios } from "@/composables/useAxios";
import { useNotify } from "@/composables/useNotify";
import { apiV1 } from "@/config/endpoints";
import { ref } from "vue";

const toast = useNotify();

const useGetMonetaryFund = () => {
  const listMonetaryFund = ref([]);
  const loading = ref(false);

  const getMonetaryFund = async () => {
    try {
      listMonetaryFund.value = [];
      loading.value = true;
      const { data, status } = await authAxios.get(apiV1.monetaryFund);
      if (status === 204) {
        return toast.notify({
          severity: "warn",
          summary: "Alerta",
          detail: `No se encontraron fondos monetarios`,
        });
      }
      listMonetaryFund.value = data;
    } catch {
      toast.notify({ severity: "error", summary: "Error", detail: "Error al obtener los fondos monetarios" });
    } finally {
      loading.value = false;
    }
  };

  return { getMonetaryFund, listMonetaryFund, loading };
};

const useCreateMonetaryFund = () => {
  const loading = ref(false);

  const createMonetaryFund = async ({ name = "", initialBalance = 0, fundTypeId = null }) => {
    try {
      loading.value = true;
      const { data } = await authAxios.post(apiV1.monetaryFund, {
        initialBalance: initialBalance,
        fundTypeId: fundTypeId,
        name: name,
      });
      toast.notify({ severity: "success", summary: "Exito", detail: "Fondo monetario creado" });
      return data;
    } catch (error) {
      toast.notify({ severity: "error", summary: "Error", detail: error.message });
      console.error("Error al hacer login:", error?.response?.data || error.message);
    }
    loading.value = false;
  };

  return { createMonetaryFund, loading };
};

export { useCreateMonetaryFund, useGetMonetaryFund };
