<template>
  <Dialog
    :visible="showModal"
    :style="{ width: '420px', borderRadius: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }"
    :header="budget && budget.id ? 'Editar presupuesto' : 'Nuevo presupuesto'"
    modal
    class="p-fluid"
    :closable="false"
    :draggable="false"
    :resizable="false"
    :maximizable="false"
    :breakpoints="{ '960px': '90vw', '641px': '98vw' }"
    @update:visible="cancel"
  >
    <form @submit.prevent="onSubmit">
      <div class="flex flex-col gap-3 py-1">
        <div class="flex flex-col gap-0.5">
          <label for="month" class="font-semibold text-lg mb-1">Mes</label>

          <IconField class="w-full">
            <InputIcon>
              <i class="pi pi-calendar" />
            </InputIcon>
            <DatePicker
              v-model="month"
              placeholder="Mes"
              view="month"
              :max-date="new Date()"
              date-format="mm/yy"
              class="w-full"
            />
          </IconField>

          <small v-if="errors.month" class="text-red-400">El mes es requerido.</small>
        </div>
        <div class="flex flex-col gap-0.5">
          <label for="amount" class="font-semibold text-base">Monto</label>
          <IconField class="w-full">
            <InputIcon>
              <i class="pi pi-money-bill" />
            </InputIcon>
            <InputNumber
              id="amount"
              v-model="amount"
              mode="currency"
              currency="USD"
              show-buttons
              locale="en-US"
              class="w-full"
              :min="1"
              :class="{ 'border-red-500': errors.amount }"
              style="height: 2.2rem; font-size: 1.1rem"
            />
          </IconField>

          <small v-if="errors.amount" class="text-red-400">El monto es requerido.</small>
        </div>
        <div class="flex flex-col gap-0.5">
          <label for="expenseTypeId" class="font-semibold text-base">Tipo de gasto</label>
          <Select
            id="expenseTypeId"
            v-model="expenseTypeId"
            :options="listExpenseTypes"
            :loading="loadingExpenseTypes"
            option-label="name"
            option-value="id"
            placeholder="Seleccionar tipo de gasto"
            class="w-full"
            :class="{ 'border-red-500': errors.expenseTypeId }"
            style="height: 2.2rem; font-size: 1.1rem"
          />
          <small v-if="errors.expenseTypeId" class="text-red-400">El tipo de gasto es requerido.</small>
        </div>
      </div>
      <div class="flex justify-end gap-3 mt-4">
        <Button label="Cancelar" icon="pi pi-times" outlined class="px-5 py-2" severity="secondary" @click="cancel" />
        <Button
          :loading="saving"
          label="Guardar"
          icon="pi pi-check"
          class="px-5 py-2"
          type="submit"
          severity="success"
        />
      </div>
    </form>
  </Dialog>
</template>
<script setup>
import { onMounted, watch } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import { monthlyBudgetSchema } from "./schemas";
import { useGetExpenseTypes } from "@/service/Common";
import { useCreateBudget } from "@/service/useBudget";

const props = defineProps({
  showModal: { type: Boolean, required: true },
  budget: { type: Object, default: null },
});

const emit = defineEmits(["saved", "canceled"]);

const { getExpenseTypes, listExpenseTypes, loading: loadingExpenseTypes } = useGetExpenseTypes();
const { createBudget, saving } = useCreateBudget();

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: toTypedSchema(monthlyBudgetSchema),
  initialValues: {
    month: "",
    expensetypeid: null,
    amount: null,
  },
});

const { value: month } = useField("month");
const { value: expenseTypeId } = useField("expenseTypeId");
const { value: amount } = useField("amount");

const onSubmit = handleSubmit(async (values) => {
  const newBudget = await createBudget(values);
  if (newBudget) {
    resetForm();
    emit("saved", newBudget);
  }
});

const cancel = () => {
  resetForm();
  emit("canceled");
};

watch(
  () => props.budget,
  (budget) => {
    if (budget) {
      resetForm({
        values: {
          month: budget.month ?? "",
          amount: budget.amount ?? 0,
          expenseTypeId: budget.expenseType?.id ?? null,
        },
      });
    }
  },
  { immediate: true },
);

onMounted(() => {
  getExpenseTypes();
});
</script>
