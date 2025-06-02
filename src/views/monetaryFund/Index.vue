<template>
  <h1>Fondos Monetarios</h1>
  <div class="flex gap-4 justify-end my-4">
    <IconField>
      <InputIcon class="pi pi-search" />
      <InputText id="fm-search-1" type="text" placeholder="Filtrar" />
    </IconField>
    <Button label="Agregar" icon="pi pi-plus" @click="openModalForm()" />
  </div>
  <div class="grid grid-cols-3 gap-4">
    <template v-if="!loadingGetMonetaryFunds && listMonetaryFunds.length > 0">
      <template v-for="(monetary, i) in listMonetaryFunds" :key="i">
        <div class="col">
          <Card class="">
            <template #title>
              <div class="flex flex-col">
                <h1 class="text-2xl m-0">{{ monetary.name }}</h1>
                <Chip class="capitalize text-sm ml-auto"> {{ monetary.fundType.name }} </Chip>
              </div>
            </template>
            <template #subtitle />
            <template #content>
              <div class="flex gap-1 justify-between">
                <div class="flex flex-col gap-2">
                  <ul>
                    <li class="text-md">
                      M. Inicial: <strong> {{ formatterMoney({ value: monetary.initialBalance }) }}</strong>
                    </li>
                    <li class="text-md">
                      M. Actual: <strong>{{ formatterMoney({ value: monetary.initialBalance }) }}</strong>
                    </li>
                  </ul>
                  <ExpandableText :text="getRelativeDate({ date: monetary.createdAt })" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <Button
                    v-tooltip.top="'Actualizar'"
                    variant="text"
                    icon="pi pi-pen-to-square"
                    @click="openModalForm(monetary)"
                  />
                  <ConfirmPopup />
                  <Button
                    v-tooltip.top="'Eliminar'"
                    class="!hidden"
                    severity="danger"
                    variant="text"
                    icon="pi pi-trash"
                    @click="confirm($event)"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </template>
    </template>

    <template v-if="loadingGetMonetaryFunds">
      <template v-for="(_, i) in Array.from({ length: 6 })" :key="i">
        <div class="col">
          <CardSkeleton />
        </div>
      </template>
    </template>
  </div>
  <template v-if="!loadingGetMonetaryFunds && listMonetaryFunds.length === 0">
    <EmptyData />
  </template>
  <ModalForm :show-modal="showModal" :fund="fundToEdit" @cancel="closeModalForm" @saved="addMonetaryFund" />
</template>

<script setup>
import { authAxios } from "@/composables/useAxios";
import { useNotify } from "@/composables/useNotify";
import { formatterMoney, getRelativeDate } from "@/composables/useUtils";
import { apiV1 } from "@/config/endpoints";
import { useConfirm } from "primevue/useconfirm";
import { onMounted, ref } from "vue";
import ModalForm from "./ModalForm.vue";

const toast = useNotify();
const confirmPopup = useConfirm();

const showModal = ref(false);
const listMonetaryFunds = ref([]);
const loadingGetMonetaryFunds = ref(false);
const fundToEdit = ref(null);

const openModalForm = (monetary) => {
  if (monetary) fundToEdit.value = monetary;
  showModal.value = true;
};

const closeModalForm = () => {
  showModal.value = false;
  fundToEdit.value = null;
};

const addMonetaryFund = ({ action, data }) => {
  if (action === "created") {
    listMonetaryFunds.value.push(data);
  } else {
    const index = listMonetaryFunds.value.findIndex((e) => e.id === data.id);
    listMonetaryFunds.value[index] = data;
  }
  closeModalForm();
};

function confirm(event) {
  confirmPopup.require({
    target: event.target,
    message: "Are you sure you want to proceed?",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Save",
    },
    accept: () => {
      toast.notify({ severity: "success", summary: "Confirmed", detail: "You have accepted" });
    },
    reject: () => {
      toast.notify({ severity: "info", summary: "Rejected", detail: "You have rejected" });
    },
  });
}

const getMonetaryFunds = async () => {
  try {
    listMonetaryFunds.value = [];
    loadingGetMonetaryFunds.value = true;
    const { data, status } = await authAxios.get(apiV1.monetaryFund);
    if (status === 204) {
      return toast.notify({
        severity: "warn",
        summary: "Alerta",
        detail: "No se encontraron Fondos monetarios",
      });
    }
    listMonetaryFunds.value = data;
  } catch {
    toast.notify({ severity: "error", summary: "Error", detail: "Error al obtener los fondos monetarios" });
  } finally {
    loadingGetMonetaryFunds.value = false;
  }
};

onMounted(() => {
  getMonetaryFunds();
});
</script>
