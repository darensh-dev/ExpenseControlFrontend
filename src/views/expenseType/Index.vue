<template>
  <div class="card">
    <div class="flex justify-between mb-4">
      <h2 class="text-2xl font-bold">Tipos de gastos</h2>
      <Button label="Nuevo tipo de gasto" icon="pi pi-plus" @click="openModalForm()" />
    </div>

    <DataTable
      :value="listExpenseTypes"
      paginator
      :rows="10"
      data-key="id"
      row-hover
      :loading="loadingExpenseTypes"
      :global-filter-fields="['descripcion', 'amount', 'date']"
    >
      <template #empty> <EmptyData /> </template>
      <template #loading> <Loading /> </template>

      <!-- <Column field="id" header="ID" data-type="numeric" /> -->
      <Column field="code" header="code" />
      <Column field="name" header="name" />
      <Column field="description" header="description" />
    </DataTable>

    <ModalForm :visible="showModal" :expense-type="expenseTypeToEdit" @saved="saved" @canceled="closeModalForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ModalForm from "./ModalForm.vue";
import { useGetExpenseTypes } from "@/service/Common";

const { getExpenseTypes, listExpenseTypes, loading: loadingExpenseTypes } = useGetExpenseTypes();

const showModal = ref(false);
const expenseTypeToEdit = ref(null);

function saved(expenseType) {
  listExpenseTypes.value.push(expenseType);
  closeModalForm();
}

function openModalForm(expenseType) {
  if (expenseType) expenseTypeToEdit.value = expenseType;
  showModal.value = true;
}

function closeModalForm() {
  showModal.value = false;
  expenseTypeToEdit.value = {};
}

onMounted(() => {
  getExpenseTypes();
});
</script>
