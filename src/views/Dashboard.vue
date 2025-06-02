<template>
  <div class="p-4">
    <h1 class="text-4xl font-bold mb-8 text-white">Dashboard</h1>
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
      <div class="flex flex-col md:flex-row gap-2 items-end">
        <Calendar
          v-model="dateRange"
          selection-mode="range"
          show-icon
          placeholder="Selecciona un rango de fechas"
          class="w-64"
          :max-date="new Date()"
        />
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12">
        <div class="bg-[#181f2a] rounded-2xl shadow-xl p-7 min-h-[350px] flex items-center justify-center">
          <div class="w-full">
            <h2 class="text-2xl font-bold text-white mb-4">Presupuesto por Tipo de Gasto</h2>
            <Chart type="bar" :data="budgetComparisonData" :options="budgetComparisonOptions" class="h-30rem" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { formatterMoney } from "@/composables/useUtils";
import Chart from "primevue/chart";
import { authAxios } from "@/composables/useAxios";
import { useNotify } from "@/composables/useNotify";
import { apiV1 } from "@/config/endpoints";
import { DateTime } from "luxon";

const toast = useNotify();

const endDate = DateTime.now();
const startDate = endDate.plus({ months: -1 });

const budgetExecutionData = {
  labels: [],
  datasets: [
    {
      label: "Presupuestado",
      data: [],
      backgroundColor: "#10b981",
    },
    {
      label: "Ejecutado",
      data: [],
      backgroundColor: "#6366f1",
    },
  ],
};

const budgetComparisonOptions = {
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  plugins: {
    legend: {
      labels: {
        color: "#fff",
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: "#fff",
        callback: function (value) {
          return formatterMoney(value);
        },
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
    },
    x: {
      ticks: {
        color: "#fff",
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
    },
  },
};

const totalBudgeted = ref(0);
const totalExecuted = ref(0);
const dateRange = ref([startDate.toJSDate(), endDate.toJSDate()]);
const loadingData = ref(false);
const budgetComparisonData = ref({ ...budgetExecutionData });

const getDataBudgetExecution = async () => {
  try {
    const StartDate = DateTime.fromJSDate(dateRange.value[0]).toFormat("yyyy-MM-dd");
    const EndDate = DateTime.fromJSDate(dateRange.value[1]).toFormat("yyyy-MM-dd");

    budgetExecutionData.value = { ...budgetExecutionData };
    loadingData.value = true;
    const { data, status } = await authAxios.get(
      `${apiV1.chartBudgetExecution}?StartDate=${StartDate}&EndDate=${EndDate}`,
    );
    if (status === 204) {
      return toast.notify({
        severity: "warn",
        summary: "Alerta",
        detail: `No se encontro informacion`,
      });
    }
    updateChartData(data);
  } catch (error) {
    console.log(error);
    toast.notify({ severity: "error", summary: "Error", detail: "Error al obtener los datos de ejecucion" });
  } finally {
    loadingData.value = false;
  }
};

function updateChartData(data) {
  budgetComparisonData.value = {
    labels: data.map((d) => d.expenseType),
    datasets: [
      {
        label: "Presupuestado",
        data: data.map((d) => d.budgetedAmount),
        backgroundColor: "#10b981",
      },
      {
        label: "Ejecutado",
        data: data.map((d) => d.executedAmount),
        backgroundColor: "#6366f1",
      },
    ],
  };

  totalBudgeted.value = data.reduce((sum, item) => sum + item.budgetedAmount, 0);
  totalExecuted.value = data.reduce((sum, item) => sum + item.executedAmount, 0);
}

watch(dateRange, () => {
  if (!!dateRange.value[0] && !!dateRange.value[1]) getDataBudgetExecution();
});

onMounted(() => {
  getDataBudgetExecution();
});
</script>
<style scoped>
.h-30rem {
  height: 30rem;
}

:deep(.p-button.p-button-text) {
  color: #fff;
}

:deep(.p-button.p-button-text:hover) {
  background: rgba(255, 255, 255, 0.1);
}
</style>
