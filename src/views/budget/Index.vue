<template>
  <div class="p-4">
    <h1 class="text-4xl font-bold mb-8">Presupuestos</h1>
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
      <div class="flex flex-col md:flex-row gap-2 items-end">
        <Select
          v-model="expenseTypeFilter"
          :options="listExpenseTypeOnBudget"
          option-label="name"
          option-value="id"
          placeholder="Tipo de gasto"
          class="w-48"
          show-clear
        />
        <div class="flex items-center gap-2">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText v-model="search" placeholder="Buscar" class="pl-12 w-48" />
          </IconField>
        </div>
      </div>
      <Button label="Nuevo presupuesto" icon="pi pi-plus" class="px-4 py-2" @click="openModalForm" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <template v-if="!loadingBudgets && filteredBudgets.length > 0">
        <template v-for="budget in filteredBudgets" :key="budget.id">
          <div
            class="bg-[#181f2a] rounded-2xl shadow-xl p-7 flex flex-col gap-3 relative border border-transparent hover:border-green-400 hover:shadow-2xl transition-all duration-200 min-h-[220px]"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-4">
                <span
                  class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white text-3xl shadow-lg"
                >
                  <i class="pi pi-chart-bar" />
                </span>
                <div>
                  <h2 class="text-2xl font-bold text-white">{{ budget.expenseType.name }}</h2>
                  <div class="text-sm text-gray-400 mt-1">{{ formatMonth(budget.month) }}</div>
                </div>
              </div>
              <span
                class="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold shadow-sm bg-gray-700 text-white"
              >
                <i class="pi pi-wallet mr-2" />
                {{ budget.expenseType.name }}
              </span>
            </div>
            <div class="flex flex-row items-center justify-between mt-2">
              <div class="flex flex-col gap-1">
                <span class="text-md text-gray-300 flex items-center gap-2">
                  <i class="pi pi-arrow-up-right text-green-400 text-lg" /> M. Inicial:
                  <span class="font-bold text-green-400">{{ formatterMoney({ value: budget.amount }) }}</span>
                </span>
                <span class="text-md text-gray-300 flex items-center gap-2">
                  <i class="pi pi-dollar text-blue-400 text-lg" /> M. Actual:
                  <span class="font-bold text-blue-400">{{ formatterMoney({ value: budget.amount }) }}</span>
                </span>
              </div>
              <!-- <div class="flex flex-col gap-2 items-end">
                <Button icon="pi pi-pencil" rounded text class="hover:bg-green-100/10" @click="openModalForm(budget)" />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  class="hover:bg-red-100/10"
                  @click="confirmDeleteBudget(budget)"
                />
              </div> -->
            </div>
          </div>
        </template>
      </template>
      <template v-if="loadingBudgets">
        <template v-for="(_, i) in Array.from({ length: 6 })" :key="i">
          <div class="col">
            <CardSkeleton />
          </div>
        </template>
      </template>
    </div>

    <template v-if="!loadingBudgets && filteredBudgets.length === 0">
      <EmptyData />
    </template>
    <ModalForm :show-modal="showModal" :budget="budgetToEdit" @saved="saveBudget" @canceled="closeModalForm" />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ModalForm from "./ModalForm.vue";
// import { useToast } from "primevue/usetoast";
// import { useConfirm } from "primevue/useconfirm";
import { formatterMoney } from "@/composables/useUtils";
import { useGetBudget } from "@/service/useBudget";

// const toast = useToast();
// const confirm = useConfirm();

const { getBudgets, listBudget, loading: loadingBudgets, listExpenseTypeOnBudget } = useGetBudget();

const showModal = ref(false);
const budgetToEdit = ref(null);
const expenseTypeFilter = ref(null);
const search = ref("");

const filteredBudgets = computed(() => {
  return listBudget.value.filter((budget) => {
    const matchesExpenseType = expenseTypeFilter.value ? budget.expenseType?.id === expenseTypeFilter.value : true;

    const searchLower = search.value.toLowerCase();
    const matchesSearch = search.value
      ? budget.expenseType?.name?.toLowerCase().includes(searchLower) ||
        budget.expenseType?.code?.toLowerCase().includes(searchLower) ||
        budget.month?.toLowerCase().includes(searchLower)
      : true;

    return matchesExpenseType && matchesSearch;
  });
});

function formatMonth(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString("es-MX", { month: "long", year: "numeric" });
}

function openModalForm(budget) {
  if (budget) budgetToEdit.value = budget;
  showModal.value = true;
}

function closeModalForm() {
  showModal.value = false;
  budgetToEdit.value = null;
}

function saveBudget(budget) {
  listBudget.value.push(budget);
  closeModalForm();
}

// function confirmDeleteBudget(budget) {
//   confirm.require({
//     message: "¿Seguro que deseas eliminar este presupuesto?",
//     header: "Confirmar eliminación",
//     icon: "pi pi-exclamation-triangle",
//     acceptLabel: "Sí, eliminar",
//     rejectLabel: "Cancelar",
//     accept: () => {
//       listBudget.value = listBudget.value.filter((b) => b.id !== budget.id);
//       toast.add({ severity: "success", summary: "Eliminado", detail: "Presupuesto eliminado", life: 2000 });
//     },
//     reject: () => {
//       toast.add({ severity: "info", summary: "Cancelado", detail: "Eliminación cancelada", life: 2000 });
//     },
//   });
// }

onMounted(() => {
  getBudgets();
});
</script>
