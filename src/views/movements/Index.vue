<template>
  <h1>Movimientos</h1>
  <DataTable
    :value="filteredMovements"
    paginator
    :rows="10"
    data-key="id"
    row-hover
    :loading="loadingData"
    :global-filter-fields="['descripcion', 'amount', 'date']"
  >
    <template #header>
      <div class="flex justify-between items-center gap-2">
        <Calendar
          v-model="dateRange"
          selection-mode="range"
          show-icon
          placeholder="Selecciona un rango de fechas"
          class="w-64"
          :max-date="new Date()"
        />
        <div class="flex gap-2">
          <Select
            v-model="movementTypeFilter"
            :options="listMovementTypes"
            placeholder="Seleccionar Fondo"
            style="width: 210px"
            show-clear
          />
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="search" placeholder="Buscar" />
          </IconField>
        </div>
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
import { computed, ref, onMounted, watch } from "vue";
import { authAxios } from "@/composables/useAxios";
import { useNotify } from "@/composables/useNotify";
import { apiV1 } from "@/config/endpoints";
import { DateTime } from "luxon";
import { uniqBy } from "lodash-es";

const toast = useNotify();

const endDate = DateTime.now();
const startDate = endDate.plus({ months: -1 });

const dateRange = ref([startDate.toJSDate(), endDate.toJSDate()]);
const dataTable = ref([]);
const loadingData = ref(false);
const search = ref("");
const movementTypeFilter = ref(null);
const listMovementTypes = ref([]);

const filteredMovements = computed(() => {
  return dataTable.value.filter((mov) => {
    const searchLower = search.value.toLowerCase();

    const matchesSearch = search.value
      ? mov.fundName?.toLowerCase().includes(searchLower) ||
        mov.documentType?.toLowerCase().includes(searchLower) ||
        mov.tradeName?.toLowerCase().includes(searchLower) ||
        mov.expenseType?.toLowerCase().includes(searchLower) ||
        mov.notes?.toLowerCase().includes(searchLower) ||
        mov.amount?.toString().includes(searchLower)
      : true;

    const matchesMovementType = movementTypeFilter.value ? mov.movementType === movementTypeFilter.value : true;

    return matchesSearch && matchesMovementType;
  });
});

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
    listMovementTypes.value = uniqBy(data.map((e) => e.movementType));
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
