import { authAxios } from "@/composables/useAxios";
import { useNotify } from "@/composables/useNotify";
import { apiV1 } from "@/config/endpoints";
import { ref } from "vue";

const toast = useNotify();

const useFundTypes = () => {
  const listFundTypes = ref([]);
  const loadingFundTypes = ref(false);

  const getFundTypes = async () => {
    try {
      listFundTypes.value = [];
      loadingFundTypes.value = true;
      const { data } = await authAxios.get(apiV1.fundTypes);
      listFundTypes.value = data;
      loadingFundTypes.value = false;
    } catch {
      toast.notify({ severity: "error", summary: "Error", detail: "Error al obtener los fondos monetarios" });
      loadingFundTypes.value = false;
    }
  };

  return { getFundTypes, listFundTypes, loadingFundTypes };
};

const useGetExpenseTypes = () => {
  const listExpenseTypes = ref([]);
  const loading = ref(false);

  const getExpenseTypes = async () => {
    try {
      listExpenseTypes.value = [];
      loading.value = true;
      const { data, status } = await authAxios.get(apiV1.expenseTypes);
      if (status === 204) {
        return toast.notify({
          severity: "warn",
          summary: "Alerta",
          detail: `No se encontraron tipos gastos`,
        });
      }
      listExpenseTypes.value = data;
    } catch {
      toast.notify({ severity: "error", summary: "Error", detail: "Error al obtener los tipos gastos" });
    } finally {
      loading.value = false;
    }
  };

  return { getExpenseTypes, listExpenseTypes, loading };
};

const useGetDocumentTypes = () => {
  const listDocumentType = ref([]);
  const loading = ref(false);

  const getDocumentType = async () => {
    try {
      listDocumentType.value = [];
      loading.value = true;
      const { data, status } = await authAxios.get(apiV1.documentTypes);
      if (status === 204) {
        return toast.notify({
          severity: "warn",
          summary: "Alerta",
          detail: `No se encontraron tipos de documentos`,
        });
      }
      listDocumentType.value = data;
      loading.value = false;
    } catch {
      toast.notify({ severity: "error", summary: "Error", detail: "Error al obtener los tipos de documentos" });
      loading.value = false;
    }
  };

  return { getDocumentType, listDocumentType, loading };
};

export { useFundTypes, useGetExpenseTypes, useGetDocumentTypes };
