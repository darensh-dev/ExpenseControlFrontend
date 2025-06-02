<template>
  <Dialog
    :visible="visible"
    header="Agrega tipo de gasto"
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
        <label for="descripcion">Nombre</label>
        <IconField class="w-full">
          <InputIcon>
            <i class="pi pi-align-justify" />
          </InputIcon>
          <InputText id="descripcion" v-model.trim="name" class="w-full" :class="{ 'p-invalid': errors.name }" />
        </IconField>

        <small v-if="errors.name" class="text-red-500">La descripción es requerida.</small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="descripcion">Descripción</label>
        <IconField class="w-full">
          <InputIcon>
            <i class="pi pi-align-center" />
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
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { expenseTypeSchema } from "./schemas";
import { useCreateExpenseType } from "@/service/useExpenseType";

defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["saved", "canceled"]);
const { createExpenseType, saving } = useCreateExpenseType();

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: toTypedSchema(expenseTypeSchema),
  initialValues: {
    name: "",
    description: "",
  },
});

const { value: name } = useField("name");
const { value: description } = useField("description");

const onSubmit = handleSubmit(async (values) => {
  const newExpenseType = await createExpenseType(values);
  if (newExpenseType) {
    resetForm();
    emit("saved", newExpenseType);
  }
});

const cancel = () => {
  resetForm();
  emit("canceled");
};
</script>
