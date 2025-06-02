<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">Administracion de Gastos</h1>
    <div class="flex gap-5">
      <Button
        severity="warn"
        label="Nuevo Tipo de gasto"
        link
        class="ml-auto"
        icon="pi pi-plus"
        as="router-link"
        to="/expense-type"
      />
      <Button label="Agregar gasto" class="ml-auto" icon="pi pi-plus" @click="openModal" />
    </div>
  </div>

  <DataTable
    v-model:expanded-rows="expandedRows"
    data-key="id"
    :value="filteredExpenses"
    :rows="5"
    row-hover
    paginator
    :loading="loading"
  >
    <template #header>
      <div class="flex justify-between items-center gap-2">
        <div class="flex gap-2">
          <Select v-model="year" :options="years" placeholder="Año" style="width: 100px" />
          <Select
            v-model="month"
            :options="months"
            option-label="label"
            option-value="value"
            placeholder="Mes"
            style="width: 120px"
          />
          <Select
            v-if="listFundOnExpenses.length > 1"
            v-model="fundFilter"
            :options="listFundOnExpenses"
            option-label="name"
            option-value="id"
            placeholder="Fondo"
            style="width: 160px"
            show-clear
          />
          <Select
            v-if="listDocumenTypeOnExpenses.length > 1"
            v-model="typeDocumentFilter"
            :options="listDocumenTypeOnExpenses"
            option-label="name"
            option-value="id"
            placeholder="Tipo documento"
            style="width: 160px"
            show-clear
          />
        </div>
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="searchText" placeholder="Filtrar" />
        </IconField>
      </div>
    </template>

    <template #empty> <EmptyData /> </template>
    <template #loading> <Loading /></template>
    <Column expander style="width: 5rem" />

    <Column field="merchantName" header="Nombre de Comercio">
      <template #body="{ data, field }">
        {{ data[field] }}
      </template>
    </Column>

    <Column field="notes" header="notes" />

    <Column field="documentType" header="Tipo de Documento">
      <template #body="{ data }">
        {{ data.documentType["name"] }}
      </template>
    </Column>
    <Column field="monetaryFund" header="Fondo Monetario">
      <template #body="{ data, field }">
        {{ data[field]["name"] }}
      </template>
    </Column>

    <Column field="date" header="Fecha" data-type="date">
      <template #body="{ data }">
        {{ formatDate(data.date) }}
      </template>
      <template #filter="{ filterModel }">
        <DatePicker
          v-model="filterModel.value"
          date-format="dd/mm/yy"
          :max-date="new Date()"
          placeholder="dd/mm/yyyy"
        />
      </template>
    </Column>
    <Column field="createdAt" header="Fecha Creacion" data-type="date">
      <template #body="{ data }">
        {{ formatDate(data.date) }}
      </template>
      <template #filter="{ filterModel }">
        <DatePicker
          v-model="filterModel.value"
          date-format="dd/mm/yy"
          :max-date="new Date()"
          placeholder="dd/mm/yyyy"
        />
      </template>
    </Column>
    <template #expansion="slotProps">
      <div class="p-s">
        <DataTable :value="slotProps.data.details">
          <Column field="id" header="Id" sortable />
          <Column field="amount" header="Monto" data-type="numeric">
            <template #body="{ data }">
              {{ formatterMoney({ value: data.amount }) }}
            </template>
            <template #filter="{ filterModel }">
              <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="es-MX" />
            </template>
          </Column>
          <Column field="expenseType" header="Tipo de gasto">
            <template #body="{ data, field }">
              {{ data[field]["code"] }}
            </template>
          </Column>
          <Column field="expenseType" header="Tipo de gasto">
            <template #body="{ data, field }">
              {{ data[field]["name"] }}
            </template>
          </Column>
          <Column field="expenseType" header="Tipo de gasto">
            <template #body="{ data, field }">
              {{ data[field]["description"] }}
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </DataTable>

  <Dialog
    v-model:visible="showModalAddExpense"
    :closable="false"
    :draggable="false"
    modal
    header="Agregar Gatos"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '80vw' }"
  >
    <form class="flex flex-col gap-6" @submit.prevent="submitCreateExpense()">
      <div class="flex flex-col gap-4">
        <div class="flex gap-4 w-full">
          <div class="w-full">
            <Select
              v-model="monetaryFundId"
              :options="listMonetaryFund"
              :loading="loadingMonetaryFund"
              option-label="name"
              option-value="id"
              placeholder="Fondo monetario"
              class="w-full"
            />
            <small v-if="errors.monetaryFundId" class="text-red-500">{{ errors.monetaryFundId }}</small>
          </div>

          <div class="w-full">
            <Select
              v-model="documentTypeId"
              :options="listDocumentType"
              :loading="loadingDocumentType"
              option-label="name"
              option-value="id"
              placeholder="Tipo documento"
              class="w-full"
            />
            <small v-if="errors.documentTypeId" class="text-red-500">{{ errors.documentTypeId }}</small>
          </div>
        </div>
        <div class="w-full">
          <IconField v-if="documentTypeId === 3" class="w-full">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="otherDocumentTypeText" placeholder="Otro" class="w-full" />
          </IconField>
          <small v-if="errors.otherDocumentTypeText" class="text-red-500">{{ errors.otherDocumentTypeText }}</small>
        </div>

        <div class="flex gap-4 w-full">
          <div class="w-full">
            <IconField class="w-full">
              <InputIcon>
                <i class="pi pi-calendar" />
              </InputIcon>
              <DatePicker
                v-model="date"
                placeholder="Mes"
                view="month"
                date-format="mm/yy"
                :max-date="new Date()"
                class="w-full"
              />
            </IconField>
            <small v-if="errors.date" class="text-red-500">{{ errors.date }}</small>
          </div>

          <div class="w-full">
            <IconField class="w-full">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="merchantName" placeholder="Nombre de comercio" class="w-full" />
            </IconField>
            <small v-if="errors.merchantName" class="text-red-500">{{ errors.merchantName }}</small>
          </div>
        </div>
        <div class="w-full">
          <IconField class="w-full">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="notes" placeholder="Notas" class="w-full" />
          </IconField>
          <small v-if="errors.notes" class="text-red-500">{{ errors.notes }}</small>
        </div>
      </div>
      <div class="pb-10">
        <DataTable
          v-model:editing-rows="editingRows"
          :value="details"
          edit-mode="row"
          data-key="id"
          @row-edit-save="onRowEditSave"
        >
          <template #header>
            <div class="flex">
              <Button
                :disabled="editingRows.length > 0"
                label="Agregar Gasto"
                class="ml-auto"
                icon="pi pi-plus"
                @click="onAddExpenseDetail()"
              />
            </div>
          </template>

          <Column field="expenseTypeId" header="Tipo de gasto">
            <template #editor="{ data, field }">
              <Select
                v-model="data[field]"
                :options="listExpenseTypes"
                :loading="loadingExpenseTypes"
                option-label="name"
                option-value="id"
                placeholder="Tipo de gasto"
                fluid
              />
            </template>
            <template #body="slotProps">
              <Tag :value="slotProps.data.expenseTypeId" />
            </template>
          </Column>

          <Column field="amount" header="Monto">
            <template #editor="{ data, field }">
              <IconField class="w-full">
                <InputIcon>
                  <i class="pi pi-money-bill" />
                </InputIcon>
                <InputNumber
                  v-model="data[field]"
                  mode="currency"
                  currency="USD"
                  show-buttons
                  locale="en-US"
                  :min="1"
                />
              </IconField>
            </template>
            <template #body="{ data, field }">
              {{ formatterMoney({ value: data[field] }) }}
            </template>
          </Column>

          <Column row-editor header="Acción" style="width: 10%; min-width: 8rem">
            <template #editor="{ index, editorSaveCallback, editorCancelCallback }">
              <div class="flex gap-2 justify-end">
                <Button icon="pi pi-check" variant="text" @click="editorSaveCallback" />
                <Button icon="pi pi-times" variant="text" severity="warn" @click="editorCancelCallback" />
                <Button icon="pi pi-trash" variant="text" severity="danger" @click="onDeleteExpenseDetail(index)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="flex gap-4 justify-center">
        <Button :disabled="savingExpense" severity="danger" icon="pi pi-times" label="Cancelar" @click="closeModal" />
        <Button :loading="savingExpense" label="Guardar" icon="pi pi-save" type="submit" />
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { formatterMoney, formatDate } from "@/composables/useUtils";
import { ref, computed, watch, onMounted } from "vue";
import { useGetExpense, useCreateExpense } from "@/service/useExpense";
import { useGetExpenseTypes, useGetDocumentTypes } from "@/service/Common";
import { useGetMonetaryFund } from "@/service/useMonetaryFund";

