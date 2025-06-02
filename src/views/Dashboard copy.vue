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
          :min-date="new Date(2024, 0, 1)"
          :max-date="new Date(2024, 11, 31)"
        />
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12">
        <div class="bg-[#181f2a] rounded-2xl shadow-xl p-7 min-h-[350px] flex items-center justify-center">
          <template v-if="dateRange && dateRange[0] && dateRange[1]">
            <div class="w-full">
              <h2 class="text-2xl font-bold text-white mb-4">Presupuesto por Tipo de Gasto</h2>
              <Chart type="bar" :data="budgetComparisonData" :options="budgetComparisonOptions" class="h-30rem" />
            </div>
          </template>
          <template v-else>
            <span class="text-gray-400 text-lg">Selecciona un rango de fechas para ver el gráfico.</span>
          </template>
        </div>
      </div>
      <!-- <div class="col-span-12 xl:col-span-6">
        <div class="bg-[#181f2a] rounded-2xl shadow-xl p-7">
          <h2 class="text-2xl font-bold text-white mb-4">Resumen de Presupuestos</h2>
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Total Presupuestado:</span>
              <span class="text-2xl font-bold text-green-400">{{ formatCurrency(totalBudgeted) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Total Ejecutado:</span>
              <span class="text-2xl font-bold text-blue-400">{{ formatCurrency(totalExecuted) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-12 xl:col-span-6">
        <div class="bg-[#181f2a] rounded-2xl shadow-xl p-7">
          <h2 class="text-2xl font-bold text-white mb-4">Distribución de Gastos</h2>
          <Chart type="pie" :data="expenseTypeChartData" :options="expenseTypeOptions" class="h-30rem" />
        </div>
      </div>
      <div class="col-span-12 xl:col-span-6">
        <div class="bg-[#181f2a] rounded-2xl shadow-xl p-7">
          <h2 class="text-2xl font-bold text-white mb-4">Tendencia de Gastos</h2>
          <Chart type="line" :data="expenseTrendChartData" :options="expenseTrendOptions" class="h-30rem" />
        </div>
      </div> -->
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "primevue/chart";

const dateRange = ref(null);
const totalBudgeted = ref(0);
const totalExecuted = ref(0);

const allBudgetData = [
  { type: "Materiales", budgeted: 322232, executed: 280000, date: "2024-01" },
  { type: "Mano de Obra", budgeted: 150000, executed: 120000, date: "2024-01" },
  { type: "Equipos", budgeted: 50000, executed: 45000, date: "2024-01" },
  { type: "Servicios", budgeted: 75000, executed: 65000, date: "2024-01" },
  { type: "Otros", budgeted: 25000, executed: 20000, date: "2024-01" },
  { type: "Materiales", budgeted: 350000, executed: 320000, date: "2024-02" },
  { type: "Mano de Obra", budgeted: 180000, executed: 150000, date: "2024-02" },
  { type: "Equipos", budgeted: 60000, executed: 55000, date: "2024-02" },
  { type: "Servicios", budgeted: 85000, executed: 75000, date: "2024-02" },
  { type: "Otros", budgeted: 30000, executed: 25000, date: "2024-02" },
  { type: "Materiales", budgeted: 380000, executed: 350000, date: "2024-03" },
  { type: "Mano de Obra", budgeted: 200000, executed: 180000, date: "2024-03" },
  { type: "Equipos", budgeted: 70000, executed: 65000, date: "2024-03" },
  { type: "Servicios", budgeted: 90000, executed: 80000, date: "2024-03" },
  { type: "Otros", budgeted: 35000, executed: 30000, date: "2024-03" },
];

const budgetData = ref([...allBudgetData]);

const expenseTypeData = [
  { name: "Materiales", y: 322232 },
  { name: "Mano de Obra", y: 150000 },
  { name: "Equipos", y: 50000 },
  { name: "Servicios", y: 75000 },
  { name: "Otros", y: 25000 },
];

const expenseTrendData = [
  { date: "2024-05", amount: 322232 },
  { date: "2024-06", amount: 150000 },
  { date: "2024-07", amount: 50000 },
];

function formatCurrency(value) {
  return value.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

function formatDate(date) {
  return date.toISOString().slice(0, 7);
}

function filterDataByDateRange(startDate, endDate) {
  if (!startDate || !endDate) return allBudgetData;

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  return allBudgetData.filter((item) => {
    return item.date >= start && item.date <= end;
  });
}

function aggregateDataByType(data) {
  const aggregated = {};

  data.forEach((item) => {
    if (!aggregated[item.type]) {
      aggregated[item.type] = {
        type: item.type,
        budgeted: 0,
        executed: 0,
      };
    }
    aggregated[item.type].budgeted += item.budgeted;
    aggregated[item.type].executed += item.executed;
  });

  return Object.values(aggregated);
}

const budgetComparisonData = ref({
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
});

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
          return formatCurrency(value);
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

const expenseTypeChartData = {
  labels: expenseTypeData.map((d) => d.name),
  datasets: [
    {
      data: expenseTypeData.map((d) => d.y),
      backgroundColor: ["#10b981", "#6366f1", "#f59e42", "#ef4444", "#8b5cf6"],
    },
  ],
};

const expenseTypeOptions = {
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  plugins: {
    legend: {
      labels: {
        color: "#fff",
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return formatCurrency(context.raw);
        },
      },
    },
  },
};

const expenseTrendChartData = {
  labels: expenseTrendData.map((d) => d.date),
  datasets: [
    {
      label: "Gastos",
      data: expenseTrendData.map((d) => d.amount),
      borderColor: "#10b981",
      tension: 0.4,
      fill: false,
    },
  ],
};

const expenseTrendOptions = {
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
          return formatCurrency(value);
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

function updateChartData() {
  if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) {
    budgetComparisonData.value = {
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
    totalBudgeted.value = 0;
    totalExecuted.value = 0;
    return;
  }

  const filteredData = filterDataByDateRange(dateRange.value[0], dateRange.value[1]);
  const aggregatedData = aggregateDataByType(filteredData);

  budgetComparisonData.value = {
    labels: aggregatedData.map((d) => d.type),
    datasets: [
      {
        label: "Presupuestado",
        data: aggregatedData.map((d) => d.budgeted),
        backgroundColor: "#10b981",
      },
      {
        label: "Ejecutado",
        data: aggregatedData.map((d) => d.executed),
        backgroundColor: "#6366f1",
      },
    ],
  };

  totalBudgeted.value = aggregatedData.reduce((sum, item) => sum + item.budgeted, 0);
  totalExecuted.value = aggregatedData.reduce((sum, item) => sum + item.executed, 0);
}

watch(dateRange, () => {
  updateChartData();
});

onMounted(() => {
  updateChartData();
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
