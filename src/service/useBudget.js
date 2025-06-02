import { authAxios } from "@/composables/useAxios";
import { useNotify } from "@/composables/useNotify";
import { apiV1 } from "@/config/endpoints";
import { ref } from "vue";
import { uniqBy } from "lodash-es";
import { DateTime } from "luxon";

const toast = useNotify();

const useGetBudget = () => {
  const listBudget = ref([]);
  const listExpenseTypeOnBudget = ref([]);
  const loading = ref(false);

  const getBudgets = async () => {
    try {
      listBudget.value = [];
      loading.value = true;
      const { data, status } = await authAxios.get(apiV1.budget);
      if (status === 204) {
        return toast.notify({
          severity: "warn",
          summary: "Alerta",
          detail: "No se encontraron presupuestos",
        });
      }
      listExpenseTypeOnBudget.value = uniqBy(
        data.map((e) => e.expenseType),
        "id",
      );
      listBudget.value = data;
    } catch {
      toast.notify({ severity: "error", summary: "Error", detail: "Error al obtener los presupuestos" });
    } finally {
      loading.value = false;
    }
  };

  return { getBudgets, listBudget, loading, listExpenseTypeOnBudget };
};

const useCreateBudget = () => {
  const saving = ref(false);

  const createBudget = async (budget) => {
    try {
      saving.value = true;
      if (!budget || !budget.month) {
        toast.notify({ severity: "warn", summary: "Alerta", detail: "Fecha no proporcionada" });
        return null;
      }
      budget.month = DateTime.fromJSDate(budget.month).toFormat("yyyy-MM-dd");
      const { data } = await authAxios.post(apiV1.budget, budget);

      toast.notify({
        severity: "success",
        summary: "Exito",
        detail: "Presupuesto registrado con exito",
      });
      return data;
    } catch {
      toast.notify({ severity: "error", summary: "Error", detail: "Error al crear el presupuesto" });
      return null;
    } finally {
      saving.value = false;
    }
  };

  return { createBudget, saving };
};

export { useGetBudget, useCreateBudget };