import { movementSchema } from "./schemas";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

const { getExpenses, listExpense, loading, year, month, listFundOnExpenses, listDocumenTypeOnExpenses } =
  useGetExpense();
const { getDocumentType, listDocumentType, loading: loadingDocumentType } = useGetDocumentTypes();
const { getExpenseTypes, listExpenseTypes, loading: loadingExpenseTypes } = useGetExpenseTypes();
const { createExpense, loading: savingExpense } = useCreateExpense();
const { getMonetaryFund, listMonetaryFund, loading: loadingMonetaryFund } = useGetMonetaryFund();

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: toTypedSchema(movementSchema),
  initialValues: {
    monetaryFundId: null,
    date: "",
    merchantName: "",
    documentTypeId: null,
    otherDocumentTypeText: "",
    notes: "",
    details: [],
  },
});
// TODO: hacer un servicio que liste los años disponibles
const years = [2025, 2024, 2023];

const months = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 0, label: "Octubre" },
  { value: 1, label: "Noviembre" },
  { value: 2, label: "Diciembre" },
];

const showModalAddExpense = ref(false);
const expandedRows = ref([]);
const editingRows = ref([]);

const fundFilter = ref(null);
const typeDocumentFilter = ref(null);
const searchText = ref("");

const filteredExpenses = computed(() => {
  return listExpense.value.filter((expense) => {
    const matchesFund = !fundFilter.value || expense.monetaryFund?.id === fundFilter.value;
    const matchesDocumentType = !typeDocumentFilter.value || expense.documentType?.id === typeDocumentFilter.value;

    const lowerText = searchText.value.toLowerCase().trim();
    const matchesText =
      !lowerText ||
      expense.merchantName?.toLowerCase().includes(lowerText) ||
      expense.notes?.toLowerCase().includes(lowerText) ||
      expense.otherDocumentTypeText?.toLowerCase().includes(lowerText);

    return matchesFund && matchesDocumentType && matchesText;
  });
});

