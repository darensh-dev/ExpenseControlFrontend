import { authAxios } from "@/composables/useAxios";
import { useNotify } from "@/composables/useNotify";
import { apiV1 } from "@/config/endpoints";
import { ref } from "vue";
import { uniqBy } from "lodash-es";
import { DateTime } from "luxon";

const toast = useNotify();

const useGetExpense = () => {
  const now = new Date();

  const listExpense = ref([]);
  const listFundOnExpenses = ref([]);
  const listDocumenTypeOnExpenses = ref([]);
  const loading = ref(false);
  const year = ref(now.getFullYear());
  const month = ref(now.getMonth() + 1);

  const getExpenses = async () => {
    try {
      listExpense.value = [];
      loading.value = true;
      const { data, status } = await authAxios.get(`${apiV1.expense}?year=${year.value}&month=${month.value}`);
      if (status === 204) {
        return toast.notify({
          severity: "warn",
          summary: "Alerta",
          detail: `No se encontraron gastos para el periodo: ${year.value}-${month.value}`,
        });
      }
      listFundOnExpenses.value = uniqBy(
        data.map((e) => e.monetaryFund),
        "id",
      );
      listDocumenTypeOnExpenses.value = uniqBy(
        data.map((e) => e.documentType),
        "id",
      );
      listExpense.value = data;
    } catch {
      toast.notify({ severity: "error", summary: "Error", detail: "Error al obtener los gastos" });
    } finally {
      loading.value = false;
    }
  };

  return { getExpenses, listExpense, loading, year, month, listFundOnExpenses, listDocumenTypeOnExpenses };
};

const useCreateExpense = () => {
  const loading = ref(false);

  const createExpense = async (expense) => {
    try {
      loading.value = true;
      if (!expense || !expense.date) {
        toast.notify({ severity: "warn", summary: "Alerta", detail: "Fecha no proporcionada" });
        return null;
      }
      expense.date = DateTime.fromJSDate(expense.date).toFormat("yyyy-MM-dd");
      const { data } = await authAxios.post(apiV1.expense, expense);

      toast.notify({
        severity: "success",
        summary: "Exito",
        detail: "Gasto registrado con exito",
      });
      return data;
    } catch (error) {
      if (error.status === 400 && error.response.data.title === "Budget Exceeded") {
        toast.notify({ severity: "error", summary: "Error", detail: error.response.data.detail });
      } else {
        toast.notify({ severity: "error", summary: "Error", detail: "Error al crear gasto" });
      }
      return null;
    } finally {
      loading.value = false;
    }
  };

  return { createExpense, loading };
};

export { useGetExpense, useCreateExpense };
