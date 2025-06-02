<template>
  <Dialog
    :visible="visible"
    :header="deposit ? '✏️ Editar Depósito' : '➕ Nuevo Depósito'"
    :style="{ width: '100%', maxWidth: '430px', borderRadius: '18px', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)' }"
    modal
    :closable="false"
    :draggable="false"
    :resizable="false"
    :maximizable="false"
    class="p-fluid dialog-form custom-modal"
  >
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <div class="flex flex-col gap-2">
        <label for="monetaryFundId">Fondo Monetario</label>
        <Select
          id="monetaryFundId"
          v-model="monetaryFundId"
          :options="listMonetaryFund"
          option-label="name"
          option-value="id"
          placeholder="Seleccionar Fondo"
          :loading="loadingMonetaryFund"
          :class="{ 'p-invalid': errors.monetaryFundId }"
          show-clear
        />
        <small v-if="errors.monetaryFundId" class="text-red-500">El fondo es requerido.</small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="date">Fecha</label>
        <Calendar
          id="date"
          v-model="date"
          date-format="dd/mm/yy"
          :class="{ 'p-invalid': errors.date }"
          show-icon
          :max-date="new Date()"
        />
        <small v-if="errors.date" class="text-red-500">La fecha es requerida.</small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="amount">Monto</label>
        <IconField class="w-full">
          <InputIcon> <i class="pi pi-money-bill" /> </InputIcon>

          <InputNumber
            id="amount"
            v-model="amount"
            mode="currency"
            currency="USD"
            show-buttons
            locale="en-US"
            :min="1"
            class="w-full"
            :class="{ 'p-invalid': errors.amount }"
          />
        </IconField>

        <small v-if="errors.amount" class="text-red-500">El monto es requerido.</small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="descripcion">Descripción</label>
        <IconField class="w-full">
          <InputIcon>
            <i class="pi pi-money-bill" />
          </InputIcon>
          <InputText
            id="descripcion"
            v-model.trim="description"
            class="w-full"
            :class="{ 'p-invalid': errors.description }"
          />
        </IconField>

        <small v-if="errors.description" class="text-red-500">La descripción es requerida.</small>
      </div>

      <div class="flex gap-6 justify-center">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          class="p-button-outlined p-button-danger"
          type="button"
          @click="cancel"
        />
        <Button :loading="saving" label="Guardar" icon="pi pi-check" class="p-button p-button-success" type="submit" />
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { depositSchema } from "./schemas";
import { useGetMonetaryFund } from "@/service/useMonetaryFund";
import { useCreateDeposit } from "@/service/useDeposit";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  deposit: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["saved", "canceled"]);
const { getMonetaryFund, listMonetaryFund, loading: loadingMonetaryFund } = useGetMonetaryFund();
const { createDeposit, saving } = useCreateDeposit();

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: toTypedSchema(depositSchema),
  initialValues: {
    amount: "",
    monetaryFundId: null,
    date: null,
    description: "",
  },
});

const { value: amount } = useField("amount");
const { value: monetaryFundId } = useField("monetaryFundId");
const { value: date } = useField("date");
const { value: description } = useField("description");

const onSubmit = handleSubmit(async (values) => {
  const newDeposit = await createDeposit(values);
  if (newDeposit) {
    resetForm();
    emit("saved", newDeposit);
  }
});

const cancel = () => {
  resetForm();
  emit("canceled");
};

watch(
  () => props.deposit,
  (deposit) => {
    if (deposit) {
      resetForm({
        values: {
          date: deposit.date ?? "",
          amount: deposit.amount ?? 0,
          monetaryFundId: deposit.monetaryFund?.id ?? null,
          description: deposit.description ?? "",
        },
      });
    }
  },
);

onMounted(() => {
  getMonetaryFund();
});
</script>

<style scoped>
/* .dialog-form {
  padding: 2.2rem 2rem 1.5rem 2rem;
  background: rgba(34, 40, 49, 0.98);
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
.custom-modal ::v-deep .p-dialog-header {
  background: transparent;
  border-bottom: none;
  padding-bottom: 0.5rem;
}
.custom-modal ::v-deep .p-dialog-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #00dfc4;
  letter-spacing: 0.5px;
}
.field {
  margin-bottom: 1.5rem;
}
.field label {
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 600;
  font-size: 1.08rem;
  color: #e0e0e0;
  letter-spacing: 0.2px;
}
.p-inputtext,
.p-inputnumber,
.p-Select,
.p-calendar {
  width: 100%;
  background: #23272f;
  color: #fff;
  border-radius: 0.7rem;
  border: 1.5px solid #444;
  padding: 0.85rem 1.1rem;
  font-size: 1.05rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.p-inputtext:focus,
.p-inputnumber:focus,
.p-Select:focus,
.p-calendar:focus-within {
  border-color: #00dfc4;
  box-shadow: 0 0 0 2px rgba(0, 223, 196, 0.15);
}
.p-invalid {
  font-size: 0.92rem;
  color: #ff7675;
  margin-top: 0.2rem;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
  margin-top: 2.2rem;
}
.p-button-success {
  background: linear-gradient(90deg, #00dfc4 0%, #0093e9 100%);
  border: none;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px 0 rgba(0, 223, 196, 0.1);
}
.p-button-success:enabled:hover {
  background: linear-gradient(90deg, #0093e9 0%, #00dfc4 100%);
}
.p-button-danger {
  border: none;
  color: #ff7675;
  font-weight: 600;
  background: transparent;
}
.p-button-danger:enabled:hover {
  background: #2d323b;
  color: #fff;
}
.row-fields {
  display: flex;
  gap: 1.2rem;
}
.field-half {
  flex: 1 1 0;
  min-width: 0;
}
@media (max-width: 600px) {
  .dialog-form {
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    min-width: 0;
  }
  .row-fields {
    flex-direction: column;
    gap: 0.5rem;
  }
} */
</style>