const { value: monetaryFundId } = useField("monetaryFundId");
const { value: date } = useField("date");
const { value: merchantName } = useField("merchantName");
const { value: documentTypeId } = useField("documentTypeId");
const { value: otherDocumentTypeText } = useField("otherDocumentTypeText");
const { value: notes } = useField("notes");
const { value: details } = useField("details");

const onAddExpenseDetail = () => {
  const newDetail = {
    amount: 0,
    expenseTypeId: null,
    id: details.value.length + 1,
  };
  details.value.push(newDetail);
  editingRows.value.push(newDetail);
};

const onDeleteExpenseDetail = (index) => {
  details.value = details.value.filter((_, i) => i !== index);
  editingRows.value = [];
};

const onRowEditSave = (event) => {
  const { newData, index } = event;
  details.value[index] = newData;
};

const openModal = () => {
  onAddExpenseDetail();
  showModalAddExpense.value = true;
};

const closeModal = () => {
  resetForm();
  showModalAddExpense.value = false;
};

const submitCreateExpense = handleSubmit(async (values) => {
  const newExpense = await createExpense(values);
  if (newExpense) {
    listExpense.value.push(newExpense);
    resetForm();
  }
});

watch([year, month], () => getExpenses());

onMounted(() => {
  getExpenses();
  getDocumentType();
  getExpenseTypes();
  getMonetaryFund();
});
</script>
