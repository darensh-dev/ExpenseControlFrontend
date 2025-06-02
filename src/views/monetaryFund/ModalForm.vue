<template>
  <Dialog
    header="Fondo"
    :visible="showModal"
    :breakpoints="{ '960px': '75vw' }"
    :style="{ width: '30vw' }"
    modal
    :closable="false"
    :draggable="false"
    :resizable="false"
    :maximizable="false"
  >
    <form @submit.prevent="onSubmit()">
      <div class="card flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="name">Nombre para el fondo</label>
          <InputText id="name" v-model="name" type="text" :invalid="!!errors.name" />
          <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="initialBalance">Balance inicial</label>
          <InputNumber
            id="initialBalance"
            v-model="initialBalance"
            mode="currency"
            currency="USD"
            locale="en-US"
            fluid
            show-buttons
            :min="0"
            :invalid="!!errors.initialBalance"
          />
          <small v-if="errors.initialBalance" class="text-red-500">{{ errors.initialBalance }}</small>
        </div>

        <div class="flex flex-col gap-2">
          <label>Tipo de fondo</label>
          <Select
            id="fundTypeId"
            v-model="fundTypeId"
            option-label="name"
            option-value="id"
            :options="listFundTypes"
            class="w-full"
            :invalid="!!errors.fundTypeId"
            :loading="loadingFundTypes"
          />
          <small v-if="errors.fundTypeId" class="text-red-500">{{ errors.fundTypeId }}</small>
        </div>
      </div>
      <div class="flex gap-4 justify-center">
        <Button severity="danger" icon="pi pi-times" label="Cancelar" :disabled="loading" @click="cancel()" />
        <Button :loading="loading" label="Guardar" icon="pi pi-save" type="submit" />
      </div>
    </form>
  </Dialog>
</template>
<script setup>
import { authAxios } from "@/composables/useAxios";
import { useNotify } from "@/composables/useNotify";
import { apiV1 } from "@/config/endpoints";
import { useFundTypes } from "@/service/Common";
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import { onMounted, ref, watch } from "vue";
import { monetaryFundSchema } from "./schemas";

const props = defineProps({
  showModal: { type: Boolean, required: true },
  fund: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["cancel", "saved"]);

const { getFundTypes, listFundTypes, loadingFundTypes } = useFundTypes();
const toast = useNotify();

const actionApi = {
  post: {
    msg: "creado",
    emit: "created",
  },
  put: {
    msg: "actualizado",
    emit: "updated",
  },
};

const { handleSubmit, resetForm, errors } = useForm({
  validateOnMount: false,
  validationSchema: toTypedSchema(monetaryFundSchema),
  initialValues: {
    name: "",
    initialBalance: 0,
    fundTypeId: null,
  },
});

const loading = ref(false);
const { value: name } = useField("name");
const { value: initialBalance } = useField("initialBalance");
const { value: fundTypeId } = useField("fundTypeId");

const cancel = () => {
  resetForm();
  emit("cancel");
};

const onSubmit = handleSubmit(async (values) => {
  try {
    const params = {
      initialBalance: values.initialBalance,
      fundTypeId: values.fundTypeId,
      name: values.name,
    };

    const action = props.fund ? "put" : "post";
    if (props.fund) params["id"] = props.fund.id;

    loading.value = true;
    const { data } = await authAxios[action](apiV1.monetaryFund, params);
    toast.notify({ severity: "success", summary: "Exito", detail: `Fondo monetario ${actionApi[action].msg}` });
    resetForm();
    emit("saved", { action: actionApi[action].emit, data });
  } catch (error) {
    toast.notify({ severity: "error", summary: "Error", detail: error.message });
    console.error("Error al hacer login:", error?.response?.data || error.message);
  } finally {
    loading.value = false;
  }
});

onMounted(() => {
  getFundTypes();
});

watch(
  () => props.fund,
  (fund) => {
    if (fund) {
      resetForm({
        values: {
          name: fund.name ?? "",
          initialBalance: fund.initialBalance ?? 0,
          fundTypeId: fund.fundType?.id ?? null,
        },
      });
    }
  },
  { immediate: true },
);
</script>
