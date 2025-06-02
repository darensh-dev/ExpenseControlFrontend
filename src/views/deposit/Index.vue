<template>
  <div class="card">
    <div class="flex justify-between mb-4">
      <h2 class="text-2xl font-bold">Depósitos Monetarios</h2>
      <Button label="Nuevo Depósito" icon="pi pi-plus" @click="openModalForm()" />
    </div>

    <DataTable
      :value="filteredDeposits"
      paginator
      :rows="10"
      data-key="id"
      row-hover
      :loading="loadingGetDeposito"
      :global-filter-fields="['descripcion', 'amount', 'date']"
    >
      <template #header>
        <div class="flex justify-between items-center gap-2">
          <IconField>
            <InputIcon>
              <i class="pi pi-calendar" />
            </InputIcon>
            <DatePicker
              v-model="monthFilter"
              placeholder="Mes"
              view="month"
              date-format="mm/yy"
              :max-date="new Date()"
              style="width: 210px"
            />
          </IconField>
          <div class="flex gap-2">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="search" placeholder="Filtrar por monto" />
            </IconField>
            <Select
              v-model="monetaryFundFilter"
              :options="listExpenseTypeOnDeposit"
              option-label="name"
              option-value="id"
              placeholder="Seleccionar Fondo"
              style="width: 210px"
              show-clear
            />
          </div>
        </div>
      </template>

      <template #empty> <EmptyData /> </template>
      <template #loading> <Loading /> </template>

      <!-- <Column field="descripcion" header="Descripción" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.descripcion }}
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Buscar por descripción" />
        </template>
      </Column> -->
      <Column field="monetaryFundId" header="Fondo Monetario" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.monetaryFund.name }}
        </template>
      </Column>

      <Column field="amount" header="Monto" data-type="numeric" style="min-width: 10rem">
        <template #body="{ data }">
          {{ formatterMoney({ value: data.amount }) }}
        </template>
        <template #filter="{ filterModel }">
          <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="es-MX" />
        </template>
      </Column>

      <Column field="date" header="Fecha" data-type="date" style="min-width: 10rem">
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
        <template #filter="{ filterModel }">
          <DatePicker v-model="filterModel.value" date-format="dd/mm/yy" placeholder="dd/mm/yyyy" />
        </template>
      </Column>

      <!-- <Column :exportable="false" style="min-width: 8rem">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openModalForm(slotProps.data)" />
          <Button icon="pi pi-trash" outlined rounded severity="danger" />
        </template>
      </Column> -->
    </DataTable>

    <ModalForm :visible="showModal" :deposit="depositToEdit" @saved="saved" @canceled="closeModalForm" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import ModalForm from "./ModalForm.vue";
import { useGetDeposit } from "@/service/useDeposit";
import { formatterMoney, formatDate } from "@/composables/useUtils";

const {
  getDeposits,
  listDeposit,
  monthFilter,
  loading: loadingGetDeposito,
  listExpenseTypeOnDeposit,
} = useGetDeposit();

const showModal = ref(false);
const depositToEdit = ref(null);
const search = ref("");
const monetaryFundFilter = ref(null);

const filteredDeposits = computed(() => {
  return listDeposit.value.filter((tx) => {
    const searchLower = search.value.toLowerCase();

    const matchesSearch = search.value
      ? tx.description?.toLowerCase().includes(searchLower) || tx.amount?.toString().includes(searchLower)
      : true;

    const matchesMonetaryFund = monetaryFundFilter.value ? tx.monetaryFund?.id === monetaryFundFilter.value : true;

    return matchesSearch && matchesMonetaryFund;
  });
});

function saved(deposit) {
  listDeposit.value.push(deposit);
  closeModalForm();
}

function openModalForm(deposit) {
  if (deposit) depositToEdit.value = deposit;
  showModal.value = true;
}

function closeModalForm() {
  showModal.value = false;
  depositToEdit.value = {};
}

watch(
  () => monthFilter.value,
  () => getDeposits(),
);

onMounted(() => {
  getDeposits();
});
</script>
