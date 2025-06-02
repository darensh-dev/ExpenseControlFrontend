import { authAxios } from "@/composables/useAxios";
import { useNotify } from "@/composables/useNotify";
import { apiV1 } from "@/config/endpoints";
import { ref } from "vue";
import { uniqBy } from "lodash-es";
import { DateTime } from "luxon";

const toast = useNotify();

const useGetDeposit = () => {
  const listDeposit = ref([]);
  const listExpenseTypeOnDeposit = ref([]);
  const loading = ref(false);
  const monthFilter = ref(new Date());

  const getDeposits = async () => {
    try {
      listDeposit.value = [];
      loading.value = true;
      const { data, status } = await authAxios.get(
        `${apiV1.deposit}?year=${monthFilter.value.getFullYear()}&month=${monthFilter.value.getMonth() + 1}`,
      );
      if (status === 204) {
        return toast.notify({
          severity: "warn",
          summary: "Alerta",
          detail: "No se encontraron depositos",
        });
      }
      listExpenseTypeOnDeposit.value = uniqBy(
        data.map((e) => e.monetaryFund),
        "id",
      );
      listDeposit.value = data;
    } catch {
      toast.notify({ severity: "error", summary: "Error", detail: "Error al obtener el historial de depositos" });
    } finally {
      loading.value = false;
    }
  };

  return { getDeposits, listDeposit, monthFilter, loading, listExpenseTypeOnDeposit };
};

const useCreateDeposit = () => {
  const saving = ref(false);

  const createDeposit = async (deposit) => {
    try {
      saving.value = true;
      if (!deposit || !deposit.date) {
        toast.notify({ severity: "warn", summary: "Alerta", detail: "Fecha no proporcionada" });
        return null;
      }
      deposit.date = DateTime.fromJSDate(deposit.date).toFormat("yyyy-MM-dd");
      const { data } = await authAxios.post(apiV1.deposit, deposit);

      toast.notify({
        severity: "success",
        summary: "Exito",
        detail: "Deposito registrado con exito",
      });
      return data;
    } catch {
      toast.notify({ severity: "error", summary: "Error", detail: "Error al registrar el desposito" });
      return null;
    } finally {
      saving.value = false;
    }
  };

  return { createDeposit, saving };
};

export { useGetDeposit, useCreateDeposit };
