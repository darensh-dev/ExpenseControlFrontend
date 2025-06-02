<template>
  <h1>Movimientos</h1>
  <DataTable
    :value="dataTable"
    paginator
    :rows="10"
    data-key="id"
    row-hover
    :loading="loadingData"
    :global-filter-fields="['descripcion', 'amount', 'date']"
  >
    <template #header>
      <div class="flex justify-between items-center gap-2">
        <div class="flex gap-2">
          <Calendar
            v-model="dateRange"
            selection-mode="range"
            show-icon
            placeholder="Selecciona un rango de fechas"
            class="w-64"
            :max-date="new Date()"
          />
        </div>
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText placeholder="Buscar..." />
        </IconField>
      </div>
    </template>

    <template #empty> <EmptyData /> </template>
    <template #loading> <Loading /></template>
    <Column field="movementType" header="Movimiento" />
    <Column field="Fecha" header="Fecha" />
    <Column field="fundName" header="Fondo Monetario" />
    <Column field="documentType" header="Tipo de Documento" />
    <Column field="tradeName" header="Comercio" />
    <Column field="expenseType" header="Tipo de Gasto" />
    <Column field="amount" header="Monto" data-type="numeric" style="min-width: 10rem">
      <template #body="{ data }">
        {{ formatterMoney({ value: data.amount }) }}
      </template>
    </Column>
    <Column field="notes" header="Notas" />
  </DataTable>
</template>

<script setup>
import { formatterMoney } from "@/composables/useUtils";
import { ref, onMounted, watch } from "vue";
import { authAxios } from "@/composables/useAxios";
import { useNotify } from "@/composables/useNotify";
import { apiV1 } from "@/config/endpoints";
import { DateTime } from "luxon";

const toast = useNotify();

const endDate = DateTime.now();
const startDate = endDate.plus({ months: -1 });

const dateRange = ref([startDate.toJSDate(), endDate.toJSDate()]);
const dataTable = ref([]);
const loadingData = ref(false);

const getDataTable = async () => {
  try {
    const StartDate = DateTime.fromJSDate(dateRange.value[0]).toFormat("yyyy-MM-dd");
    const EndDate = DateTime.fromJSDate(dateRange.value[1]).toFormat("yyyy-MM-dd");

    dataTable.value = [];
    loadingData.value = true;
    const { data, status } = await authAxios.get(`${apiV1.movements}?StartDate=${StartDate}&EndDate=${EndDate}`);
    if (status === 204) {
      return toast.notify({
        severity: "warn",
        summary: "Alerta",
        detail: `No se encontraron tipos gastos`,
      });
    }
    dataTable.value = data;
  } catch {
    toast.notify({ severity: "error", summary: "Error", detail: "Error al obtener los tipos gastos" });
  } finally {
    loadingData.value = false;
  }
};

watch(dateRange, () => {
  if (!!dateRange.value[0] && !!dateRange.value[1]) getDataTable();
});

onMounted(() => {
  getDataTable();
});
</script>
